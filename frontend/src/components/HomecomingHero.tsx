// © 2026 1001538341 ONTARIO INC.

import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

const HERO_IMAGE = require('../../assets/images/logo.jpg');
const BLUE = '#16BFD6';

type HomecomingHeroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
};

export default function HomecomingHero({ title, subtitle, eyebrow }: HomecomingHeroProps) {
  return (
    <View style={styles.frame}>
      <ImageBackground source={HERO_IMAGE} resizeMode="cover" style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.overlay} />
        <View style={styles.topShade} />
        <View style={styles.bottomShade} />
        <View style={styles.sideShadeLeft} />
        <View style={styles.sideShadeRight} />

        <View style={styles.content}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
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
    opacity: 0.98,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
  },
  topShade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 92,
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
  },
  bottomShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 132,
    backgroundColor: 'rgba(0, 0, 0, 0.68)',
  },
  sideShadeLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 56,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  sideShadeRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 56,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  content: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    alignItems: 'center',
  },
  eyebrow: {
    color: BLUE,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(22,191,214,0.35)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 31,
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
    marginTop: 10,
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
