try {
  require('dotenv').config();
} catch {
  // dotenv comes in via expo; without it we just use the ambient environment.
}

module.exports = ({ config }) => {
  const appID = process.env.FACEBOOK_APP_ID;
  const clientToken = process.env.FACEBOOK_CLIENT_TOKEN;

  if (!appID || !clientToken) {
    throw new Error(
      'FACEBOOK_APP_ID and FACEBOOK_CLIENT_TOKEN must be set (.env locally, EAS env vars for builds).',
    );
  }

  const plugins = config.plugins.map(plugin =>
    Array.isArray(plugin) && plugin[0] === 'react-native-fbsdk-next'
      ? [
          plugin[0],
          {
            ...plugin[1],
            appID,
            clientToken,
            scheme: `fb${appID}`,
          },
        ]
      : plugin,
  );

  return {
    ...config,
    plugins,
    android: {
      ...config.android,
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? config.android.googleServicesFile,
    },
  };
};
