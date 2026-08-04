import { renderWithProviders } from '@/test/renderWithProviders';
import { lightTheme } from '@/styles/themes';
import { screen } from '@testing-library/react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import AppText from './Text';

const flatStyleOf = (text: string) =>
  StyleSheet.flatten(screen.getByText(text).props.style) as Record<string, unknown>;

describe('AppText', () => {
  it('renders its children', () => {
    renderWithProviders(<AppText>Hello</AppText>);
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('falls back to the body variant', () => {
    renderWithProviders(<AppText>Ödeme başarıyla tamamlandı</AppText>);
    const flat = flatStyleOf('Ödeme başarıyla tamamlandı');
    expect(flat.fontFamily).toBe('Inter_400Regular');
    expect(flat.fontSize).toBe(16);
    expect(flat.color).toBe(lightTheme.text.primary);
  });

  it('applies the display variant', () => {
    renderWithProviders(<AppText variant="display">KonutHub</AppText>);
    const flat = flatStyleOf('KonutHub');
    expect(flat.fontFamily).toBe('SpaceGrotesk_600SemiBold');
    expect(flat.fontSize).toBe(28);
    expect(flat.letterSpacing).toBe(0.5);
    expect(flat.color).toBe(lightTheme.text.primary);
  });

  it('applies the section heading variant', () => {
    renderWithProviders(<AppText variant="sectionHeading">Ağustos aidatı</AppText>);
    const flat = flatStyleOf('Ağustos aidatı');
    expect(flat.fontFamily).toBe('SpaceGrotesk_500Medium');
    expect(flat.fontSize).toBe(18);
  });

  it('applies the bodyBold variant for emphasis', () => {
    renderWithProviders(<AppText variant="bodyBold">Fatura ödenmedi</AppText>);
    const flat = flatStyleOf('Fatura ödenmedi');
    expect(flat.fontFamily).toBe('Inter_700Bold');
    expect(flat.fontSize).toBe(16);
  });

  it('uses the muted text color for the bodySecondary variant', () => {
    renderWithProviders(
      <AppText variant="bodySecondary">Devam etmek için telefon numaranı gir</AppText>,
    );
    const flat = flatStyleOf('Devam etmek için telefon numaranı gir');
    expect(flat.fontSize).toBe(15);
    expect(flat.color).toBe(lightTheme.text.secondary);
  });

  it('uses the most muted text color for the caption variant', () => {
    renderWithProviders(<AppText variant="caption">v1.0.0</AppText>);
    const flat = flatStyleOf('v1.0.0');
    expect(flat.fontSize).toBe(13);
    expect(flat.color).toBe(lightTheme.text.tertiary);
  });

  it('renders amounts in tabular mono figures', () => {
    renderWithProviders(<AppText variant="amount">2.450,00 ₺</AppText>);
    const flat = flatStyleOf('2.450,00 ₺');
    expect(flat.fontFamily).toBe('IBMPlexMono_500Medium');
    expect(flat.fontSize).toBe(22);
    expect(flat.fontVariant).toEqual(['tabular-nums']);
    expect(flat.color).toBe(lightTheme.text.primary);
  });

  it('applies the numericSmall variant', () => {
    renderWithProviders(<AppText variant="numericSmall">14 Ağustos, 09:32</AppText>);
    const flat = flatStyleOf('14 Ağustos, 09:32');
    expect(flat.fontFamily).toBe('IBMPlexMono_400Regular');
    expect(flat.fontSize).toBe(14);
    expect(flat.color).toBe(lightTheme.text.secondary);
  });

  it('uses the given color over the variant default', () => {
    renderWithProviders(
      <AppText variant="caption" color="#123456">
        Hello
      </AppText>,
    );
    expect(flatStyleOf('Hello').color).toBe('#123456');
  });

  it('lets the style prop override the variant', () => {
    renderWithProviders(<AppText style={{ fontSize: 40 }}>Hello</AppText>);
    expect(flatStyleOf('Hello').fontSize).toBe(40);
  });

  it('applies the uppercase style when uppercase is true', () => {
    renderWithProviders(<AppText uppercase>Hello</AppText>);
    expect(flatStyleOf('Hello').textTransform).toBe('uppercase');
  });
});
