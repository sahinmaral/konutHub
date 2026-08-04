import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActiveChannelState {
  /** Id of the channel whose conversation is currently on screen, or null when none is. */
  viewingChannelId: string | null;
}

const initialState: ActiveChannelState = {
  viewingChannelId: null,
};

// Deliberately kept out of the persisted slices: which conversation is open belongs to the
// current session only, and a stale id restored on launch would silently swallow unread counts.
export const activeChannelSlice = createSlice({
  name: 'activeChannel',
  initialState,
  reducers: {
    setViewingChannelId: (state, action: PayloadAction<string | null>) => {
      state.viewingChannelId = action.payload;
    },
  },
});

export const { setViewingChannelId } = activeChannelSlice.actions;

export default activeChannelSlice.reducer;
