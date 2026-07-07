// © 2026 1001538341 ONTARIO INC.
import React, { useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Pressable,
  Animated,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { eventConfig } from '../../src/data/eventConfig';
import { productionHomeEvents, type ProductionHomeEvent } from '../../src/data/productionSchedule';
import { colors } from '../../src/theme/colors';
import HomecomingHero from '../../src/components/HomecomingHero';

const categoryColors: Record<ProductionHomeEvent['category'], string> = {
  Music: '#F6008F',
  Kids: '#45DDF0',
  Parade: '#FFD23F',
  Food: '#74D65E',
  Community: '#16BFD6',
  Merch: '#FFFFFF',
};

function getDaysUntil(dateString: string) {
  const target = new Date(`${dateString}T00:00:00`);
  const today = new Date();
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
}

function getCurrentOrNextEvents() {
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  const todayEvents = productionHomeEvents.filter((event) => event.date === todayKey);
  if (todayEvents.length > 0) return { title: 'Happening Today', events: todayEvents.slice(0, 3) };

  const next = productionHomeEvents.find((event) => new Date(`${event.date}T23:59:59`) >= today);
  if (!next) return { title: 'Weekend Highlights', events: productionHomeEvents.slice(-3) };

  const nextEvents = productionHomeEvents.filter((event) => event.date === next.date).slice(0, 3);
  const label = new Date(`${next.date}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  return { title: `Coming Up: ${label}`, events: nextEvents };
}

function openExternalUrl(url: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  Linking.openURL(url);
}

type ActionItem = {
  id: string;
  label: string;
  icon: string;
  color: string;
  route?: string;
  url?: string;
};

function ActionCard({
  action,
  onPress,
  compact,
}: {
  action: ActionItem;
  onPress: () => void;
  compact?: boolean;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const iconSize = compact ? 18 : 20;
  const iconColor = action.color === '#FFD23F' ? '#111111' : '#FFFFFF';

  return (
    <Animated.View style={[compact ? styles.compactActionShell : styles.actionShell, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()}
        style={({ pressed }) => [
          compact ? styles.compactActionCard : styles.actionCard,
          pressed ? styles.actionCardPressed : null,
        ]}
      >
        <View style={compact ? styles.compactActionContent : styles.actionContent}>
          <View style={[styles.actionIconWrap, { backgroundColor: action.color }]}>
            <View style={[styles.actionIconFrame, compact ? styles.compactActionIconFrame : null]}>
              <Feather
                name={action.icon as any}
                size={iconSize}
                color={iconColor}
                style={[styles.actionIcon, compact ? styles.compactActionIcon : null]}
              />
            </View>
          </View>
          <Text style={compact ? styles.compactActionLabel : styles.actionLabel}>{action.label}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 960;
  const contentMaxWidth = isWide ? 1080 : 760;
  const days = getDaysUntil('2026-07-30');
  const dynamicEvents = useMemo(() => getCurrentOrNextEvents(), []);

  const actionsById = useMemo(
    () =>
      Object.fromEntries(
        eventConfig.homeActions.map((item) => [item.id, item])
      ) as Record<string, ActionItem>,
    []
  );

  const mainActions: ActionItem[] = [
    actionsById.tickets,
    {
      id: 'schedule',
      label: 'Day Schedule',
      icon: 'calendar',
      color: colors.accent,
      route: '/(tabs)/schedule',
    },
    actionsById['visitor-info'],
    actionsById.sponsors,
    actionsById.facebook,
    actionsById.instagram,
  ];

  const merchAction = actionsById.merch;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.page, { maxWidth: contentMaxWidth }]}>
        <HomecomingHero title="Home" />

        <View style={styles.detailsCard}>
          <View style={styles.detailsRow}>
            <Feather name="calendar" size={18} color={colors.primary} />
            <Text style={styles.detailText}>July 30 – August 3, 2026</Text>
          </View>
          <View style={styles.detailsRow}>
            <Feather name="map-pin" size={18} color={colors.accentLight} />
            <Text style={styles.detailText}>Walkerton, Ontario</Text>
          </View>
          <Text style={styles.detailsSummary}>{eventConfig.event.description}</Text>
        </View>

        <View style={styles.countdownCard}>
          <Text style={styles.countdownEyebrow}>Countdown</Text>
          <View style={styles.countdownValueRow}>
            <Text style={styles.countdownNumber}>{days}</Text>
            <Text style={styles.countdownLabel}>days until homecoming</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderContent}>
              <Text style={styles.sectionEyebrow}>Coming Up</Text>
              <Text style={styles.sectionTitle}>{dynamicEvents.title}</Text>
            </View>
            <Pressable style={styles.scheduleLink} onPress={() => router.push('/(tabs)/schedule')}>
              <Text style={styles.scheduleLinkText}>View schedule</Text>
              <Feather name="arrow-right" size={16} color={colors.primary} />
            </Pressable>
          </View>

          <View style={styles.eventsList}>
            {dynamicEvents.events.map((event, index) => (
              <View key={event.id} style={[styles.eventRow, index < dynamicEvents.events.length - 1 ? styles.eventRowBorder : null]}>
                <View style={[styles.eventCategoryMarker, { backgroundColor: categoryColors[event.category] }]} />
                <View style={styles.eventTimeBlock}>
                  <Text style={styles.eventTime}>{event.time}</Text>
                  <Text style={styles.eventCategory}>{event.category}</Text>
                </View>
                <Text style={styles.eventTitle}>{event.title}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionsSection}>
          <Text style={styles.sectionEyebrow}>Plan Your Weekend</Text>
          <Text style={styles.actionsTitle}>Everything you need, organized for the weekend.</Text>

          <View style={styles.actionsGrid}>
            {mainActions.map((action) => (
              <ActionCard
                key={action.id}
                action={action}
                onPress={() => {
                  if (action.route) router.push(action.route);
                  if (action.url) openExternalUrl(action.url);
                }}
              />
            ))}
          </View>

          {merchAction ? (
            <View style={styles.compactActionRow}>
              <ActionCard
                action={merchAction}
                compact
                onPress={() => {
                  if (merchAction.route) router.push(merchAction.route);
                  if (merchAction.url) openExternalUrl(merchAction.url);
                }}
              />
            </View>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 120,
  },
  page: {
    width: '100%',
    alignSelf: 'center',
  },
  detailsCard: {
    borderRadius: 22,
    backgroundColor: '#0E0E10',
    paddingHorizontal: 22,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  detailText: {
    color: '#F4F5F7',
    fontSize: 17,
    fontWeight: '800',
    marginLeft: 9,
    textAlign: 'center',
  },
  detailsSummary: {
    marginTop: 10,
    color: '#C8CDD4',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 760,
  },
  countdownCard: {
    borderRadius: 22,
    backgroundColor: '#111214',
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1E2229',
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  countdownEyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  countdownValueRow: {
    alignItems: 'center',
  },
  countdownNumber: {
    color: colors.utility,
    fontSize: 48,
    lineHeight: 52,
    fontWeight: '900',
  },
  countdownLabel: {
    color: '#EBEEF2',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionCard: {
    borderRadius: 22,
    backgroundColor: '#0F1012',
    padding: 22,
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 18,
  },
  sectionHeaderContent: {
    flex: 1,
    minWidth: 0,
  },
  sectionEyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
    maxWidth: 520,
  },
  scheduleLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
    maxWidth: '100%',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: 'rgba(22, 191, 214, 0.12)',
  },
  scheduleLinkText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  eventsList: {
    borderRadius: 18,
    backgroundColor: '#15171B',
    overflow: 'hidden',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  eventRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#232730',
  },
  eventCategoryMarker: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginRight: 14,
  },
  eventTimeBlock: {
    width: 88,
    marginRight: 12,
  },
  eventTime: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  eventCategory: {
    color: '#98A2AF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 3,
    letterSpacing: 0.4,
  },
  eventTitle: {
    flex: 1,
    color: '#E5E7EB',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
  actionsSection: {
    marginBottom: 8,
  },
  actionsTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
    marginBottom: 16,
    maxWidth: 540,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionShell: {
    width: '48.4%',
    marginBottom: 14,
  },
  actionCard: {
    minHeight: 134,
    borderRadius: 22,
    backgroundColor: '#14161A',
    paddingHorizontal: 18,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#252B34',
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  actionCardPressed: {
    opacity: 0.94,
  },
  actionContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  actionIconFrame: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactActionIconFrame: {
    width: 18,
    height: 18,
  },
  actionIcon: {
    lineHeight: 20,
    textAlign: 'center',
    includeFontPadding: false,
  },
  compactActionIcon: {
    lineHeight: 18,
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  compactActionRow: {
    marginTop: 2,
  },
  compactActionShell: {
    width: '100%',
  },
  compactActionCard: {
    borderRadius: 18,
    backgroundColor: '#14161A',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 108,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#252B34',
    shadowColor: '#000000',
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  compactActionContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactActionLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
});
