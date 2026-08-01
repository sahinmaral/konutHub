import * as Sentry from '@sentry/react-native';

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

// The native SDK crashes on an unparseable DSN (e.g. a placeholder string) rather than
// failing gracefully, so only initialize once a real DSN URL has been configured.
if (dsn?.startsWith('http')) {
  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
  });
}
