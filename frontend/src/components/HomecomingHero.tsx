// © 2026 1001538341 ONTARIO INC.

import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';

const HERO_IMAGE = require('../../assets/images/logo.jpg');
const BLUE = '#16BFD6';

type HomecomingHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  countdownText?: string;
};

export default function HomecomingHero({ title, subtitle, countdownText }: HomecomingHeroProps) {
  return (
    <View style={styles.frame}>
      <ImageBackground source={HERO_IMAGE} resizeMode="cover" style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.overlay} />
        <View style={styles.topShade} />
        <View style={styles.bottomShade} />
        <View style={styles.sideShadeLeft} />
        <View style={styles.sideShadeRight} />

        <View style={styles.content}>
          <Image source={HERO_IMAGE} style={styles.foregroundLogo} resizeMode="contain" />
          {countdownText ? <Text style={styles.countdown}>{countdownText}</Text> : null}
          <Text style={styles.title}>{title}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaPrimary}>July 30 – August 3, 2026</Text>
            <Text style={styles.metaDivider}>•</Text>
            <Text style={styles.metaSecondary}>Walkerton, Ontario</Text>
          </View>

          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </ImageBackground>
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
    justifyContent: 'flex-end',
  },
  heroImage: {
    opacity: 0.52,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
  },
  topShade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 86,
    backgroundColor: 'rgba(0, 0, 0, 0.26)',
  },
  bottomShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 140,
    backgroundColor: 'rgba(0, 0, 0, 0.70)',
  },
  sideShadeLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 56,
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
  },
  sideShadeRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 56,
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
  },
  content: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foregroundLogo: {
    width: 184,
    height: 58,
    marginBottom: 10,
    opacity: 0.96,
  },
  countdown: {
    color: '#74D65E',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 29,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    color: '#E5E7EB',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    marginTop: 8,
    maxWidth: '92%',
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
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
