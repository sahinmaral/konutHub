import appReducer from '@/redux/reducers/appReducer';
import themeReducer from '@/redux/reducers/themeReducer';
import ErrorScreen from '@/screens/Error';
import { configureStore } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react-native';
import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { Provider } from 'react-redux';

const testStore = configureStore({
  reducer: { app: appReducer, theme: themeReducer },
});

function Boundary({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={testStore}>
      <Sentry.ErrorBoundary
        fallback={({ resetError }) => (
          <ErrorScreen
            description="Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin."
            onRetry={resetError}
          />
        )}
      >
        {children}
      </Sentry.ErrorBoundary>
    </Provider>
  );
}

function ThrowingChild(): React.ReactElement {
  throw new Error('boom');
}

function OkChild() {
  return <Text>all good</Text>;
}

describe('Sentry.ErrorBoundary + Error fallback wiring', () => {
  it('renders the fallback Error UI when a child throws during render', () => {
    // React logs the caught error via console.error by design when an error boundary
    // catches it — expected noise for this test, suppressed to keep output clean.
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <Boundary>
        <ThrowingChild />
      </Boundary>,
    );

    expect(screen.getByText('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.')).toBeTruthy();

    consoleErrorSpy.mockRestore();
  });

  it('renders children normally when nothing throws', () => {
    render(
      <Boundary>
        <OkChild />
      </Boundary>,
    );

    expect(screen.getByText('all good')).toBeTruthy();
  });
});
