// © 2026 1001538341 ONTARIO INC.
import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Image,
  Pressable,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import eventConfig from '../../src/data/eventConfig';
import { featuredSponsors } from '../../src/data/sponsors';

function SponsorCard({ sponsor }: any) {
  return (
    <Pressable
      onPress={() => sponsor.url && Linking.openURL(sponsor.url)}
      style={[styles.sponsorCard, { borderColor: sponsor.color }]}
    >
      <View style={[styles.sponsorBadge, { backgroundColor: sponsor.color }]}>
        <Text style={styles.sponsorBadgeText}>{sponsor.tier.toUpperCase()}</Text>
      </View>
      <View style={styles.sponsorCopy}>
        <Text style={styles.sponsorName}>{sponsor.name}</Text>
        <Text style={styles.sponsorTagline}>{sponsor.tagline}</Text>
      </View>
    </Pressable>
  );
}

function GridItem({ label, icon, color, onPress }: any) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.gridItem, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.gridPressable}
      >
        <View style={[styles.iconWrap, { backgroundColor: color }]}>
          <Feather name={icon} size={22} color="#fff" />
        </View>
        <Text style={styles.gridLabel}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const filteredActions = eventConfig.homeActions.filter((a) => a.label !== 'Map');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroCard}>
        <View style={styles.heroGlowPink} />
        <View style={styles.heroGlowBlue} />
        <View style={styles.logoPanel}>
          <Image source={{ uri: eventConfig.assets.logoUri }} style={styles.heroLogo} resizeMode="contain" />
        </View>
        <Text style={styles.heroSubtitle}>{eventConfig.event.subtitle}</Text>
        <Text style={styles.heroDates}>{eventConfig.event.dates}</Text>
        <Text style={styles.heroLocation}>{eventConfig.event.location}</Text>
        <Text style={styles.heroTagline}>{eventConfig.event.tagline}</Text>
      </View>

      <View style={styles.revenueRow}>
        <Pressable style={[styles.revenueButton, styles.ticketButton]} onPress={() => Linking.openURL(eventConfig.links.tickets)}>
          <Feather name="tag" size={18} color="#fff" />
          <Text style={styles.revenueButtonText}>Get Tickets</Text>
        </Pressable>
        <Pressable style={[styles.revenueButton, styles.merchButton]} onPress={() => Linking.openURL(eventConfig.links.merch)}>
          <Feather name="shopping-bag" size={18} color="#000" />
          <Text style={[styles.revenueButtonText, { color: '#000' }]}>Order Merch</Text>
        </Pressable>
      </View>

      <View style={styles.featureCard}>
        <View style={styles.featureIconWrap}>
          <Feather name="music" size={22} color="#fff" />
        </View>
        <View style={styles.featureCopy}>
          <Text style={styles.featureEyebrow}>Weekend Highlight</Text>
          <Text style={styles.featureTitle}>Live music, reunions, parade fun, food, merch, and hometown energy.</Text>
          <Text style={styles.featureBody}>Keep tickets, schedule updates, sponsor offers, and your weekend plan in one place.</Text>
        </View>
      </View>

      <View style={styles.gridWrapper}>
        <Text style={styles.sectionTitle}>Plan Your Weekend</Text>
        <View style={styles.grid}>
          {filteredActions.map((item) => (
            <GridItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              color={item.color}
              onPress={() => {
                if (item.route) router.push(item.route);
                if (item.url) Linking.openURL(item.url);
              }}
            />
          ))}
        </View>
      </View>

      <View style={styles.sponsorStrip}>
        <Text style={styles.sponsorStripLabel}>Sponsor Visibility</Text>
        <Text style={styles.sponsorStripTitle}>Put local businesses where visitors actually look.</Text>
        <Text style={styles.sponsorStripText}>Available placements include top banners, home screen features, sponsor cards, and schedule callouts.</Text>
      </View>

      <View style={styles.sponsorSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Featured Sponsors</Text>
          <Text style={styles.sectionHint}>Tap to visit</Text>
        </View>
        {featuredSponsors.map((sponsor) => (
          <SponsorCard key={sponsor.id} sponsor={sponsor} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 14,
    borderRadius: 26,
    minHeight: 286,
    overflow: 'hidden',
    backgroundColor: '#090909',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(22, 191, 214, 0.55)',
  },
  heroGlowPink: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(246, 0, 143, 0.30)',
    top: -95,
    right: -75,
  },
  heroGlowBlue: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(22, 191, 214, 0.32)',
    bottom: -95,
    left: -75,
  },
  logoPanel: {
    width: '96%',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  heroLogo: { width: '100%', height: 112 },
  heroSubtitle: {
    color: '#74D65E',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  heroDates: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 8,
  },
  heroLocation: { color: '#D1D5DB', fontSize: 14, marginTop: 4 },
  heroTagline: {
    color: '#FFFFFF',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.92,
  },
  revenueRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  revenueButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  ticketButton: { backgroundColor: '#F6008F' },
  merchButton: { backgroundColor: '#74D65E' },
  revenueButtonText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  featureCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#101010',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#F6008F',
  },
  featureIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F6008F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureCopy: { flex: 1 },
  featureEyebrow: {
    color: '#16BFD6',
    fontWeight: '900',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  featureTitle: { color: '#fff', fontWeight: '900', fontSize: 15, marginTop: 3 },
  featureBody: { color: '#B7BDC7', fontSize: 12, marginTop: 5, lineHeight: 17 },
  gridWrapper: { paddingHorizontal: 16 },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: '900', marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: {
    width: '31%',
    backgroundColor: '#111',
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#252525',
  },
  gridPressable: { alignItems: 'center', paddingVertical: 17, paddingHorizontal: 6 },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gridLabel: { fontSize: 12, fontWeight: '800', color: '#fff', textAlign: 'center' },
  sponsorStrip: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
    borderRadius: 18,
    backgroundColor: '#16BFD6',
    padding: 16,
  },
  sponsorStripLabel: {
    color: '#000',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sponsorStripTitle: { color: '#000', fontSize: 18, fontWeight: '900', marginTop: 4 },
  sponsorStripText: { color: '#001014', fontSize: 12, lineHeight: 18, marginTop: 6 },
  sponsorSection: { paddingHorizontal: 16, paddingBottom: 120 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionHint: { color: '#74D65E', fontSize: 11, fontWeight: '800', marginBottom: 10 },
  sponsorCard: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sponsorBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 8, marginRight: 10 },
  sponsorBadgeText: { color: '#FFFFFF', fontWeight: '900', fontSize: 9 },
  sponsorCopy: { flex: 1 },
  sponsorName: { fontWeight: '900', fontSize: 14, color: '#fff' },
  sponsorTagline: { fontSize: 12, color: '#B7BDC7', marginTop: 2 },
});
