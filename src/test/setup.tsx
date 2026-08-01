// Global test setup, loaded via `setupFilesAfterEnv` in jest.config.js.

// AsyncStorage has no native module under Jest; its maintainers ship this in-memory mock
// for exactly that. Needed by anything that reaches the persisted store or tokenManager.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Screens are rendered on their own, without a NavigationContainer, so the real
// useFocusEffect never fires. Treat "focused" as "mounted", which is what a first focus
// amounts to for a freshly rendered screen. Everything else in the module stays real.
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    ...jest.requireActual('@react-navigation/native'),
    useFocusEffect: (callback: React.EffectCallback) => React.useEffect(callback, [callback]),
  };
});

// @expo/vector-icons loads its font through expo-font's native module, which jest-expo
// does not stub for this Expo/React Native pair — rendering a real icon throws
// "loadedNativeFonts.forEach is not a function". Icons carry no behaviour we assert on,
// so render them as a plain View that keeps its props queryable (e.g. UNSAFE_getByProps).
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');

  const makeIconSet = () => (props: Record<string, unknown>) =>
    React.createElement(View, props, null);

  return {
    __esModule: true,
    Feather: makeIconSet(),
    Ionicons: makeIconSet(),
    MaterialIcons: makeIconSet(),
    MaterialCommunityIcons: makeIconSet(),
    AntDesign: makeIconSet(),
    FontAwesome: makeIconSet(),
    createIconSet: () => makeIconSet(),
  };
});
