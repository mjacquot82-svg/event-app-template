import { Linking, Platform } from 'react-native';
import { getAnalyticsConfig } from './analyticsConfig';
import { trackExternalLinkClick } from './jdsAnalytics';

export type ExternalDestinationType =
  | 'sponsor_website'
  | 'vendor_website'
  | 'facebook'
  | 'instagram'
  | 'jds_website'
  | 'phone'
  | 'email'
  | 'external_url'
  | 'directions'
  | 'ad_link';

type OpenTrackedExternalLinkParams = {
  url: string;
  destinationType: ExternalDestinationType;
  destinationName: string;
};

export async function openTrackedExternalLink({
  url,
  destinationType,
  destinationName,
}: OpenTrackedExternalLinkParams): Promise<void> {
  const config = getAnalyticsConfig();
  void trackExternalLinkClick(config, {
    destinationType,
    destinationName,
    destinationUrl: url,
  });

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  await Linking.openURL(url);
}
