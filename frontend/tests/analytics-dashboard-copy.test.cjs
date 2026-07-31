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
  assert.equal(LIST_SECTION_COPY.trafficByHour.title, 'Session Starts by Hour');
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
