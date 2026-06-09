// Basic sponsor inventory for the reusable event app template.
// Replace these demo sponsors with real sponsor names, logos, and links when available.

export type SponsorTier = 'presenting' | 'featured' | 'community';

export type Sponsor = {
  id: string;
  name: string;
  tier: SponsorTier;
  tagline: string;
  description?: string;
  logo?: string;
  url?: string;
  color: string;
};

export const sponsors: Sponsor[] = [
  {
    id: 'presenting-1',
    name: 'Main Stage Sponsor',
    tier: 'presenting',
    tagline: 'Presenting sponsor for live music and headline events',
    color: '#F6008F',
  },
  {
    id: 'featured-1',
    name: 'Downtown Food Sponsor',
    tier: 'featured',
    tagline: 'Supporting food trucks, patios, and local tastes',
    color: '#16BFD6',
  },
  {
    id: 'featured-2',
    name: 'Parade Route Sponsor',
    tier: 'featured',
    tagline: 'Helping bring the parade through town',
    color: '#74D65E',
  },
  {
    id: 'community-1',
    name: 'Kids Zone Sponsor',
    tier: 'community',
    tagline: 'Supporting family-friendly homecoming activities',
    color: '#FFD23F',
  },
];

export const featuredSponsors = sponsors.filter((sponsor) =>
  sponsor.tier === 'presenting' || sponsor.tier === 'featured'
);

export const sponsorsByTier = {
  presenting: sponsors.filter((sponsor) => sponsor.tier === 'presenting'),
  featured: sponsors.filter((sponsor) => sponsor.tier === 'featured'),
  community: sponsors.filter((sponsor) => sponsor.tier === 'community'),
};
