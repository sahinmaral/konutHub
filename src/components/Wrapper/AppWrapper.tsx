import { persistor, store } from '@/redux/store';
import ErrorScreen from '@/screens/Error';
import * as Sentry from '@sentry/react-native';
import React from 'react';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from '../../../App';
import Toast from '../Toast';

function AppWrapper() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Sentry.ErrorBoundary
            fallback={({ resetError }) => (
              <ErrorScreen
                description={"Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin."}
                onRetry={resetError}
              />
            )}
          >
            <App />
          </Sentry.ErrorBoundary>
          <FlashMessage position="top" duration={3000} MessageComponent={Toast} />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

export default AppWrapper;
