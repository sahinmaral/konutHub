import './src/utils/sentry';

import * as Sentry from '@sentry/react-native';
import { registerRootComponent } from 'expo';
import AppWrapper from './src/components/Wrapper/AppWrapper';

registerRootComponent(Sentry.wrap(AppWrapper));
