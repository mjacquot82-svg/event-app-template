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
    bannerImage: require('../../assets/images/Untitled.png'),
    logoUri: require('../../assets/images/new.jpg'),
  },
  brand: {
    primary: '#16BFD6',
    primaryLight: '#45DDF0',
    primaryDark: '#0A8FA3',
    accent: '#F6008F',
    accentLight: '#FF4DB8',
    accentDark: '#B8006B',
    background: '#000000',
    homeBackground: '#000000',
    surface: '#111111',
    surfaceElevated: '#151515',
    surfaceHighlight: '#1F2937',
    textPrimary: '#FFFFFF',
    textSecondary: '#D1D5DB',
    textMuted: '#8B95A1',
    stage: '#F6008F',
    vendor: '#16BFD6',
    utility: '#74D65E',
    field: '#74D65E',
    success: '#74D65E',
    warning: '#FFD23F',
    error: '#F6008F',
    info: '#16BFD6',
    border: '#1F2937',
    divider: '#252525',
    overlay: 'rgba(0, 0, 0, 0.65)',
    tabActive: '#F6008F',
    tabInactive: '#D1D5DB',
    userLocation: '#16BFD6',
    mapOverlay: 'rgba(0, 0, 0, 0.96)',
    route: '#F6008F',
  },
  links: {
    officialWebsite: 'https://www.walkertonhomecoming2026.ca',
    tickets: 'https://www.walkertonhomecoming2026.ca/tickets',
    merch: 'https://www.walkertonhomecoming2026.ca/shop/homecoming-merchandise/I6PLTIHAXJ26J6YBYY3JY7OQ',
  },
  homeActions: [
    { id: 'tickets', label: 'Buy Tickets', icon: 'tag', color: '#74D65E', url: 'https://www.walkertonhomecoming2026.ca/tickets' },
    { id: 'merch', label: 'Buy Merch', icon: 'shopping-bag', color: '#F6008F', url: 'https://www.walkertonhomecoming2026.ca/shop/homecoming-merchandise/I6PLTIHAXJ26J6YBYY3JY7OQ' },
    { id: 'visitor-info', label: 'Getting Around', icon: 'map-pin', color: '#16BFD6', route: '/(tabs)/visitor-info' },
    { id: 'sponsors', label: 'Sponsors', icon: 'award', color: '#16BFD6', route: '/(tabs)/sponsors' },
    { id: 'facebook', label: 'Facebook', icon: 'facebook', color: '#1877F2', url: 'https://www.facebook.com/p/Walkerton-Homecoming-2026-61568641512947/' },
    { id: 'instagram', label: 'Instagram', icon: 'instagram', color: '#E4405F', url: 'https://www.instagram.com/walkertonhomecoming2026/' },
  ] as EventHomeAction[],
  about: {
    highlightTitle: 'Mingle & Remix',
    highlightSubtitle: 'A bright homecoming weekend for every generation.',
    secondarySectionTitle: 'Homecoming Spirit',
    secondaryCardTitle: 'Back to Walkerton',
    secondaryCardIcon: 'music',
    secondaryText:
      'Walkerton Home Coming 2026 celebrates the feeling of coming home: old friends, new memories, downtown energy, community pride, local music, family activities, and a weekend built around reconnecting.',
  },
  footer: {
    copyrightLines: ['App Built & Provided By', 'Jennifer Jacquot Photography'],
  },
};

export default eventConfig;
