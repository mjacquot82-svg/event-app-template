// © 2026 1001538341 ONTARIO INC. All Rights Reserved.

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
} from 'react-native';
import colors from '../theme/colors';

const MAP_ASSET = require('../../assets/images/Capture2.png');
const MAP_ASPECT_RATIO = 345 / 468;

interface MapComponentProps {
  highlightedLocation?: string | null;
  showOnlyHighlighted?: boolean;
  onLocationSelect?: (...args: any[]) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  highlightedLocation: _highlightedLocation,
  showOnlyHighlighted: _showOnlyHighlighted = false,
  onLocationSelect: _onLocationSelect,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const baseWidth = Math.min(Math.max(windowWidth - 48, 240), 1100);
  const baseHeight = baseWidth / MAP_ASPECT_RATIO;
  const viewerMaxHeight = Math.max(windowHeight - 260, 280);

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Walkerton Home Coming 2026</Text>
        <Text style={styles.subtitle}>Site Map</Text>
      </View>

      <View style={[styles.viewer, { maxHeight: viewerMaxHeight }]}>
        <View style={[styles.mapFrame, { width: baseWidth, height: baseHeight }]}>
          <Image
            source={MAP_ASSET}
            style={styles.mapImage}
            resizeMode="contain"
          />
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
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default MapComponent;
