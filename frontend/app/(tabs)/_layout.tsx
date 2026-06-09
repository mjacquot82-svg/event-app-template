// © 2026 1001538341 ONTARIO INC. All Rights Reserved.

import React from 'react';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, View, Platform, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../src/theme/colors';

const ICON_SIZE = 24;
const NAV_ICONS_HEIGHT = 68;
const APP_BLACK = '#000000';
const NAV_BLACK = '#090909';

const visibleTabs = ['index', 'schedule', 'map', 'about'];

function getIconName(routeName: string): keyof typeof Feather.glyphMap {
  switch (routeName) {
    case 'index': return 'home';
    case 'schedule': return 'calendar';
    case 'map': return 'map';
    case 'about': return 'award';
    default: return 'circle';
  }
}

function getLabel(routeName: string): string {
  switch (routeName) {
    case 'index': return 'Home';
    case 'schedule': return 'Schedule';
    case 'map': return 'Map';
    case 'about': return 'About';
    default: return routeName;
  }
}

function getTabColor(routeName: string, isFocused: boolean) {
  if (isFocused) return colors.accent;
  switch (routeName) {
    case 'index': return '#16BFD6';
    case 'schedule': return '#74D65E';
    case 'map': return '#FFD23F';
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
    router.push(routeName === 'index' ? '/(tabs)' : `/(tabs)/${routeName}`);
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
  const bottomInset = Platform.OS === 'web' ? 0 : insets.bottom || 0;
  const totalBottomBarHeight = NAV_ICONS_HEIGHT + bottomInset;

  return (
    <View style={styles.root}>
      <View style={styles.contentArea}>
        <Tabs tabBar={() => <EmptyTabBar />} screenOptions={{ headerShown: false }} sceneContainerStyle={styles.scene}>
          <Tabs.Screen name="index" options={{ title: 'Home' }} />
          <Tabs.Screen name="map" options={{ title: 'Map' }} />
          <Tabs.Screen name="schedule" options={{ title: 'Schedule' }} />
          <Tabs.Screen name="leaderboard" options={{ title: 'Highlights', href: null }} />
          <Tabs.Screen name="about" options={{ title: 'About' }} />
          <Tabs.Screen name="sponsors" options={{ title: 'Sponsors', href: null }} />
        </Tabs>
      </View>

      <View style={[styles.combinedBottomBar, { height: totalBottomBarHeight, paddingBottom: bottomInset }]}> 
        <View style={styles.iconsSection}>
          {visibleTabs.map((routeName) => <TabItem key={routeName} routeName={routeName} />)}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: APP_BLACK },
  contentArea: { flex: 1, backgroundColor: APP_BLACK },
  scene: { flex: 1, backgroundColor: APP_BLACK },
  combinedBottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: NAV_BLACK, borderTopWidth: 1, borderTopColor: '#1F2937', zIndex: 100 },
  iconsSection: { flexDirection: 'row', height: NAV_ICONS_HEIGHT, paddingTop: 8, backgroundColor: NAV_BLACK },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconPill: { width: 38, height: 30, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  iconPillActive: { backgroundColor: 'rgba(246, 0, 143, 0.16)', borderWidth: 1, borderColor: 'rgba(246, 0, 143, 0.55)' },
  tabLabel: { fontSize: 10, fontWeight: '800', marginTop: 3 },
});
