import Text from '@/components/Text';
import useThemedStyles from '@/hooks/useThemedStyles';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, View } from 'react-native';
import makeStyles from './Loading.styles';

interface LoadingProps {
  text: string;
}

function Loading({ text }: LoadingProps) {
  const styles = useThemedStyles(makeStyles);
  const dot1 = useRef(new Animated.Value(0.4)).current;
  const dot2 = useRef(new Animated.Value(0.4)).current;
  const dot3 = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.4, duration: 300, useNativeDriver: true }),
          Animated.delay(600 - delay),
        ]),
      );

    Animated.parallel([pulse(dot1, 0), pulse(dot2, 200), pulse(dot3, 400)]).start();
  }, [dot1, dot2, dot3]);

  const dotAnimStyle = (dot: Animated.Value) => ({
    opacity: dot,
    transform: [{ scale: dot.interpolate({ inputRange: [0.4, 1], outputRange: [0.8, 1.2] }) }],
  });

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text variant="display" style={styles.appName}>
          KonutHub
        </Text>
      </View>
      <View style={styles.loadingSection}>
        <Text variant="bodySecondary" style={styles.loadingText}>
          {text}
        </Text>
        <View style={styles.dotsRow}>
          <Animated.View style={[styles.dot, dotAnimStyle(dot1)]} />
          <Animated.View style={[styles.dot, dotAnimStyle(dot2)]} />
          <Animated.View style={[styles.dot, dotAnimStyle(dot3)]} />
        </View>
      </View>
      <Text variant="caption" style={styles.version}>
        v1.0.0
      </Text>
    </View>
  );
}

export default Loading;
