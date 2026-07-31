const ALL_HOURLY_LABELS = Array.from({ length: 24 }, (_, hour) =>
  `${String(hour).padStart(2, '0')}:00`
);

function normalizeHourlyMetrics(items) {
  const metricsByLabel = new Map(
    Array.isArray(items)
      ? items.map((item) => [item.label, item])
      : []
  );

  return ALL_HOURLY_LABELS.map((label) => {
    const metric = metricsByLabel.get(label);

    return {
      label,
      value: typeof metric?.value === 'number' ? metric.value : 0,
      type: metric?.type,
    };
  });
}

module.exports = {
  ALL_HOURLY_LABELS,
  normalizeHourlyMetrics,
};
