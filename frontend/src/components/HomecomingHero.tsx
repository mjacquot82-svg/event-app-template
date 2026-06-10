// © 2026 1001538341 ONTARIO INC.

import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const HERO_IMAGE = require('../../assets/images/logo.jpg');
const BLUE = '#16BFD6';

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
          <Image source={HERO_IMAGE} style={styles.foregroundLogo} resizeMode="contain" />
          <View style={styles.metaRow}>
            <Text style={styles.metaPrimary}>July 30 – August 3, 2026</Text>
            <Text style={styles.metaDivider}>•</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.20)',
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
    height: 96,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
  },
  content: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foregroundLogo: {
    width: '96%',
    maxWidth: 560,
    height: 116,
    marginBottom: 10,
    opacity: 1,
  },
  countdown: {
    color: '#74D65E',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 12,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  metaPrimary: {
    color: BLUE,
    fontSize: 13,
    fontWeight: '900',
  },
  metaDivider: {
    color: '#A7F3D0',
    marginHorizontal: 8,
    fontWeight: '900',
  },
  metaSecondary: {
    color: '#F9FAFB',
    fontSize: 13,
    fontWeight: '800',
  },
});
