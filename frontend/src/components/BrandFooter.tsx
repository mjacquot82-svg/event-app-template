// © 2026 1001538341 ONTARIO INC. All Rights Reserved.

import React from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { eventConfig } from '../data/eventConfig';
import { colors } from '../theme/colors';

const TAB_BAR_HEIGHT = 68;

export default function BrandFooter() {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'web' ? 0 : insets.bottom || 0;

  return (
    <View style={[styles.footer, { paddingBottom: 24 + TAB_BAR_HEIGHT + bottomInset }]}>
      <Text style={styles.label}>{eventConfig.footer.builtByLabel}</Text>
      <Text style={styles.company}>{eventConfig.footer.companyName}</Text>
      <Pressable
        accessibilityRole="link"
        onPress={() => Linking.openURL(eventConfig.footer.websiteUrl)}
        style={styles.linkWrap}
      >
        <Text style={styles.link}>{eventConfig.footer.websiteLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    marginTop: 28,
    paddingHorizontal: 16,
  },
  label: {
    color: colors.textMuted,
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
  },
  company: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  linkWrap: {
    marginTop: 4,
  },
  link: {
    color: colors.accent,
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
  },
});
