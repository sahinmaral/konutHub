
export interface ApiValidationError {
  propertyName: string;
  errorMessage: string;
  attemptedValue: unknown;
  errorCode: string;
}

export interface ApiError {
  detail: string;
  errors?: ApiValidationError[];
  extensions: Record<string, unknown>;
  instance: string;
  status: number;
  title: string;
  type: string;
}

export interface Role {
  name: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpires: string;
}

export interface User extends TokenResponse {
  id: string;
  userName: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  profilePhotoURL?: string | null;
  profile?: MyProfileDto | null;
}

export interface MyProfileDto {
  bio?: string | null;
  joinedChannelCount: number;
  createdAt: string
}

export interface UserNotificationSetting {
  isEnabled: boolean;
  isSoundEnabled: boolean;
}

export interface UserChannelMuteSetting {
  channelId: string;
  mutedUntil?: string;
  isMuted: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  count: number;
  size: number;
  index: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// export type MainStackParamList = {
//   Channels: undefined;
//   Explore: undefined;
//   Profile: undefined;
// };

// export type RootStackParamList = {
//   Login: undefined;
//   SignUp: undefined;
//   ContinueSignUp: { email: string; password: string; username: string };
//   ActiveChannelList: undefined;
//   AllChannelList: undefined;
//   ChannelMessagesList: undefined;
//   ChannelDetail: undefined;
//   ChannelMembersList: undefined;
//   ChannelPendingJoinRequestsList: undefined;
//   ChannelBannedMembersList: undefined;
//   RemoveMemberFromChannel: undefined;
// };

// export type ProfileStackParamList = {
//   MyProfile: undefined;
//   EditProfile: undefined;
//   Settings: undefined;
//   ChangePassword: undefined;
//   TermsOfService: undefined;
//   PrivacyPolicy: undefined;
// };

// export type AppNavigationProp = CompositeNavigationProp<
//   NativeStackNavigationProp<RootStackParamList>,
//   BottomTabNavigationProp<MainStackParamList>
// >;
