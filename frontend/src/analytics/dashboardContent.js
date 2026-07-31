const SECTION_COPY = {
  overview: {
    title: 'Dashboard Overview',
    subtitle: 'Recorded session starts and persisted device activity across the application.',
  },
  live: {
    title: 'Live Activity',
    subtitle: 'Operational visibility from recent analytics events and estimated live activity.',
  },
  visitor: {
    title: 'Visitor Analytics',
    subtitle: 'Device-level traffic and launch trends across recorded sessions.',
  },
  navigation: {
    title: 'Navigation Analytics',
    subtitle: 'How visitors move through tracked pages and quick-entry actions.',
  },
  schedule: {
    title: 'Schedule Analytics',
    subtitle: 'Schedule detail engagement and event interest.',
  },
  maps: {
    title: 'Map Analytics',
    subtitle: 'Map usage totals and ranking across the app.',
  },
  sponsors: {
    title: 'Sponsor Analytics',
    subtitle: 'Sponsor page traffic and sponsor selection engagement.',
  },
  jds: {
    title: 'JDS Marketing',
    subtitle: 'App-wide engagement tied to JDS Studio traffic generation.',
  },
  external: {
    title: 'External Links',
    subtitle: 'Outbound destination activity across links opened from the app.',
  },
  system: {
    title: 'System Information',
    subtitle: 'Application metadata and compatibility-oriented launch context.',
  },
};

const APPLICATION_SUMMARY_METRICS = [
  {
    key: 'totalSessions',
    label: 'Total Sessions',
    description: 'Recorded session-start events captured by the analytics service.',
  },
  {
    key: 'uniqueDevices',
    label: 'Unique Devices',
    description:
      'Unique persisted browser/app storage IDs, not a confirmed count of people. Best estimate of total app users. Actual people may be slightly lower because one person can use multiple devices or browsers.',
  },
  {
    key: 'returningDevices',
    label: 'Returning Devices',
    description: 'Device IDs with more than one recorded launch.',
  },
  {
    key: 'averageSessionDuration',
    label: 'Average Session Duration',
  },
];

const LAUNCH_METRICS = [
  {
    key: 'installedDevices',
    label: 'Installed Devices',
    description: 'Device IDs observed in installed mode. One physical device can create multiple IDs.',
  },
  {
    key: 'browserOnlyDevices',
    label: 'Browser-Only Devices',
    description: 'Device IDs never observed in installed mode.',
  },
  {
    key: 'totalLaunches',
    label: 'Total Launches',
  },
  {
    key: 'launchesToday',
    label: 'Launches Today',
  },
];

const LIVE_ACTIVITY_METRICS = [
  {
    key: 'lastAnalyticsEvent',
    label: 'Last Analytics Event',
  },
  {
    key: 'lastEventReceived',
    label: 'Last Event Received',
  },
  {
    key: 'activeSessions',
    label: 'Active Sessions',
    description: 'Estimated from analytics activity during the last 30 minutes.',
  },
  {
    key: 'eventsLastMinute',
    label: 'Events Last Minute',
  },
  {
    key: 'eventsLastFiveMinutes',
    label: 'Events Last Five Minutes',
  },
];

const SPONSOR_METRICS = [
  {
    key: 'totalSponsorPageViews',
    label: 'Total Sponsor Page Views',
  },
  {
    key: 'uniqueDevicesOnSponsors',
    label: 'Unique Devices on Sponsors',
    description: 'Unique persisted browser/app storage IDs that recorded sponsor page views.',
  },
  {
    key: 'averageSponsorPageDuration',
    label: 'Average Sponsor Page Duration',
    description: 'Not available because sponsor duration tracking is not currently collected.',
  },
];

const JDS_MARKETING_METRICS = [
  {
    key: 'jdsWebsiteClicks',
    label: 'JDS Website Clicks',
    description: 'App-wide outbound clicks to the JDS Studio website.',
  },
];

const LIST_SECTION_COPY = {
  trafficByDay: {
    title: 'Session Starts by Day',
    subtitle: 'Recorded session-start events grouped by calendar day.',
    emptyLabel: 'No daily session-start data available yet.',
  },
  todayTrafficByHour: {
    title: "Today's Session Starts by Hour",
    subtitle: "Today's session-start events grouped by local hour in America/Toronto.",
    emptyLabel: 'No session starts recorded for today yet.',
  },
  trafficByHour: {
    title: 'Historical Session Starts by Hour',
    subtitle: 'All recorded session-start events grouped by local hour in America/Toronto.',
    emptyLabel: 'No hourly session-start data available yet.',
  },
  mostVisitedPages: {
    title: 'Most Visited Pages',
    subtitle: 'Tracked pages opened most often.',
    emptyLabel: 'No page-view data available yet.',
  },
  mostUsedQuickActions: {
    title: 'Most Used Quick Actions',
    subtitle: 'Quick actions visitors opened from the home experience.',
    emptyLabel: 'No quick-action data available yet.',
  },
  mostViewedScheduleEvents: {
    title: 'Most Viewed Schedule Events',
    subtitle: 'Event detail views from the schedule.',
    emptyLabel: 'No schedule event views available yet.',
  },
  mostViewedMaps: {
    title: 'Most Viewed Maps',
    subtitle: 'Top map opens across the app.',
    emptyLabel: 'No map analytics available yet.',
  },
  mostSelectedSponsors: {
    title: 'Most Selected Sponsors',
    subtitle: 'Sponsors selected from the Sponsors page.',
    emptyLabel: 'No sponsor selections available yet.',
  },
  mostClickedExternalLinks: {
    title: 'Most Clicked External Links',
    subtitle: 'Outbound destinations visitors tapped most often.',
    emptyLabel: 'No external link activity available yet.',
  },
};

module.exports = {
  APPLICATION_SUMMARY_METRICS,
  JDS_MARKETING_METRICS,
  LAUNCH_METRICS,
  LIST_SECTION_COPY,
  LIVE_ACTIVITY_METRICS,
  SECTION_COPY,
  SPONSOR_METRICS,
};
