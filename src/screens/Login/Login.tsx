import Button from '@/components/Button';
import Divider from '@/components/Divider';
import Input from '@/components/Input';
import Text from '@/components/Text';
import useKeyboardVisible from '@/hooks/useKeyboardVisible';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import makeStyles from './Login.styles';

const PHONE_DIGIT_COUNT = 10;
/** `5xx xxx xx xx` — the way Turkish mobile numbers are read out loud. */
const PHONE_GROUPS = [3, 3, 2, 2];
const PHONE_MAX_LENGTH = PHONE_DIGIT_COUNT + PHONE_GROUPS.length - 1;

export const toPhoneDigits = (value: string) =>
  value.replace(/\D/g, '').slice(0, PHONE_DIGIT_COUNT);

export const formatPhoneNumber = (value: string) => {
  const digits = toPhoneDigits(value);
  let cursor = 0;

  return PHONE_GROUPS.reduce<string[]>((groups, size) => {
    const group = digits.slice(cursor, cursor + size);
    cursor += size;
    return group ? [...groups, group] : groups;
  }, []).join(' ');
};

function Login() {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const { isKeyboardVisible } = useKeyboardVisible();
  const insets = useSafeAreaInsets();
  const [phoneNumber, setPhoneNumber] = useState('');

  const digits = toPhoneDigits(phoneNumber);
  const isPhoneComplete = digits.length === PHONE_DIGIT_COUNT;

  // The auth requests and the routes these lead to don't exist yet, so each
  // handler is the single place to wire one up.
  const handleContinue = () => {
    if (!isPhoneComplete) return;
  };

  const handleGoogleLogin = async () => {
    const hasPlayServices = await GoogleSignin.hasPlayServices();
    console.log('Google Play Services available:', hasPlayServices);

    const response = await GoogleSignin.signIn();

    console.log('Google Sign-In response:', JSON.stringify(response, null, 2));

    // if (response.data?.idToken) {
    //   await fetch(
    //     'https://eeb1-2a00-1d34-2834-1f00-1004-1acd-5753-3c71.ngrok-free.app/api/auth/google',
    //     {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ idToken: response.data.idToken }),
    //     },
    //   );
    // }
  };

  const handleFacebookLogin = () => {};

  const handleTermsPress = () => {};

  const handlePrivacyPress = () => {};

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={isKeyboardVisible}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        enableOnAndroid
        extraScrollHeight={20}
        enableResetScrollToCoords={false}
        enableAutomaticScroll={false}
      >
        <View style={styles.header}>
          <View style={styles.logoCard}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
          </View>
        </View>

        <View style={[styles.sheet, { paddingBottom: Math.max(24, insets.bottom) }]}>
          <View style={styles.intro}>
            <Text variant="display">Giriş yap</Text>
            <Text variant="bodySecondary">Devam etmek için telefon numaranı gir</Text>
          </View>

          <View style={styles.phoneSection}>
            <Text variant="bodySecondary">Telefon numarası</Text>
            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text variant="bodyBold">+90</Text>
              </View>
              <Input
                testID="phone-input"
                containerStyle={styles.phoneInput}
                placeholder="5xx xxx xx xx"
                value={phoneNumber}
                onChangeText={value => setPhoneNumber(formatPhoneNumber(value))}
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                autoComplete="tel"
                maxLength={PHONE_MAX_LENGTH}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
              />
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              title="Devam et"
              variant="primary"
              disabled={!isPhoneComplete}
              onPress={handleContinue}
            />

            <Divider text="veya" />

            <View style={styles.socialGroup}>
              <Button
                title="Google ile devam et"
                variant="secondary"
                icon="google-fill"
                iconColor={theme.primary}
                onPress={handleGoogleLogin}
              />
              <Button
                title="Facebook ile devam et"
                variant="secondary"
                icon="facebook-circle-fill"
                iconColor={theme.primary}
                onPress={handleFacebookLogin}
              />
            </View>

            <Text variant="caption" style={styles.terms}>
              Devam ederek{' '}
              <Text
                variant="caption"
                style={styles.termsLink}
                accessibilityRole="link"
                onPress={handleTermsPress}
              >
                Kullanım Koşullarını
              </Text>{' '}
              ve{' '}
              <Text
                variant="caption"
                style={styles.termsLink}
                accessibilityRole="link"
                onPress={handlePrivacyPress}
              >
                Gizlilik Politikamızı
              </Text>{' '}
              kabul etmiş olursunuz.
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default Login;
