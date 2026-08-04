import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import activeChannelReducer from './reducers/activeChannelReducer';
import appReducer from './reducers/appReducer';
import themeReducer from './reducers/themeReducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['app', 'theme', 'language'],
};

const rootReducer = combineReducers({
  app: appReducer,
  theme: themeReducer,
  activeChannel: activeChannelReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
