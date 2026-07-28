// © 2026 1001538341 ONTARIO INC.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import PageBannerHeader from '../../src/components/PageBannerHeader';
import BrandFooter from '../../src/components/BrandFooter';
import { productionSchedule, type ProductionScheduleEvent } from '../../src/data/productionSchedule';
import { getAnalyticsConfig } from '../../src/analytics/analyticsConfig';
import { trackScheduleEventViewed, trackScheduleFilterSelected } from '../../src/analytics/jdsAnalytics';
import { usePageAnalytics } from '../../src/analytics/usePageAnalytics';

const categoryColors: Record<ProductionScheduleEvent['category'], string> = {
  Music: '#F6008F',
  Family: '#45DDF0',
  Food: '#74D65E',
  'Sports & Games': '#3A86FF',
  'Community Events': '#16BFD6',
};

export default function ScheduleScreen() {
  usePageAnalytics('Schedule', { openEventName: 'schedule_opened' });
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDay, setSelectedDay] = useState<string>('All Days');
  const [selectedEvent, setSelectedEvent] = useState<ProductionScheduleEvent | null>(null);
  const hasTrackedInitialCategory = useRef(false);
  const hasTrackedInitialDay = useRef(false);
  const analyticsConfig = getAnalyticsConfig();
  const categories = ['All', ...Array.from(new Set(productionSchedule.map((event) => event.category)))];
  const days = ['All Days', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday'];
  const filteredEvents = productionSchedule.filter((event) => {
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesDay = selectedDay === 'All Days' || event.day === selectedDay;
    return matchesCategory && matchesDay;
  });

  const grouped = useMemo(() => filteredEvents.reduce((acc, event) => {
    const key = `${event.day}, ${event.date}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {} as Record<string, ProductionScheduleEvent[]>), [filteredEvents]);

  useEffect(() => {
    if (selectedEvent) {
      void trackScheduleEventViewed(analyticsConfig, {
        eventId: selectedEvent.id,
        eventTitle: selectedEvent.title,
        category: selectedEvent.category,
      });
    }
  }, [analyticsConfig, selectedEvent]);

  useEffect(() => {
    if (!hasTrackedInitialCategory.current) {
      hasTrackedInitialCategory.current = true;
      return;
    }

    void trackScheduleFilterSelected(analyticsConfig, {
      filterType: 'category',
      filterValue: selectedCategory,
    });
  }, [analyticsConfig, selectedCategory]);

  useEffect(() => {
    if (!hasTrackedInitialDay.current) {
      hasTrackedInitialDay.current = true;
      return;
    }

    void trackScheduleFilterSelected(analyticsConfig, {
      filterType: 'day',
      filterValue: selectedDay,
    });
  }, [analyticsConfig, selectedDay]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.page}>
          <PageBannerHeader maxWidth={1080} />

          <View style={styles.introCard}>
            <Text style={styles.eyebrow}>Schedule</Text>
            <Text style={styles.pageTitle}>Weekend Schedule</Text>
            <Text style={styles.pageSubtitle}>{productionSchedule.length} events across the full Homecoming weekend.</Text>
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
            <View style={styles.filterDivider} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {days.map((day) => {
                const active = day === selectedDay;
                return (
                  <TouchableOpacity key={day} style={[styles.filterPill, active && styles.filterPillActive]} onPress={() => setSelectedDay(day)}>
                    <Text style={[styles.filterText, active && styles.filterTextActive]}>{day}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.content}>
            <View style={styles.ticketCallout}>
              <Feather name="calendar" size={20} color="#000" />
              <View style={{ flex: 1 }}>
                <Text style={styles.ticketTitle}>Plan the weekend your way</Text>
                <Text style={styles.ticketText}>Filter by music, family activities, food, sports and games, community events, and day.</Text>
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
          </View>

          <BrandFooter />
        </View>
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
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  scrollContent: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 12 },
  page: { width: '100%', maxWidth: 1080, alignSelf: 'center' },
  introCard: {
    borderRadius: 22,
    backgroundColor: '#0F1012',
    paddingHorizontal: 22,
    paddingVertical: 22,
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  eyebrow: { color: '#16BFD6', fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  pageTitle: { color: '#FFFFFF', fontSize: 24, lineHeight: 28, fontWeight: '900' },
  pageSubtitle: { color: '#C8CDD4', fontSize: 14, lineHeight: 21, marginTop: 8, maxWidth: 640 },
  filterWrap: { backgroundColor: '#0F1012', borderRadius: 22, marginBottom: 14, shadowColor: '#000000', shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: { width: 0, height: 10 }, elevation: 5 },
  filterScroll: { paddingHorizontal: 16, paddingVertical: 16 },
  filterDivider: { height: 1, backgroundColor: '#252525', marginHorizontal: 16 },
  filterPill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, backgroundColor: '#15171B', marginRight: 8, borderWidth: 1, borderColor: '#252525' },
  filterPillActive: { backgroundColor: '#74D65E', borderColor: '#74D65E' },
  filterText: { fontSize: 13, color: '#D1D5DB', fontWeight: '800' },
  filterTextActive: { color: '#000' },
  content: { backgroundColor: 'transparent' },
  ticketCallout: { flexDirection: 'row', gap: 12, backgroundColor: '#74D65E', borderRadius: 22, padding: 18, marginBottom: 18, shadowColor: '#000000', shadowOpacity: 0.14, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  ticketTitle: { color: '#000', fontSize: 15, fontWeight: '900' },
  ticketText: { color: '#061207', fontSize: 12, lineHeight: 17, marginTop: 4 },
  daySection: { marginBottom: 22 },
  dayTitle: { fontSize: 19, fontWeight: '900', color: '#fff', marginBottom: 10 },
  eventCard: { flexDirection: 'row', backgroundColor: '#111214', borderRadius: 20, overflow: 'hidden', marginBottom: 12, borderWidth: 1, shadowColor: '#000000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  colorBar: { width: 5 },
  eventBody: { flex: 1, padding: 16 },
  eventTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventTime: { color: '#74D65E', fontSize: 13, fontWeight: '900' },
  categoryBadge: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  eventTitle: { fontSize: 16, fontWeight: '900', color: '#fff', marginTop: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  locationText: { color: '#B7BDC7', fontSize: 12, fontWeight: '600' },
  eventDescription: { color: '#D1D5DB', fontSize: 13, lineHeight: 18, marginTop: 7 },
  sponsorLine: { color: '#16BFD6', fontSize: 12, fontWeight: '900', marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#111214', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, minHeight: 320, borderTopWidth: 2, borderColor: '#74D65E' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  modalTitle: { flex: 1, fontSize: 22, fontWeight: '900', color: '#fff' },
  modalMeta: { color: '#74D65E', fontWeight: '900', marginTop: 12 },
  modalLocation: { color: '#D1D5DB', marginTop: 6, fontWeight: '700' },
  modalDescription: { color: '#D1D5DB', fontSize: 15, lineHeight: 22, marginTop: 16 },
  modalSponsor: { color: '#16BFD6', fontSize: 14, fontWeight: '900', marginTop: 16 },
});
