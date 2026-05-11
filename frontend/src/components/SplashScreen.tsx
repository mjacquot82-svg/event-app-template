// © 2026 1001538341 ONTARIO INC. All Rights Reserved.
// Static Splash Screen - No animation, just the IPM Final image for the App.

import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, Platform } from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
  duration?: number;
}

export default function SplashScreen({ onFinish, duration = 2000 }: SplashScreenProps) {
  
  // Logic Gate: Skip for web browsers, show for the installed App
  const isWebBrowser = Platform.OS === 'web' && 
    typeof window !== 'undefined' && 
    !window.matchMedia('(display-mode: standalone)').matches;

  useEffect(() => {
    if (isWebBrowser) {
      onFinish();
      return;
    }

    // Simple timer to hold the image before entering the app
    const timer = setTimeout(() => {
      onFinish();
    }, duration);

    return () => clearTimeout(timer);
  }, [onFinish, isWebBrowser, duration]);

  // If it's the website, show nothing (Coming Soon page loads instantly)
  if (isWebBrowser) {
    return null;
  }

  const isHomeComing = (() => {
    try {
      // Lazy import to avoid circular issues during web SSR
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const cfg = require('../data/eventConfig').default;
      return cfg?.appName?.toLowerCase().includes('walkerton');
    } catch (e) {
      return false;
    }
  })();

  if (isHomeComing) {
    // Show a centered, contained logo for the Home Coming app to avoid an oversized splash
    return (
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/logo.jpg')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/ipm-final-v1.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000', 
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: width,
    height: height,
    position: 'absolute',
  },
  // Smaller, centered logo for Home Coming splash
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
