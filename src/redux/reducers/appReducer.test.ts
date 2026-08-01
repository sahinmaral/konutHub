import { User, UserChannelMuteSetting, UserNotificationSetting } from '@/types';
import reducer, {
    clearUser,
    incrementChannelUnreadCount,
    removeChannelMuteSetting,
    resetChannelUnreadCount,
    upsertChannelMuteSetting,
} from './appReducer';

const initialState = reducer(undefined, { type: '@@INIT' });

const mockUser: User = {
  id: 'user-1',
  userName: 'sahin',
  firstName: 'Sahin',
  lastName: 'Maral',
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  refreshTokenExpires: '2030-01-01T00:00:00Z',
};

const mockNotificationSettings: UserNotificationSetting = {
  isEnabled: true,
  isSoundEnabled: true,
};

const mockMuteSetting: UserChannelMuteSetting = {
  channelId: 'channel-1',
  isMuted: true,
};

describe('appReducer', () => {
  describe('upsertChannelMuteSetting', () => {
    it('inserts a new entry when the channel has no existing mute setting', () => {
      const state = reducer(initialState, upsertChannelMuteSetting(mockMuteSetting));
      expect(state.channelMuteSettings).toEqual([mockMuteSetting]);
    });

    it('replaces the existing entry for the same channelId', () => {
      const withSetting = reducer(initialState, upsertChannelMuteSetting(mockMuteSetting));
      const updated: UserChannelMuteSetting = { channelId: 'channel-1', isMuted: false };
      const state = reducer(withSetting, upsertChannelMuteSetting(updated));
      expect(state.channelMuteSettings).toEqual([updated]);
    });
  });

  describe('removeChannelMuteSetting', () => {
    it('filters out the mute setting for the given channelId', () => {
      const withSetting = reducer(initialState, upsertChannelMuteSetting(mockMuteSetting));
      const state = reducer(withSetting, removeChannelMuteSetting('channel-1'));
      expect(state.channelMuteSettings).toEqual([]);
    });

    it('leaves other channels untouched', () => {
      const other: UserChannelMuteSetting = { channelId: 'channel-2', isMuted: true };
      let state = reducer(initialState, upsertChannelMuteSetting(mockMuteSetting));
      state = reducer(state, upsertChannelMuteSetting(other));
      state = reducer(state, removeChannelMuteSetting('channel-1'));
      expect(state.channelMuteSettings).toEqual([other]);
    });
  });

  describe('incrementChannelUnreadCount', () => {
    it('initializes the count at 1 for a channel with no prior entry', () => {
      const state = reducer(initialState, incrementChannelUnreadCount('channel-1'));
      expect(state.channelUnreadCounts).toEqual({ 'channel-1': 1 });
    });

    it('increments an already-populated count', () => {
      let state = reducer(initialState, incrementChannelUnreadCount('channel-1'));
      state = reducer(state, incrementChannelUnreadCount('channel-1'));
      expect(state.channelUnreadCounts).toEqual({ 'channel-1': 2 });
    });
  });

  describe('resetChannelUnreadCount', () => {
    it('resets an existing count to 0', () => {
      let state = reducer(initialState, incrementChannelUnreadCount('channel-1'));
      state = reducer(state, resetChannelUnreadCount('channel-1'));
      expect(state.channelUnreadCounts).toEqual({ 'channel-1': 0 });
    });

    it('sets a fresh channel directly to 0', () => {
      const state = reducer(initialState, resetChannelUnreadCount('channel-1'));
      expect(state.channelUnreadCounts).toEqual({ 'channel-1': 0 });
    });
  });

  describe('clearUser', () => {
    it('resets user, notificationSettings, totalUnreadCount, channelMuteSettings and channelUnreadCounts', () => {
      let state = reducer(initialState, { type: 'app/setUser', payload: mockUser });
      state = reducer(state, {
        type: 'app/setNotificationSettings',
        payload: mockNotificationSettings,
      });
      state = reducer(state, upsertChannelMuteSetting(mockMuteSetting));
      state = reducer(state, incrementChannelUnreadCount('channel-1'));
      state = reducer(state, { type: 'app/setTotalUnreadCount', payload: 5 });

      state = reducer(state, clearUser());

      expect(state).toEqual({
        user: null,
        notificationSettings: null,
        channelMuteSettings: [],
        totalUnreadCount: 0,
        channelUnreadCounts: {},
      });
    });
  });
});
