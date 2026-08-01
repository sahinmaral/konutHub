// import { BubbleContentMenuProvider } from '@/components/BubbleContentMenu';
// import { ConfirmationDialogProvider } from '@/components/ConfirmationDialog';
// import CustomBottomTab from '@/components/CustomBottomTab';
import { useNotificationHandler } from '@/hooks/useNotificationHandler';
import { useNotificationHub } from '@/hooks/useNotificationHub';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import {
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
    useFonts,
} from '@expo-google-fonts/montserrat';
import {
    DarkTheme,
    DefaultTheme,
    Theme as NavigationTheme
} from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useCheckInternet from './src/hooks/useCheckInternet';
import useLanguage from './src/hooks/useLanguage';
import useTheme from './src/hooks/useTheme';
import { useAppDispatch, useAppSelector } from './src/redux/hooks';
// import CheckInternet from './src/screens/CheckInternet';
// import ContinueSignUp from './src/screens/ContinueSignUp';
// import Login from './src/screens/Login';
// import SignUp from './src/screens/SignUp';
// import colors from './src/styles/colors';
// import { MainStackParamList, ProfileStackParamList, RootStackParamList } from './src/types';

// const Stack = createNativeStackNavigator<RootStackParamList>();
// const ProfileStackNav = createNativeStackNavigator<ProfileStackParamList>();
// const Tab = createBottomTabNavigator<MainStackParamList>();

// const AuthStack = () => (
//   <Stack.Navigator screenOptions={{ headerShown: false }}>
//     <Stack.Screen name="Login" component={Login} />
//     <Stack.Screen name="SignUp" component={SignUp} />
//     <Stack.Screen name="ContinueSignUp" component={ContinueSignUp} />
//   </Stack.Navigator>
// );

// const ChannelStack = () => (
//   <Stack.Navigator initialRouteName="ActiveChannelList" screenOptions={{ headerShown: false }}>
//     <Stack.Screen name="ActiveChannelList" component={ActiveChannelList} />
//     <Stack.Screen name="ChannelMessagesList" component={ChannelMessagesList} />
//     <Stack.Screen name="ChannelDetail" component={ChannelDetail} />
//     <Stack.Screen name="ChannelMembersList" component={ChannelMembersList} />
//     <Stack.Screen
//       name="ChannelPendingJoinRequestsList"
//       component={ChannelPendingJoinRequestsList}
//     />
//     <Stack.Screen name="ChannelBannedMembersList" component={ChannelBannedMembersList} />
//     <Stack.Screen name="RemoveMemberFromChannel" component={RemoveMemberFromChannel} />
//   </Stack.Navigator>
// );

// const ExploreStack = () => (
//   <Stack.Navigator initialRouteName="AllChannelList" screenOptions={{ headerShown: false }}>
//     <Stack.Screen name="AllChannelList" component={AllChannelList} />
//   </Stack.Navigator>
// );

// const ProfileStack = () => (
//   <ProfileStackNav.Navigator initialRouteName="MyProfile" screenOptions={{ headerShown: false }}>
//     <ProfileStackNav.Screen name="MyProfile" component={MyProfile} />
//     <ProfileStackNav.Screen name="EditProfile" component={EditProfile} />
//     <ProfileStackNav.Screen name="Settings" component={Settings} />
//     <ProfileStackNav.Screen name="ChangePassword" component={ChangePassword} />
//     <ProfileStackNav.Screen name="TermsOfService" component={TermsOfService} />
//     <ProfileStackNav.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
//   </ProfileStackNav.Navigator>
// );

// const MainStack = () => (
//   <Tab.Navigator
//     screenOptions={{ headerShown: false }}
//     tabBar={props => <CustomBottomTab {...props} />}
//   >
//     <Tab.Screen name="Channels" component={ChannelStack} />
//     <Tab.Screen name="Explore" component={ExploreStack} />
//     <Tab.Screen name="Profile" component={ProfileStack} />
//   </Tab.Navigator>
// );

function App() {
  const user = useAppSelector(state => state.app.user);
  const dispatch = useAppDispatch();

  usePushNotifications(user?.id);
  useNotificationHub(user !== null);
  useNotificationHandler();

  const { isConnected } = useCheckInternet();
  const theme = useTheme();
  useLanguage();
  const [fontsLoaded] = useFonts({
    Montserrat_100: Montserrat_100Thin,
    Montserrat_200: Montserrat_200ExtraLight,
    Montserrat_300: Montserrat_300Light,
    Montserrat_400: Montserrat_400Regular,
    Montserrat_500: Montserrat_500Medium,
    Montserrat_600: Montserrat_600SemiBold,
    Montserrat_700: Montserrat_700Bold,
    Montserrat_800: Montserrat_800ExtraBold,
    Montserrat_900: Montserrat_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const navigationTheme: NavigationTheme = {
    ...(theme.mode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme.mode === 'dark' ? DarkTheme : DefaultTheme).colors,
      primary: theme.primary,
      background: theme.background.primary,
      card: theme.surface,
      text: theme.text.primary,
      border: theme.border,
    },
  };

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      {/* <ConfirmationDialogProvider>
        <NavigationContainer ref={navigationRef} theme={navigationTheme}>
          <BubbleContentMenuProvider>
            {user === null ? <AuthStack /> : <MainStack />}
          </BubbleContentMenuProvider>
        </NavigationContainer>
      </ConfirmationDialogProvider>

      {!isConnected && (
        <View style={StyleSheet.absoluteFill}>
          <CheckInternet
            styles={{
              container: { backgroundColor: theme.primary },
              text: { color: colors.white },
            }}
          />
        </View>
      )} */}
    </GestureHandlerRootView>
  );
}

export default App;
