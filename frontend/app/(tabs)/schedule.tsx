// © 2026 1001538341 ONTARIO INC.

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import HomecomingHero from '../../src/components/HomecomingHero';

type DemoEvent = {
  id: string;
  day: string;
  date: string;
  time: string;
  title: string;
  location: string;
  category: 'Music' | 'Kids' | 'Food' | 'Parade' | 'Sports' | 'Special Events' | 'Community';
  description: string;
  sponsor?: string;
};

const schedule: DemoEvent[] = [
  { id: 'thu-roller-skating', day: 'Thursday', date: 'July 30', time: '7:00pm–9:00pm', title: 'Roller Skating', location: "Lang's Home Energy Event Arena", category: 'Community', description: "Roller skating at Lang's Home Energy Event Arena." },
  { id: 'thu-preteen-dance', day: 'Thursday', date: 'July 30', time: '6:30pm–8:00pm', title: 'Preteen Dance (Ages 6–12)', location: "Auditorium - Lang's Home Energy Event Arena", category: 'Kids', description: "Preteen dance for ages 6–12 in the auditorium at Lang's Home Energy Event Arena." },
  { id: 'thu-paint-sip', day: 'Thursday', date: 'July 30', time: '6:30pm–8:00pm', title: 'Paint & Sip (19+)', location: "Auditorium - Lang's Home Energy Event Arena", category: 'Community', description: "Paint & Sip for ages 19+ in the auditorium at Lang's Home Energy Event Arena." },
  { id: 'thu-teen-dance', day: 'Thursday', date: 'July 30', time: '8:30pm–10:00pm', title: 'Teen Dance (Ages 13–18)', location: "Auditorium - Lang's Home Energy Event Arena", category: 'Kids', description: "Teen dance for ages 13–18 in the auditorium at Lang's Home Energy Event Arena." },
  { id: 'fri-golf-tournament', day: 'Friday', date: 'July 31', time: '10:00am–5:00pm', title: 'Golf Tournament', location: 'Walkerton Golf & Curling Club', category: 'Sports', description: 'Golf tournament at Walkerton Golf & Curling Club.' },
  { id: 'fri-aquafit', day: 'Friday', date: 'July 31', time: '11:30am–12:30pm', title: 'Aquafit', location: 'Walkerton Centennial Pool', category: 'Sports', description: 'Aquafit session at Walkerton Centennial Pool.' },
  { id: 'fri-ticket-pickup', day: 'Friday', date: 'July 31', time: '4:00pm–6:00pm', title: 'Ticket Pickup', location: 'CMR Insurance Welcome Building', category: 'Special Events', description: 'Ticket pickup at the CMR Insurance Welcome Building.' },
  { id: 'fri-opening-ceremonies', day: 'Friday', date: 'July 31', time: '4:00pm', title: 'Opening Ceremonies', location: 'Kisses | Lifeology Entertainment Tent', category: 'Community', description: 'Opening ceremonies at the Kisses | Lifeology Entertainment Tent.' },
  { id: 'fri-kids-self-guided', day: 'Friday', date: 'July 31', time: '7:00pm–7:00pm', title: 'Kids Events - Self Guided', location: "Brown's Pharmacy Children's Tent", category: 'Kids', description: "Self-guided kids events at Brown's Pharmacy Children's Tent." },
  { id: 'fri-kids-tye-dye', day: 'Friday', date: 'July 31', time: '4:00pm–7:00pm', title: 'Kids Tye Dye Shirt Booth', location: "Brown's Pharmacy Children's Tent", category: 'Kids', description: "Kids Tye Dye Shirt Booth at Brown's Pharmacy Children's Tent." },
  { id: 'fri-youth-dodgeball', day: 'Friday', date: 'July 31', time: '6:00pm–8:00pm', title: 'Youth Dodgeball', location: "Lang's Home Energy Event Arena", category: 'Kids', description: "Youth dodgeball at Lang's Home Energy Event Arena." },
  { id: 'fri-music-blake-lisa', day: 'Friday', date: 'July 31', time: '3:00pm–7:00pm', title: 'Music by Blake Wilson & Lisa McEwen', location: 'Kisses | Lifeology Entertainment Tent', category: 'Music', description: 'Music by Blake Wilson & Lisa McEwen at the Kisses | Lifeology Entertainment Tent.' },
  { id: 'fri-chicken-dinner', day: 'Friday', date: 'July 31', time: '5:00pm', title: 'Chicken Dinner', location: 'Price Schonstrom Food Palace', category: 'Food', description: 'Chicken Dinner at the Price Schonstrom Food Palace.' },
  { id: 'fri-dance-pages-big-shiny-90s', day: 'Friday', date: 'July 31', time: '9:00pm–1:00am', title: 'Dance (19+) - The Pages Opening for Big Shiny 90s', location: 'RMP Welding Bandshell', category: 'Music', description: '19+ dance featuring The Pages opening for Big Shiny 90s at the RMP Welding Bandshell.' },
  { id: 'sat-grab-go-breakfast', day: 'Saturday', date: 'August 1', time: 'Time TBA', title: 'Grab & Go Breakfast', location: 'Location TBA', category: 'Food', description: 'Grab & Go Breakfast on Saturday, August 1.' },
  { id: 'sat-craft-vendor-market', day: 'Saturday', date: 'August 1', time: 'Time TBA', title: 'Craft & Vendor Market', location: 'Downtown Walkerton', category: 'Community', description: 'Craft & Vendor Market in Downtown Walkerton.' },
  { id: 'sat-pickleball-tournament', day: 'Saturday', date: 'August 1', time: 'Time TBA', title: 'Pickleball Tournament', location: 'Location TBA', category: 'Sports', description: 'Pickleball Tournament on Saturday, August 1.' },
  { id: 'sat-car-show', day: 'Saturday', date: 'August 1', time: 'Time TBA', title: 'Car Show', location: 'Location TBA', category: 'Special Events', description: 'Car Show on Saturday, August 1.' },
  { id: 'sat-volleyball-tournament', day: 'Saturday', date: 'August 1', time: 'Time TBA', title: 'Volleyball Tournament', location: 'Location TBA', category: 'Sports', description: 'Volleyball Tournament on Saturday, August 1.' },
  { id: 'sat-bruce-power-funfest', day: 'Saturday', date: 'August 1', time: 'Time TBA', title: 'Bruce Power Funfest', location: 'Location TBA', category: 'Kids', description: 'Bruce Power Funfest on Saturday, August 1.' },
  { id: 'sat-music-whiskey-pines', day: 'Saturday', date: 'August 1', time: 'Time TBA', title: 'Music by Whiskey Pines', location: 'Main Stage', category: 'Music', description: 'Music by Whiskey Pines on Saturday, August 1.' },
  { id: 'sat-tug-of-war', day: 'Saturday', date: 'August 1', time: 'Time TBA', title: 'Tug of War', location: 'Location TBA', category: 'Sports', description: 'Tug of War on Saturday, August 1.' },
  { id: 'sat-beard-growing-competition', day: 'Saturday', date: 'August 1', time: 'Time TBA', title: 'Beard Growing Competition', location: 'Location TBA', category: 'Special Events', description: 'Beard Growing Competition on Saturday, August 1.' },
  { id: 'sat-music-skeleton-crew', day: 'Saturday', date: 'August 1', time: 'Time TBA', title: 'Music by Skeleton Crew', location: 'Main Stage', category: 'Music', description: 'Music by Skeleton Crew on Saturday, August 1.' },
  { id: 'sat-teen-paint-craft', day: 'Saturday', date: 'August 1', time: 'Time TBA', title: 'Teen Paint & Craft', location: 'Location TBA', category: 'Kids', description: 'Teen Paint & Craft on Saturday, August 1.' },
  { id: 'sat-colour-run', day: 'Saturday', date: 'August 1', time: 'Time TBA', title: 'Colour Run', location: 'Location TBA', category: 'Sports', description: 'Colour Run on Saturday, August 1.' },
  { id: 'sat-glow-party', day: 'Saturday', date: 'August 1', time: 'Time TBA', title: 'Glow Party', location: 'Location TBA', category: 'Kids', description: 'Glow Party on Saturday, August 1.' },
  { id: 'sat-roast-beef-dinner', day: 'Saturday', date: 'August 1', time: 'Time TBA', title: 'Roast Beef Dinner', location: 'Location TBA', category: 'Food', description: 'Roast Beef Dinner on Saturday, August 1.' },
  { id: 'sat-music-tommy-youngsteen', day: 'Saturday', date: 'August 1', time: 'Time TBA', title: 'Music by Tommy Youngsteen', location: 'Main Stage', category: 'Music', description: 'Music by Tommy Youngsteen on Saturday, August 1.' },
  { id: 'sun-hot-breakfast', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Hot Breakfast', location: 'Location TBA', category: 'Food', description: 'Hot Breakfast on Sunday, August 2.' },
  { id: 'sun-chair-yoga', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Chair Yoga', location: 'Location TBA', category: 'Community', description: 'Chair Yoga on Sunday, August 2.' },
  { id: 'sun-survivor-walkerton', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Survivor Walkerton', location: 'Location TBA', category: 'Sports', description: 'Survivor Walkerton on Sunday, August 2.' },
  { id: 'sun-road-hockey-tournament', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Road Hockey Tournament', location: 'Location TBA', category: 'Sports', description: 'Road Hockey Tournament on Sunday, August 2.' },
  { id: 'sun-school-open-houses', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'School Open Houses', location: 'Location TBA', category: 'Community', description: 'School Open Houses on Sunday, August 2.' },
  { id: 'sun-cornhole-tournament', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Cornhole Tournament', location: 'Location TBA', category: 'Sports', description: 'Cornhole Tournament on Sunday, August 2.' },
  { id: 'sun-basketball-tournament', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: '3-on-3 Basketball Tournament', location: 'Location TBA', category: 'Sports', description: '3-on-3 Basketball Tournament on Sunday, August 2.' },
  { id: 'sun-baby-races', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Baby Races', location: 'Location TBA', category: 'Kids', description: 'Baby Races on Sunday, August 2.' },
  { id: 'sun-caesar-sunday', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Caesar Sunday', location: 'Location TBA', category: 'Food', description: 'Caesar Sunday on Sunday, August 2.' },
  { id: 'sun-painting-with-cara', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Painting With Cara', location: 'Location TBA', category: 'Community', description: 'Painting With Cara on Sunday, August 2.' },
  { id: 'sun-escape-room', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Escape Room', location: 'Location TBA', category: 'Special Events', description: 'Escape Room on Sunday, August 2.' },
  { id: 'sun-free-swim', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Free Swim', location: 'Location TBA', category: 'Kids', description: 'Free Swim on Sunday, August 2.' },
  { id: 'sun-face-painting', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Face Painting', location: 'Location TBA', category: 'Kids', description: 'Face Painting on Sunday, August 2.' },
  { id: 'sun-dueling-pianos', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Dueling Pianos', location: 'Location TBA', category: 'Music', description: 'Dueling Pianos on Sunday, August 2.' },
  { id: 'sun-dog-show', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Dog Show', location: 'Location TBA', category: 'Special Events', description: 'Dog Show on Sunday, August 2.' },
  { id: 'sun-foam-party', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Foam Party', location: 'Location TBA', category: 'Kids', description: 'Foam Party on Sunday, August 2.' },
  { id: 'sun-cozy-coupe-drift', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Cozy Coupe Drift', location: 'Location TBA', category: 'Kids', description: 'Cozy Coupe Drift on Sunday, August 2.' },
  { id: 'sun-bed-races', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Bed Races', location: 'Location TBA', category: 'Sports', description: 'Bed Races on Sunday, August 2.' },
  { id: 'sun-music-weekend-never-ends', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Music by Weekend Never Ends', location: 'Location TBA', category: 'Music', description: 'Music by Weekend Never Ends on Sunday, August 2.' },
  { id: 'sun-trivia-night', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Trivia Night', location: 'Location TBA', category: 'Community', description: 'Trivia Night on Sunday, August 2.' },
  { id: 'sun-pork-dinner', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Pork Dinner', location: 'Location TBA', category: 'Food', description: 'Pork Dinner on Sunday, August 2.' },
  { id: 'sun-little-rock-dance', day: 'Sunday', date: 'August 2', time: 'Time TBA', title: 'Little Rock Dance', location: 'Location TBA', category: 'Music', description: 'Little Rock Dance on Sunday, August 2.' },
  { id: 'mon-grab-go-breakfast', day: 'Monday', date: 'August 3', time: 'Time TBA', title: 'Grab & Go Breakfast', location: 'Location TBA', category: 'Food', description: 'Grab & Go Breakfast on Monday, August 3.' },
  { id: 'mon-yoga-sound-bath', day: 'Monday', date: 'August 3', time: 'Time TBA', title: 'Yoga Sound Bath', location: 'Location TBA', category: 'Community', description: 'Yoga Sound Bath on Monday, August 3.' },
  { id: 'mon-painting-with-cara', day: 'Monday', date: 'August 3', time: 'Time TBA', title: 'Painting With Cara', location: 'Location TBA', category: 'Community', description: 'Painting With Cara on Monday, August 3.' },
  { id: 'mon-parade', day: 'Monday', date: 'August 3', time: 'Time TBA', title: 'Parade', location: 'Parade Route', category: 'Parade', description: 'Parade on Monday, August 3.' },
  { id: 'mon-music-greg-mclean', day: 'Monday', date: 'August 3', time: 'Time TBA', title: 'Music by Greg McLean', location: 'Main Stage', category: 'Music', description: 'Music by Greg McLean on Monday, August 3.' },
  { id: 'mon-music-andrew-mcveety', day: 'Monday', date: 'August 3', time: 'Time TBA', title: 'Music by Andrew McVeety', location: 'Main Stage', category: 'Music', description: 'Music by Andrew McVeety on Monday, August 3.' },
  { id: 'mon-kids-inflatables', day: 'Monday', date: 'August 3', time: 'Time TBA', title: 'Kids Inflatables', location: 'Location TBA', category: 'Kids', description: 'Kids Inflatables on Monday, August 3.' },
  { id: 'mon-bike-strider-parade', day: 'Monday', date: 'August 3', time: 'Time TBA', title: 'Bike / Strider Parade', location: 'Location TBA', category: 'Kids', description: 'Bike / Strider Parade on Monday, August 3.' },
  { id: 'mon-face-painting', day: 'Monday', date: 'August 3', time: 'Time TBA', title: 'Face Painting', location: 'Location TBA', category: 'Kids', description: 'Face Painting on Monday, August 3.' },
  { id: 'mon-chuckles-the-clown', day: 'Monday', date: 'August 3', time: 'Time TBA', title: 'Chuckles the Clown', location: 'Location TBA', category: 'Kids', description: 'Chuckles the Clown on Monday, August 3.' },
  { id: 'mon-music-born-in-the-eighties', day: 'Monday', date: 'August 3', time: 'Time TBA', title: 'Music by Born in the Eighties', location: 'Main Stage', category: 'Music', description: 'Music by Born in the Eighties on Monday, August 3.' },
  { id: 'mon-pulled-pork-dinner', day: 'Monday', date: 'August 3', time: 'Time TBA', title: 'Pulled Pork Dinner', location: 'Location TBA', category: 'Food', description: 'Pulled Pork Dinner on Monday, August 3.' },
  { id: 'mon-fireworks', day: 'Monday', date: 'August 3', time: 'Time TBA', title: 'Fireworks', location: 'Location TBA', category: 'Special Events', description: 'Fireworks on Monday, August 3.' },
];

const categoryColors: Record<DemoEvent['category'], string> = {
  Music: '#F6008F',
  Kids: '#45DDF0',
  Food: '#74D65E',
  Parade: '#FFD23F',
  Sports: '#3A86FF',
  'Special Events': '#FF9F1C',
  Community: '#16BFD6',
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
      <HomecomingHero
        eyebrow="Schedule"
        title="Weekend Schedule"
        subtitle={`${schedule.length} events across the full Homecoming weekend.`}
      />

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
            <Text style={styles.ticketText}>Filter by music, kids events, food, parade, sports, special events, and community moments.</Text>
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
