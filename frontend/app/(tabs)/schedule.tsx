// © 2026 1001538341 ONTARIO INC.

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import eventConfig from '../../src/data/eventConfig';

type DemoEvent = {
  id: string;
  day: string;
  date: string;
  time: string;
  title: string;
  location: string;
  category: 'Music' | 'Kids' | 'Parade' | 'Food' | 'Community' | 'Merch' | 'Tickets';
  description: string;
  sponsor?: string;
};

const schedule: DemoEvent[] = [
  { id: 'thu-open', day: 'Thursday', date: 'July 30', time: '5:00 PM', title: 'Welcome Home Kickoff', location: 'Downtown Walkerton', category: 'Community', description: 'Opening night check-in, welcome booths, music downtown, food vendors, and a first chance to reconnect with old friends.', sponsor: 'Presented by Main Stage Sponsor' },
  { id: 'thu-merch', day: 'Thursday', date: 'July 30', time: '6:30 PM', title: 'Merch Pickup & Pop-Up Shop', location: 'Homecoming Hub', category: 'Merch', description: 'Pick up pre-ordered clothing, browse limited-edition Homecoming gear, and grab weekend info.' },
  { id: 'fri-kids', day: 'Friday', date: 'July 31', time: '11:00 AM', title: 'Kids Remix Zone Opens', location: 'Community Park', category: 'Kids', description: 'Family activities, games, face painting, inflatables, and youth-friendly entertainment throughout the afternoon.', sponsor: 'Kids Zone Sponsor' },
  { id: 'fri-food', day: 'Friday', date: 'July 31', time: '4:00 PM', title: 'Food Truck Friday', location: 'Downtown Food Row', category: 'Food', description: 'Local eats, patios, treats, and community food vendors. A perfect stop before the evening concerts.', sponsor: 'Downtown Food Sponsor' },
  { id: 'fri-music', day: 'Friday', date: 'July 31', time: '9:00 PM', title: 'Friday Night Mingle Concert', location: 'Main Stage', category: 'Music', description: 'A high-energy throwback night built for reconnecting, dancing, and kicking off the weekend properly.', sponsor: 'Main Stage Sponsor' },
  { id: 'sat-parade', day: 'Saturday', date: 'August 1', time: '10:30 AM', title: 'Homecoming Parade', location: 'Parade Route', category: 'Parade', description: 'Floats, community groups, alumni, music, and hometown pride through the heart of Walkerton.', sponsor: 'Parade Route Sponsor' },
  { id: 'sat-market', day: 'Saturday', date: 'August 1', time: '1:00 PM', title: 'Local Market & Community Showcase', location: 'Downtown Walkerton', category: 'Community', description: 'Local vendors, service clubs, sponsor booths, history displays, and community organizations.' },
  { id: 'sat-remix', day: 'Saturday', date: 'August 1', time: '9:00 PM', title: 'Saturday Night Remix Party', location: 'Main Stage', category: 'Music', description: 'The signature Mingle & Remix party night with live music, reunion energy, and premium sponsor visibility.', sponsor: 'Presented by Main Stage Sponsor' },
  { id: 'sun-brunch', day: 'Sunday', date: 'August 2', time: '10:00 AM', title: 'Community Brunch', location: 'Community Hall', category: 'Food', description: 'A slower Sunday morning to gather, share stories, and enjoy a community meal together.' },
  { id: 'sun-family', day: 'Sunday', date: 'August 2', time: '2:00 PM', title: 'Family Field Day', location: 'Community Park', category: 'Kids', description: 'Outdoor games, family challenges, youth events, and relaxed afternoon entertainment.' },
  { id: 'mon-finale', day: 'Monday', date: 'August 3', time: '7:30 PM', title: 'Finale Night & Fireworks', location: 'Main Stage Grounds', category: 'Music', description: 'Closing celebration with music, thank-yous, sponsor recognition, and a community sendoff.', sponsor: 'Community Sponsor Spotlight' },
];

const categoryColors: Record<DemoEvent['category'], string> = {
  Music: '#F6008F', Kids: '#45DDF0', Parade: '#FFD23F', Food: '#74D65E', Community: '#16BFD6', Merch: '#B7BDC7', Tickets: '#F6008F',
};

export default function ScheduleScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEvent, setSelectedEvent] = useState<DemoEvent | null>(null);
  const categories = ['All', ...Array.from(new Set(schedule.map((event) => event.category)))];
  const filteredEvents = selectedCategory === 'All' ? schedule : schedule.filter((event) => event.category === selectedCategory);

  const grouped = useMemo(() => filteredEvents.reduce((acc, event) => {
    const key = `${event.day}, ${event.date}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {} as Record<string, DemoEvent[]>), [filteredEvents]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{eventConfig.event.shortName}</Text>
        <Text style={styles.title}>Weekend Schedule</Text>
        <Text style={styles.subtitle}>{eventConfig.event.dates} · {schedule.length} events</Text>
      </View>

      <View style={styles.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {categories.map((category) => {
            const active = category === selectedCategory;
            return (
              <TouchableOpacity key={category} style={[styles.filterPill, active && styles.filterPillActive]} onPress={() => setSelectedCategory(category)}>
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{category}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.ticketCallout}>
          <Feather name="calendar" size={20} color="#000" />
          <View style={{ flex: 1 }}>
            <Text style={styles.ticketTitle}>Plan the weekend your way</Text>
            <Text style={styles.ticketText}>Filter by music, kids events, parade, food, merch, and community moments.</Text>
          </View>
        </View>

        {Object.entries(grouped).map(([day, events]) => (
          <View key={day} style={styles.daySection}>
            <Text style={styles.dayTitle}>{day}</Text>
            {events.map((event) => (
              <TouchableOpacity key={event.id} style={[styles.eventCard, { borderColor: categoryColors[event.category] }]} onPress={() => setSelectedEvent(event)}>
                <View style={[styles.colorBar, { backgroundColor: categoryColors[event.category] }]} />
                <View style={styles.eventBody}>
                  <View style={styles.eventTopRow}>
                    <Text style={styles.eventTime}>{event.time}</Text>
                    <Text style={[styles.categoryBadge, { color: categoryColors[event.category] }]}>{event.category}</Text>
                  </View>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.locationRow}>
                    <Feather name="map-pin" size={12} color="#8B95A1" />
                    <Text style={styles.locationText}>{event.location}</Text>
                  </View>
                  <Text style={styles.eventDescription} numberOfLines={2}>{event.description}</Text>
                  {event.sponsor ? <Text style={styles.sponsorLine}>Sponsored: {event.sponsor}</Text> : null}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={styles.bottomPadding} />
      </ScrollView>

      <Modal visible={!!selectedEvent} transparent animationType="slide" onRequestClose={() => setSelectedEvent(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedEvent && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                  <TouchableOpacity onPress={() => setSelectedEvent(null)}><Feather name="x" size={24} color="#B7BDC7" /></TouchableOpacity>
                </View>
                <Text style={styles.modalMeta}>{selectedEvent.day}, {selectedEvent.date} · {selectedEvent.time}</Text>
                <Text style={styles.modalLocation}>{selectedEvent.location}</Text>
                <Text style={styles.modalDescription}>{selectedEvent.description}</Text>
                {selectedEvent.sponsor ? <Text style={styles.modalSponsor}>{selectedEvent.sponsor}</Text> : null}
                <TouchableOpacity style={styles.modalButton} onPress={() => setSelectedEvent(null)}><Text style={styles.modalButtonText}>Add to My Weekend</Text></TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, backgroundColor: '#061207', borderBottomWidth: 2, borderBottomColor: '#74D65E' },
  eyebrow: { color: '#74D65E', fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginTop: 4 },
  subtitle: { color: '#D1D5DB', fontSize: 13, marginTop: 4 },
  filterWrap: { backgroundColor: '#000', borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  filterScroll: { paddingHorizontal: 16, paddingVertical: 12 },
  filterPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#111', marginRight: 8, borderWidth: 1, borderColor: '#252525' },
  filterPillActive: { backgroundColor: '#74D65E', borderColor: '#74D65E' },
  filterText: { fontSize: 13, color: '#D1D5DB', fontWeight: '800' },
  filterTextActive: { color: '#000' },
  content: { flex: 1, paddingHorizontal: 16, backgroundColor: '#000' },
  ticketCallout: { flexDirection: 'row', gap: 12, backgroundColor: '#74D65E', borderRadius: 18, padding: 16, marginTop: 16, marginBottom: 18 },
  ticketTitle: { color: '#000', fontSize: 15, fontWeight: '900' },
  ticketText: { color: '#061207', fontSize: 12, lineHeight: 17, marginTop: 4 },
  daySection: { marginBottom: 22 },
  dayTitle: { fontSize: 19, fontWeight: '900', color: '#fff', marginBottom: 10 },
  eventCard: { flexDirection: 'row', backgroundColor: '#111', borderRadius: 16, overflow: 'hidden', marginBottom: 12, borderWidth: 1 },
  colorBar: { width: 5 },
  eventBody: { flex: 1, padding: 14 },
  eventTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventTime: { color: '#74D65E', fontSize: 13, fontWeight: '900' },
  categoryBadge: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  eventTitle: { fontSize: 16, fontWeight: '900', color: '#fff', marginTop: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  locationText: { color: '#B7BDC7', fontSize: 12, fontWeight: '600' },
  eventDescription: { color: '#D1D5DB', fontSize: 13, lineHeight: 18, marginTop: 7 },
  sponsorLine: { color: '#16BFD6', fontSize: 12, fontWeight: '900', marginTop: 8 },
  bottomPadding: { height: 160 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#111', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, minHeight: 320, borderTopWidth: 2, borderColor: '#74D65E' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  modalTitle: { flex: 1, fontSize: 22, fontWeight: '900', color: '#fff' },
  modalMeta: { color: '#74D65E', fontWeight: '900', marginTop: 12 },
  modalLocation: { color: '#D1D5DB', marginTop: 6, fontWeight: '700' },
  modalDescription: { color: '#D1D5DB', fontSize: 15, lineHeight: 22, marginTop: 16 },
  modalSponsor: { color: '#16BFD6', fontSize: 14, fontWeight: '900', marginTop: 16 },
  modalButton: { backgroundColor: '#74D65E', borderRadius: 16, padding: 16, alignItems: 'center', marginTop: 22 },
  modalButtonText: { color: '#000', fontWeight: '900' },
});
