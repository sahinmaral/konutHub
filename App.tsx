// import { BubbleContentMenuProvider } from '@/components/BubbleContentMenu';
// import { ConfirmationDialogProvider } from '@/components/ConfirmationDialog';
// import CustomBottomTab from '@/components/CustomBottomTab';
import Login from '@/screens/Login/Login';
import { IBMPlexMono_400Regular, IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold } from '@expo-google-fonts/space-grotesk';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { DarkTheme, DefaultTheme, Theme as NavigationTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useCheckInternet from './src/hooks/useCheckInternet';
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

  const { isConnected } = useCheckInternet();
  const theme = useTheme();

  const [fontsLoaded] = useFonts({
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    Inter_400Regular,
    Inter_700Bold,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  });

  useEffect(() => {
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

    console.log('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID:', webClientId);

    if (!webClientId) {
      console.warn('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is not set; Google sign-in is disabled.');
      return;
    }

    GoogleSignin.configure({ webClientId });
  }, []);

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
      <Login />
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
