// © 2026 1001538341 ONTARIO INC.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import eventConfig from '../../src/data/eventConfig';

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

        <View style={styles.header}>
          <Text style={styles.title}>About the Event</Text>
          <Text style={styles.subtitle}>{eventConfig.event.subtitle}</Text>
        </View>

        <View style={styles.section}>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{eventConfig.event.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{eventConfig.about.secondarySectionTitle}</Text>
          <Text style={styles.description}>{eventConfig.about.secondaryText}</Text>
        </View>

        <View style={styles.footer}>
          {eventConfig.footer.copyrightLines.map((line, i) => (
            <Text key={i} style={styles.footerText}>{line}</Text>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollView: { flex: 1, backgroundColor: '#000' },
  scrollContent: { paddingBottom: 220 },
  header: { padding: 20, borderBottomWidth: 2, borderBottomColor: BLUE, backgroundColor: '#06141A' },
  title: { fontSize: 26, fontWeight: '900', color: '#fff' },
  subtitle: { fontSize: 14, color: '#B7BDC7', marginTop: 4 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#fff', marginBottom: 10 },
  detailCard: { backgroundColor: '#111', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1F2937' },
  detailRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 8 },
  detailValue: { fontSize: 14, color: '#D1D5DB' },
  directionsButton: { marginTop: 12, backgroundColor: BLUE, padding: 12, borderRadius: 12, alignItems: 'center' },
  directionsButtonText: { color: '#000', fontWeight: '900' },
  description: { fontSize: 14, lineHeight: 20, color: '#D1D5DB' },
  footer: { alignItems: 'center', padding: 20 },
  footerText: { fontSize: 10, color: '#8B95A1' },
});
