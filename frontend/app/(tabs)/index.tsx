// © 2026 1001538341 ONTARIO INC.
import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Image, Pressable, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import eventConfig from '../../src/data/eventConfig';
import HomecomingHero from '../../src/components/HomecomingHero';

type HomeEvent = {
  id: string;
  date: string;
  time: string;
  title: string;
  category: 'Music' | 'Kids' | 'Parade' | 'Food' | 'Community' | 'Merch';
};

const homeEvents: HomeEvent[] = [
  { id: 'thu-open', date: '2026-07-30', time: '5:00 PM', title: 'Welcome Home Kickoff', category: 'Community' },
  { id: 'fri-kids', date: '2026-07-31', time: '11:00 AM', title: 'Kids Remix Zone Opens', category: 'Kids' },
  { id: 'fri-food', date: '2026-07-31', time: '4:00 PM', title: 'Food Truck Friday', category: 'Food' },
  { id: 'fri-music', date: '2026-07-31', time: '9:00 PM', title: 'Friday Night Mingle Concert', category: 'Music' },
  { id: 'sat-parade', date: '2026-08-01', time: '10:30 AM', title: 'Homecoming Parade', category: 'Parade' },
  { id: 'sat-market', date: '2026-08-01', time: '1:00 PM', title: 'Local Market & Community Showcase', category: 'Community' },
  { id: 'sat-remix', date: '2026-08-01', time: '9:00 PM', title: 'Saturday Night Remix Party', category: 'Music' },
  { id: 'sun-brunch', date: '2026-08-02', time: '10:00 AM', title: 'Community Brunch', category: 'Food' },
  { id: 'mon-finale', date: '2026-08-03', time: '7:30 PM', title: 'Finale Night & Fireworks', category: 'Music' },
];

const categoryColors: Record<HomeEvent['category'], string> = {
  Music: '#F6008F',
  Kids: '#45DDF0',
  Parade: '#FFD23F',
  Food: '#74D65E',
  Community: '#16BFD6',
  Merch: '#FFFFFF',
};

function getDaysUntil(dateString: string) {
  const target = new Date(`${dateString}T00:00:00`);
  const today = new Date();
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
}

function getCurrentOrNextEvents() {
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  const todayEvents = homeEvents.filter((event) => event.date === todayKey);
  if (todayEvents.length > 0) return { title: 'Happening Today', events: todayEvents.slice(0, 3) };

  const next = homeEvents.find((event) => new Date(`${event.date}T23:59:59`) >= today);
  if (!next) return { title: 'Weekend Highlights', events: homeEvents.slice(-3) };

  const nextEvents = homeEvents.filter((event) => event.date === next.date).slice(0, 3);
  const label = new Date(`${next.date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  return { title: `Coming Up: ${label}`, events: nextEvents };
}

function GridItem({ label, icon, color, onPress }: any) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={[styles.gridItem, { transform: [{ scale: scaleAnim }] }]}> 
      <Pressable
        onPress={onPress}
        onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()}
        style={styles.gridPressable}
      >
        <View style={[styles.iconWrap, { backgroundColor: color }]}> 
          <Feather name={icon} size={22} color={color === '#FFD23F' ? '#000' : '#fff'} />
        </View>
        <Text style={styles.gridLabel}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const homeActions = eventConfig.homeActions;
  const days = getDaysUntil('2026-07-30');
  const dynamicEvents = useMemo(() => getCurrentOrNextEvents(), []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <HomecomingHero
        title={eventConfig.event.shortName}
        subtitle={eventConfig.event.tagline}
      />

      <View style={styles.heroMetaSection}>
        <Text style={styles.heroMetaPrimary}>July 30 – August 3, 2026</Text>
        <Text style={styles.heroMetaSecondary}>Walkerton, Ontario</Text>
      </View>

      <View style={styles.countdownSection}>
        <Text style={styles.countdownText}>⏳ {days} Days Until Homecoming</Text>
      </View>

      <View style={styles.todayCard}>
        <View style={styles.todayHeader}>
          <Text style={styles.todayTitle}>{dynamicEvents.title}</Text>
          <Pressable onPress={() => router.push('/(tabs)/schedule')}>
            <Text style={styles.viewAll}>View schedule</Text>
          </Pressable>
        </View>
        {dynamicEvents.events.map((event) => (
          <View key={event.id} style={styles.todayItemRow}>
            <View style={[styles.todayDot, { backgroundColor: categoryColors[event.category] }]} />
            <Text style={styles.todayTime}>{event.time}</Text>
            <Text style={styles.todayItem}>{event.title}</Text>
          </View>
        ))}
      </View>

      <View style={styles.featureCard}>
        <View style={styles.featureIconWrap}>
          <Feather name="music" size={22} color="#fff" />
        </View>
        <View style={styles.featureCopy}>
          <Text style={styles.featureEyebrow}>Homecoming Weekend</Text>
          <Text style={styles.featureTitle}>Four days of reunions, live music, family activities, downtown events, parades, tournaments, and community celebrations across Walkerton.</Text>
          <Text style={styles.featureBody}>Track events, explore maps, check transportation details, browse sponsors, and stay on top of the full weekend schedule in one place.</Text>
        </View>
      </View>

      <View style={styles.gridWrapper}>
        <Text style={styles.sectionTitle}>Plan Your Weekend</Text>
        <View style={styles.grid}>
          {homeActions.map((item) => (
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

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollContent: { paddingBottom: 120 },
  heroMetaSection: { marginHorizontal: 16, marginBottom: 12, alignItems: 'center' },
  heroMetaPrimary: { color: '#16BFD6', fontWeight: '900', fontSize: 16, textAlign: 'center' },
  heroMetaSecondary: { color: '#16BFD6', fontWeight: '800', fontSize: 15, textAlign: 'center', marginTop: 4 },
  countdownSection: { marginHorizontal: 16, marginBottom: 16, borderRadius: 18, backgroundColor: '#111', borderWidth: 1, borderColor: '#1F2937', paddingVertical: 16, paddingHorizontal: 18, alignItems: 'center' },
  countdownText: { color: '#74D65E', fontWeight: '900', fontSize: 18, textAlign: 'center' },
  todayCard: { marginHorizontal: 16, marginBottom: 16, borderRadius: 18, backgroundColor: '#111', padding: 16, borderWidth: 1, borderColor: '#252525' },
  todayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  todayTitle: { color: '#fff', fontWeight: '900', fontSize: 16 },
  viewAll: { color: '#16BFD6', fontWeight: '900', fontSize: 12 },
  todayItemRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  todayDot: { width: 9, height: 9, borderRadius: 5 },
  todayTime: { color: '#74D65E', fontSize: 12, fontWeight: '900', width: 70 },
  todayItem: { color: '#D1D5DB', fontSize: 13, flex: 1 },
  featureCard: { marginHorizontal: 16, marginBottom: 16, borderRadius: 20, padding: 16, backgroundColor: '#101010', flexDirection: 'row', borderWidth: 2, borderColor: '#F6008F' },
  featureIconWrap: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#F6008F', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  featureCopy: { flex: 1 },
  featureEyebrow: { color: '#16BFD6', fontWeight: '900', fontSize: 11, textTransform: 'uppercase' },
  featureTitle: { color: '#fff', fontWeight: '900', fontSize: 15, marginTop: 3 },
  featureBody: { color: '#B7BDC7', fontSize: 12, marginTop: 5, lineHeight: 17 },
  gridWrapper: { paddingHorizontal: 16 },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: '900', marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', backgroundColor: '#111', borderRadius: 18, marginBottom: 14, borderWidth: 1, borderColor: '#252525' },
  gridPressable: { alignItems: 'center', paddingVertical: 22, paddingHorizontal: 10 },
  iconWrap: { width: 54, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  gridLabel: { fontSize: 13, fontWeight: '800', color: '#fff', textAlign: 'center' },
});
