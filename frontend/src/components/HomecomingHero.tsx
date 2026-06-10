// © 2026 1001538341 ONTARIO INC.

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const HERO_IMAGE = require('../../assets/images/logo.jpg');

type HomecomingHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
};

export default function HomecomingHero(_: HomecomingHeroProps) {
  return (
    <View style={styles.frame}>
      <View style={styles.hero}>
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
    backgroundColor: '#090909',
  },
  hero: {
    height: 232,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#090909',
  },
  bannerImage: {
    width: '100%',
    maxWidth: 560,
    height: 188,
  },
});
