# JDS Analytics v1

JDS Analytics v1 adds anonymous launch tracking for JDS Studio apps without collecting personal data.

## Frontend

- `frontend/src/analytics/jdsAnalytics.ts` is the reusable web client.
- It persists `jds_device_id` in `localStorage`.
- It detects installed PWA mode from browser display mode signals.
- It posts launch events to `/api/analytics/launch` with `appId`, `appVersion`, `deviceId`, `installed`, and a client timestamp.
- The launch payload does not need to change across JDS apps; reuse it and set the app-specific `appId`.

### Integrate into another JDS app

1. Copy `frontend/src/analytics/jdsAnalytics.ts` into the new app.
2. Call `trackAppLaunch(...)` from the app startup entry point.
3. Set the app-specific values:
   - `apiBaseUrl`
   - `appId`
   - `appVersion`

Example:

```ts
import Constants from 'expo-constants';
import { trackAppLaunch } from '../src/analytics/jdsAnalytics';

void trackAppLaunch({
  apiBaseUrl: process.env.EXPO_PUBLIC_BACKEND_URL || '',
  appId: 'my-jds-app',
  appVersion: Constants.expoConfig?.version ?? 'unknown',
});
```

The only required application-specific identifier is `appId`.

## Backend

- `POST /api/analytics/launch` records anonymous launches per `appId`.
- `GET /api/analytics/stats?appId=...` returns:
  - `totalLaunches`
  - `uniqueDevices`
  - `launchesToday`
  - `installedDevices`
  - `browserOnlyDevices`

Installed-device behavior:

- Each device record stores whether it has ever launched in installed PWA mode.
- Once a device reports `installed=true`, it remains counted as installed for future stats.
- `browserOnlyDevices` is calculated as unique devices that have never reported installed PWA usage.

MongoDB collections:

- `analytics_devices`: one record per `appId` + `deviceId`
- `analytics_app_stats`: aggregate totals per `appId`
- `analytics_daily_stats`: per-day launch counters per `appId`

To reuse the backend in another JDS app, keep the same routes and storage model. The analytics data stays partitioned by `appId`.

## Privacy

- No names, emails, phone numbers, GPS coordinates, or IP addresses are stored by this module.
- The device identifier is an anonymous UUID generated in the browser and reused on later launches.
