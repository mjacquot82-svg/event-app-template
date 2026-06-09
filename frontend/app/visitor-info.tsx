// © 2026 1001538341 ONTARIO INC.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const CYAN = '#16BFD6';
const LIME = '#74D65E';
const YELLOW = '#FFD23F';
const PINK = '#F6008F';
const BUS_ROUTE_ASSET = require('../assets/images/Bus Route.png');
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
  const imageWidth = '82%';

  return (
    <>
      <Text style={styles.imageCardTitle}>{title}</Text>
      <Image
        source={asset}
        style={[styles.routeImage, { width: imageWidth }]}
        resizeMode="contain"
      />
    </>
  );
}

export default function VisitorInfoScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Visitor Info</Text>
          <Text style={styles.subtitle}>Shuttles, parade route, and food service details for Homecoming weekend.</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="truck" size={20} color={CYAN} />
            <Text style={styles.sectionTitle}>Shuttle Information</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>In Town Shuttle</Text>
            <InfoRow day="Friday" hours="2pm–2am" />
            <InfoRow day="Saturday" hours="10:30am–2am" />
            <InfoRow day="Sunday" hours="10:30am–2am" />
            <InfoRow day="Monday" hours="10:30am–7pm" />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Rodeo Express</Text>
            <InfoRow day="Saturday" hours="10:30am–11:30pm" />
            <InfoRow day="Sunday" hours="2pm–11:30pm" />
          </View>

          <ZoomableImageCard title="Bus Route" asset={BUS_ROUTE_ASSET} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="flag" size={20} color={PINK} />
            <Text style={styles.sectionTitle}>Parade Route</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.routeText}>Wallace Street</Text>
            <Text style={styles.routeText}>McGivern Street</Text>
            <Text style={styles.routeText}>Victoria Street</Text>
            <Text style={styles.routeText}>Durham Street</Text>
            <Text style={styles.routeText}>Arena</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="coffee" size={20} color={YELLOW} />
            <Text style={styles.sectionTitle}>Food Truck Alley</Text>
          </View>

          <View style={styles.card}>
            <InfoRow day="Friday" hours="4pm–1am" />
            <InfoRow day="Saturday–Monday" hours="11am–1am" />
          </View>
        </View>

        <View style={styles.noteCard}>
          <Feather name="info" size={18} color={LIME} />
          <Text style={styles.noteText}>Check this page during the weekend for operating details before heading out.</Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollView: { flex: 1, backgroundColor: '#000' },
  scrollContent: { paddingBottom: 220 },
  header: { padding: 20, borderBottomWidth: 2, borderBottomColor: CYAN, backgroundColor: '#06141A' },
  title: { fontSize: 26, fontWeight: '900', color: '#fff' },
  subtitle: { color: '#D1D5DB', marginTop: 4, lineHeight: 20 },
  section: { padding: 20, paddingBottom: 0 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#fff' },
  card: { backgroundColor: '#111', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1F2937', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '900', color: '#fff', marginBottom: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#252525' },
  infoDay: { color: '#D1D5DB', fontWeight: '800', fontSize: 14 },
  infoHours: { color: '#FFFFFF', fontWeight: '900', fontSize: 14 },
  routeText: { color: '#D1D5DB', fontSize: 15, fontWeight: '800', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#252525' },
  imageCardTitle: { fontSize: 16, fontWeight: '900', color: '#fff', marginBottom: 12 },
  routeImage: { alignSelf: 'center', height: undefined, aspectRatio: BUS_ROUTE_ASPECT_RATIO, marginBottom: 12 },
  noteCard: { marginHorizontal: 20, marginTop: 20, borderRadius: 16, backgroundColor: '#101010', borderWidth: 1, borderColor: LIME, padding: 16, flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  noteText: { flex: 1, color: '#D1D5DB', lineHeight: 20 },
  bottomPadding: { height: 160 },
});
