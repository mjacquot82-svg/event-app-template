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

export const sponsors: Sponsor[] = [];

export const featuredSponsors = sponsors.filter((sponsor) =>
  sponsor.tier === 'presenting' || sponsor.tier === 'featured'
);

export const sponsorsByTier = {
  presenting: sponsors.filter((sponsor) => sponsor.tier === 'presenting'),
  featured: sponsors.filter((sponsor) => sponsor.tier === 'featured'),
  community: sponsors.filter((sponsor) => sponsor.tier === 'community'),
};
