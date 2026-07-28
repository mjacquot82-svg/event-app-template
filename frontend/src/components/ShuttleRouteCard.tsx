import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { EventMapDefinition } from '../data/maps';

const CYAN = '#16BFD6';
const BUS_ROUTE_ASPECT_RATIO = 1199 / 1312;

type ShuttleRouteCardProps = {
  map: EventMapDefinition;
  onOpen: (map: EventMapDefinition) => void;
};

export default function ShuttleRouteCard({ map, onOpen }: ShuttleRouteCardProps) {
  const { width: windowWidth } = useWindowDimensions();
  const imageWidth = Math.min(windowWidth - 64, 760);
  const imageHeight = imageWidth / BUS_ROUTE_ASPECT_RATIO;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${map.title}`}
      onPress={() => onOpen(map)}
      style={({ pressed }) => [styles.imageCard, pressed && styles.imageCardPressed]}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.sectionIconWrap, { backgroundColor: CYAN }]}>
          <Feather name="map" size={18} color="#051014" />
        </View>
        <View style={styles.cardHeaderCopy}>
          <Text style={styles.cardEyebrow}>Shuttle route</Text>
          <Text style={styles.cardTitle}>Bus Route</Text>
        </View>
      </View>

      <View style={styles.imageWrap}>
        <Image
          source={map.asset}
          style={[styles.routeImage, { width: imageWidth, height: imageHeight }]}
          resizeMode="contain"
        />
        <View style={styles.imageOverlay} pointerEvents="none" />
        <View style={[styles.mapBadge, { backgroundColor: map.accentColor }]} pointerEvents="none">
          <Feather name="maximize-2" size={14} color="#050505" />
          <Text style={styles.mapBadgeText}>Open Map</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  imageCard: {
    borderRadius: 20,
    backgroundColor: '#15171B',
    padding: 20,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  imageCardPressed: {
    opacity: 0.94,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  cardHeaderCopy: { flex: 1 },
  cardEyebrow: { color: '#98A2AF', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: '900', color: '#fff' },
  sectionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrap: {
    position: 'relative',
    alignItems: 'center',
  },
  routeImage: {
    alignSelf: 'center',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 16,
  },
  mapBadge: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  mapBadgeText: {
    color: '#050505',
    fontSize: 12,
    fontWeight: '900',
  },
});
