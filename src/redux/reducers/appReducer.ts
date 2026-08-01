import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MyProfileDto, User, UserNotificationSetting } from '../../types';

interface AppState {
  user: User | null;
  notificationSettings: UserNotificationSetting | null;
}

const initialState: AppState = {
  user: null,
  notificationSettings: null,
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
    },
    setProfile: (state, action: PayloadAction<MyProfileDto | null>) => {
      if (state.user) {
        state.user.profile = action.payload;
      }
    },
    setNotificationSettings: (state, action: PayloadAction<UserNotificationSetting | null>) => {
      state.notificationSettings = action.payload;
    },
  },
});

export const {
  setUser,
  clearUser,
  setProfile,
  setNotificationSettings,
} = appSlice.actions;

export default appSlice.reducer;
