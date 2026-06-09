// © 2026 1001538341 ONTARIO INC.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Sponsor, sponsorsByTier } from '../../src/data/sponsors';
import HomecomingHero from '../../src/components/HomecomingHero';

const GOLD = '#FFD23F';

function tierLabel(tier: Sponsor['tier']) {
  switch (tier) {
    case 'presenting':
      return 'Presenting Sponsor';
    case 'featured':
      return 'Featured Sponsor';
    case 'community':
      return 'Community Sponsor';
    default:
      return 'Sponsor';
  }
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <View style={[styles.sponsorCard, { borderColor: sponsor.color }]}>
      <View style={styles.cardTopRow}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoPlaceholderText}>{sponsor.logo ? 'Logo Ready' : 'Logo'}</Text>
        </View>

        <View style={styles.cardCopy}>
          <Text style={styles.sponsorName}>{sponsor.name}</Text>
          <View style={[styles.tierBadge, { backgroundColor: sponsor.color }]}>
            <Text style={styles.tierBadgeText}>{tierLabel(sponsor.tier)}</Text>
          </View>
          <Text style={styles.sponsorTagline}>{sponsor.tagline}</Text>
          {sponsor.description ? (
            <Text style={styles.sponsorDescription}>{sponsor.description}</Text>
          ) : null}
        </View>
      </View>

      {sponsor.url ? (
        <Pressable style={styles.visitButton} onPress={() => Linking.openURL(sponsor.url)}>
          <Feather name="external-link" size={16} color="#000" />
          <Text style={styles.visitButtonText}>Visit Website</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function SponsorSection({ title, sponsors }: { title: string; sponsors: Sponsor[] }) {
  if (sponsors.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {sponsors.map((sponsor) => (
        <SponsorCard key={sponsor.id} sponsor={sponsor} />
      ))}
    </View>
  );
}

export default function SponsorsScreen() {
  const hasSponsors =
    sponsorsByTier.presenting.length > 0 ||
    sponsorsByTier.featured.length > 0 ||
    sponsorsByTier.community.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HomecomingHero
          eyebrow="Sponsors"
          title="Community Partners"
          subtitle="The businesses and organizations helping power Homecoming weekend."
        />

        {hasSponsors ? (
          <>
            <SponsorSection title="Presenting Sponsors" sponsors={sponsorsByTier.presenting} />
            <SponsorSection title="Featured Sponsors" sponsors={sponsorsByTier.featured} />
            <SponsorSection title="Community Sponsors" sponsors={sponsorsByTier.community} />
          </>
        ) : (
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderTitle}>Sponsors</Text>
            <Text style={styles.placeholderBody}>
              Official sponsor listings and logos will be added as sponsor information becomes available.
            </Text>
            <Text style={styles.placeholderBody}>
              Thank you to all businesses and organizations supporting Walkerton Home Coming 2026.
            </Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    paddingBottom: 220,
  },
  placeholderCard: {
    marginHorizontal: 20,
    marginTop: 6,
    borderRadius: 18,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 18,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 12,
  },
  placeholderBody: {
    color: '#D1D5DB',
    lineHeight: 22,
    marginBottom: 12,
  },
  section: {
    padding: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 12,
  },
  sponsorCard: {
    borderRadius: 18,
    backgroundColor: '#111',
    marginBottom: 12,
    borderWidth: 1,
    padding: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  logoPlaceholder: {
    width: 84,
    height: 84,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2B2B2B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholderText: {
    color: '#8B95A1',
    fontWeight: '800',
    fontSize: 12,
  },
  cardCopy: {
    flex: 1,
  },
  sponsorName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  tierBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 8,
  },
  tierBadgeText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  sponsorTagline: {
    color: '#D1D5DB',
    marginTop: 10,
    lineHeight: 19,
  },
  sponsorDescription: {
    color: '#B7BDC7',
    marginTop: 8,
    lineHeight: 19,
  },
  visitButton: {
    marginTop: 14,
    backgroundColor: GOLD,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  visitButtonText: {
    color: '#000',
    fontWeight: '900',
  },
  bottomPadding: {
    height: 160,
  },
});
