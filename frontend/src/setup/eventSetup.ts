// New Event Setup File
// Edit this file first when cloning the app for a new event.
// Goal: change the event without hunting through the app code.

export type EventSponsor = {
  name: string;
  tier: 'diamond' | 'platinum' | 'gold' | 'silver' | 'bronze';
  tagline?: string;
  url?: string;
  color: string;
};

const eventSetup = {
  isDemo: true,

  basic: {
    appName: 'Walkerton Home Coming 2026',
    name: 'Walkerton Home Coming 2026: Mingle & Remix',
    shortName: 'Mingle & Remix',
    subtitle: 'Walkerton Home Coming 2026',
    year: 2026,
    tagline: 'Come home. Mingle. Remix the memories.',
    dates: 'July 30 - August 3, 2026',
    location: 'Walkerton, Ontario',
    description:
      'A bright, high-energy homecoming weekend bringing Walkerton together for concerts, parade fun, kids events, local food, alumni meetups, downtown activities, and a Saturday night Mingle & Remix celebration.',
  },

  coordinates: {
    lat: 44.1310,
    lng: -81.1507,
    latitudeDelta: 0.018,
    longitudeDelta: 0.018,
  },

  links: {
    officialWebsite: 'https://www.walkertonhomecoming2026.ca',
    tickets: 'https://www.walkertonhomecoming2026.ca/tickets',
    merch: 'https://www.walkertonhomecoming2026.ca/shop/homecoming-merchandise/I6PLTIHAXJ26J6YBYY3JY7OQ',
    sponsors: 'https://www.walkertonhomecoming2026.ca/sponsors',
  },

  brand: {
    primary: '#16BFD6',
    accent: '#F6008F',
    lime: '#74D65E',
    yellow: '#FFD23F',
    background: '#000000',
  },

  features: {
    tickets: true,
    merch: true,
    schedule: true,
    specialEvents: true,
    kidsEvents: true,
    parade: true,
    map: false,
    sponsors: true,
    highlights: true,
  },

  sponsors: [] satisfies EventSponsor[],
};

export default eventSetup;
