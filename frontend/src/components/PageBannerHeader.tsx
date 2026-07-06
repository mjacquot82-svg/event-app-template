// © 2026 1001538341 ONTARIO INC.

import React from 'react';
import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const HERO_IMAGE = require('../../assets/images/logo.jpg');

type PageBannerHeaderProps = {
  maxWidth?: number;
};

export default function PageBannerHeader({ maxWidth = 760 }: PageBannerHeaderProps) {
  const { width, height } = useWindowDimensions();
  const isWide = width >= 960;
  const heroHeight = Math.max(138, Math.min(Math.round(height * 0.2), isWide ? 220 : 190));

  return (
    <View style={[styles.page, { maxWidth }]}>
      <View style={[styles.heroCard, { height: heroHeight }]}>
        <View style={styles.heroImageFrame}>
          <Image source={HERO_IMAGE} style={styles.heroImage} resizeMode="contain" />
        </View>
      </View>

      <View style={styles.detailsCard}>
        <View style={styles.detailsRow}>
          <Feather name="calendar" size={18} color={colors.primary} />
          <Text style={styles.detailText}>July 30 – August 3, 2026</Text>
        </View>
        <View style={styles.detailsRow}>
          <Feather name="map-pin" size={18} color={colors.accentLight} />
          <Text style={styles.detailText}>Walkerton, Ontario</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    alignSelf: 'center',
  },
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
  detailsCard: {
    borderRadius: 22,
    backgroundColor: '#0E0E10',
    paddingHorizontal: 22,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  detailText: {
    color: '#F4F5F7',
    fontSize: 17,
    fontWeight: '800',
    marginLeft: 9,
    textAlign: 'center',
  },
});
