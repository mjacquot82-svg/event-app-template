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
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const heroHeight = isWide ? 280 : 220;
  const horizontalPadding = isWide ? 4 : 0;
  const verticalPadding = isWide ? 4 : 0;

  return (
    <View style={styles.frame}>
      <View
        style={[
          styles.heroImageContainer,
          {
            height: heroHeight,
            paddingHorizontal: horizontalPadding,
            paddingVertical: verticalPadding,
          },
        ]}
      >
        <Image source={HERO_IMAGE} style={styles.bannerImage} resizeMode="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 14,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(22,191,214,0.55)',
    backgroundColor: '#071017',
    shadowColor: '#16BFD6',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  heroImageContainer: {
    width: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#071017',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
  },
});
