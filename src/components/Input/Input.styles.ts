import { Theme } from '@/styles/themes';
import { fontFamilies } from '@/styles/typography';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import colors from '../../styles/colors';

export type InputVariant = 'default' | 'search';

/** Matches the `body` text variant so multiline fields grow in whole rows. */
const LINE_HEIGHT = 23;

export const multilineHeight = (lines: number) => lines * LINE_HEIGHT;

// Grounded trust: flat fills, thin borders, zero shadows. A field earns
// attention by thickening and tinting its border, never by casting a shadow.
const field: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  minHeight: 48,
  borderRadius: 12,
  borderWidth: 1,
  paddingHorizontal: 14,
  paddingVertical: 11,
};

// The focus ring is 2px, so shave a point off the padding to keep the text
// from shifting as the border thickens.
const fieldFocused: ViewStyle = {
  borderWidth: 2,
  paddingHorizontal: 13,
  paddingVertical: 10,
};

const makeStyles = (theme: Theme) => {
  const isDark = theme.mode === 'dark';

  return StyleSheet.create({
    container: {
      gap: 8,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    field: {
      ...field,
      borderColor: theme.input.border,
      backgroundColor: theme.input.background,
    },
    fieldSearch: {
      borderRadius: 999,
    },
    fieldMultiline: {
      alignItems: 'flex-start',
    },
    fieldFocused: {
      ...fieldFocused,
      borderColor: theme.input.focusedBorder,
    },
    fieldError: {
      borderColor: theme.danger,
    },
    fieldDisabled: {
      opacity: 0.5,
      // The dark input surface already sits at ink[700], so step one shade
      // further back to keep "disabled" reading as recessed.
      backgroundColor: isDark ? colors.ink[800] : theme.background.tertiary,
    },
    prefix: {
      color: theme.text.primary,
    },
    prefixDivider: {
      width: StyleSheet.hairlineWidth,
      alignSelf: 'stretch',
      backgroundColor: theme.border,
    },
    input: {
      flex: 1,
      // Drops Android's built-in inset so the field padding is the only ruler.
      padding: 0,
      fontFamily: fontFamilies.interRegular,
      fontSize: 16,
      lineHeight: LINE_HEIGHT,
      color: theme.text.primary,
    } as TextStyle,
    inputMultiline: {
      textAlignVertical: 'top',
    } as TextStyle,
    footerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 8,
    },
    footerText: {
      flex: 1,
    },
  });
};

export default makeStyles;
