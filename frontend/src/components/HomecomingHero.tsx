// © 2026 1001538341 ONTARIO INC.

import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const HERO_IMAGE = require('../../assets/images/logo.jpg');

type HomecomingHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  countdownText?: string;
};

export default function HomecomingHero({ countdownText }: HomecomingHeroProps) {
  return (
    <View style={styles.frame}>
      <View style={styles.hero}>
        <View style={styles.overlay} />
        <View style={styles.topShade} />
        <View style={styles.bottomShade} />

        <View style={styles.content}>
          <Image source={HERO_IMAGE} style={styles.bannerImage} resizeMode="contain" />
          <View style={styles.detailsBlock}>
            <Text style={styles.metaPrimary}>July 30 – August 3, 2026</Text>
            <Text style={styles.metaSecondary}>Walkerton, Ontario</Text>
          </View>
          {countdownText ? <Text style={styles.countdown}>{countdownText}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    marginHorizontal: 16,
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
    backgroundColor: '#090909',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  topShade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
  },
  bottomShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 88,
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  bannerImage: {
    width: '100%',
    maxWidth: 560,
    height: 132,
    marginBottom: 6,
  },
  countdown: {
    color: '#74D65E',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 12,
    textAlign: 'center',
  },
  detailsBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaPrimary: {
    color: '#CFFAFE',
    fontSize: 12,
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  metaSecondary: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
