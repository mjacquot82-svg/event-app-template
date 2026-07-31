export type HourlyMetric = {
  label: string;
  value: number;
  type?: string;
};

export const ALL_HOURLY_LABELS: string[];
export function normalizeHourlyMetrics(
  items?: HourlyMetric[] | null,
): HourlyMetric[];
