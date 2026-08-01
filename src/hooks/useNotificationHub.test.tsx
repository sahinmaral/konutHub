import activeChannelReducer, { setViewingChannelId } from '@/redux/reducers/activeChannelReducer';
import appReducer from '@/redux/reducers/appReducer';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';
import { useNotificationHub } from './useNotificationHub';

// Captures the handlers the hook registers so tests can play the server's part.
const handlers: Record<string, (payload: unknown) => void> = {};

jest.mock('@microsoft/signalr', () => {
  const connection = {
    on: jest.fn((event: string, handler: (payload: unknown) => void) => {
      handlers[event] = handler;
    }),
    start: jest.fn().mockResolvedValue(undefined),
    stop: jest.fn().mockResolvedValue(undefined),
  };

  // Annotated because the chainable methods return the builder itself.
  const builder: Record<string, jest.Mock> = {
    withUrl: jest.fn(() => builder),
    withAutomaticReconnect: jest.fn(() => builder),
    build: jest.fn(() => connection),
  };

  return { HubConnectionBuilder: jest.fn(() => builder) };
});

jest.mock('@/utils/tokenManager', () => ({ getValidAccessToken: jest.fn() }));

const rootReducer = combineReducers({ app: appReducer, activeChannel: activeChannelReducer });

function renderHub(viewingChannelId: string | null = null) {
  const store = configureStore({ reducer: rootReducer });
  if (viewingChannelId) store.dispatch(setViewingChannelId(viewingChannelId));

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  const view = renderHook(() => useNotificationHub(true), { wrapper });
  return { store, ...view };
}

const receiveMessage = (channelId: string) =>
  act(() => {
    handlers.ReceiveChannelMessage({ channelId });
  });

beforeEach(() => {
  jest.clearAllMocks();
  Object.keys(handlers).forEach(key => delete handlers[key]);
});

describe('useNotificationHub', () => {
  it('counts a message for a channel the user is not looking at', () => {
    const { store } = renderHub();

    receiveMessage('channel-1');

    expect(store.getState().app.totalUnreadCount).toBe(1);
    expect(store.getState().app.channelUnreadCounts['channel-1']).toBe(1);
  });

  it('counts silent messages the same way', () => {
    const { store } = renderHub();

    act(() => {
      handlers.ReceiveChannelMessageSilent({ channelId: 'channel-1' });
    });

    expect(store.getState().app.totalUnreadCount).toBe(1);
  });

  // The badges used to climb while the user sat reading the conversation.
  it('ignores messages for the channel whose conversation is on screen', () => {
    const { store } = renderHub('channel-1');

    receiveMessage('channel-1');

    expect(store.getState().app.totalUnreadCount).toBe(0);
    expect(store.getState().app.channelUnreadCounts['channel-1']).toBeUndefined();
  });

  it('still counts other channels while one conversation is open', () => {
    const { store } = renderHub('channel-1');

    receiveMessage('channel-2');

    expect(store.getState().app.totalUnreadCount).toBe(1);
    expect(store.getState().app.channelUnreadCounts['channel-2']).toBe(1);
  });

  it('resumes counting for a channel once its conversation is closed', () => {
    const { store } = renderHub('channel-1');

    receiveMessage('channel-1');
    act(() => {
      store.dispatch(setViewingChannelId(null));
    });
    receiveMessage('channel-1');

    expect(store.getState().app.totalUnreadCount).toBe(1);
    expect(store.getState().app.channelUnreadCounts['channel-1']).toBe(1);
  });

  it('does not connect when nobody is signed in', () => {
    const store = configureStore({ reducer: rootReducer });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useNotificationHub(false), { wrapper });

    expect(handlers.ReceiveChannelMessage).toBeUndefined();
  });
});
