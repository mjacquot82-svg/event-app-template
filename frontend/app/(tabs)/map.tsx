// © 2026 1001538341 ONTARIO INC. All Rights Reserved.

import React from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapComponent from '../../src/components/MapComponent';
import { colors } from '../../src/theme/colors';
import PageBannerHeader from '../../src/components/PageBannerHeader';

export default function MapScreen() {
  // Get location parameter from navigation
  const { location, showOnly } = useLocalSearchParams<{ location?: string; showOnly?: string }>();

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
            <Text style={styles.eyebrow}>Map</Text>
            <Text style={styles.pageTitle}>Festival Grounds</Text>
            <Text style={styles.pageSubtitle}>Find key locations, venue areas, and event destinations around Walkerton.</Text>
          </View>

          <View style={styles.mapWrap}>
            <MapComponent
              highlightedLocation={location || null}
              showOnlyHighlighted={showOnly === 'true'}
              scrollable={false}
            />
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 28,
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
  mapWrap: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#111214',
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
});
