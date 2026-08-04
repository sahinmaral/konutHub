import Button from '@/components/Button';
import Text from '@/components/Text';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useAppDispatch } from '@/redux/hooks';
import { clearUser } from '@/redux/reducers/appReducer';
import React from 'react';
import { Image, View } from 'react-native';
import makeStyles from './Error.styles';

interface ErrorProps {
  title?: string;
  description: string;
  onRetry?: () => void;
}

function Error({ description, title, onRetry }: ErrorProps) {
  const styles = useThemedStyles(makeStyles);
  const dispatch = useAppDispatch();

  const handleGoToLogin = () => {
    dispatch(clearUser());
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text variant="display" style={styles.appName}>
          KonutHub
        </Text>
      </View>
      <View style={styles.errorSection}>
        <Text variant="sectionHeading" style={styles.errorText}>
          {title ?? 'Bir şeyler ters gitti'}
        </Text>
        <Text variant="bodySecondary" style={styles.errorTextDescription}>
          {description}
        </Text>
        <View style={styles.buttonGroup}>
          {onRetry && (
            <Button
              title="Tekrar Dene"
              icon="ri-restart-line"
              style={styles.button}
              onPress={onRetry}
            />
          )}
          <Button
            title="Girişe Dön"
            variant="secondary"
            style={styles.button}
            onPress={handleGoToLogin}
          />
        </View>
      </View>
      <Text variant="caption" style={styles.version}>
        v1.0.0
      </Text>
    </View>
  );
}

export default Error;
