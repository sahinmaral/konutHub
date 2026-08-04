import { renderWithProviders } from '@/test/renderWithProviders';
import { screen } from '@testing-library/react-native';
import React from 'react';
import Divider from './Divider';

describe('Divider', () => {
  it('renders the given text uppercased', () => {
    renderWithProviders(<Divider text="or continue with" />);
    expect(screen.getByText('or continue with')).toBeTruthy();
  });

  it('renders no text when the text prop is omitted', () => {
    renderWithProviders(<Divider />);
    expect(screen.queryByText(/./)).toBeNull();
  });
});
