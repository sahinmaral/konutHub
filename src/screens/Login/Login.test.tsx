import { renderWithProviders } from '@/test/renderWithProviders';
import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import Login, { formatPhoneNumber } from './Login';

const typePhone = (value: string) =>
  fireEvent.changeText(screen.getByPlaceholderText('5xx xxx xx xx'), value);

describe('formatPhoneNumber', () => {
  it('groups digits the way the placeholder reads', () => {
    expect(formatPhoneNumber('5321234567')).toBe('532 123 45 67');
  });

  it('drops everything that is not a digit', () => {
    expect(formatPhoneNumber('+90 (532) 123-45-67')).toBe('905 321 23 45');
  });

  it('stops at ten digits', () => {
    expect(formatPhoneNumber('53212345678899')).toBe('532 123 45 67');
  });

  it('leaves a partial number unpadded', () => {
    expect(formatPhoneNumber('5321')).toBe('532 1');
  });
});

describe('Login', () => {
  it('renders the phone sign-in form', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText('Giriş yap')).toBeTruthy();
    expect(screen.getByText('Devam etmek için telefon numaranı gir')).toBeTruthy();
    expect(screen.getByText('Telefon numarası')).toBeTruthy();
    expect(screen.getByText('+90')).toBeTruthy();
    expect(screen.getByPlaceholderText('5xx xxx xx xx').props.value).toBe('');
    expect(screen.getByText('Google ile devam et')).toBeTruthy();
    expect(screen.getByText('Facebook ile devam et')).toBeTruthy();
  });

  it('formats the number as it is typed', () => {
    renderWithProviders(<Login />);

    typePhone('5321234567');

    expect(screen.getByPlaceholderText('5xx xxx xx xx').props.value).toBe('532 123 45 67');
  });

  it('keeps "Devam et" disabled until the number is complete', () => {
    renderWithProviders(<Login />);
    const button = screen.getByLabelText('Devam et');

    expect(button.props.accessibilityState.disabled).toBe(true);

    typePhone('53212345');
    expect(button.props.accessibilityState.disabled).toBe(true);

    typePhone('5321234567');
    expect(button.props.accessibilityState.disabled).toBeFalsy();
  });

  it('renders the terms and privacy links', () => {
    renderWithProviders(<Login />);

    expect(screen.getByText('Kullanım Koşullarını')).toBeTruthy();
    expect(screen.getByText('Gizlilik Politikamızı')).toBeTruthy();
  });
});
