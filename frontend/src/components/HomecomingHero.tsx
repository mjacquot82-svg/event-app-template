// © 2026 1001538341 ONTARIO INC.

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const HERO_IMAGE = require('../../assets/images/logo.jpg');
const HERO_ASPECT_RATIO = 1880 / 400;

type HomecomingHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
};

export default function HomecomingHero(_: HomecomingHeroProps) {
  return (
    <View style={styles.heroWrap}>
      <Image source={HERO_IMAGE} style={styles.bannerImage} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    width: '100%',
    maxWidth: 980,
    alignSelf: 'center',
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 14,
  },
  bannerImage: {
    width: '100%',
    aspectRatio: HERO_ASPECT_RATIO,
    alignSelf: 'center',
  },
});
