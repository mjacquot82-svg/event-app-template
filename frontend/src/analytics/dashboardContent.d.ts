export type MetricCopy = {
  key: string;
  label: string;
  description?: string;
};

export type SectionCopy = {
  title: string;
  subtitle: string;
};

export type ListSectionCopy = {
  title: string;
  subtitle: string;
  emptyLabel: string;
};

export const SECTION_COPY: Record<string, SectionCopy>;
export const APPLICATION_SUMMARY_METRICS: MetricCopy[];
export const LAUNCH_METRICS: MetricCopy[];
export const LIVE_ACTIVITY_METRICS: MetricCopy[];
export const SPONSOR_METRICS: MetricCopy[];
export const JDS_MARKETING_METRICS: MetricCopy[];
export const LIST_SECTION_COPY: Record<string, ListSectionCopy>;
