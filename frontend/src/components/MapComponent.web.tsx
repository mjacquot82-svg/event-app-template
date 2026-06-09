// © 2026 1001538341 ONTARIO INC. All Rights Reserved.

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import colors from '../theme/colors';

const MAP_ASSET = require('../../assets/images/Capture2.png');

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
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <Text style={styles.title}>Walkerton Home Coming 2026</Text>
        <Text style={styles.subtitle}>Site Map</Text>
      </View>

      <View style={styles.imageCard}>
        <Image
          source={MAP_ASSET}
          style={styles.mapImage}
          resizeMode="contain"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 120,
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
  imageCard: {
    borderRadius: 24,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 345 / 468,
    backgroundColor: '#000000',
  },
});

export default MapComponent;
