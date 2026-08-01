import appReducer, { setUser } from '@/redux/reducers/appReducer';
import { fetchRemoveDevice } from '@/services/apiServices/devices';
import { User } from '@/types';
import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { Provider } from 'react-redux';
import useLogout from './useLogout';

jest.mock('expo-notifications', () => ({
  getExpoPushTokenAsync: jest.fn(),
}));

jest.mock('@/services/apiServices/devices', () => ({
  fetchRemoveDevice: jest.fn(),
}));

const mockGetExpoPushTokenAsync = Notifications.getExpoPushTokenAsync as jest.Mock;
const mockFetchRemoveDevice = fetchRemoveDevice as jest.Mock;

const mockUser: User = {
  id: 'user-1',
  userName: 'sahin',
  firstName: 'Sahin',
  lastName: 'Maral',
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  refreshTokenExpires: '2030-01-01T00:00:00Z',
};

function makeStore() {
  const store = configureStore({ reducer: { app: appReducer } });
  store.dispatch(setUser(mockUser));
  return store;
}

function renderUseLogout(store: ReturnType<typeof makeStore>) {
  return renderHook(() => useLogout(), {
    wrapper: ({ children }) => React.createElement(Provider, { store, children }),
  });
}

describe('useLogout', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // useLogout intentionally console.logs a swallowed cleanup error (see useLogout.ts) —
    // expected noise for the failure-path tests below, suppressed to keep output clean.
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('removes the device token and clears the user on success', async () => {
    mockGetExpoPushTokenAsync.mockResolvedValue({ data: 'push-token' });
    mockFetchRemoveDevice.mockResolvedValue({});

    const store = makeStore();
    const { result } = renderUseLogout(store);

    await act(async () => {
      await result.current();
    });

    expect(mockFetchRemoveDevice).toHaveBeenCalledWith('push-token');
    expect(store.getState().app.user).toBeNull();
  });

  it('still clears the user even if push-token removal fails', async () => {
    mockGetExpoPushTokenAsync.mockRejectedValue(new Error('no permission'));

    const store = makeStore();
    const { result } = renderUseLogout(store);

    await act(async () => {
      await result.current();
    });

    expect(mockFetchRemoveDevice).not.toHaveBeenCalled();
    expect(store.getState().app.user).toBeNull();
  });

  it('still clears the user even if device removal itself fails', async () => {
    mockGetExpoPushTokenAsync.mockResolvedValue({ data: 'push-token' });
    mockFetchRemoveDevice.mockRejectedValue(new Error('network error'));

    const store = makeStore();
    const { result } = renderUseLogout(store);

    await act(async () => {
      await result.current();
    });

    expect(store.getState().app.user).toBeNull();
  });
});
