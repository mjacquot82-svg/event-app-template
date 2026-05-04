// © 2026 1001538341 ONTARIO INC. All Rights Reserved.

import React from 'react';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, View, Platform, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../src/theme/colors';
import AdBanner from '../../src/components/AdBanner';
import adCampaignsConfig from '../../src/config/AdCampaignsConfig';

const ICON_SIZE = 24;
const NAV_ICONS_HEIGHT = 68;
const AD_SECTION_HEIGHT = 58;
const APP_BLACK = '#000000';
const NAV_BLACK = '#090909';

const visibleTabs = ['index', 'schedule', 'leaderboard', 'about'];

function getIconName(routeName: string): keyof typeof Feather.glyphMap {
  switch (routeName) {
    case 'index': return 'home';
    case 'schedule': return 'calendar';
    case 'leaderboard': return 'bar-chart-2';
    case 'about': return 'award';
    default: return 'circle';
  }
}

function getLabel(routeName: string): string {
  switch (routeName) {
    case 'index': return 'Home';
    case 'schedule': return 'Schedule';
    case 'leaderboard': return 'Highlights';
    case 'about': return 'About';
    default: return routeName;
  }
}

function getTabColor(routeName: string, isFocused: boolean) {
  if (isFocused) return colors.accent;
  switch (routeName) {
    case 'index': return '#16BFD6';
    case 'schedule': return '#74D65E';
    case 'leaderboard': return '#FFD23F';
    case 'about': return '#45DDF0';
    default: return '#8B95A1';
  }
}

function EmptyTabBar() {
  return null;
}

function TabItem({ routeName }: { routeName: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const iconName = getIconName(routeName);
  const label = getLabel(routeName);
  const isFocused = (pathname === '/' && routeName === 'index') || pathname === `/${routeName}` || pathname.startsWith(`/${routeName}/`);
  const tabColor = getTabColor(routeName, isFocused);

  const onPress = () => {
    router.push(routeName === 'index' ? '/' : `/${routeName}`);
  };

  return (
    <TouchableOpacity style={styles.tabItem} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.iconPill, isFocused && styles.iconPillActive]}>
        <Feather name={iconName} size={ICON_SIZE} color={tabColor} />
      </View>
      <Text style={[styles.tabLabel, { color: isFocused ? colors.accent : '#D1D5DB' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const topInset = insets.top || 0;
  const bottomInset = Platform.OS === 'web' ? 0 : insets.bottom || 0;
  const topAdHeight = adCampaignsConfig.topBanner.enabled ? 98 : 0;
  const bottomAdEnabled = adCampaignsConfig.bottomBanner.enabled;
  const totalBottomBarHeight = (bottomAdEnabled ? AD_SECTION_HEIGHT : 0) + NAV_ICONS_HEIGHT + bottomInset;

  return (
    <View style={styles.root}>
      {adCampaignsConfig.topBanner.enabled && (
        <View style={[styles.topAdWrapper, { paddingTop: topInset }]}>
          <AdBanner adUnit={adCampaignsConfig.topBanner} position="top" />
        </View>
      )}

      <View style={[styles.contentArea, { marginTop: topAdHeight + topInset }]}>
        <Tabs tabBar={() => <EmptyTabBar />} screenOptions={{ headerShown: false }} sceneContainerStyle={styles.scene}>
          <Tabs.Screen name="index" options={{ title: 'Home' }} />
          <Tabs.Screen name="map" options={{ title: 'Map', href: null }} />
          <Tabs.Screen name="schedule" options={{ title: 'Schedule' }} />
          <Tabs.Screen name="leaderboard" options={{ title: 'Highlights' }} />
          <Tabs.Screen name="about" options={{ title: 'About' }} />
        </Tabs>
      </View>

      <View style={[styles.combinedBottomBar, { height: totalBottomBarHeight, paddingBottom: bottomInset }]}> 
        {bottomAdEnabled && (
          <View style={styles.adSection}>
            <AdBanner adUnit={adCampaignsConfig.bottomBanner} position="bottom" />
          </View>
        )}
        <View style={styles.iconsSection}>
          {visibleTabs.map((routeName) => <TabItem key={routeName} routeName={routeName} />)}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: APP_BLACK },
  topAdWrapper: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: APP_BLACK },
  contentArea: { flex: 1, backgroundColor: APP_BLACK },
  scene: { flex: 1, backgroundColor: APP_BLACK },
  combinedBottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: NAV_BLACK, borderTopWidth: 1, borderTopColor: '#1F2937', zIndex: 100 },
  adSection: { alignItems: 'center', paddingVertical: 4, backgroundColor: APP_BLACK },
  iconsSection: { flexDirection: 'row', height: NAV_ICONS_HEIGHT, paddingTop: 8, backgroundColor: NAV_BLACK },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconPill: { width: 38, height: 30, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  iconPillActive: { backgroundColor: 'rgba(246, 0, 143, 0.16)', borderWidth: 1, borderColor: 'rgba(246, 0, 143, 0.55)' },
  tabLabel: { fontSize: 10, fontWeight: '800', marginTop: 3 },
});
