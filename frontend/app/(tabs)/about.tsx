// © 2026 1001538341 ONTARIO INC.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { eventConfig } from '../../src/data/eventConfig';
import PageBannerHeader from '../../src/components/PageBannerHeader';
import BrandFooter from '../../src/components/BrandFooter';

const BLUE = '#16BFD6';

export default function AboutScreen() {
  const openMaps = () => {
    const { lat, lng } = eventConfig.event.coordinates;
    const url = Platform.select({
      ios: `maps://app?daddr=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    });
    Linking.openURL(url as string);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.page}>
          <PageBannerHeader maxWidth={760} />

          <View style={styles.introCard}>
            <Text style={styles.eyebrow}>About</Text>
            <Text style={styles.pageTitle}>About the Event</Text>
            <Text style={styles.pageSubtitle}>What Homecoming weekend is all about, and how to make the most of it.</Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Event Details</Text>

            <View style={styles.detailCard}>
              <View style={styles.detailRow}>
                <Feather name="calendar" size={18} color={BLUE} />
                <Text style={styles.detailValue}>{eventConfig.event.dates}</Text>
              </View>

              <View style={styles.detailRow}>
                <Feather name="map-pin" size={18} color={BLUE} />
                <Text style={styles.detailValue}>{eventConfig.event.location}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.directionsButton} onPress={openMaps}>
              <Text style={styles.directionsButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{eventConfig.event.description}</Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{eventConfig.about.secondarySectionTitle}</Text>
            <Text style={styles.description}>{eventConfig.about.secondaryText}</Text>
          </View>

          <BrandFooter />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  scrollView: { flex: 1, backgroundColor: '#050505' },
  scrollContent: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 12 },
  page: { width: '100%', maxWidth: 760, alignSelf: 'center' },
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
  pageSubtitle: { color: '#C8CDD4', fontSize: 14, lineHeight: 21, marginTop: 8 },
  sectionCard: {
    borderRadius: 22,
    backgroundColor: '#0F1012',
    padding: 22,
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#fff', marginBottom: 12 },
  detailCard: { backgroundColor: '#15171B', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#1F2937' },
  detailRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 8 },
  detailValue: { fontSize: 14, color: '#D1D5DB' },
  directionsButton: { marginTop: 14, backgroundColor: BLUE, padding: 14, borderRadius: 16, alignItems: 'center' },
  directionsButtonText: { color: '#000', fontWeight: '900' },
  description: { fontSize: 14, lineHeight: 20, color: '#D1D5DB' },
});
