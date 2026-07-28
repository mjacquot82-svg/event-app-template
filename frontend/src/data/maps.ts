declare const require: any;

export type MapAnalyticsKey = 'site-map' | 'car-show-map' | 'shuttle-route' | 'parade-route';

export type EventMapDefinition = {
  id: MapAnalyticsKey;
  title: string;
  description: string;
  asset: any;
  accentColor: string;
};

export const eventMaps: EventMapDefinition[] = [
  {
    id: 'site-map',
    title: 'Site Map',
    description: 'Find event buildings, attractions and destinations.',
    asset: require('../../assets/images/site-map.jpg'),
    accentColor: '#16BFD6',
  },
  {
    id: 'car-show-map',
    title: 'Car Show Map',
    description: 'Saturday car show location and entrance.',
    asset: require('../../assets/images/car-show.jpg'),
    accentColor: '#FFD23F',
  },
  {
    id: 'shuttle-route',
    title: 'Shuttle Route',
    description: 'Parking locations and shuttle route.',
    asset: require('../../assets/images/bus-shuttle.jpg'),
    accentColor: '#74D65E',
  },
  {
    id: 'parade-route',
    title: 'Parade Route',
    description: 'Monday parade route.',
    asset: require('../../assets/images/parade-route.jpg'),
    accentColor: '#F6008F',
  },
];
