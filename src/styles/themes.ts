import colors from './colors';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  mode: 'light' | 'dark';
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  surface: string;
  border: string;
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  primary: string;
  success: string;
  danger: string;
  input: {
    background: string;
    border: string;
    focusedBorder: string;
  };
}

export const lightTheme: Theme = {
  mode: 'light',
  background: {
    primary: colors.mosaic[500],
    secondary: colors.white,
    tertiary: colors.mosaic[400],
  },
  surface: colors.white,
  border: colors.concrete[300],
  text: {
    primary: colors.ink[500],
    secondary: colors.concrete[600],
    tertiary: colors.concrete[500],
  },
  primary: colors.copper[500],
  success: colors.moss[500],
  danger: colors.brick[500],
  input: {
    background: colors.white,
    border: colors.concrete[300],
    focusedBorder: colors.copper[500],
  },
};

export const darkTheme: Theme = {
  mode: 'dark',
  background: {
    primary: colors.ink[500],
    secondary: colors.ink[600],
    tertiary: colors.ink[700],
  },
  surface: colors.ink[600],
  border: colors.ink[700],
  text: {
    primary: colors.mosaic[500],
    secondary: colors.concrete[400],
    tertiary: colors.concrete[500],
  },
  primary: colors.copper[400],
  success: colors.moss[400],
  danger: colors.brick[400],
  input: {
    background: colors.ink[700],
    border: colors.ink[600],
    focusedBorder: colors.copper[400],
  },
};
