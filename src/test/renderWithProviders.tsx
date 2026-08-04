import appReducer from '@/redux/reducers/appReducer';
import themeReducer from '@/redux/reducers/themeReducer';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react-native';
import React, { ReactElement } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

const testSafeAreaMetrics = {
  frame: { x: 0, y: 0, width: 375, height: 812 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const rootReducer = combineReducers({
  app: appReducer,
  theme: themeReducer
});

type RootState = ReturnType<typeof rootReducer>;

function makeTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({ reducer: rootReducer, preloadedState });
}

type Options = Omit<RenderOptions, 'wrapper'> & { preloadedState?: Partial<RootState> };

export function renderWithProviders(
  ui: ReactElement,
  { preloadedState, ...options }: Options = {},
) {
  const store = makeTestStore(preloadedState);
  return {
    store,
    ...render(
      <SafeAreaProvider initialMetrics={testSafeAreaMetrics}>
        <Provider store={store}>{ui}</Provider>
      </SafeAreaProvider>,
      options,
    ),
  };
}
