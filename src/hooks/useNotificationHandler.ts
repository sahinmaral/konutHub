import { UserRole } from '@/enums/UserRole';
import { EventSubscription } from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { useAppDispatch } from '../redux/hooks';
import { setActiveChannel } from '../redux/reducers/activeChannelReducer';
import { fetchGetChannelById } from '../services/apiServices/channels';
import { navigationRef } from '../utils/navigationRef';

// Setup Android notification channels
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'Default',
    importance: Notifications.AndroidImportance.MAX,
    sound: 'default',
  });

  Notifications.setNotificationChannelAsync('silent', {
    name: 'Silent',
    importance: Notifications.AndroidImportance.LOW,
    sound: null,
  });
}

Notifications.setNotificationHandler({
  handleNotification: async notification => {
    const { withSound } = notification.request.content.data;
    return {
      shouldShowAlert: true,
      shouldPlaySound: withSound === 'true',
      shouldSetBadge: true,
    };
  },
});

export const useNotificationHandler = () => {
  const responseListener = useRef<EventSubscription>();
  const dispatch = useAppDispatch();

  // Runs from notification callbacks, so a rejection here has nothing to catch it: an offline
  // cold start or a deleted channel would surface as an unhandled rejection. Failing quietly
  // leaves the user on whatever screen they opened, which is the sane fallback.
  const handleNotificationResponse = async (response: Notifications.NotificationResponse) => {
    const { channelId } = response.notification.request.content.data;

    try {
      const { data: channel } = await fetchGetChannelById(channelId);

      dispatch(
        setActiveChannel({
          id: channel.id,
          name: channel.name,
          description: channel.description,
          createdAt: channel.createdAt,
          inviteCode: channel.inviteCode,
          joinPolicy: channel.joinPolicy,
          role: channel.role?.name as UserRole,
        }),
      );

      if (navigationRef.isReady()) {
        navigationRef.navigate('ChannelMessagesList');
      }
    } catch (exception) {
      console.log('Could not open the channel from a notification', exception);
    }
  };

  useEffect(() => {
    Notifications.getLastNotificationResponseAsync()
      .then(response => {
        if (response) handleNotificationResponse(response);
      })
      .catch(exception => console.log('Could not read the last notification', exception));

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse,
    );

    return () => {
      responseListener.current?.remove();
    };
  }, [dispatch]);
};
