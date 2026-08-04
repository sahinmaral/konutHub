import React from 'react';
import { Text, TextProps } from 'react-native';
import useTheme from '@/hooks/useTheme';
import { TextVariant, textVariantColors, textVariants } from '@/styles/typography';
import styles from './Text.styles';

type AppTextProps = TextProps & {
  variant?: TextVariant;
  color?: string;
  uppercase?: boolean;
};

function AppText({ variant = 'body', color, uppercase, style, ...props }: AppTextProps) {
  const theme = useTheme();
  const resolvedColor = color ?? theme.text[textVariantColors[variant]];

  return (
    <Text
      style={[textVariants[variant], { color: resolvedColor }, uppercase && styles.uppercase, style]}
      {...props}
    />
  );
}

export default AppText;
