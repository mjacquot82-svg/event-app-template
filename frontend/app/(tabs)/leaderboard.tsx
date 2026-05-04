// © 2026 1001538341 ONTARIO INC. All Rights Reserved.

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const YELLOW = '#FFD23F';
const PINK = '#F6008F';
const CYAN = '#16BFD6';
const LIME = '#74D65E';

export default function LeaderboardScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Weekend Highlights</Text>
        <Text style={styles.headerTitle}>Featured Moments</Text>
        <Text style={styles.subtitle}>What people should not miss during Homecoming weekend.</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.iconContainer}>
            <Feather name="star" size={42} color="#000" />
          </View>
          <Text style={styles.placeholderTitle}>Highlights Hub</Text>
          <Text style={styles.placeholderText}>
            Featured concerts, sponsor spotlights, photo moments, contests, and top weekend announcements can live here.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured This Weekend</Text>
          <View style={[styles.featureCard, { borderColor: PINK }]}>
            <Feather name="music" size={24} color={PINK} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Main Stage Nights</Text>
              <Text style={styles.featureText}>Concerts, reunion energy, and Saturday night Remix vibes.</Text>
            </View>
          </View>
          <View style={[styles.featureCard, { borderColor: LIME }]}>
            <Feather name="users" size={24} color={LIME} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Community Moments</Text>
              <Text style={styles.featureText}>Parade, market, brunch, and hometown gathering points.</Text>
            </View>
          </View>
          <View style={[styles.featureCard, { borderColor: CYAN }]}>
            <Feather name="camera" size={24} color={CYAN} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Photo & Sponsor Spots</Text>
              <Text style={styles.featureText}>Future home for sponsor-backed photo walls and highlight galleries.</Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, backgroundColor: '#151100', borderBottomWidth: 2, borderBottomColor: YELLOW },
  eyebrow: { color: YELLOW, fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#fff', marginTop: 4 },
  subtitle: { color: '#D1D5DB', fontSize: 13, marginTop: 4 },
  content: { flex: 1, backgroundColor: '#000' },
  contentContainer: { padding: 20 },
  heroCard: { alignItems: 'center', paddingVertical: 34, paddingHorizontal: 20, backgroundColor: '#111', borderRadius: 22, marginBottom: 24, borderWidth: 2, borderColor: YELLOW },
  iconContainer: { width: 92, height: 92, borderRadius: 46, backgroundColor: YELLOW, justifyContent: 'center', alignItems: 'center', marginBottom: 18 },
  placeholderTitle: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 10 },
  placeholderText: { fontSize: 14, color: '#D1D5DB', textAlign: 'center', lineHeight: 21 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#fff', marginBottom: 14 },
  featureCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', padding: 16, borderRadius: 16, marginBottom: 12, gap: 16, borderWidth: 1 },
  featureContent: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: '900', color: '#fff', marginBottom: 4 },
  featureText: { fontSize: 13, color: '#B7BDC7', lineHeight: 18 },
  bottomPadding: { height: 200 },
});
