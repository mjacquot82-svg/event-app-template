// © 2026 1001538341 ONTARIO INC.

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GOLD = '#FFD23F';

export default function SponsorsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Sponsors</Text>
          <Text style={styles.subtitle}>Our community partners and supporters</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Sponsors</Text>

          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderText}>Sponsor logos will appear here</Text>
          </View>

          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderText}>Gold / Silver / Bronze tiers</Text>
          </View>

        </View>

        <View style={styles.bottomPadding} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    paddingBottom: 220,
  },
  header: {
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: GOLD,
    backgroundColor: '#1A1400',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
  },
  subtitle: {
    color: '#D1D5DB',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 12,
  },
  placeholderCard: {
    height: 140,
    borderRadius: 16,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: GOLD,
  },
  placeholderText: {
    color: GOLD,
    fontWeight: '800',
  },
  bottomPadding: {
    height: 160,
  },
});
