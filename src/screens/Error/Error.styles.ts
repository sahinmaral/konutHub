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
    errorSection: {
      width: '100%',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 30,
    },
    errorText: {
      textAlign: 'center',
    },
    errorTextDescription: {
      textAlign: 'center',
    },
    buttonGroup: {
      marginTop: 20,
      width: '80%',
      gap: 15,
    },
    button: { paddingVertical: 10 },
    version: {
      marginTop: 40,
    },
  });

export default makeStyles;
