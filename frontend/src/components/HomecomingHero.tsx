// © 2026 1001538341 ONTARIO INC.

import React from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';

const HERO_IMAGE = require('../../assets/images/new.jpg');
const HERO_ASPECT_RATIO = 838 / 627;

type HomecomingHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
};

export default function HomecomingHero(_: HomecomingHeroProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  return (
    <View style={[styles.heroWrap, isWide ? styles.heroWrapWide : styles.heroWrapMobile]}>
      <Image source={HERO_IMAGE} style={styles.bannerImage} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    alignSelf: 'center',
    marginTop: 2,
    marginBottom: 6,
  },
  heroWrapWide: {
    width: '100%',
    maxWidth: 980,
  },
  heroWrapMobile: {
    width: '94%',
  },
  bannerImage: {
    width: '100%',
    aspectRatio: HERO_ASPECT_RATIO,
    alignSelf: 'center',
  },
});
