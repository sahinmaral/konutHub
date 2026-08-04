import { renderWithProviders } from '@/test/renderWithProviders';
import { User } from '@/types';
import { fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import ErrorScreen from './Error';

const preloadedState = {
  app: {
    user: { id: 'user-1' } as User,
    notificationSettings: { isEnabled: true, isSoundEnabled: true },
  },
};

describe('Error', () => {
  it('renders the default title with the given description', () => {
    renderWithProviders(<ErrorScreen description="Failed to load channels." />);

    expect(screen.getByText('Failed to load channels.')).toBeTruthy();
    expect(screen.getByText('Bir şeyler ters gitti')).toBeTruthy();
  });

  it('prefers an explicit title over the default one', () => {
    renderWithProviders(<ErrorScreen title="No connection" description="Try again later." />);

    expect(screen.getByText('No connection')).toBeTruthy();
    expect(screen.queryByText('Bir şeyler ters gitti')).toBeNull();
  });

  it('offers a retry action only when the caller passes onRetry', () => {
    const onRetry = jest.fn();
    const { unmount } = renderWithProviders(<ErrorScreen description="Failed." />);

    expect(screen.queryByText('Tekrar Dene')).toBeNull();
    unmount();

    renderWithProviders(<ErrorScreen description="Failed." onRetry={onRetry} />);
    fireEvent.press(screen.getByText('Tekrar Dene'));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('clears the session so the app returns to login', () => {
    const { store } = renderWithProviders(<ErrorScreen description="Failed." />, {
      preloadedState,
    });

    fireEvent.press(screen.getByText('Girişe Dön'));

    expect(store.getState().app.user).toBeNull();
    expect(store.getState().app.notificationSettings).toBeNull();
  });
});
