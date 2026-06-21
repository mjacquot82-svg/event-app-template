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
      <View style={styles.heroImageContainer}>
        <Image source={HERO_IMAGE} style={styles.bannerImage} resizeMode="cover" />
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
  heroImageContainer: {
    width: '100%',
    height: 204,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },
});
