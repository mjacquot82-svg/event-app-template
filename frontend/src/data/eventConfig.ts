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
    // Temporary demo logo based on the Mingle & Remix artwork supplied for the template mockup.
    logoUri:
      'data:image/png;base64,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',
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
  links: {
    officialWebsite: 'https://www.walkertonhomecoming2026.ca',
    tickets: 'https://www.walkertonhomecoming2026.ca/tickets',
    merch: 'https://www.walkertonhomecoming2026.ca/merch',
  },
  homeActions: [
    { id: 'tickets', label: 'Tickets', icon: 'tag', color: '#F6008F', url: 'https://www.walkertonhomecoming2026.ca/tickets' },
    { id: 'merch', label: 'Merch', icon: 'shopping-bag', color: '#16BFD6', url: 'https://www.walkertonhomecoming2026.ca/merch' },
    { id: 'schedule', label: 'Schedule', icon: 'calendar', color: '#74D65E', route: '/schedule' },
    { id: 'special', label: 'Special Events', icon: 'star', color: '#FFD23F', route: '/schedule' },
    { id: 'kids', label: 'Kids Events', icon: 'smile', color: '#45DDF0', route: '/schedule' },
    { id: 'parade', label: 'Parade', icon: 'flag', color: '#F6008F', route: '/schedule' },
    { id: 'map', label: 'Map', icon: 'map', color: '#74D65E', route: '/map' },
    { id: 'itinerary', label: 'My Weekend', icon: 'clipboard', color: '#16BFD6', route: '/itinerary' },
    { id: 'help', label: 'Help', icon: 'alert-circle', color: '#F6008F', route: '/sos' },
  ] as EventHomeAction[],
  about: {
    highlightTitle: 'Mingle & Remix',
    highlightSubtitle: 'A bright homecoming weekend for every generation.',
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
