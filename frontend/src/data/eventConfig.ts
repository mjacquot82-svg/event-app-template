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
  appName: 'Walkerton Home Coming 2026',
  event: {
    name: 'Walkerton Home Coming 2026: Mingle & Remix',
    shortName: 'Mingle & Remix',
    subtitle: 'Walkerton Home Coming 2026',
    year: 2026,
    tagline: 'Come home. Mingle. Remix the memories.',
    dates: 'July 30 - August 3, 2026',
    location: 'Walkerton, Ontario',
    coordinates: { lat: 44.1310, lng: -81.1507 },
    description:
      'A bright, high-energy homecoming weekend bringing Walkerton together for concerts, parade fun, kids events, local food, alumni meetups, downtown activities, and a Saturday night Mingle & Remix celebration.',
  },
  venueCenter: {
    latitude: 44.1310,
    longitude: -81.1507,
    latitudeDelta: 0.018,
    longitudeDelta: 0.018,
  },
  assets: {
    // Demo note: using the original local banner asset until a Walkerton Home Coming banner is added.
    bannerImage: require('../../assets/images/ipm-2026-banner.png'),
    logoUri:
      'https://dummyimage.com/600x240/ffffff/22c7d9.png&text=MINGLE+%26+REMIX+2026',
  },
  brand: {
    primary: '#16BFD6',
    primaryLight: '#45DDF0',
    primaryDark: '#0A8FA3',
    accent: '#F6008F',
    accentLight: '#FF4DB8',
    accentDark: '#B8006B',
    background: '#FAF7FF',
    homeBackground: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceElevated: '#F7FCFD',
    surfaceHighlight: '#E9FBFF',
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#8B95A1',
    stage: '#F6008F',
    vendor: '#16BFD6',
    utility: '#74D65E',
    field: '#74D65E',
    success: '#74D65E',
    warning: '#FFD23F',
    error: '#F6008F',
    info: '#16BFD6',
    border: '#E5E7EB',
    divider: '#EEF2F7',
    overlay: 'rgba(17, 24, 39, 0.45)',
    tabActive: '#F6008F',
    tabInactive: '#9CA3AF',
    userLocation: '#16BFD6',
    mapOverlay: 'rgba(255, 255, 255, 0.96)',
    route: '#F6008F',
  },
  homeActions: [
    { id: 'tickets', label: 'Tickets', icon: 'tag', color: '#F6008F', url: 'https://example.com/walkerton-homecoming-tickets' },
    { id: 'schedule', label: 'Events', icon: 'calendar', color: '#16BFD6', route: '/schedule' },
    { id: 'map', label: 'Map', icon: 'map', color: '#74D65E', route: '/map' },
    { id: 'parade', label: 'Parade', icon: 'flag', color: '#FFD23F', route: '/schedule' },
    { id: 'kids', label: 'Kids Events', icon: 'smile', color: '#45DDF0', route: '/schedule' },
    { id: 'vendors', label: 'Food & Merch', icon: 'shopping-bag', color: '#F6008F', route: '/vendors' },
    { id: 'itinerary', label: 'My Weekend', icon: 'clipboard', color: '#74D65E', route: '/itinerary' },
    { id: 'photos', label: 'Photos', icon: 'camera', color: '#16BFD6', route: '/photos' },
    { id: 'sos', label: 'Help', icon: 'alert-circle', color: '#F6008F', route: '/sos' },
  ] as EventHomeAction[],
  about: {
    highlightTitle: 'Mingle & Remix',
    highlightSubtitle: 'A neon-bright homecoming weekend for every generation.',
    secondarySectionTitle: 'Homecoming Spirit',
    secondaryCardTitle: 'Back to Walkerton',
    secondaryCardIcon: 'music',
    secondaryText:
      'This demo event celebrates the feeling of coming home: old friends, new memories, downtown energy, community pride, local music, family activities, and a weekend built around reconnecting.',
  },
  footer: {
    copyrightLines: ['Demo Event Template', 'Walkerton Home Coming 2026 sample content'],
  },
};

export default eventConfig;
