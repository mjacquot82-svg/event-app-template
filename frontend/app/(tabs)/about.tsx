// © 2026 1001538341 ONTARIO INC.

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import colors from '../../src/theme/colors';
import eventConfig from '../../src/data/eventConfig';

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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Logo + Title */}
        <View style={styles.logoSection}>
          <Image source={{ uri: eventConfig.assets.logoUri }} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.eventTitle}>{eventConfig.event.shortName}</Text>
          <Text style={styles.eventSubtitle}>{eventConfig.event.subtitle}</Text>
        </View>

        {/* Highlight Banner */}
        <View style={styles.heritageBanner}>
          <Feather name="award" size={24} color={colors.accent} />
          <Text style={styles.heritageTagline}>{eventConfig.about.highlightTitle}</Text>
          <Text style={styles.heritageYear}>{eventConfig.about.highlightSubtitle}</Text>
        </View>

        {/* Event Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Details</Text>

          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Feather name="calendar" size={20} color={colors.primary} />
              <Text style={styles.detailValue}>{eventConfig.event.dates}</Text>
            </View>

            <View style={styles.detailRow}>
              <Feather name="map-pin" size={20} color={colors.accent} />
              <Text style={styles.detailValue}>{eventConfig.event.location}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.directionsButton} onPress={openMaps}>
            <Text style={styles.directionsButtonText}>Get Directions</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{eventConfig.event.description}</Text>
        </View>

        {/* Secondary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{eventConfig.about.secondarySectionTitle}</Text>
          <Text style={styles.description}>{eventConfig.about.secondaryText}</Text>
        </View>

        {/* Footer */}
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
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  logoSection: { alignItems: 'center', padding: 20 },
  logoImage: { width: 120, height: 120 },
  eventTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  eventSubtitle: { fontSize: 14, color: colors.accent },
  heritageBanner: { alignItems: 'center', padding: 16 },
  heritageTagline: { fontSize: 20, fontWeight: '700', color: colors.accent },
  heritageYear: { fontSize: 12, color: colors.textSecondary },
  section: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  detailCard: { gap: 10 },
  detailRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  detailValue: { fontSize: 14 },
  directionsButton: { marginTop: 10 },
  directionsButtonText: { color: colors.primary },
  description: { fontSize: 14, lineHeight: 20 },
  footer: { alignItems: 'center', padding: 20 },
  footerText: { fontSize: 10, color: colors.textMuted },
});
