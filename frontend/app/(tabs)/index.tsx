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

  return (
    <Animated.View style={[styles.gridItem, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable onPress={onPress} style={styles.gridPressable}>
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

  const filteredActions = eventConfig.homeActions.filter(a => a.label !== 'Map');

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#000' }]}> 

      <View style={styles.heroCard}>
        <Image source={{ uri: eventConfig.assets.logoUri }} style={styles.heroLogo} resizeMode="contain" />
        <Text style={styles.heroSubtitle}>{eventConfig.event.subtitle}</Text>
        <Text style={styles.heroDates}>{eventConfig.event.dates}</Text>
        <Text style={styles.heroLocation}>{eventConfig.event.location}</Text>
        <Text style={styles.heroTagline}>{eventConfig.event.tagline}</Text>
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
        <Text style={styles.sponsorStripTitle}>Sponsor Opportunities Available</Text>
        <Text style={styles.sponsorStripText}>Feature your business across the app including banners and featured placements.</Text>
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
    margin: 16,
    borderRadius: 20,
    backgroundColor: '#000',
    alignItems: 'center',
    padding: 20,
  },

  heroLogo: {
    width: '90%',
    height: 90,
  },

  heroSubtitle: {
    color: '#00E5FF',
    fontSize: 14,
    fontWeight: '800',
  },

  heroDates: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 6,
  },

  heroLocation: {
    color: '#ccc',
    marginTop: 4,
  },

  heroTagline: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
  },

  gridWrapper: { paddingHorizontal: 16 },

  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  gridItem: {
    width: '31%',
    backgroundColor: '#111',
    borderRadius: 16,
    marginBottom: 12,
  },

  gridPressable: {
    alignItems: 'center',
    padding: 16,
  },

  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  gridLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  sponsorStrip: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#16BFD6',
    padding: 16,
  },

  sponsorStripTitle: {
    color: '#000',
    fontWeight: '900',
    fontSize: 16,
  },

  sponsorStripText: {
    color: '#000',
    marginTop: 4,
  },

  sponsorSection: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  sponsorCard: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
  },

  sponsorBadge: {
    borderRadius: 10,
    padding: 8,
    marginRight: 10,
  },

  sponsorBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },

  sponsorCopy: { flex: 1 },

  sponsorName: {
    color: '#fff',
    fontWeight: '900',
  },

  sponsorTagline: {
    color: '#aaa',
    fontSize: 12,
  },
});
