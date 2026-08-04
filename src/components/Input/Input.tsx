import Text from '@/components/Text';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import React, { ReactNode, useState } from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-remix-icon';
import makeStyles, { InputVariant, multilineHeight } from './Input.styles';

type InputProps = Omit<TextInputProps, 'style' | 'editable'> & {
  /** `search` renders a pill-shaped field with a leading search icon. */
  variant?: InputVariant;
  label?: string;
  /** Trailing slot on the label row, e.g. an "Opsiyonel" hint or a link. */
  labelRight?: ReactNode;
  helperText?: string;
  /** When set, the field turns danger-toned and this replaces `helperText`. */
  error?: string;
  disabled?: boolean;
  /** Remix icon name rendered before the input. */
  icon?: string;
  /** Fixed leading segment, divided off from the input — e.g. `+90`. */
  prefix?: string;
  /** Masks the value and adds an eye toggle. */
  isSecure?: boolean;
  showCharacterCount?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  fieldStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

function Input({
  variant = 'default',
  label,
  labelRight,
  helperText,
  error,
  disabled,
  icon,
  prefix,
  isSecure,
  showCharacterCount,
  containerStyle,
  fieldStyle,
  inputStyle,
  value,
  placeholder,
  multiline,
  // Sizes the field instead of reaching the TextInput: Android reads
  // `numberOfLines` as maxLines and clamps the text past it.
  numberOfLines = 3,
  maxLength,
  onFocus,
  onBlur,
  testID,
  ...rest
}: InputProps) {
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  const leadingIcon = icon ?? (variant === 'search' ? 'search-line' : undefined);
  const footerText = error ?? helperText;
  const showCounter = Boolean(showCharacterCount && maxLength);

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label || labelRight ? (
        <View style={styles.labelRow}>
          {label ? <Text variant="bodySecondary">{label}</Text> : <View />}
          {labelRight}
        </View>
      ) : null}

      <View
        testID={testID ? `${testID}-field` : undefined}
        style={[
          styles.field,
          variant === 'search' && styles.fieldSearch,
          multiline && styles.fieldMultiline,
          // Focus sets the 2px ring and error repaints it, so a field being
          // corrected keeps the thicker border in the danger tone.
          focused && !disabled && styles.fieldFocused,
          error && styles.fieldError,
          disabled && styles.fieldDisabled,
          fieldStyle,
        ]}
      >
        {leadingIcon ? <Icon name={leadingIcon} color={theme.text.secondary} size={20} /> : null}

        {prefix ? (
          <>
            <Text style={styles.prefix}>{prefix}</Text>
            <View style={styles.prefixDivider} />
          </>
        ) : null}

        <TextInput
          placeholderTextColor={theme.text.tertiary}
          {...rest}
          testID={testID}
          placeholder={placeholder}
          value={value ?? ''}
          editable={!disabled}
          accessibilityState={{ disabled: Boolean(disabled) }}
          secureTextEntry={isSecure && !passwordVisible}
          multiline={multiline}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            multiline && { minHeight: multilineHeight(numberOfLines) },
            inputStyle,
          ]}
        />

        {isSecure ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? 'Şifreyi gizle' : 'Şifreyi göster'}
            hitSlop={8}
            disabled={disabled}
            onPress={() => setPasswordVisible(prev => !prev)}
          >
            <Icon
              name={passwordVisible ? 'eye-line' : 'eye-off-line'}
              color={theme.text.secondary}
              size={20}
            />
          </Pressable>
        ) : null}
      </View>

      {footerText || showCounter ? (
        <View style={styles.footerRow}>
          {footerText ? (
            <Text
              variant="caption"
              color={error ? theme.danger : theme.text.tertiary}
              style={styles.footerText}
              accessibilityRole={error ? 'alert' : undefined}
            >
              {footerText}
            </Text>
          ) : (
            <View style={styles.footerText} />
          )}
          {showCounter ? (
            <Text variant="caption">
              {(value ?? '').length}/{maxLength}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export default Input;
