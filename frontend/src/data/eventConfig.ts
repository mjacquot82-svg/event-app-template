// © 2026 1001538341 ONTARIO INC. All Rights Reserved.

// Reusable event app configuration.
// To adapt this app for another event, update this file first.

declare const require: any;

export type EventHomeAction = {
  id: string;
  label: string;
  icon: string;
  color: string;
  route?: string;
  url?: string;
};

export const eventConfig = {
  appName: 'Event App Template',
  event: {
    name: 'International Plowing Match & Rural Expo',
    shortName: 'International Plowing Match',
    subtitle: '& Rural Expo',
    year: 2026,
    tagline: '50 Years Strong',
    dates: 'September 22-26, 2026',
    location: 'Walkerton, Bruce County, Ontario',
    coordinates: { lat: 44.1251, lng: -81.2061 },
    description:
      'Celebrating 50 years of agricultural heritage and innovation in Bruce County. Join us for world-class plowing competitions, rural exhibitions, and community celebration.',
  },
  venueCenter: {
    latitude: 44.1251,
    longitude: -81.2061,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  },
  assets: {
    // For a new event, replace this with a new local banner image.
    bannerImage: require('../../assets/images/ipm-2026-banner.png'),
    // Logo can be a remote image URL or changed later to a local image asset.
    logoUri:
      'https://customer-assets.emergentagent.com/job_95522952-d1fd-436e-88ee-22dc044a6280/artifacts/cwk6huub_image.png',
  },
  brand: {
    primary: '#A6262D',
    primaryLight: '#C73B42',
    primaryDark: '#8A1F25',
    accent: '#D4920A',
    accentLight: '#F2A900',
    accentDark: '#B87D08',
    background: '#F5F5F0',
    homeBackground: '#ECE8E1',
    surface: '#FFFFFF',
    surfaceElevated: '#FAFAF7',
    surfaceHighlight: '#F0F0EB',
    textPrimary: '#2D2926',
    textSecondary: '#5C5856',
    textMuted: '#8A8986',
    stage: '#A6262D',
    vendor: '#D4920A',
    utility: '#3DBDB5',
    field: '#5A7A1F',
    success: '#5A7A1F',
    warning: '#D4920A',
    error: '#A6262D',
    info: '#3A7BC8',
    border: '#E0E0DB',
    divider: '#EAEAE5',
    overlay: 'rgba(45, 41, 38, 0.5)',
    tabActive: '#A6262D',
    tabInactive: '#9A9896',
    userLocation: '#3A7BC8',
    mapOverlay: 'rgba(255, 255, 255, 0.95)',
    route: '#A6262D',
  },
  homeActions: [
    { id: 'map', label: 'Map', icon: 'map', color: '#2E7D32', route: '/map' },
    { id: 'schedule', label: 'Schedule', icon: 'calendar', color: '#1976D2', route: '/schedule' },
    { id: 'vendors', label: 'Vendors', icon: 'shopping-bag', color: '#EF6C00', route: '/vendors' },
    { id: 'tickets', label: 'Tickets', icon: 'tag', color: '#C62828', url: 'https://www.plowingmatch.org/' },
    { id: 'camping', label: 'Camping', icon: 'compass', color: '#556B2F', url: 'https://letscamp.ca/' },
    { id: 'news', label: 'News', icon: 'rss', color: '#6A1B9A', route: '/news' },
    { id: 'itinerary', label: 'Itinerary', icon: 'clipboard', color: '#FBC02D', route: '/itinerary' },
    { id: 'photos', label: 'Photos', icon: 'camera', color: '#00838F', route: '/photos' },
    { id: 'sos', label: 'SOS', icon: 'alert-circle', color: '#D32F2F', route: '/sos' },
  ] as EventHomeAction[],
  about: {
    highlightTitle: '50 Years Strong',
    highlightSubtitle: 'Celebrating Half a Century of Agricultural Excellence',
    secondarySectionTitle: 'Our Heritage',
    secondaryCardTitle: 'A Proud Tradition',
    secondaryCardIcon: 'book-open',
    secondaryText:
      "For 50 years, the International Plowing Match has brought together farmers, families, and communities to celebrate Ontario's rich agricultural heritage. From horse-drawn plows to modern machinery, we honor the past while embracing the future of farming.",
  },
  footer: {
    copyrightLines: ['© 2026 1001538341 ONTARIO INC.', 'All Rights Reserved.'],
  },
};

export default eventConfig;
