import { fetchRegisterDevice } from '@/services/apiServices/devices';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

export const usePushNotifications = (userId?: string) => {
  useEffect(() => {
    if (!userId) return;
    registerForPushNotificationsAsync();
  }, [userId]);

  const registerForPushNotificationsAsync = async () => {
    try {
      if (!Device.isDevice) {
        console.log('Push notifications require a physical device');
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permission not granted for push notifications');
        return;
      }

      const { data: token } = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      await registerDeviceToken(token);
    } catch (error) {
      console.log(error);
    }
  };

  const registerDeviceToken = async (token: string) => {
    await fetchRegisterDevice(token);
  };
};
