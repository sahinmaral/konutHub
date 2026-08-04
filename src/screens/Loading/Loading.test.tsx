import { renderWithProviders } from '@/test/renderWithProviders';
import { screen } from '@testing-library/react-native';
import React from 'react';
import Loading from './Loading';

describe('Loading', () => {
  it('renders the branding and the caller-provided text', () => {
    renderWithProviders(<Loading text="Please wait while channels load ..." />);

    expect(screen.getByText('KonutHub')).toBeTruthy();
    expect(screen.getByText('Please wait while channels load ...')).toBeTruthy();
    expect(screen.getByText('v1.0.0')).toBeTruthy();
  });
});
