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
import themeColors from '../src/theme/colors';
import appConfig from '../src/data/eventConfig';
import { parseJsonResponse } from '../src/utils/fetchJson';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';
const ANALYTICS_APP_ID = 'walkerton-homecoming';
const REFRESH_INTERVAL_MS = 30_000;

type AnalyticsStatsResponse = {
  appId: string;
  totalLaunches: number;
  uniqueDevices: number;
  installedDevices: number;
  browserOnlyDevices: number;
  launchesToday: number;
};

type MetricCardProps = {
  label: string;
  value: number;
  accentColor: string;
};

function MetricCard({ label, value, accentColor }: MetricCardProps) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricAccent, { backgroundColor: accentColor }]} />
      <Text style={styles.metricValue}>{value.toLocaleString()}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export default function AnalyticsDashboardScreen() {
  const { width } = useWindowDimensions();
  const [stats, setStats] = useState<AnalyticsStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSuccessfulRefresh, setLastSuccessfulRefresh] = useState<Date | null>(null);

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

  const metrics = [
    {
      label: 'Unique Devices',
      value: stats?.uniqueDevices ?? 0,
      accentColor: themeColors.primary,
    },
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
            <Text style={styles.subtitle}>Anonymous launch metrics for one application.</Text>

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

              <View style={[styles.metricsGrid, !isCompact && styles.metricsGridWide]}>
                {metrics.map((metric) => (
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
    fontSize: 16,
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
    backgroundColor: themeColors.surfaceElevated,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  statusLabel: {
    color: themeColors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  statusValue: {
    color: themeColors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  refreshButton: {
    alignSelf: 'flex-start',
    backgroundColor: themeColors.primary,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  refreshButtonPressed: {
    opacity: 0.88,
  },
  refreshButtonDisabled: {
    opacity: 0.7,
  },
  refreshButtonText: {
    color: '#001014',
    fontSize: 15,
    fontWeight: '800',
  },
  loadingCard: {
    backgroundColor: themeColors.surface,
    borderRadius: 24,
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  loadingText: {
    marginTop: 14,
    color: themeColors.textSecondary,
    fontSize: 15,
  },
  alertCard: {
    backgroundColor: 'rgba(246, 0, 143, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(246, 0, 143, 0.35)',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  alertTitle: {
    color: themeColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  alertText: {
    color: themeColors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  metricsGrid: {
    flexDirection: 'column',
    gap: 14,
  },
  metricsGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -7,
  },
  metricColumn: {
    width: '100%',
  },
  metricColumnWide: {
    width: '50%',
    paddingHorizontal: 7,
    marginBottom: 14,
  },
  metricCard: {
    backgroundColor: themeColors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: themeColors.border,
    paddingHorizontal: 18,
    paddingVertical: 18,
    minHeight: 146,
    justifyContent: 'space-between',
  },
  metricAccent: {
    width: 42,
    height: 6,
    borderRadius: 999,
    marginBottom: 18,
  },
  metricValue: {
    color: themeColors.textPrimary,
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 10,
  },
  metricLabel: {
    color: themeColors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
});
