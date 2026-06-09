// © 2026 1001538341 ONTARIO INC. All Rights Reserved.

import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
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
  const { width: windowWidth } = useWindowDimensions();
  const imageWidth = windowWidth >= 1024 ? '82%' : '100%';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[styles.imageCard, { width: imageWidth }]}
      >
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
    paddingTop: 0,
    paddingBottom: 120,
  },
  imageCard: {
    alignSelf: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: undefined,
    aspectRatio: MAP_ASPECT_RATIO,
    backgroundColor: '#000000',
  },
});

export default MapComponent;
