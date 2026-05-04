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
      <Text style={[styles.sponsorName, { color: sponsor.color }]}>
        {sponsor.name}
      </Text>
      <Text style={styles.sponsorTagline}>{sponsor.tagline}</Text>
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

  return (
    <ScrollView style={[styles.container, { backgroundColor: eventConfig.brand.homeBackground }]}> 
      <View style={styles.bannerContainer}>
        <Image source={eventConfig.assets.bannerImage} style={styles.bannerImage} resizeMode="cover" />
        <View style={styles.bannerOverlay} />
      </View>

      <View style={styles.gridWrapper}>
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

      {/* Sponsors Section */}
      <View style={styles.sponsorSection}>
        <Text style={styles.sponsorTitle}>Featured Sponsors</Text>
        {featuredSponsors.map((sponsor) => (
          <SponsorCard key={sponsor.id} sponsor={sponsor} />
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bannerContainer: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
  },
  bannerImage: { width: '100%', height: '100%' },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  gridWrapper: { paddingHorizontal: 16 },
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
    fontWeight: '700',
    color: '#1F2937',
  },
  sponsorSection: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  sponsorTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  sponsorCard: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  sponsorName: {
    fontWeight: '700',
    fontSize: 14,
  },
  sponsorTagline: {
    fontSize: 12,
    color: '#6B7280',
  },
});
