// © 2026 1001538341 ONTARIO INC.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import HomecomingHero from '../../src/components/HomecomingHero';
import { colors } from '../../src/theme/colors';

const CYAN = '#16BFD6';
const LIME = '#74D65E';
const YELLOW = '#FFD23F';
const PINK = '#F6008F';
const BUS_ROUTE_ASSET = require('../../assets/images/Bus Route.png');
const BUS_ROUTE_ASPECT_RATIO = 1199 / 1312;

function InfoRow({ day, hours }: { day: string; hours: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoDay}>{day}</Text>
      <Text style={styles.infoHours}>{hours}</Text>
    </View>
  );
}

function ZoomableImageCard({ title, asset }: { title: string; asset: any }) {
  const { width: windowWidth } = useWindowDimensions();
  const imageWidth = Math.min(windowWidth - 64, 760);
  const imageHeight = imageWidth / BUS_ROUTE_ASPECT_RATIO;

  return (
    <View style={styles.imageCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.sectionIconWrap, { backgroundColor: CYAN }]}>
          <Feather name="map" size={18} color="#051014" />
        </View>
        <View style={styles.cardHeaderCopy}>
          <Text style={styles.cardEyebrow}>Shuttle route</Text>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
      </View>
      <Image
        source={asset}
        style={[styles.routeImage, { width: imageWidth, height: imageHeight }]}
        resizeMode="contain"
      />
    </View>
  );
}

export default function VisitorInfoScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <HomecomingHero
            eyebrow="Getting Around"
            title="Getting Around"
            subtitle="Shuttles, parade route, and food service details for Homecoming weekend."
          />

          <View style={styles.introCard}>
            <Text style={styles.eyebrow}>Weekend logistics</Text>
            <Text style={styles.pageTitle}>Travel details in one place</Text>
            <Text style={styles.pageSubtitle}>
              Check shuttle windows, parade flow, and food service timing before you head out.
            </Text>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrap, { backgroundColor: CYAN }]}>
                <Feather name="truck" size={18} color="#051014" />
              </View>
              <View style={styles.sectionHeaderCopy}>
                <Text style={styles.sectionEyebrow}>Transit</Text>
                <Text style={styles.sectionTitle}>Shuttle Information</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>In Town Shuttle</Text>
              <InfoRow day="Friday" hours="2pm–2am" />
              <InfoRow day="Saturday" hours="10:30am–2am" />
              <InfoRow day="Sunday" hours="10:30am–2am" />
              <InfoRow day="Monday" hours="10:30am–7pm" />
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Rodeo Express</Text>
              <InfoRow day="Saturday" hours="10:30am–11:30pm" />
              <InfoRow day="Sunday" hours="2pm–11:30pm" />
            </View>

            <ZoomableImageCard title="Bus Route" asset={BUS_ROUTE_ASSET} />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrap, { backgroundColor: PINK }]}>
                <Feather name="flag" size={18} color="#FFFFFF" />
              </View>
              <View style={styles.sectionHeaderCopy}>
                <Text style={styles.sectionEyebrow}>Route</Text>
                <Text style={styles.sectionTitle}>Parade Route</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.routeText}>Wallace Street</Text>
              <Text style={styles.routeText}>McGivern Street</Text>
              <Text style={styles.routeText}>Victoria Street</Text>
              <Text style={styles.routeText}>Durham Street</Text>
              <Text style={[styles.routeText, styles.routeTextLast]}>Arena</Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrap, { backgroundColor: YELLOW }]}>
                <Feather name="coffee" size={18} color="#111111" />
              </View>
              <View style={styles.sectionHeaderCopy}>
                <Text style={styles.sectionEyebrow}>Dining</Text>
                <Text style={styles.sectionTitle}>Food Truck Alley</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <InfoRow day="Friday" hours="4pm–1am" />
              <InfoRow day="Saturday–Monday" hours="11am–1am" />
            </View>
          </View>

          <View style={styles.noteCard}>
            <View style={[styles.sectionIconWrap, { backgroundColor: LIME }]}>
              <Feather name="info" size={16} color="#071207" />
            </View>
            <View style={styles.noteCopy}>
              <Text style={styles.noteTitle}>Plan ahead</Text>
              <Text style={styles.noteText}>Check this page during the weekend for operating details before heading out.</Text>
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  scrollView: { flex: 1, backgroundColor: '#050505' },
  scrollContent: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 220 },
  page: { width: '100%', maxWidth: 1080, alignSelf: 'center' },
  introCard: {
    borderRadius: 22,
    backgroundColor: '#0F1012',
    paddingHorizontal: 22,
    paddingVertical: 24,
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  pageTitle: { color: '#FFFFFF', fontSize: 24, lineHeight: 28, fontWeight: '900' },
  pageSubtitle: { color: '#C8CDD4', fontSize: 14, lineHeight: 21, marginTop: 8, maxWidth: 640 },
  sectionCard: {
    borderRadius: 22,
    backgroundColor: '#0F1012',
    padding: 24,
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  sectionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderCopy: { flex: 1 },
  sectionEyebrow: { color: '#98A2AF', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  sectionTitle: { fontSize: 24, lineHeight: 28, fontWeight: '900', color: '#fff' },
  infoCard: {
    borderRadius: 20,
    backgroundColor: '#15171B',
    padding: 20,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 16,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  cardHeaderCopy: { flex: 1 },
  cardEyebrow: { color: '#98A2AF', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: '900', color: '#fff' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#252B34' },
  infoDay: { color: '#D1D5DB', fontWeight: '800', fontSize: 14 },
  infoHours: { color: '#FFFFFF', fontWeight: '900', fontSize: 14, textAlign: 'right' },
  routeText: { color: '#E5E7EB', fontSize: 15, fontWeight: '800', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#252B34' },
  routeTextLast: { borderBottomWidth: 0, paddingBottom: 0 },
  imageCard: {
    borderRadius: 20,
    backgroundColor: '#15171B',
    padding: 20,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  routeImage: { alignSelf: 'center' },
  noteCard: {
    marginTop: 2,
    borderRadius: 22,
    backgroundColor: '#101712',
    borderWidth: 1,
    borderColor: LIME,
    padding: 20,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    shadowColor: '#000000',
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  noteCopy: { flex: 1 },
  noteTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '900', marginBottom: 4 },
  noteText: { color: '#D1D5DB', lineHeight: 20, flexShrink: 1 },
  bottomPadding: { height: 160 },
});
