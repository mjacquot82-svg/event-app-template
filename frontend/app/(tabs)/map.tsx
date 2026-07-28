// © 2026 1001538341 ONTARIO INC. All Rights Reserved.

import React from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Text, Image, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../src/theme/colors';
import PageBannerHeader from '../../src/components/PageBannerHeader';
import BrandFooter from '../../src/components/BrandFooter';
import MapImageViewer from '../../src/components/MapImageViewer';
import { trackMapOpen } from '../../src/analytics/jdsAnalytics';
import { getAnalyticsConfig } from '../../src/analytics/analyticsConfig';
import { usePageAnalytics } from '../../src/analytics/usePageAnalytics';
import { eventMaps } from '../../src/data/maps';
import { useRouteBackedMapViewer } from '../../src/hooks/useRouteBackedMapViewer';

export default function MapScreen() {
  usePageAnalytics('Maps');
  const { selectedMap, openMap, closeMap } = useRouteBackedMapViewer({
    maps: eventMaps,
    onMapOpen: (map) => trackMapOpen(getAnalyticsConfig(), { id: map.id, title: map.title }),
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.page}>
          <PageBannerHeader maxWidth={1080} />

          <View style={styles.introCard}>
            <Text style={styles.eyebrow}>Maps</Text>
            <Text style={styles.pageTitle}>Event Maps</Text>
            <Text style={styles.pageSubtitle}>
              Find event buildings, routes, parking access, and destination details across Homecoming weekend.
            </Text>
          </View>

          {eventMaps.map((map) => (
            <Pressable
              key={map.id}
              accessibilityRole="button"
              accessibilityLabel={`Open ${map.title}`}
              onPress={() => openMap(map)}
              style={({ pressed }) => [styles.mapCard, pressed && styles.mapCardPressed]}
            >
              <View style={styles.mapCardImageWrap}>
                <Image source={map.asset} resizeMode="cover" style={styles.mapCardImage} />
                <View style={styles.imageOverlay} />
                <View style={[styles.mapBadge, { backgroundColor: map.accentColor }]}>
                  <Feather name="maximize-2" size={14} color="#050505" />
                  <Text style={styles.mapBadgeText}>Open Map</Text>
                </View>
              </View>

              <View style={styles.mapCardBody}>
                <Text style={styles.mapCardTitle}>{map.title}</Text>
                <Text style={styles.mapCardDescription}>{map.description}</Text>
              </View>
            </Pressable>
          ))}

          <BrandFooter />
        </View>
      </ScrollView>

      {selectedMap ? (
        <MapImageViewer
          visible
          asset={selectedMap.asset}
          title={selectedMap.title}
          description={selectedMap.description}
          onClose={closeMap}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  page: { width: '100%', maxWidth: 1080, alignSelf: 'center' },
  introCard: {
    borderRadius: 22,
    backgroundColor: '#0F1012',
    paddingHorizontal: 22,
    paddingVertical: 22,
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  eyebrow: { color: '#16BFD6', fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  pageTitle: { color: '#FFFFFF', fontSize: 24, lineHeight: 28, fontWeight: '900' },
  pageSubtitle: { color: '#C8CDD4', fontSize: 14, lineHeight: 21, marginTop: 8, maxWidth: 640 },
  mapCard: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#111214',
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  mapCardPressed: {
    opacity: 0.92,
  },
  mapCardImageWrap: {
    position: 'relative',
    backgroundColor: '#050505',
  },
  mapCardImage: {
    width: '100%',
    height: 220,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  mapBadge: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  mapBadgeText: {
    color: '#050505',
    fontSize: 12,
    fontWeight: '900',
  },
  mapCardBody: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  mapCardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
  },
  mapCardDescription: {
    color: '#C8CDD4',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
});
