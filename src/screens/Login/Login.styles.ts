import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

const LOGO_SIZE = 112;

// The copper field runs edge to edge behind the sheet, so the form reads as a
// card lifted onto a brand-colored ground — tonal layering, no shadows.
const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.copper[500],
    },
    scrollContent: {
      flexGrow: 1,
    },
    header: {
      flex: 1,
      minHeight: 180,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 32,
    },
    logoCard: {
      width: LOGO_SIZE,
      height: LOGO_SIZE,
      borderRadius: 24,
      overflow: 'hidden',
      backgroundColor: colors.white,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: LOGO_SIZE,
      height: LOGO_SIZE,
    },
    sheet: {
      backgroundColor: theme.background.primary,
      borderTopStartRadius: 24,
      borderTopEndRadius: 24,
      paddingTop: 32,
      paddingHorizontal: 24,
      gap: 28,
    },
    intro: {
      gap: 6,
    },
    phoneSection: {
      gap: 8,
    },
    phoneRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    // Mirrors the Input field box so the fixed country code and the editable
    // number read as one control split in two.
    countryCode: {
      minWidth: 84,
      minHeight: 48,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.input.border,
      backgroundColor: theme.input.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    phoneInput: {
      flex: 1,
    },
    actions: {
      gap: 20,
    },
    socialGroup: {
      gap: 12,
    },
    terms: {
      textAlign: 'center',
    },
    termsLink: {
      color: theme.primary,
      textDecorationLine: 'underline',
    },
  });

export default makeStyles;
