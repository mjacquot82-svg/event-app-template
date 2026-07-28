import Constants from 'expo-constants';
import type { JdsAnalyticsConfig } from './jdsAnalytics';

export function getAnalyticsConfig(): JdsAnalyticsConfig {
  return {
    apiBaseUrl: process.env.EXPO_PUBLIC_BACKEND_URL || '',
    appId: 'walkerton-homecoming',
    appVersion: Constants.expoConfig?.version ?? 'unknown',
  };
}
