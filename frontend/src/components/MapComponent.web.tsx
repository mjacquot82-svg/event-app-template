// © 2026 1001538341 ONTARIO INC. All Rights Reserved.

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '../theme/colors';

const MAP_ASSET = require('../../assets/images/Capture2.png');
const MAP_ASPECT_RATIO = 345 / 468;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.5;

interface MapComponentProps {
  highlightedLocation?: string | null;
  showOnlyHighlighted?: boolean;
  onLocationSelect?: (...args: any[]) => void;
}

const clampZoom = (zoom: number) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));

const MapComponent: React.FC<MapComponentProps> = ({
  highlightedLocation: _highlightedLocation,
  showOnlyHighlighted: _showOnlyHighlighted = false,
  onLocationSelect: _onLocationSelect,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [zoom, setZoom] = useState(1);
  const baseWidth = Math.min(Math.max(windowWidth - 48, 240), 1100);
  const baseHeight = baseWidth / MAP_ASPECT_RATIO;
  const viewerMaxHeight = Math.max(windowHeight - 260, 280);

  const scaledSize = useMemo(
    () => ({
      width: baseWidth * zoom,
      height: baseHeight * zoom,
    }),
    [baseHeight, baseWidth, zoom]
  );

  const updateZoom = (nextZoom: number) => setZoom(clampZoom(nextZoom));

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Walkerton Home Coming 2026</Text>
        <Text style={styles.subtitle}>Site Map</Text>
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.horizontalContent}
        style={[styles.viewer, { maxHeight: viewerMaxHeight }]}
        showsHorizontalScrollIndicator={false}
      >
        <ScrollView
          contentContainerStyle={styles.verticalContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.mapFrame, scaledSize]}>
            <Image
              source={MAP_ASSET}
              style={styles.mapImage}
              resizeMode="contain"
            />
          </View>
        </ScrollView>
      </ScrollView>

      <View style={styles.footerRow}>
        <View style={styles.hintCard}>
          <Feather name="move" size={16} color={colors.textMuted} />
          <Text style={styles.hintText}>Use + / - to zoom and drag to explore the full map.</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => updateZoom(zoom - ZOOM_STEP)}
            activeOpacity={0.85}
          >
            <Feather name="minus" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => updateZoom(1)}
            activeOpacity={0.85}
          >
            <Feather name="maximize-2" size={16} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => updateZoom(zoom + ZOOM_STEP)}
            activeOpacity={0.85}
          >
            <Feather name="plus" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 20,
  },
  headerCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  viewer: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: '#050505',
    borderWidth: 1,
    borderColor: colors.borderLight,
    minHeight: 280,
  },
  horizontalContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  verticalContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  mapFrame: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  footerRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hintCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  hintText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
});

export default MapComponent;
