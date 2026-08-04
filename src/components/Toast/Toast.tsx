import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MessageComponentProps, hideMessage } from 'react-native-flash-message';
import Icon from 'react-native-remix-icon';
import Text from '@/components/Text';

type ToastVariant = 'success' | 'danger' | 'warning' | 'info';

const DEFAULT_DURATION = 3000;

const variantConfig: Record<
  ToastVariant,
  { bg: string; border: string; iconBg: string; textColor: string; icon: string }
> = {
  success: {
    bg: '#f0fdf4',
    border: '#22c55e',
    iconBg: '#22c55e',
    textColor: '#15803d',
    icon: 'checkbox-circle-fill',
  },
  danger: {
    bg: '#fef2f2',
    border: '#ef4444',
    iconBg: '#ef4444',
    textColor: '#b91c1c',
    icon: 'close-circle-fill',
  },
  info: {
    bg: '#fff7ed',
    border: '#f97316',
    iconBg: '#f97316',
    textColor: '#c2410c',
    icon: 'information-fill',
  },
  warning: {
    bg: '#fefce8',
    border: '#eab308',
    iconBg: '#eab308',
    textColor: '#a16207',
    icon: 'error-warning-fill',
  },
};

function Toast({ message }: MessageComponentProps) {
  const { top } = useSafeAreaInsets();
  const config = variantConfig[message.type as ToastVariant] ?? variantConfig.info;
  const duration = message.duration ?? DEFAULT_DURATION;
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 0,
      duration,
      useNativeDriver: false,
    }).start();
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.bg, borderColor: config.border, marginTop: top + 8 },
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: config.iconBg }]}>
          <Icon name={config.icon} color="#fff" size={18} />
        </View>
        <Text
          variant="bodySecondary"
          color={config.textColor}
          style={styles.message}
          numberOfLines={2}
        >
          {message.message}
        </Text>
        <TouchableOpacity onPress={hideMessage} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="close-line" color={config.textColor} size={20} />
        </TouchableOpacity>
      </View>
      <Animated.View
        style={[styles.progress, { width: progressWidth, backgroundColor: config.border }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 10,
  },
  message: {
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    height: 3,
  },
});

export default Toast;
