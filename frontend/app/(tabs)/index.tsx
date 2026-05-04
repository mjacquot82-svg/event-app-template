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

  return (
    <ScrollView style={[styles.container, { backgroundColor: eventConfig.brand.homeBackground }]}> 
      <View style={styles.heroCard}>
        <View style={styles.heroGlowPink} />
        <View style={styles.heroGlowBlue} />
        <Image source={{ uri: eventConfig.assets.logoUri }} style={styles.heroLogo} resizeMode="contain" />
        <Text style={styles.heroSubtitle}>{eventConfig.event.subtitle}</Text>
        <Text style={styles.heroDates}>{eventConfig.event.dates}</Text>
        <Text style={styles.heroLocation}>{eventConfig.event.location}</Text>
        <Text style={styles.heroTagline}>{eventConfig.event.tagline}</Text>
      </View>

      <View style={styles.featureCard}>
        <View style={styles.featureIconWrap}>
          <Feather name="music" size={22} color="#fff" />
        </View>
        <View style={styles.featureCopy}>
          <Text style={styles.featureEyebrow}>Weekend Highlight</Text>
          <Text style={styles.featureTitle}>Live music, reunions, parade fun, food, merch, and hometown energy.</Text>
          <Text style={styles.featureBody}>Use the app for tickets, schedule updates, sponsor offers, and your personal weekend plan.</Text>
        </View>
      </View>

      <View style={styles.gridWrapper}>
        <Text style={styles.sectionTitle}>Plan Your Weekend</Text>
        <View style={styles.grid}>
          {eventConfig.homeActions.map((item) => (
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
        <Text style={styles.sponsorStripLabel}>Sponsor Opportunity</Text>
        <Text style={styles.sponsorStripTitle}>Premium app-wide placements available</Text>
        <Text style={styles.sponsorStripText}>Top banner, home screen features, event sponsorship, and future map placements can be sold to local businesses.</Text>
      </View>

      <View style={styles.sponsorSection}>
        <Text style={styles.sectionTitle}>Featured Sponsors</Text>
        {featuredSponsors.map((sponsor) => (
          <SponsorCard key={sponsor.id} sponsor={sponsor} />
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 24,
    minHeight: 245,
    overflow: 'hidden',
    backgroundColor: '#101827',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  heroGlowPink: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(246, 0, 143, 0.32)',
    top: -70,
    right: -55,
  },
  heroGlowBlue: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(22, 191, 214, 0.36)',
    bottom: -75,
    left: -50,
  },
  heroLogo: {
    width: '90%',
    height: 96,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#74D65E',
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroDates: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 8,
  },
  heroLocation: {
    color: '#D1D5DB',
    fontSize: 14,
    marginTop: 4,
  },
  heroTagline: {
    color: '#FFFFFF',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.9,
  },
  featureCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 18,
    padding: 16,
    backgroundColor: '#FFFFFF',
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
  featureTitle: {
    color: '#111827',
    fontWeight: '900',
    fontSize: 15,
    marginTop: 3,
  },
  featureBody: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 5,
    lineHeight: 17,
  },
  gridWrapper: { paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  gridPressable: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gridLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
  },
  sponsorStrip: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
    borderRadius: 18,
    backgroundColor: '#111827',
    padding: 16,
    borderWidth: 2,
    borderColor: '#16BFD6',
  },
  sponsorStripLabel: {
    color: '#74D65E',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  sponsorStripTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 4,
  },
  sponsorStripText: {
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  sponsorSection: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  sponsorCard: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sponsorBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginRight: 10,
  },
  sponsorBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 9,
  },
  sponsorCopy: { flex: 1 },
  sponsorName: {
    fontWeight: '900',
    fontSize: 14,
    color: '#111827',
  },
  sponsorTagline: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});
