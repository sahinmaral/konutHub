import ChannelJoinPolicy from '@/enums/ChannelJoinPolicy';
import { UserRole } from '@/enums/UserRole';
import activeChannelReducer from '@/redux/reducers/activeChannelReducer';
import { fetchGetChannelById } from '@/services/apiServices/channels';
import { navigationRef } from '@/utils/navigationRef';
import { ChannelDetailDto } from '@/types';
import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { Provider } from 'react-redux';
import { useNotificationHandler } from './useNotificationHandler';

let capturedListener: ((response: Notifications.NotificationResponse) => void) | undefined;

jest.mock('expo-notifications', () => ({
  getLastNotificationResponseAsync: jest.fn().mockResolvedValue(null),
  addNotificationResponseReceivedListener: jest.fn(callback => {
    capturedListener = callback;
    return { remove: jest.fn() };
  }),
  setNotificationChannelAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
  AndroidImportance: { MAX: 5, LOW: 1 },
}));

jest.mock('@/services/apiServices/channels', () => ({
  fetchGetChannelById: jest.fn(),
}));

jest.mock('@/utils/navigationRef', () => ({
  navigationRef: { isReady: jest.fn(), navigate: jest.fn() },
}));

const mockFetchGetChannelById = fetchGetChannelById as jest.Mock;
const mockIsReady = navigationRef.isReady as jest.Mock;
const mockNavigate = navigationRef.navigate as jest.Mock;

const mockChannel: ChannelDetailDto = {
  id: 'channel-1',
  name: 'General',
  description: 'General discussion',
  inviteCode: 'ABC123',
  joinPolicy: ChannelJoinPolicy.Open,
  memberCount: 3,
  createdAt: '2026-01-01T00:00:00Z',
  role: { name: UserRole.Owner },
};

function makeNotificationResponse(channelId: string): Notifications.NotificationResponse {
  return {
    notification: { request: { content: { data: { channelId } } } },
  } as unknown as Notifications.NotificationResponse;
}

function renderWithStore() {
  const store = configureStore({ reducer: { activeChannel: activeChannelReducer } });
  const rendered = renderHook(() => useNotificationHandler(), {
    wrapper: ({ children }) => React.createElement(Provider, { store, children }),
  });
  return { store, ...rendered };
}

describe('useNotificationHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedListener = undefined;
    mockFetchGetChannelById.mockResolvedValue({ data: mockChannel });
  });

  it('sets the active channel and navigates when a live notification is tapped', async () => {
    mockIsReady.mockReturnValue(true);
    const { store } = renderWithStore();

    await act(async () => {
      await capturedListener?.(makeNotificationResponse('channel-1'));
    });

    expect(mockFetchGetChannelById).toHaveBeenCalledWith('channel-1');
    expect(store.getState().activeChannel.channel).toMatchObject({
      id: 'channel-1',
      name: 'General',
      role: UserRole.Owner,
    });
    expect(mockNavigate).toHaveBeenCalledWith('ChannelMessagesList');
  });

  it('does not navigate when navigation is not ready yet', async () => {
    mockIsReady.mockReturnValue(false);
    const { store } = renderWithStore();

    await act(async () => {
      await capturedListener?.(makeNotificationResponse('channel-1'));
    });

    expect(store.getState().activeChannel.channel).not.toBeNull();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles a cold-start notification response on mount', async () => {
    mockIsReady.mockReturnValue(true);
    (Notifications.getLastNotificationResponseAsync as jest.Mock).mockResolvedValue(
      makeNotificationResponse('channel-1'),
    );

    const { store } = renderWithStore();

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(store.getState().activeChannel.channel?.id).toBe('channel-1');
  });
});
