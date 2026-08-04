import { Theme } from '@/styles/themes';
import { StyleSheet } from 'react-native';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    line: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.border,
    },
    text: {
      textAlign: 'center',
      paddingHorizontal: 16,
      letterSpacing: 3,
    },
  });

export default makeStyles;
