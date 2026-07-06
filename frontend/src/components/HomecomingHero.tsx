// © 2026 1001538341 ONTARIO INC.

import React from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';

const HERO_IMAGE = require('../../assets/images/logo.jpg');

type HomecomingHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
};

export default function HomecomingHero(_: HomecomingHeroProps) {
  const { height } = useWindowDimensions();
  const heroHeight = Math.max(138, Math.min(Math.round(height * 0.2), 220));

  return (
    <View style={[styles.heroCard, { height: heroHeight }]}>
      <View style={styles.heroImageFrame}>
        <Image source={HERO_IMAGE} style={styles.heroImage} resizeMode="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    width: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  heroImageFrame: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  heroImage: {
    width: '94%',
    height: '92%',
    alignSelf: 'center',
  },
});
