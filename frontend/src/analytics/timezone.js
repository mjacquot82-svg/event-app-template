const ANALYTICS_TIME_ZONE = 'America/Toronto';

function formatAnalyticsTimestamp(value) {
  if (!value) {
    return 'No data yet';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ANALYTICS_TIME_ZONE,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).format(parsed);
}

module.exports = {
  ANALYTICS_TIME_ZONE,
  formatAnalyticsTimestamp,
};
