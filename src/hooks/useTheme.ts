import { useColorScheme } from 'react-native';
import { useAppSelector } from '../redux/hooks';
import { darkTheme, lightTheme, Theme } from '../styles/themes';

const useTheme = (): Theme => {
  const mode = useAppSelector(state => state.theme.mode);
  const systemScheme = useColorScheme();

  const resolved = mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;

  return resolved === 'dark' ? darkTheme : lightTheme;
};

export default useTheme;
