import { Platform } from 'react-native';

const DEVICE_ID_STORAGE_KEY = 'jds_device_id';
const SESSION_ID_STORAGE_KEY = 'jds_session_id';
const SESSION_STARTED_AT_STORAGE_KEY = 'jds_session_started_at';
const ANALYTICS_EVENT_ENDPOINT = '/api/analytics/event';

export type JdsAnalyticsConfig = {
  apiBaseUrl: string;
  appId: string;
  appVersion: string;
};

export type AnalyticsPropertyValue = string | number | boolean | null;

export type MapOpenPayload = {
  deviceId: string;
  sessionId: string;
  appId: string;
  appVersion: string;
  installed: boolean;
  launchMode: 'browser_launch' | 'installed_pwa_launch';
  mapId: string;
  mapName: string;
  timestamp: string;
};

type LaunchPayload = {
  deviceId: string;
  appId: string;
  appVersion: string;
  installed: boolean;
  timestamp: string;
};

export type AnalyticsEventPayload = {
  deviceId: string;
  sessionId: string;
  appId: string;
  appVersion: string;
  installed: boolean;
  launchMode: 'browser_launch' | 'installed_pwa_launch';
  timestamp: string;
  eventName: string;
  properties: Record<string, AnalyticsPropertyValue>;
};

let sessionEndListenersRegistered = false;
let sessionEndTracked = false;

function canUseWebStorage(): boolean {
  return Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = Math.random() * 16 | 0;
    const value = character === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export function detectInstalledPwa(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return false;
  }

  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };

  return Boolean(
    window.matchMedia?.('(display-mode: standalone)').matches ||
    navigatorWithStandalone.standalone ||
    document.referrer.startsWith('android-app://')
  );
}

export function getLaunchMode(): 'browser_launch' | 'installed_pwa_launch' {
  return detectInstalledPwa() ? 'installed_pwa_launch' : 'browser_launch';
}

export function getOrCreateDeviceId(): string | null {
  if (!canUseWebStorage()) {
    return null;
  }

  const existingDeviceId = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
  if (existingDeviceId) {
    return existingDeviceId;
  }

  const deviceId = generateUuid();
  window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
  return deviceId;
}

export function getOrCreateSessionId(): string | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') {
    return null;
  }

  const existingSessionId = window.sessionStorage.getItem(SESSION_ID_STORAGE_KEY);
  if (existingSessionId) {
    return existingSessionId;
  }

  const sessionId = generateUuid();
  window.sessionStorage.setItem(SESSION_ID_STORAGE_KEY, sessionId);
  return sessionId;
}

function getSessionStartedAt(): number | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(SESSION_STARTED_AT_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  const parsedValue = Number(rawValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function setSessionStartedAt(timestampMs: number): void {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(SESSION_STARTED_AT_STORAGE_KEY, String(timestampMs));
}

function clearSessionStartedAt(): void {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(SESSION_STARTED_AT_STORAGE_KEY);
}

function buildLaunchPayload(config: JdsAnalyticsConfig, deviceId: string): LaunchPayload {
  return {
    deviceId,
    appId: config.appId,
    appVersion: config.appVersion,
    installed: detectInstalledPwa(),
    timestamp: new Date().toISOString(),
  };
}

function buildAnalyticsEventPayload(
  config: JdsAnalyticsConfig,
  deviceId: string,
  sessionId: string,
  eventName: string,
  properties: Record<string, AnalyticsPropertyValue>
): AnalyticsEventPayload {
  return {
    deviceId,
    sessionId,
    appId: config.appId,
    appVersion: config.appVersion,
    installed: detectInstalledPwa(),
    launchMode: getLaunchMode(),
    timestamp: new Date().toISOString(),
    eventName,
    properties,
  };
}

function postWithBeacon(endpoint: string, payload: unknown): boolean {
  if (Platform.OS !== 'web' || typeof navigator === 'undefined' || typeof navigator.sendBeacon !== 'function') {
    return false;
  }

  try {
    return navigator.sendBeacon(endpoint, new Blob([JSON.stringify(payload)], { type: 'application/json' }));
  } catch (error) {
    console.error('JDS analytics beacon send failed:', error);
    return false;
  }
}

async function postJson(endpoint: string, payload: unknown): Promise<Response> {
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function trackAppLaunch(config: JdsAnalyticsConfig): Promise<void> {
  const deviceId = getOrCreateDeviceId();
  const sessionId = getOrCreateSessionId();
  if (!deviceId || !sessionId) {
    return;
  }

  const hasTrackedSessionStart = getSessionStartedAt() !== null;
  if (!hasTrackedSessionStart) {
    setSessionStartedAt(Date.now());

    const payload = buildLaunchPayload(config, deviceId);
    const endpoint = `${config.apiBaseUrl}/api/analytics/launch`;

    try {
      const response = await postJson(endpoint, payload);

      if (!response.ok) {
        console.warn(`JDS Analytics: launch tracking failed (HTTP ${response.status})`);
      }
    } catch (error) {
      console.error('JDS analytics launch tracking failed:', error);
    }

    await trackAnalyticsEvent(config, 'session_started', {
      launchMode: getLaunchMode(),
    });
  }

  registerSessionEndTracking(config);
}

export async function trackMapOpen(
  config: JdsAnalyticsConfig,
  map: { id: string; title: string }
): Promise<void> {
  const deviceId = getOrCreateDeviceId();
  const sessionId = getOrCreateSessionId();
  if (!deviceId || !sessionId) {
    return;
  }

  const endpoint = `${config.apiBaseUrl}/api/analytics/map-open`;
  const payload: MapOpenPayload = {
    deviceId,
    sessionId,
    appId: config.appId,
    appVersion: config.appVersion,
    installed: detectInstalledPwa(),
    launchMode: getLaunchMode(),
    mapId: map.id,
    mapName: map.title,
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await postJson(endpoint, payload);

    if (!response.ok) {
      console.warn(`JDS Analytics: map open tracking failed (HTTP ${response.status})`);
    }
  } catch (error) {
    console.error('JDS analytics map open tracking failed:', error);
  }
}

export async function trackAnalyticsEvent(
  config: JdsAnalyticsConfig,
  eventName: string,
  properties: Record<string, AnalyticsPropertyValue> = {},
  options: { useBeacon?: boolean } = {}
): Promise<void> {
  const deviceId = getOrCreateDeviceId();
  const sessionId = getOrCreateSessionId();
  if (!deviceId || !sessionId) {
    return;
  }

  const endpoint = `${config.apiBaseUrl}${ANALYTICS_EVENT_ENDPOINT}`;
  const payload = buildAnalyticsEventPayload(config, deviceId, sessionId, eventName, properties);

  if (options.useBeacon && postWithBeacon(endpoint, payload)) {
    return;
  }

  try {
    const response = await postJson(endpoint, payload);
    if (!response.ok) {
      console.warn(`JDS Analytics: ${eventName} tracking failed (HTTP ${response.status})`);
    }
  } catch (error) {
    console.error(`JDS analytics ${eventName} tracking failed:`, error);
  }
}

function registerSessionEndTracking(config: JdsAnalyticsConfig): void {
  if (sessionEndListenersRegistered || Platform.OS !== 'web' || typeof window === 'undefined') {
    return;
  }

  const handleSessionEnd = () => {
    if (sessionEndTracked) {
      return;
    }

    sessionEndTracked = true;
    const sessionStartedAt = getSessionStartedAt();
    const durationSeconds = sessionStartedAt
      ? Math.max(0, Math.round((Date.now() - sessionStartedAt) / 1000))
      : 0;

    void trackAnalyticsEvent(
      config,
      'session_ended',
      {
        launchMode: getLaunchMode(),
        durationSeconds,
      },
      { useBeacon: true }
    );

    clearSessionStartedAt();
  };

  window.addEventListener('pagehide', handleSessionEnd);
  window.addEventListener('beforeunload', handleSessionEnd);
  sessionEndListenersRegistered = true;
}

export async function trackPageView(config: JdsAnalyticsConfig, page: string): Promise<void> {
  await trackAnalyticsEvent(config, 'page_view', { page });
}

export async function trackQuickActionOpen(
  config: JdsAnalyticsConfig,
  action: { actionId: string; actionName: string; destinationType?: string }
): Promise<void> {
  await trackAnalyticsEvent(config, 'quick_action_opened', {
    actionId: action.actionId,
    actionName: action.actionName,
    destinationType: action.destinationType || null,
  });
}

export async function trackScheduleEventViewed(
  config: JdsAnalyticsConfig,
  event: { eventId: string; eventTitle: string; category: string }
): Promise<void> {
  await trackAnalyticsEvent(config, 'schedule_event_viewed', {
    eventId: event.eventId,
    eventTitle: event.eventTitle,
    category: event.category,
  });
}

export async function trackScheduleFilterSelected(
  config: JdsAnalyticsConfig,
  filter: { filterType: 'category' | 'day'; filterValue: string }
): Promise<void> {
  await trackAnalyticsEvent(config, 'schedule_filter_selected', {
    filterType: filter.filterType,
    filterValue: filter.filterValue,
  });
}

export async function trackScheduleSearchPerformed(
  config: JdsAnalyticsConfig,
  search: { query: string }
): Promise<void> {
  await trackAnalyticsEvent(config, 'schedule_search_performed', {
    query: search.query,
  });
}

export async function trackFavoriteChanged(
  config: JdsAnalyticsConfig,
  favorite: { action: 'added' | 'removed'; eventId: string }
): Promise<void> {
  await trackAnalyticsEvent(config, favorite.action === 'added' ? 'favorite_added' : 'favorite_removed', {
    eventId: favorite.eventId,
  });
}

export async function trackExternalLinkClick(
  config: JdsAnalyticsConfig,
  link: { destinationType: string; destinationName: string; destinationUrl: string }
): Promise<void> {
  await trackAnalyticsEvent(config, 'external_link_clicked', {
    destinationType: link.destinationType,
    destinationName: link.destinationName,
    destinationUrl: link.destinationUrl,
  });
}

export async function trackSponsorSelected(
  config: JdsAnalyticsConfig,
  sponsor: { sponsorId: string; sponsorName: string; tier?: string }
): Promise<void> {
  await trackAnalyticsEvent(config, 'sponsor_selected', {
    sponsorId: sponsor.sponsorId,
    sponsorName: sponsor.sponsorName,
    tier: sponsor.tier || null,
  });
}
