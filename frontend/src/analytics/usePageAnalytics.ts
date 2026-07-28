import React from 'react';
import { useFocusEffect } from 'expo-router';
import { getAnalyticsConfig } from './analyticsConfig';
import { trackAnalyticsEvent, trackPageView } from './jdsAnalytics';

type UsePageAnalyticsOptions = {
  openEventName?: string;
  openEventProperties?: Record<string, string | number | boolean | null>;
};

export function usePageAnalytics(pageName: string, options?: UsePageAnalyticsOptions) {
  const openEventName = options?.openEventName;
  const openEventProperties = options?.openEventProperties;
  const openEventPropertiesRef = React.useRef(openEventProperties);

  React.useEffect(() => {
    openEventPropertiesRef.current = openEventProperties;
  }, [openEventProperties]);

  useFocusEffect(
    React.useCallback(() => {
      const config = getAnalyticsConfig();
      void trackPageView(config, pageName);

      if (openEventName) {
        void trackAnalyticsEvent(config, openEventName, {
          page: pageName,
          ...(openEventPropertiesRef.current || {}),
        });
      }
    }, [pageName, openEventName])
  );
}
