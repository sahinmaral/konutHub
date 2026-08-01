import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  incrementChannelUnreadCount,
  incrementTotalUnreadCount,
} from '@/redux/reducers/appReducer';
import { getValidAccessToken } from '@/utils/tokenManager';
import * as SignalR from '@microsoft/signalr';
import { useEffect, useRef } from 'react';

// Mirrors the backend ChannelMessagePayload sent on ReceiveChannelMessage(Silent).
// channelId casing is read defensively since SignalR serialization may vary.
interface ChannelMessagePayload {
  channelId?: string;
}

export const useNotificationHub = (isAuthenticated: boolean) => {
  const connectionRef = useRef<SignalR.HubConnection | null>(null);
  const dispatch = useAppDispatch();

  // Held in a ref because the message handler is registered once per connection: reading the
  // selector directly would capture whichever channel was open when the hub connected.
  const viewingChannelId = useAppSelector(state => state.activeChannel.viewingChannelId);
  const viewingChannelIdRef = useRef(viewingChannelId);
  viewingChannelIdRef.current = viewingChannelId;

  useEffect(() => {
    if (!isAuthenticated) return;

    const connection = new SignalR.HubConnectionBuilder()
      .withUrl(`${process.env.EXPO_PUBLIC_API_BASE_URL}/hubs/notifications`, {
        accessTokenFactory: () => getValidAccessToken(),
      })
      .withAutomaticReconnect()
      .build();

    const handleChannelMessage = (payload: ChannelMessagePayload) => {
      const channelId = payload?.channelId;

      // The user is looking at this conversation, so the message is read as it arrives;
      // counting it would inflate both badges while they read and only settle on re-entry.
      if (channelId && channelId === viewingChannelIdRef.current) return;

      dispatch(incrementTotalUnreadCount());
      if (channelId) dispatch(incrementChannelUnreadCount(channelId));
    };

    connection.on('ReceiveChannelMessage', handleChannelMessage);
    connection.on('ReceiveChannelMessageSilent', handleChannelMessage);

    connection.start().catch(console.error);
    connectionRef.current = connection;

    return () => {
      connection.stop().catch(console.error);
    };
  }, [isAuthenticated]);
};
