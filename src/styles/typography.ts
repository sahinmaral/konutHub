import { StyleSheet, TextStyle } from 'react-native';
import { Theme } from './themes';

// Font family names must match the keys passed to `useFonts` in App.tsx.
export const fontFamilies = {
  spaceGroteskMedium: 'SpaceGrotesk_500Medium',
  spaceGroteskSemiBold: 'SpaceGrotesk_600SemiBold',
  interRegular: 'Inter_400Regular',
  interBold: 'Inter_700Bold',
  monoRegular: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
} as const;

export type TextVariant =
  | 'display'
  | 'sectionHeading'
  | 'body'
  | 'bodyBold'
  | 'bodySecondary'
  | 'caption'
  | 'amount'
  | 'numericSmall';

export type TextColorToken = keyof Theme['text'];

/**
 * Type scale. Space Grotesk carries headings, Inter carries copy and
 * IBM Plex Mono carries anything numeric so amounts and dates stay aligned.
 */
export const textVariants = StyleSheet.create<Record<TextVariant, TextStyle>>({
  // 'KonutHub'
  display: {
    fontFamily: fontFamilies.spaceGroteskSemiBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: 0.5,
  },
  // 'Ağustos aidatı'
  sectionHeading: {
    fontFamily: fontFamilies.spaceGroteskMedium,
    fontSize: 18,
    lineHeight: 24,
  },
  // 'Ödeme başarıyla tamamlandı'
  body: {
    fontFamily: fontFamilies.interRegular,
    fontSize: 16,
    lineHeight: 23,
  },
  // 'Fatura ödenmedi' — emphasis inside body copy
  bodyBold: {
    fontFamily: fontFamilies.interBold,
    fontSize: 16,
    lineHeight: 23,
  },
  // 'Devam etmek için telefon numaranı gir'
  bodySecondary: {
    fontFamily: fontFamilies.interRegular,
    fontSize: 15,
    lineHeight: 22,
  },
  // 'v1.0.0'
  caption: {
    fontFamily: fontFamilies.interRegular,
    fontSize: 13,
    lineHeight: 18,
  },
  // '2.450,00 ₺'
  amount: {
    fontFamily: fontFamilies.monoMedium,
    fontSize: 22,
    lineHeight: 28,
    fontVariant: ['tabular-nums'],
  },
  // '14 Ağustos, 09:32'
  numericSmall: {
    fontFamily: fontFamilies.monoRegular,
    fontSize: 14,
    lineHeight: 20,
  },
});

/** Theme text color each variant defaults to, overridable via the `color` prop. */
export const textVariantColors: Record<TextVariant, TextColorToken> = {
  display: 'primary',
  sectionHeading: 'primary',
  body: 'primary',
  bodyBold: 'primary',
  bodySecondary: 'secondary',
  caption: 'tertiary',
  amount: 'primary',
  numericSmall: 'secondary',
};
