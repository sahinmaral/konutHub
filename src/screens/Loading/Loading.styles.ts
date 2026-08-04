import colors from '@/styles/colors';
import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.primary,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 80,
    },
    main: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: 110,
      height: 110,
    },
    appName: {
      marginTop: 14,
    },
    loadingSection: {
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 30,
    },
    loadingText: {
      textAlign: 'center',
    },
    dotsRow: {
      flexDirection: 'row',
      gap: 8,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.copper[500],
    },
    version: {
      marginTop: 40,
    },
  });

export default makeStyles;
