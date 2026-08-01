import { useMemo } from 'react';
import { Theme } from '../styles/themes';
import useTheme from './useTheme';

const useThemedStyles = <T>(factory: (theme: Theme) => T): T => {
  const theme = useTheme();
  return useMemo(() => factory(theme), [factory, theme]);
};

export default useThemedStyles;
