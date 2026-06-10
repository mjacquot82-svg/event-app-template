// © 2026 1001538341 ONTARIO INC. All Rights Reserved.
// Legacy in-app splash component retained for optional non-startup use.

import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, Platform } from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
  duration?: number;
}

export default function SplashScreen({ onFinish, duration = 2000 }: SplashScreenProps) {
  const isWebBrowser = Platform.OS === 'web' && 
    typeof window !== 'undefined' && 
    !window.matchMedia('(display-mode: standalone)').matches;

  useEffect(() => {
    if (isWebBrowser) {
      onFinish();
      return;
    }

    const timer = setTimeout(() => {
      onFinish();
    }, duration);

    return () => clearTimeout(timer);
  }, [onFinish, isWebBrowser, duration]);

  if (isWebBrowser) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/whc-logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: Math.min(420, Math.round(width * 0.72)),
    height: Math.min(420, Math.round(width * 0.72)),
    maxWidth: 420,
    maxHeight: 420,
    resizeMode: 'contain',
    // react-native-web supports objectFit for web builds
    objectFit: 'contain' as any,
  },
});
