import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MyProfileDto, User, UserChannelMuteSetting, UserNotificationSetting } from '../../types';

interface AppState {
  user: User | null;
  notificationSettings: UserNotificationSetting | null;
  channelMuteSettings: UserChannelMuteSetting[];
  totalUnreadCount: number;
  channelUnreadCounts: Record<string, number>;
}

const initialState: AppState = {
  user: null,
  notificationSettings: null,
  channelMuteSettings: [],
  totalUnreadCount: 0,
  channelUnreadCounts: {},
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: state => {
      state.user = null;
      state.notificationSettings = null;
      state.channelMuteSettings = [];
      state.totalUnreadCount = 0;
      state.channelUnreadCounts = {};
    },
    setProfile: (state, action: PayloadAction<MyProfileDto | null>) => {
      if (state.user) {
        state.user.profile = action.payload;
      }
    },
    setNotificationSettings: (state, action: PayloadAction<UserNotificationSetting | null>) => {
      state.notificationSettings = action.payload;
    },
    setChannelMuteSettings: (state, action: PayloadAction<UserChannelMuteSetting[]>) => {
      state.channelMuteSettings = action.payload;
    },
    // The server keeps one setting per channel, so muting a channel that already has an
    // entry replaces it rather than stacking a second one next to it.
    upsertChannelMuteSetting: (state, action: PayloadAction<UserChannelMuteSetting>) => {
      const index = state.channelMuteSettings.findIndex(
        setting => setting.channelId === action.payload.channelId,
      );

      if (index === -1) {
        state.channelMuteSettings.push(action.payload);
      } else {
        state.channelMuteSettings[index] = action.payload;
      }
    },
    removeChannelMuteSetting: (state, action: PayloadAction<string>) => {
      state.channelMuteSettings = state.channelMuteSettings.filter(
        setting => setting.channelId !== action.payload,
      );
    },
    setTotalUnreadCount: (state, action: PayloadAction<number>) => {
      state.totalUnreadCount = action.payload;
    },
    incrementTotalUnreadCount: state => {
      state.totalUnreadCount += 1;
    },
    incrementChannelUnreadCount: (state, action: PayloadAction<string>) => {
      state.channelUnreadCounts[action.payload] =
        (state.channelUnreadCounts[action.payload] ?? 0) + 1;
    },
    // Written as an explicit zero rather than deleted, so a channel the user has just read
    // still has a count for the badge to render against.
    resetChannelUnreadCount: (state, action: PayloadAction<string>) => {
      state.channelUnreadCounts[action.payload] = 0;
    },
  },
});

export const {
  setUser,
  clearUser,
  setProfile,
  setNotificationSettings,
  setChannelMuteSettings,
  upsertChannelMuteSetting,
  removeChannelMuteSetting,
  setTotalUnreadCount,
  incrementTotalUnreadCount,
  incrementChannelUnreadCount,
  resetChannelUnreadCount,
} = appSlice.actions;

export default appSlice.reducer;
