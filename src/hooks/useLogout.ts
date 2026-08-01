import { useAppDispatch } from '@/redux/hooks';
import { clearUser } from '@/redux/reducers/appReducer';
import { fetchRemoveDevice } from '@/services/apiServices/devices';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

function useLogout() {
  const dispatch = useAppDispatch();

  const logout = async () => {
    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      await fetchRemoveDevice(token.data);
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(clearUser());
    }
  };

  return logout;
}

export default useLogout;
