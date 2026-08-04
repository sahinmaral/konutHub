import { renderWithProviders } from '@/test/renderWithProviders';
import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import Button from './Button';

describe('Button', () => {
  it('renders the title', () => {
    renderWithProviders(<Button title="Save" />);
    expect(screen.getByText('Save')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    renderWithProviders(<Button title="Save" onPress={onPress} />);

    fireEvent.press(screen.getByText('Save'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    renderWithProviders(<Button title="Save" onPress={onPress} disabled />);

    fireEvent.press(screen.getByText('Save'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress while loading', () => {
    const onPress = jest.fn();
    renderWithProviders(<Button title="Save" onPress={onPress} loading />);

    fireEvent.press(screen.getByRole('button', { name: 'Save' }));

    expect(onPress).not.toHaveBeenCalled();
  });
});
