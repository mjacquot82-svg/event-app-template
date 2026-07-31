const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  APPLICATION_SUMMARY_METRICS,
  JDS_MARKETING_METRICS,
  LAUNCH_METRICS,
  LIST_SECTION_COPY,
  LIVE_ACTIVITY_METRICS,
  SPONSOR_METRICS,
} = require('../src/analytics/dashboardContent.js');
const {
  ANALYTICS_TIME_ZONE,
  formatAnalyticsTimestamp,
} = require('../src/analytics/timezone.js');
const {
  ALL_HOURLY_LABELS,
  normalizeHourlyMetrics,
} = require('../src/analytics/hourlySeries.js');

test('analytics dashboard uses corrected summary and sponsor labels', () => {
  assert.deepEqual(
    APPLICATION_SUMMARY_METRICS.map((metric) => metric.label),
    ['Total Sessions', 'Unique Devices', 'Returning Devices', 'Average Session Duration']
  );

  assert.deepEqual(
    LAUNCH_METRICS.map((metric) => metric.label),
    ['Installed Devices', 'Browser-Only Devices', 'Total Launches', 'Launches Today']
  );

  assert.deepEqual(
    SPONSOR_METRICS.map((metric) => metric.label),
    ['Total Sponsor Page Views', 'Unique Devices on Sponsors', 'Average Sponsor Page Duration']
  );

  assert.equal(LIST_SECTION_COPY.mostSelectedSponsors.title, 'Most Selected Sponsors');
  assert.equal(LIST_SECTION_COPY.trafficByDay.title, 'Session Starts by Day');
  assert.equal(LIST_SECTION_COPY.trafficByHour.title, 'Historical Session Starts by Hour');
});

test('analytics dashboard descriptions explain current metric definitions', () => {
  assert.match(
    APPLICATION_SUMMARY_METRICS[0].description,
    /session-start events/i
  );
  assert.match(
    APPLICATION_SUMMARY_METRICS[1].description,
    /persisted browser\/app storage IDs/i
  );
  assert.match(
    APPLICATION_SUMMARY_METRICS[1].description,
    /not a confirmed count of people/i
  );
  assert.match(
    APPLICATION_SUMMARY_METRICS[2].description,
    /more than one recorded launch/i
  );
  assert.match(
    LAUNCH_METRICS[0].description,
    /one physical device can create multiple IDs/i
  );
  assert.match(
    LAUNCH_METRICS[1].description,
    /never observed in installed mode/i
  );
  assert.match(
    LIVE_ACTIVITY_METRICS[2].description,
    /estimated/i
  );
  assert.match(
    LIVE_ACTIVITY_METRICS[2].description,
    /last 30 minutes/i
  );
  assert.match(
    SPONSOR_METRICS[2].description,
    /not currently collected/i
  );
});

test('JDS Website Clicks is not sponsor-scoped in dashboard copy', () => {
  assert.equal(SPONSOR_METRICS.some((metric) => metric.label === 'JDS Website Clicks'), false);
  assert.equal(JDS_MARKETING_METRICS.some((metric) => metric.label === 'JDS Website Clicks'), true);
  assert.match(
    JDS_MARKETING_METRICS[0].description,
    /app-wide outbound clicks/i
  );
});

test('analytics dashboard exposes operational and historical hourly session sections', () => {
  assert.equal(LIST_SECTION_COPY.todayTrafficByHour.title, "Today's Session Starts by Hour");
  assert.equal(
    LIST_SECTION_COPY.todayTrafficByHour.subtitle,
    "Today's session-start events grouped by local hour in America/Toronto."
  );
  assert.equal(LIST_SECTION_COPY.trafficByHour.title, 'Historical Session Starts by Hour');
  assert.equal(
    LIST_SECTION_COPY.trafficByHour.subtitle,
    'All recorded session-start events grouped by local hour in America/Toronto.'
  );
});

test('dashboard section component does not render duplicate expanded subtitles', () => {
  const analyticsScreenPath = path.join(__dirname, '..', 'app', 'analytics.tsx');
  const analyticsScreenSource = fs.readFileSync(analyticsScreenPath, 'utf8');
  const dashboardSectionStart = analyticsScreenSource.indexOf('function DashboardSection(');
  const dashboardSectionEnd = analyticsScreenSource.indexOf('function formatDuration');
  const dashboardSectionSource = analyticsScreenSource.slice(dashboardSectionStart, dashboardSectionEnd);

  assert.equal(
    dashboardSectionSource.includes('<Text style={styles.sectionSubtitle}>{subtitle}</Text>'),
    false
  );
});

test('analytics dashboard renders both today and historical hourly session sections', () => {
  const analyticsScreenPath = path.join(__dirname, '..', 'app', 'analytics.tsx');
  const analyticsScreenSource = fs.readFileSync(analyticsScreenPath, 'utf8');

  assert.match(analyticsScreenSource, /LIST_SECTION_COPY\.todayTrafficByHour\.title/);
  assert.match(analyticsScreenSource, /items=\{todayTrafficByHour\}/);
  assert.match(analyticsScreenSource, /normalizeHourlyMetrics\(stats\?\.todayTrafficByHour\)/);
  assert.match(analyticsScreenSource, /LIST_SECTION_COPY\.trafficByHour\.title/);
});

test('hourly metric normalizer always returns all 24 hours with zero-filled gaps', () => {
  const metrics = normalizeHourlyMetrics([
    { label: '08:00', value: 3 },
    { label: '20:00', value: 1 },
  ]);

  assert.deepEqual(metrics.map((metric) => metric.label), ALL_HOURLY_LABELS);
  assert.equal(metrics.length, 24);
  assert.equal(metrics[8].value, 3);
  assert.equal(metrics[20].value, 1);
  assert.equal(metrics[0].value, 0);
  assert.equal(metrics[23].value, 0);
});

test('hourly metric normalizer reflects current-day updates when new values arrive', () => {
  const initialMetrics = normalizeHourlyMetrics([{ label: '09:00', value: 1 }]);
  const refreshedMetrics = normalizeHourlyMetrics([
    { label: '09:00', value: 2 },
    { label: '10:00', value: 1 },
  ]);

  assert.equal(initialMetrics[9].value, 1);
  assert.equal(initialMetrics[10].value, 0);
  assert.equal(refreshedMetrics[9].value, 2);
  assert.equal(refreshedMetrics[10].value, 1);
});

test('analytics timestamps are presented in America/Toronto with DST-aware offsets', () => {
  assert.equal(ANALYTICS_TIME_ZONE, 'America/Toronto');

  const winterTimestamp = formatAnalyticsTimestamp('2026-01-15T17:00:00+00:00');
  assert.match(winterTimestamp, /Jan/);
  assert.match(winterTimestamp, /12:00:00 p\.m\./i);
  assert.match(winterTimestamp, /EST/);

  const summerTimestamp = formatAnalyticsTimestamp('2026-07-15T16:00:00+00:00');
  assert.match(summerTimestamp, /Jul/);
  assert.match(summerTimestamp, /12:00:00 p\.m\./i);
  assert.match(summerTimestamp, /EDT/);
});
