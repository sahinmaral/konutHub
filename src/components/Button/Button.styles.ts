import { TextStyle, ViewStyle } from 'react-native';
import { Theme } from '@/styles/themes';
import colors from '../../styles/colors';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

type ButtonVariantStyle = {
  container: ViewStyle;
  pressed: ViewStyle;
  text: TextStyle;
};

type ButtonStyles = {
  disabled: ViewStyle;
  variants: Record<ButtonVariant, ButtonVariantStyle>;
};

// Grounded trust: flat fills, 1px borders, zero shadows. Depth comes from
// tonal layering only, so pressed states shift surface color instead of
// dimming the whole button.
const baseContainer: ViewStyle = {
  flexDirection: 'row',
  gap: 8,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 13,
  paddingHorizontal: 20,
  minHeight: 46,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: 'transparent',
};

const makeStyles = (theme: Theme): ButtonStyles => {
  const isDark = theme.mode === 'dark';
  const tint = isDark ? colors.ink[700] : colors.copper[50];

  return {
    disabled: { opacity: 0.4 },
    variants: {
      primary: {
        container: { ...baseContainer, backgroundColor: colors.copper[500] },
        pressed: { backgroundColor: colors.copper[600] },
        text: { color: colors.white },
      },
      secondary: {
        container: {
          ...baseContainer,
          backgroundColor: 'transparent',
          borderColor: theme.border,
        },
        pressed: { backgroundColor: tint },
        text: { color: theme.text.primary },
      },
      danger: {
        container: { ...baseContainer, backgroundColor: colors.brick[500] },
        pressed: { backgroundColor: colors.brick[600] },
        text: { color: colors.white },
      },
      ghost: {
        container: { ...baseContainer, backgroundColor: 'transparent' },
        pressed: { backgroundColor: isDark ? colors.ink[700] : colors.copper[100] },
        text: { color: theme.primary },
      },
    },
  };
};

export default makeStyles;
