// © 2026 1001538341 ONTARIO INC.

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Sponsor, sponsorsByTier } from '../../src/data/sponsors';
import HomecomingHero from '../../src/components/HomecomingHero';

const GOLD = '#FFD23F';
const FILTER_OPTIONS = ['All', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'] as const;
type SponsorFilter = typeof FILTER_OPTIONS[number];

function tierLabel(tier: Sponsor['tier']) {
  switch (tier) {
    case 'diamond':
      return 'Diamond Sponsor';
    case 'platinum':
      return 'Platinum Sponsor';
    case 'gold':
      return 'Gold Sponsor';
    case 'silver':
      return 'Silver Sponsor';
    case 'bronze':
      return 'Bronze Sponsor';
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
          {sponsor.tagline ? <Text style={styles.sponsorTagline}>{sponsor.tagline}</Text> : null}
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
  const [selectedTier, setSelectedTier] = useState<SponsorFilter>('All');
  const hasSponsors =
    sponsorsByTier.diamond.length > 0 ||
    sponsorsByTier.platinum.length > 0 ||
    sponsorsByTier.gold.length > 0 ||
    sponsorsByTier.silver.length > 0 ||
    sponsorsByTier.bronze.length > 0;
  const filteredByTier = useMemo(() => {
    if (selectedTier === 'All') return sponsorsByTier;

    return {
      diamond: selectedTier === 'Diamond' ? sponsorsByTier.diamond : [],
      platinum: selectedTier === 'Platinum' ? sponsorsByTier.platinum : [],
      gold: selectedTier === 'Gold' ? sponsorsByTier.gold : [],
      silver: selectedTier === 'Silver' ? sponsorsByTier.silver : [],
      bronze: selectedTier === 'Bronze' ? sponsorsByTier.bronze : [],
    };
  }, [selectedTier]);

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
            <View style={styles.filterWrap}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                {FILTER_OPTIONS.map((option) => {
                  const active = option === selectedTier;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[styles.filterPill, active && styles.filterPillActive]}
                      onPress={() => setSelectedTier(option)}
                    >
                      <Text style={[styles.filterText, active && styles.filterTextActive]}>{option}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <SponsorSection title="Diamond Sponsors" sponsors={filteredByTier.diamond} />
            <SponsorSection title="Platinum Sponsors" sponsors={filteredByTier.platinum} />
            <SponsorSection title="Gold Sponsors" sponsors={filteredByTier.gold} />
            <SponsorSection title="Silver Sponsors" sponsors={filteredByTier.silver} />
            <SponsorSection title="Bronze Sponsors" sponsors={filteredByTier.bronze} />
            <Text style={styles.footerNote}>
              Sponsor logos and additional sponsor information will be added as available.
            </Text>
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
  filterWrap: {
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#111',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#252525',
  },
  filterPillActive: {
    backgroundColor: '#74D65E',
    borderColor: '#74D65E',
  },
  filterText: {
    fontSize: 13,
    color: '#D1D5DB',
    fontWeight: '800',
  },
  filterTextActive: {
    color: '#000',
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
    fontSize: 10,
    textAlign: 'center',
    paddingHorizontal: 8,
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
  footerNote: {
    color: '#B7BDC7',
    fontSize: 13,
    lineHeight: 20,
    marginHorizontal: 20,
    marginTop: 8,
  },
  bottomPadding: {
    height: 160,
  },
});
