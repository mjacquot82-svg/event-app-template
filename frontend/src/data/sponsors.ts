export type SponsorTier = 'diamond' | 'platinum' | 'gold' | 'silver' | 'bronze';

export type Sponsor = {
  id: string;
  name: string;
  tier: SponsorTier;
  tagline?: string;
  description?: string;
  logo?: string;
  url?: string;
  color: string;
};

const tierColors: Record<SponsorTier, string> = {
  diamond: '#45DDF0',
  platinum: '#F6008F',
  gold: '#FFD23F',
  silver: '#C0C7D1',
  bronze: '#B87333',
};

function makeSponsor(tier: SponsorTier, name: string): Sponsor {
  return {
    id: `${tier}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
    name,
    tier,
    color: tierColors[tier],
  };
}

export const sponsors: Sponsor[] = [
  makeSponsor('diamond', '519 Table & Pour'),
  makeSponsor('diamond', 'Brockton'),
  makeSponsor('diamond', "Brown's Guardian Pharmacy"),
  makeSponsor('diamond', 'CMR Insurance'),
  makeSponsor('diamond', "D'S Construction"),
  makeSponsor('diamond', 'John Ernewein Limited'),
  makeSponsor('diamond', 'Kisses | Lifeology'),
  makeSponsor('diamond', "Lang's Home Energy"),
  makeSponsor('diamond', 'Little Rock Farm Trucking'),
  makeSponsor('diamond', 'McIntee Real Estate'),
  makeSponsor('diamond', 'Pellow Pharmasave'),
  makeSponsor('diamond', 'Price Schonstrom'),
  makeSponsor('diamond', 'RMP Welding'),
  makeSponsor('diamond', 'Surefire Framing'),
  makeSponsor('diamond', 'The Guest House'),
  makeSponsor('diamond', "Weber's Electric and Line Service"),

  makeSponsor('platinum', "Al Reich's Backhoeing & Haulage Ltd."),
  makeSponsor('platinum', 'Cheetah Electric'),
  makeSponsor('platinum', 'Cottage Springs'),
  makeSponsor('platinum', 'CS Law'),
  makeSponsor('platinum', 'Dirt Pig Foundation'),
  makeSponsor('platinum', "Realty Ladies 'N Gents - eXp Realty"),
  makeSponsor('platinum', 'Hawkins Electrical Contracting'),
  makeSponsor('platinum', 'HDTV & Electronics'),
  makeSponsor('platinum', 'Holm Graphics'),
  makeSponsor('platinum', 'In Line Family Chiropractic'),
  makeSponsor('platinum', 'Jennifer Jacquot Photography'),
  makeSponsor('platinum', 'Leslie Motors Ford'),
  makeSponsor('platinum', 'MNP'),
  makeSponsor('platinum', "Stroeders Truck & Trailer"),
  makeSponsor('platinum', 'United Rentals'),
  makeSponsor('platinum', 'Walkerton Clean Water Centre'),
  makeSponsor('platinum', 'Walkerton Legion'),
  makeSponsor('platinum', 'Walkerton Toyota'),
  makeSponsor('platinum', "Willie's Electric and Line Service"),

  makeSponsor('gold', '93.7/97.9 Radio'),
  makeSponsor('gold', 'Bester Forest Products Inc.'),
  makeSponsor('gold', 'Bluewater Radio 91.3 FM'),
  makeSponsor('gold', 'Country Creek Pet Hotel'),
  makeSponsor('gold', 'First Choice Property Maintenance'),
  makeSponsor('gold', 'Foerster Plumbing Heating & AC'),
  makeSponsor('gold', 'Grey Bruce Trash Taxi'),
  makeSponsor('gold', "Harley's Pub & Perk"),
  makeSponsor('gold', 'His Style'),
  makeSponsor('gold', 'Huron Tractor'),
  makeSponsor('gold', 'Joy Source for Sports'),
  makeSponsor('gold', "Kaufman's Your Independent Grocer"),
  makeSponsor('gold', 'Labatt Brewing Company Ltd.'),
  makeSponsor('gold', 'Luxury Woodworking'),
  makeSponsor('gold', 'Northern Points Roofing & Exteriors'),
  makeSponsor('gold', 'Ross Young Bus Lines'),
  makeSponsor('gold', 'Sleepers Bed Gallery / Lake Huron Home'),
  makeSponsor('gold', 'Sunbelt Rental'),
  makeSponsor('gold', 'Upstaged Design'),
  makeSponsor('gold', 'Victor Lair Jewellers'),
  makeSponsor('gold', 'Walkerton Auto Parts'),
  makeSponsor('gold', 'Walkerton Foodland'),
  makeSponsor('gold', 'Walkerton Golf & Curling Club'),
  makeSponsor('gold', 'Walkerton Home Hardware'),
  makeSponsor('gold', 'Walkerton Tim Hortons'),
  makeSponsor('gold', 'Walkerton Timbermart'),
  makeSponsor('gold', 'Wightman Telecom'),
  makeSponsor('gold', 'Wilson Solutions'),

  makeSponsor('silver', '101.7/Cool 94.5 Radio'),
  makeSponsor('silver', 'Best Western Plus Hotel & CC and @Home Walkerton'),
  makeSponsor('silver', "Cameron's Cremation and Funeral Services"),
  makeSponsor('silver', 'CSN Collision'),
  makeSponsor('silver', 'Davishill Nursery'),
  makeSponsor('silver', 'Hear Right Canada'),
  makeSponsor('silver', 'Holmdale Pro Rodeo'),
  makeSponsor('silver', 'Howick Mutual'),
  makeSponsor('silver', 'JC Welding'),
  makeSponsor('silver', 'Matcrete'),
  makeSponsor('silver', 'Meridian Credit Union'),
  makeSponsor('silver', 'PBJ Kitsupply'),
  makeSponsor('silver', "Shookie's Mechanical"),
  makeSponsor('silver', 'Sons of Concrete'),
  makeSponsor('silver', 'Southport Golf Club'),
  makeSponsor('silver', 'Tee & Co'),
  makeSponsor('silver', "The Cook's Cupboard"),
  makeSponsor('silver', 'Tranquility Spa & Salon'),
  makeSponsor('silver', "Troy's Plumbing, Heating and Cooling"),
  makeSponsor('silver', "Walker's Landing Pub & Eatery"),
  makeSponsor('silver', 'Walkerton Pizza Delight'),

  makeSponsor('bronze', 'A&R Music'),
  makeSponsor('bronze', 'Bruce-Grey Catholic District School Board'),
  makeSponsor('bronze', 'Bluewater District School Board'),
  makeSponsor('bronze', 'Birdie Barn'),
  makeSponsor('bronze', 'Bombshell'),
  makeSponsor('bronze', 'Bruce Grey Print House'),
  makeSponsor('bronze', 'CJ Custom Woodworking'),
  makeSponsor('bronze', 'Dave & The Retros'),
  makeSponsor('bronze', 'Essential Wellness'),
  makeSponsor('bronze', 'Fischer Law'),
  makeSponsor('bronze', 'Folmer Landscaping'),
  makeSponsor('bronze', "Leo Al's Contracting"),
  makeSponsor('bronze', 'Mill Town Barber Shop'),
  makeSponsor('bronze', 'Premier Windows & Doors'),
  makeSponsor('bronze', 'Redefined Smile'),
  makeSponsor('bronze', 'Saugeen Valley Media'),
  makeSponsor('bronze', 'Schuett Furniture'),
  makeSponsor('bronze', 'Studio 226'),
  makeSponsor('bronze', 'The Dragonfly Spa'),
  makeSponsor('bronze', 'Walkerton & District Optimist Club'),
  makeSponsor('bronze', 'Walkerton-Hanover Veterinary Clinic'),
  makeSponsor('bronze', 'Yoga Barn'),
  makeSponsor('bronze', 'Zettel-Fischer Contracting'),
];

export const featuredSponsors = sponsors.filter((sponsor) =>
  sponsor.tier === 'diamond' || sponsor.tier === 'platinum' || sponsor.tier === 'gold'
);

export const sponsorsByTier = {
  diamond: sponsors.filter((sponsor) => sponsor.tier === 'diamond'),
  platinum: sponsors.filter((sponsor) => sponsor.tier === 'platinum'),
  gold: sponsors.filter((sponsor) => sponsor.tier === 'gold'),
  silver: sponsors.filter((sponsor) => sponsor.tier === 'silver'),
  bronze: sponsors.filter((sponsor) => sponsor.tier === 'bronze'),
};
