import Text from '@/components/Text';
import useThemedStyles from '@/hooks/useThemedStyles';
import React from 'react';
import { ActivityIndicator, Pressable, ViewStyle } from 'react-native';
import Icon from 'react-native-remix-icon';
import makeStyles, { ButtonVariant } from './Button.styles';

interface ButtonProps {
  title: string;
  icon?: string;
  /** Tints the icon apart from the label — e.g. a brand mark on a neutral button. */
  iconColor?: string;
  style?: ViewStyle;
  disabled?: boolean;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
}

function Button({
  title,
  icon,
  iconColor,
  style,
  disabled,
  onPress,
  variant = 'primary',
  loading,
}: ButtonProps) {
  const styles = useThemedStyles(makeStyles);
  const { container, pressed, text } = styles.variants[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed: isPressed }) => [
        container,
        isPressed && pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color={text.color} />
      ) : (
        <>
          {icon ? <Icon name={icon} color={iconColor ?? text.color} size={20} /> : null}
          <Text variant="bodyBold" style={text}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

export default Button;
