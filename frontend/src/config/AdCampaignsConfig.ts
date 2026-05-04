// © 2026 1001538341 ONTARIO INC. All Rights Reserved.
// Sponsor placement configuration
// These are monetizable ad/sponsor slots, not random third-party ads.

export interface AdUnit {
  id: string;
  name: string;
  imageUrl: string | null;
  targetUrl: string;
  placeholderText: string;
  width: number;
  height: number;
  enabled: boolean;
}

export interface AdCampaignsConfig {
  topBanner: AdUnit;
  bottomBanner: AdUnit;
  interstitial: AdUnit;
}

const adCampaignsConfig: AdCampaignsConfig = {
  // Premium top sponsor placement.
  // Sell this as the highest-value sponsor spot across the app.
  topBanner: {
    id: 'top-presenting-sponsor',
    name: 'Presented by Main Stage Sponsor',
    imageUrl: null,
    targetUrl: 'https://www.walkertonhomecoming2026.ca/sponsors',
    placeholderText: 'Premium app-wide sponsor placement',
    width: 1800,
    height: 400,
    enabled: true,
  },

  // Secondary sponsor placement above the bottom navigation.
  bottomBanner: {
    id: 'bottom-community-sponsor',
    name: 'Community Sponsor Spotlight',
    imageUrl: null,
    targetUrl: 'https://www.walkertonhomecoming2026.ca/sponsors',
    placeholderText: 'Support local businesses powering Home Coming weekend',
    width: 1800,
    height: 250,
    enabled: true,
  },

  // Keep this disabled for now so the demo does not feel intrusive.
  // It can be enabled later for a premium sponsor takeover.
  interstitial: {
    id: 'interstitial',
    name: 'Full-Screen Sponsor Takeover',
    imageUrl: null,
    targetUrl: 'https://www.walkertonhomecoming2026.ca/sponsors',
    placeholderText: 'Premium full-screen sponsor takeover',
    width: 1170,
    height: 2532,
    enabled: false,
  },
};

export default adCampaignsConfig;
