// © 2026 1001538341 ONTARIO INC. All Rights Reserved.

import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapComponent from '../../src/components/MapComponent';
import colors from '../../src/theme/colors';
import HomecomingHero from '../../src/components/HomecomingHero';

export default function MapScreen() {
  // Get location parameter from navigation
  const { location, showOnly } = useLocalSearchParams<{ location?: string; showOnly?: string }>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <HomecomingHero
        eyebrow="Map"
        title="Festival Grounds"
        subtitle="Find key locations, venue areas, and event destinations around Walkerton."
      />
      <View style={styles.mapWrap}>
        <MapComponent 
          highlightedLocation={location || null} 
          showOnlyHighlighted={showOnly === 'true'}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapWrap: {
    flex: 1,
  },
});
