// © 2026 1001538341 ONTARIO INC.

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Sponsor, sponsorsByTier } from '../../src/data/sponsors';
import HomecomingHero from '../../src/components/HomecomingHero';
import { colors } from '../../src/theme/colors';

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
    <View style={styles.sponsorCard}>
      <View style={styles.cardTopRow}>
        <View style={styles.cardCopy}>
          <View style={styles.nameRow}>
            <Text style={styles.sponsorName}>{sponsor.name}</Text>
            <View style={[styles.tierBadge, { backgroundColor: sponsor.color }]}>
              <Text style={styles.tierBadgeText}>{tierLabel(sponsor.tier)}</Text>
            </View>
          </View>

          <View style={styles.dividerRow}>
            <View style={[styles.dividerAccent, { backgroundColor: sponsor.color }]} />
            <Text style={styles.tierMeta}>{tierLabel(sponsor.tier)}</Text>
          </View>

          {sponsor.tagline ? <Text style={styles.sponsorTagline}>{sponsor.tagline}</Text> : null}
          {sponsor.description ? (
            <Text style={styles.sponsorDescription}>{sponsor.description}</Text>
          ) : null}
        </View>
      </View>

      {sponsor.url ? (
        <Pressable style={[styles.visitButton, { backgroundColor: sponsor.color }]} onPress={() => Linking.openURL(sponsor.url)}>
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
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionEyebrow}>Sponsor tier</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
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
        <View style={styles.page}>
          <HomecomingHero
            eyebrow="Sponsors"
            title="Community Partners"
            subtitle="The businesses and organizations helping power Homecoming weekend."
          />

          <View style={styles.introCard}>
            <Text style={styles.eyebrow}>Supporters</Text>
            <Text style={styles.pageTitle}>Local sponsors powering the weekend</Text>
            <Text style={styles.pageSubtitle}>
              Browse our sponsor tiers and discover the businesses backing Home Coming across the community.
            </Text>
          </View>

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
                Thank you to every business and organization helping bring Walkerton Home Coming 2026 to life.
              </Text>
            </>
          ) : (
            <View style={styles.placeholderCard}>
              <Text style={styles.placeholderTitle}>Sponsors</Text>
              <Text style={styles.placeholderBody}>
                Official sponsor listings will be added as sponsor information becomes available.
              </Text>
              <Text style={styles.placeholderBody}>
                Thank you to all businesses and organizations supporting Walkerton Home Coming 2026.
              </Text>
            </View>
          )}

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 220,
  },
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
  filterWrap: {
    borderRadius: 22,
    backgroundColor: '#0F1012',
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  filterScroll: {
    paddingHorizontal: 18,
    paddingVertical: 14,
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
    borderRadius: 22,
    backgroundColor: '#0F1012',
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 24,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
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
  sectionHeader: { marginBottom: 18 },
  sectionEyebrow: { color: '#98A2AF', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
    color: '#fff',
  },
  sponsorCard: {
    borderRadius: 20,
    backgroundColor: '#15171B',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardTopRow: {
    alignItems: 'flex-start',
  },
  cardCopy: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  sponsorName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    flex: 1,
    lineHeight: 28,
  },
  tierBadge: {
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
    flexShrink: 0,
  },
  tierBadgeText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  dividerAccent: {
    width: 36,
    height: 4,
    borderRadius: 999,
  },
  tierMeta: {
    color: '#98A2AF',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sponsorTagline: {
    color: '#D1D5DB',
    marginTop: 16,
    lineHeight: 21,
    fontWeight: '700',
  },
  sponsorDescription: {
    color: '#B7BDC7',
    marginTop: 10,
    lineHeight: 21,
  },
  visitButton: {
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 13,
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
    marginTop: 10,
  },
  bottomPadding: {
    height: 160,
  },
});
