declare module 'react-native-remix-icon' {
  import React from 'react';
  interface IconProps {
    name: string;
    size?: number | string;
    color?: import('react-native').ColorValue;
    style?: import('react-native').StyleProp<import('react-native').TextStyle>;
  }
  const Icon: React.FC<IconProps>;
  export default Icon;
}

declare module '*.json' {
  const value: any;
  export default value;
}
