import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import themeColors from '../src/theme/colors';
import appConfig from '../src/data/eventConfig';
import { parseJsonResponse } from '../src/utils/fetchJson';
import { eventMaps, type MapAnalyticsKey } from '../src/data/maps';
import { getAnalyticsConfig } from '../src/analytics/analyticsConfig';

const { apiBaseUrl: API_BASE_URL, appId: ANALYTICS_APP_ID } = getAnalyticsConfig();
const REFRESH_INTERVAL_MS = 30_000;

type AnalyticsListMetric = {
  label: string;
  value: number;
  type?: string;
};

type AnalyticsStatsResponse = {
  appId: string;
  totalLaunches: number;
  uniqueDevices: number;
  installedDevices: number;
  browserOnlyDevices: number;
  launchesToday: number;
  mapOpens?: Partial<Record<MapAnalyticsKey, number>>;
  totalSessions?: number;
  uniqueVisitors?: number;
  returningVisitors?: number;
  averageSessionDurationSeconds?: number;
  mostVisitedPages?: AnalyticsListMetric[];
  mostUsedQuickActions?: AnalyticsListMetric[];
  mostViewedMaps?: AnalyticsListMetric[];
  mostViewedScheduleEvents?: AnalyticsListMetric[];
  mostClickedExternalLinks?: AnalyticsListMetric[];
  trafficByDay?: AnalyticsListMetric[];
  trafficByHour?: AnalyticsListMetric[];
  liveActivity?: {
    lastEventName?: string | null;
    lastEventAt?: string | null;
    lastPageViewed?: string | null;
    lastMapOpened?: string | null;
    lastQuickActionOpened?: string | null;
    activeSessions?: number;
    eventsReceivedLastMinute?: number;
    eventsReceivedLastFiveMinutes?: number;
  };
  totalSponsorPageViews?: number;
  uniqueVisitorsToSponsors?: number;
  averageTimeSpentOnSponsorsPageSeconds?: number | null;
  mostViewedSponsors?: AnalyticsListMetric[];
  jdsWebsiteClicks?: number;
};

type MetricCardProps = {
  label: string;
  value: number | string;
  accentColor: string;
};

type ListSectionProps = {
  title: string;
  subtitle: string;
  items: AnalyticsListMetric[];
  emptyLabel: string;
};

type DashboardSectionKey =
  | 'overview'
  | 'live'
  | 'visitor'
  | 'navigation'
  | 'schedule'
  | 'maps'
  | 'sponsors'
  | 'jds'
  | 'external'
  | 'system';

type DashboardSectionProps = {
  title: string;
  subtitle: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

function MetricCard({ label, value, accentColor }: MetricCardProps) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricAccent, { backgroundColor: accentColor }]} />
      <Text style={styles.metricValue}>{typeof value === 'number' ? value.toLocaleString() : value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function ListSection({ title, subtitle, items, emptyLabel }: ListSectionProps) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{emptyLabel}</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {items.map((item, index) => (
            <View
              key={`${title}-${item.label}-${item.type || 'default'}-${index}`}
              style={[styles.listRow, index < items.length - 1 && styles.listRowBorder]}
            >
              <View style={styles.listRowText}>
                <Text style={styles.listRowLabel}>{item.label}</Text>
                {item.type ? <Text style={styles.listRowMeta}>{item.type}</Text> : null}
              </View>
              <Text style={styles.listRowValue}>{item.value.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function DashboardSection({
  title,
  subtitle,
  expanded,
  onToggle,
  children,
}: DashboardSectionProps) {
  return (
    <View style={styles.sectionCard}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={onToggle}
        style={({ pressed }) => [
          styles.sectionHeaderButton,
          pressed && styles.sectionHeaderButtonPressed,
        ]}
      >
        <View style={styles.sectionHeaderCopy}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSubtitleCompact}>{subtitle}</Text>
        </View>
        <View style={styles.sectionHeaderIcon}>
          <Feather
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={themeColors.textPrimary}
          />
        </View>
      </Pressable>

      {expanded ? (
        <View style={styles.sectionBody}>
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
          {children}
        </View>
      ) : null}
    </View>
  );
}

function formatDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) {
    return '0m';
  }

  const roundedSeconds = Math.round(seconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const remainingSeconds = roundedSeconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

function formatTimestamp(value?: string | null): string {
  if (!value) {
    return 'No data yet';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString();
}

export default function AnalyticsDashboardScreen() {
  const { width } = useWindowDimensions();
  const [stats, setStats] = useState<AnalyticsStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSuccessfulRefresh, setLastSuccessfulRefresh] = useState<Date | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<DashboardSectionKey, boolean>>({
    overview: true,
    live: true,
    visitor: false,
    navigation: false,
    schedule: false,
    maps: false,
    sponsors: false,
    jds: false,
    external: false,
    system: false,
  });

  const isCompact = width < 720;

  const fetchAnalytics = async (mode: 'initial' | 'manual' | 'poll' = 'manual') => {
    if (mode === 'initial') {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const endpoint = `${API_BASE_URL}/api/analytics/stats?appId=${encodeURIComponent(ANALYTICS_APP_ID)}`;
      const response = await fetch(endpoint);
      const data = await parseJsonResponse<AnalyticsStatsResponse>(response, endpoint);
      setStats(data);
      setError(null);
      setLastSuccessfulRefresh(new Date());
    } catch (err) {
      console.error('Error fetching analytics stats:', err);
      setError('Unable to load analytics right now.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchAnalytics('initial');

    const interval = setInterval(() => {
      void fetchAnalytics('poll');
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const applicationSummaryMetrics = [
    {
      label: 'Total Sessions',
      value: stats?.totalSessions ?? stats?.totalLaunches ?? 0,
      accentColor: themeColors.accent,
    },
    {
      label: 'Unique Visitors',
      value: stats?.uniqueVisitors ?? stats?.uniqueDevices ?? 0,
      accentColor: themeColors.primary,
    },
    {
      label: 'Returning Visitors',
      value: stats?.returningVisitors ?? 0,
      accentColor: themeColors.utility,
    },
    {
      label: 'Average Session Duration',
      value: formatDuration(stats?.averageSessionDurationSeconds),
      accentColor: themeColors.warning,
    },
  ];

  const launchMetrics = [
    {
      label: 'Installed Devices',
      value: stats?.installedDevices ?? 0,
      accentColor: themeColors.utility,
    },
    {
      label: 'Browser Only Devices',
      value: stats?.browserOnlyDevices ?? 0,
      accentColor: themeColors.warning,
    },
    {
      label: 'Total Launches',
      value: stats?.totalLaunches ?? 0,
      accentColor: themeColors.accent,
    },
    {
      label: 'Launches Today',
      value: stats?.launchesToday ?? 0,
      accentColor: themeColors.primaryLight,
    },
  ];

  const mapMetrics = eventMaps.map((map) => ({
    label: map.title,
    value:
      stats?.mostViewedMaps?.find((metric) => metric.label === map.title)?.value ??
      stats?.mapOpens?.[map.id] ??
      0,
    accentColor: map.accentColor,
  }));

  const liveActivityMetrics = [
    {
      label: 'Last Analytics Event',
      value: stats?.liveActivity?.lastEventName || 'No data yet',
      accentColor: themeColors.primary,
    },
    {
      label: 'Last Event Received',
      value: formatTimestamp(stats?.liveActivity?.lastEventAt),
      accentColor: themeColors.utility,
    },
    {
      label: 'Active Sessions',
      value: stats?.liveActivity?.activeSessions ?? 0,
      accentColor: themeColors.accent,
    },
    {
      label: 'Events Last Minute',
      value: stats?.liveActivity?.eventsReceivedLastMinute ?? 0,
      accentColor: themeColors.warning,
    },
    {
      label: 'Events Last Five Minutes',
      value: stats?.liveActivity?.eventsReceivedLastFiveMinutes ?? 0,
      accentColor: themeColors.primaryLight,
    },
    {
      label: 'JDS Website Clicks',
      value: stats?.jdsWebsiteClicks ?? 0,
      accentColor: themeColors.primary,
    },
  ];

  const sponsorMetrics = [
    {
      label: 'Total Sponsor Page Views',
      value: stats?.totalSponsorPageViews ?? 0,
      accentColor: themeColors.primary,
    },
    {
      label: 'Unique Visitors to Sponsors',
      value: stats?.uniqueVisitorsToSponsors ?? 0,
      accentColor: themeColors.utility,
    },
    {
      label: 'Average Sponsor Page Duration',
      value: stats?.averageTimeSpentOnSponsorsPageSeconds
        ? formatDuration(stats.averageTimeSpentOnSponsorsPageSeconds)
        : 'Not available',
      accentColor: themeColors.warning,
    },
    {
      label: 'JDS Website Clicks',
      value: stats?.jdsWebsiteClicks ?? 0,
      accentColor: themeColors.accent,
    },
  ];

  const jdsMarketingMetrics = [
    {
      label: 'JDS Website Clicks',
      value: stats?.jdsWebsiteClicks ?? 0,
      accentColor: themeColors.primary,
    },
  ];

  const toggleSection = (section: DashboardSectionKey) => {
    setExpandedSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.heroCard}>
            <Text style={styles.eyebrow}>JDS Analytics</Text>
            <Text style={styles.title}>{appConfig.appName}</Text>
            <Text style={styles.subtitle}>Anonymous engagement metrics for one application.</Text>

            <View style={[styles.statusRow, isCompact && styles.statusRowCompact]}>
              <View style={styles.statusBlock}>
                <Text style={styles.statusLabel}>App ID</Text>
                <Text style={styles.statusValue}>{ANALYTICS_APP_ID}</Text>
              </View>
              <View style={styles.statusBlock}>
                <Text style={styles.statusLabel}>Last Successful Refresh</Text>
                <Text style={styles.statusValue}>
                  {lastSuccessfulRefresh
                    ? lastSuccessfulRefresh.toLocaleString()
                    : 'Waiting for first refresh'}
                </Text>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => void fetchAnalytics('manual')}
              style={({ pressed }) => [
                styles.refreshButton,
                pressed && styles.refreshButtonPressed,
                refreshing && styles.refreshButtonDisabled,
              ]}
              disabled={refreshing}
            >
              <Text style={styles.refreshButtonText}>
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Text>
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={themeColors.primary} />
              <Text style={styles.loadingText}>Loading analytics...</Text>
            </View>
          ) : (
            <>
              {error ? (
                <View style={styles.alertCard}>
                  <Text style={styles.alertTitle}>Dashboard refresh issue</Text>
                  <Text style={styles.alertText}>{error}</Text>
                </View>
              ) : null}

              <DashboardSection
                title="Dashboard Overview"
                subtitle="High-level session and visitor activity across the application."
                expanded={expandedSections.overview}
                onToggle={() => toggleSection('overview')}
              >
                <View style={[styles.metricsGrid, !isCompact && styles.metricsGridWide]}>
                  {applicationSummaryMetrics.map((metric) => (
                    <View
                      key={metric.label}
                      style={[styles.metricColumn, !isCompact && styles.metricColumnWide]}
                    >
                      <MetricCard
                        label={metric.label}
                        value={metric.value}
                        accentColor={metric.accentColor}
                      />
                    </View>
                  ))}
                </View>
              </DashboardSection>

              <DashboardSection
                title="Live Activity"
                subtitle="Operational visibility using the existing dashboard refresh cycle."
                expanded={expandedSections.live}
                onToggle={() => toggleSection('live')}
              >
                <View style={[styles.metricsGrid, !isCompact && styles.metricsGridWide]}>
                  {liveActivityMetrics.map((metric) => (
                    <View
                      key={metric.label}
                      style={[styles.metricColumn, !isCompact && styles.metricColumnWide]}
                    >
                      <MetricCard
                        label={metric.label}
                        value={metric.value}
                        accentColor={metric.accentColor}
                      />
                    </View>
                  ))}
                </View>

                <View style={styles.liveSummaryBlock}>
                  <Text style={styles.liveSummaryText}>
                    Last page viewed: {stats?.liveActivity?.lastPageViewed || 'No data yet'}
                  </Text>
                  <Text style={styles.liveSummaryText}>
                    Last map opened: {stats?.liveActivity?.lastMapOpened || 'No data yet'}
                  </Text>
                  <Text style={styles.liveSummaryText}>
                    Last quick action opened: {stats?.liveActivity?.lastQuickActionOpened || 'No data yet'}
                  </Text>
                </View>
              </DashboardSection>

              <DashboardSection
                title="Visitor Analytics"
                subtitle="Traffic and audience trends across sessions and devices."
                expanded={expandedSections.visitor}
                onToggle={() => toggleSection('visitor')}
              >
                <View style={[styles.metricsGrid, !isCompact && styles.metricsGridWide]}>
                  {launchMetrics.map((metric) => (
                    <View
                      key={metric.label}
                      style={[styles.metricColumn, !isCompact && styles.metricColumnWide]}
                    >
                      <MetricCard
                        label={metric.label}
                        value={metric.value}
                        accentColor={metric.accentColor}
                      />
                    </View>
                  ))}
                </View>

                <ListSection
                  title="Traffic by Day"
                  subtitle="Usage volume grouped by calendar day."
                  items={stats?.trafficByDay ?? []}
                  emptyLabel="No daily traffic data available yet."
                />

                <ListSection
                  title="Traffic by Hour"
                  subtitle="Usage volume grouped by hour of day."
                  items={stats?.trafficByHour ?? []}
                  emptyLabel="No hourly traffic data available yet."
                />
              </DashboardSection>

              <DashboardSection
                title="Navigation Analytics"
                subtitle="How visitors move through core pages and quick-entry actions."
                expanded={expandedSections.navigation}
                onToggle={() => toggleSection('navigation')}
              >
                <ListSection
                  title="Most Visited Pages"
                  subtitle="Which core pages visitors opened most often."
                  items={stats?.mostVisitedPages ?? []}
                  emptyLabel="No page-view data available yet."
                />

                <ListSection
                  title="Most Used Quick Actions"
                  subtitle="Quick actions visitors opened from the home experience."
                  items={stats?.mostUsedQuickActions ?? []}
                  emptyLabel="No quick-action data available yet."
                />
              </DashboardSection>

              <DashboardSection
                title="Schedule Analytics"
                subtitle="Schedule detail engagement and event interest."
                expanded={expandedSections.schedule}
                onToggle={() => toggleSection('schedule')}
              >
                <ListSection
                  title="Most Viewed Schedule Events"
                  subtitle="Event detail views from the schedule."
                  items={stats?.mostViewedScheduleEvents ?? []}
                  emptyLabel="No schedule event views available yet."
                />
              </DashboardSection>

              <DashboardSection
                title="Map Analytics"
                subtitle="Map usage totals and ranking across the app."
                expanded={expandedSections.maps}
                onToggle={() => toggleSection('maps')}
              >
                <View style={[styles.metricsGrid, !isCompact && styles.metricsGridWide]}>
                  {mapMetrics.map((metric) => (
                    <View
                      key={metric.label}
                      style={[styles.metricColumn, !isCompact && styles.metricColumnWide]}
                    >
                      <MetricCard
                        label={metric.label}
                        value={metric.value}
                        accentColor={metric.accentColor}
                      />
                    </View>
                  ))}
                </View>

                <ListSection
                  title="Most Viewed Maps"
                  subtitle="Top map opens across the app."
                  items={stats?.mostViewedMaps ?? []}
                  emptyLabel="No map analytics available yet."
                />
              </DashboardSection>

              <DashboardSection
                title="Sponsor Analytics"
                subtitle="Sponsor page traffic and sponsor selection engagement."
                expanded={expandedSections.sponsors}
                onToggle={() => toggleSection('sponsors')}
              >
                <View style={[styles.metricsGrid, !isCompact && styles.metricsGridWide]}>
                  {sponsorMetrics.map((metric) => (
                    <View
                      key={metric.label}
                      style={[styles.metricColumn, !isCompact && styles.metricColumnWide]}
                    >
                      <MetricCard
                        label={metric.label}
                        value={metric.value}
                        accentColor={metric.accentColor}
                      />
                    </View>
                  ))}
                </View>

                <ListSection
                  title="Most Viewed Sponsors"
                  subtitle="Sponsors selected from the Sponsors page."
                  items={stats?.mostViewedSponsors ?? []}
                  emptyLabel="No sponsor selections available yet."
                />
              </DashboardSection>

              <DashboardSection
                title="JDS Marketing"
                subtitle="Business-case metrics tied to JDS Studio traffic generation."
                expanded={expandedSections.jds}
                onToggle={() => toggleSection('jds')}
              >
                <View style={[styles.metricsGrid, !isCompact && styles.metricsGridWide]}>
                  {jdsMarketingMetrics.map((metric) => (
                    <View
                      key={metric.label}
                      style={[styles.metricColumn, !isCompact && styles.metricColumnWide]}
                    >
                      <MetricCard
                        label={metric.label}
                        value={metric.value}
                        accentColor={metric.accentColor}
                      />
                    </View>
                  ))}
                </View>
              </DashboardSection>

              <DashboardSection
                title="External Links"
                subtitle="Outbound destination activity across links opened from the app."
                expanded={expandedSections.external}
                onToggle={() => toggleSection('external')}
              >
                <ListSection
                  title="Most Clicked External Links"
                  subtitle="Outbound destinations visitors tapped most often."
                  items={stats?.mostClickedExternalLinks ?? []}
                  emptyLabel="No external link activity available yet."
                />
              </DashboardSection>

              <DashboardSection
                title="System Information"
                subtitle="Application metadata and compatibility-oriented launch context."
                expanded={expandedSections.system}
                onToggle={() => toggleSection('system')}
              >
                <View style={[styles.statusRow, isCompact && styles.statusRowCompact, styles.systemStatusRow]}>
                  <View style={styles.statusBlock}>
                    <Text style={styles.statusLabel}>App ID</Text>
                    <Text style={styles.statusValue}>{ANALYTICS_APP_ID}</Text>
                  </View>
                  <View style={styles.statusBlock}>
                    <Text style={styles.statusLabel}>Last Successful Refresh</Text>
                    <Text style={styles.statusValue}>
                      {lastSuccessfulRefresh
                        ? lastSuccessfulRefresh.toLocaleString()
                        : 'Waiting for first refresh'}
                    </Text>
                  </View>
                </View>

                <View style={[styles.metricsGrid, !isCompact && styles.metricsGridWide]}>
                  {launchMetrics.map((metric) => (
                    <View
                      key={`${metric.label}-system`}
                      style={[styles.metricColumn, !isCompact && styles.metricColumnWide]}
                    >
                      <MetricCard
                        label={metric.label}
                        value={metric.value}
                        accentColor={metric.accentColor}
                      />
                    </View>
                  ))}
                </View>
              </DashboardSection>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  container: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
  },
  heroCard: {
    backgroundColor: themeColors.surface,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: themeColors.border,
    marginBottom: 18,
  },
  eyebrow: {
    color: themeColors.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    color: themeColors.textPrimary,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: themeColors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 18,
  },
  statusRowCompact: {
    flexDirection: 'column',
  },
  statusBlock: {
    flex: 1,
    backgroundColor: themeColors.backgroundElevated,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  statusLabel: {
    color: themeColors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  statusValue: {
    color: themeColors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  refreshButton: {
    alignSelf: 'flex-start',
    backgroundColor: themeColors.primary,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  refreshButtonPressed: {
    opacity: 0.9,
  },
  refreshButtonDisabled: {
    opacity: 0.6,
  },
  refreshButtonText: {
    color: themeColors.buttonText,
    fontSize: 14,
    fontWeight: '800',
  },
  loadingCard: {
    backgroundColor: themeColors.surface,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: themeColors.border,
    alignItems: 'center',
    gap: 14,
  },
  loadingText: {
    color: themeColors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  alertCard: {
    backgroundColor: themeColors.surface,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: themeColors.warning,
    marginBottom: 18,
  },
  alertTitle: {
    color: themeColors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  alertText: {
    color: themeColors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionCard: {
    backgroundColor: themeColors.surface,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: themeColors.border,
    marginBottom: 18,
  },
  sectionHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  sectionHeaderButtonPressed: {
    opacity: 0.9,
  },
  sectionHeaderCopy: {
    flex: 1,
  },
  sectionHeaderIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themeColors.backgroundElevated,
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  sectionBody: {
    marginTop: 16,
  },
  sectionTitle: {
    color: themeColors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  sectionSubtitleCompact: {
    color: themeColors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionSubtitle: {
    color: themeColors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  metricsGridWide: {
    marginHorizontal: -8,
  },
  metricColumn: {
    width: '100%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  metricColumnWide: {
    width: '50%',
    paddingHorizontal: 8,
  },
  metricCard: {
    backgroundColor: themeColors.backgroundElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: themeColors.border,
    paddingHorizontal: 18,
    paddingVertical: 18,
    minHeight: 124,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  metricAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
  },
  metricValue: {
    color: themeColors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  metricLabel: {
    color: themeColors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  listContainer: {
    backgroundColor: themeColors.backgroundElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: themeColors.border,
    overflow: 'hidden',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  listRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border,
  },
  listRowText: {
    flex: 1,
  },
  listRowLabel: {
    color: themeColors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  listRowMeta: {
    color: themeColors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  listRowValue: {
    color: themeColors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  emptyState: {
    backgroundColor: themeColors.backgroundElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: themeColors.border,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  emptyStateText: {
    color: themeColors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  liveSummaryBlock: {
    backgroundColor: themeColors.backgroundElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: themeColors.border,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  liveSummaryText: {
    color: themeColors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 8,
  },
  systemStatusRow: {
    marginBottom: 18,
  },
});
