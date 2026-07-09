import { Platform } from 'react-native';

const DEVICE_ID_STORAGE_KEY = 'jds_device_id';

export type JdsAnalyticsConfig = {
  apiBaseUrl: string;
  appId: string;
  appVersion: string;
};

type LaunchPayload = {
  deviceId: string;
  appId: string;
  appVersion: string;
  installed: boolean;
  timestamp: string;
};

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

function buildLaunchPayload(config: JdsAnalyticsConfig, deviceId: string): LaunchPayload {
  return {
    deviceId,
    appId: config.appId,
    appVersion: config.appVersion,
    installed: detectInstalledPwa(),
    timestamp: new Date().toISOString(),
  };
}

export async function trackAppLaunch(config: JdsAnalyticsConfig): Promise<void> {
  const deviceId = getOrCreateDeviceId();
  if (!deviceId) {
    return;
  }

  const payload = buildLaunchPayload(config, deviceId);
  const endpoint = `${config.apiBaseUrl}/api/analytics/launch`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn(`JDS Analytics: launch tracking failed (HTTP ${response.status})`);
    }
  } catch (error) {
    console.error('JDS analytics launch tracking failed:', error);
  }
}
