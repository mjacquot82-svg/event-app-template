// © 2026 1001538341 ONTARIO INC.

export type ProductionScheduleCategory =
  | 'Music'
  | 'Family'
  | 'Food'
  | 'Sports & Games'
  | 'Community Events';

export type ProductionHomeCategory =
  | 'Music'
  | 'Kids'
  | 'Parade'
  | 'Food'
  | 'Community'
  | 'Merch';

export type ProductionScheduleEvent = {
  id: string;
  day: string;
  date: string;
  time: string;
  title: string;
  location: string;
  category: ProductionScheduleCategory;
  description: string;
  sponsor?: string;
};

export type ProductionHomeEvent = {
  id: string;
  date: string;
  time: string;
  title: string;
  category: ProductionHomeCategory;
};

export const productionSchedule: ProductionScheduleEvent[] = [
  { id: 'thu-roller-skating', day: 'Thursday', date: 'July 30', time: '7:00pm–9:00pm', title: 'Roller Skating', location: "Lang's Home Energy Event Arena", category: 'Community Events', description: "Roller skating at Lang's Home Energy Event Arena." },
  { id: 'thu-preteen-dance', day: 'Thursday', date: 'July 30', time: '6:30pm–8:00pm', title: 'Preteen Dance (Ages 6–12)', location: "Auditorium - Lang's Home Energy Event Arena", category: 'Family', description: "Preteen dance for ages 6–12 in the auditorium at Lang's Home Energy Event Arena." },
  { id: 'thu-paint-sip', day: 'Thursday', date: 'July 30', time: '6:30pm–8:00pm', title: 'Paint & Sip (19+)', location: 'Agri Building', category: 'Community Events', description: 'Paint & Sip for ages 19+ in the Agri Building with Yellow Door Mercantile.' },
  { id: 'thu-teen-dance', day: 'Thursday', date: 'July 30', time: '8:30pm–10:00pm', title: 'Teen Dance (Ages 13–18)', location: "Auditorium - Lang's Home Energy Event Arena", category: 'Family', description: "Teen dance for ages 13–18 in the auditorium at Lang's Home Energy Event Arena." },
  { id: 'fri-golf-tournament', day: 'Friday', date: 'July 31', time: '10:00am–5:00pm', title: 'Golf Tournament', location: 'Walkerton Golf & Curling Club', category: 'Sports & Games', description: 'Golf tournament at Walkerton Golf & Curling Club.' },
  { id: 'fri-aquafit', day: 'Friday', date: 'July 31', time: '11:30am–12:30pm', title: 'Aquafit', location: 'Walkerton Centennial Pool', category: 'Sports & Games', description: 'Aquafit session at Walkerton Centennial Pool.' },
  { id: 'fri-ticket-pickup', day: 'Friday', date: 'July 31', time: '4:00pm–6:00pm', title: 'Ticket Pickup', location: 'CMR Insurance Welcome Building', category: 'Community Events', description: 'Ticket pickup at the CMR Insurance Welcome Building.' },
  { id: 'fri-opening-ceremonies', day: 'Friday', date: 'July 31', time: '4:00pm', title: 'Opening Ceremonies', location: 'Kisses | Lifeology Entertainment Tent', category: 'Community Events', description: 'Opening ceremonies at the Kisses | Lifeology Entertainment Tent.' },
  { id: 'fri-kids-self-guided', day: 'Friday', date: 'July 31', time: '4:00pm–7:00pm', title: 'Kids Events - Self Guided', location: "Brown's Pharmacy Children's Tent", category: 'Family', description: "Self-guided kids activities at Brown's Pharmacy Children's Tent." },
  { id: 'fri-kids-tye-dye', day: 'Friday', date: 'July 31', time: '4:00pm–7:00pm', title: 'Kids Tye Dye Shirt Booth', location: "Brown's Pharmacy Children's Tent", category: 'Family', description: "Kids tye dye shirt booth at Brown's Pharmacy Children's Tent." },
  { id: 'fri-youth-dodgeball', day: 'Friday', date: 'July 31', time: '6:00pm–8:00pm', title: 'Youth Dodgeball*', location: "Lang's Home Energy Event Arena", category: 'Family', description: "Youth dodgeball at Lang's Home Energy Event Arena. Pre-registration required; see website." },
  { id: 'fri-music-blake-lisa', day: 'Friday', date: 'July 31', time: '3:00pm–6:00pm', title: 'Music by Blake Wilson & Lisa McEwen', location: 'Kisses | Lifeology Entertainment Tent', category: 'Music', description: 'Music by Blake Wilson & Lisa McEwen at the Kisses | Lifeology Entertainment Tent.' },
  { id: 'fri-chicken-dinner', day: 'Friday', date: 'July 31', time: '5:00pm–7:00pm', title: 'Chicken Dinner', location: 'Price-Schonstrom Food Palace', category: 'Food', description: 'Chicken dinner catered by T&M BBQ at the Price-Schonstrom Food Palace.' },
  { id: 'fri-dance-pages-big-shiny-90s', day: 'Friday', date: 'July 31', time: '9:00pm–1:00am', title: "Dance (19+) The Pages Opening for Big Shiny 90's", location: 'RMP Welding Bandshell', category: 'Music', description: "Dance (19+) with The Pages opening for Big Shiny 90's at the RMP Welding Bandshell." },
  { id: 'sat-grab-go-breakfast', day: 'Saturday', date: 'August 1', time: '8:00am–10:00am', title: 'Grab N Go Breakfast', location: 'Price-Schonstrom Food Palace', category: 'Food', description: 'Grab N Go Breakfast at the Price-Schonstrom Food Palace.' },
  { id: 'sat-craft-vendor-market', day: 'Saturday', date: 'August 1', time: '9:00am–2:00pm', title: 'Craft and Vendor Market*', location: 'Pellow Pharmacy Agriculture Building', category: 'Community Events', description: 'Craft and Vendor Market at the Pellow Pharmacy Agriculture Building. Pre-registration required; see website.' },
  { id: 'sat-pickleball-tournament', day: 'Saturday', date: 'August 1', time: '9:30am–3:30pm', title: 'Pickleball Tournament*', location: 'Pickleball Courts', category: 'Sports & Games', description: 'Pickleball tournament at the Pickleball Courts. Pre-registration required; see website.' },
  { id: 'sat-car-show', day: 'Saturday', date: 'August 1', time: '10:00am–3:00pm', title: 'Car Show*', location: 'Agricultural Building to Yonge Street', category: 'Community Events', description: 'Car show from the Agricultural Building to Yonge Street. Pre-registration required; see website.' },
  { id: 'sat-volleyball-tournament', day: 'Saturday', date: 'August 1', time: '10:00am–3:30pm', title: 'Volleyball Tournament*', location: 'Little Rock Farm Trucking Special Events Area', category: 'Sports & Games', description: 'Volleyball tournament at the Little Rock Farm Trucking Special Events Area. Pre-registration required; see website.' },
  { id: 'sat-bruce-power-funfest', day: 'Saturday', date: 'August 1', time: '11:00am–5:00pm', title: 'Bruce Power Funfest', location: 'Event Grounds', category: 'Family', description: 'Bruce Power Funfest in the event grounds.' },
  { id: 'sat-music-whiskey-pines', day: 'Saturday', date: 'August 1', time: '11:00am–1:00pm', title: 'Music by Whiskey Pines', location: 'Kisses | Lifeology Entertainment Tent', category: 'Music', description: 'Music by Whiskey Pines at the Kisses | Lifeology Entertainment Tent.' },
  { id: 'sat-tug-of-war', day: 'Saturday', date: 'August 1', time: '11:00am–1:00pm', title: "Tug O' War*", location: 'Little Rock Farm Trucking Special Events Area', category: 'Sports & Games', description: "Tug O' War at the Little Rock Farm Trucking Special Events Area. Pre-registration required; see website." },
  { id: 'sat-beard-growing-competition', day: 'Saturday', date: 'August 1', time: '1:00pm–2:00pm', title: 'Beard Growing Competition', location: 'Kisses | Lifeology Entertainment Tent', category: 'Community Events', description: 'Beard Growing Competition at the Kisses | Lifeology Entertainment Tent.' },
  { id: 'sat-music-skeleton-crew', day: 'Saturday', date: 'August 1', time: '2:00pm–6:00pm', title: 'Music by Skeleton Crew', location: 'Kisses | Lifeology Entertainment Tent', category: 'Music', description: 'Music by Skeleton Crew at the Kisses | Lifeology Entertainment Tent.' },
  { id: 'sat-teen-paint-craft', day: 'Saturday', date: 'August 1', time: '2:00pm–4:00pm', title: 'Teen Paint & Craft', location: "Auditorium - Lang's Home Energy Event Arena", category: 'Family', description: "Teen Paint & Craft in the auditorium at Lang's Home Energy Event Arena." },
  { id: 'sat-colour-run', day: 'Saturday', date: 'August 1', time: '7:00pm–7:30pm', title: 'Colour Run (Age 5–12)', location: "Brown's Pharmacy Children's Tent", category: 'Family', description: "Colour Run for ages 5–12 at Brown's Pharmacy Children's Tent." },
  { id: 'sat-glow-party-ages-5-10', day: 'Saturday', date: 'August 1', time: '7:00pm–8:00pm', title: 'Glow Party (Ages 5–10)', location: "Brown's Pharmacy Children's Tent", category: 'Family', description: "Glow Party for ages 5–10 at Brown's Pharmacy Children's Tent." },
  { id: 'sat-glow-party-ages-10-14', day: 'Saturday', date: 'August 1', time: '8:00pm–9:00pm', title: 'Glow Party (Ages 10–14)', location: "Brown's Pharmacy Children's Tent", category: 'Family', description: "Glow Party for ages 10–14 at Brown's Pharmacy Children's Tent." },
  { id: 'sat-roast-beef-dinner', day: 'Saturday', date: 'August 1', time: '5:00pm–7:00pm', title: 'Roast Beef Dinner', location: 'Price-Schonstrom Food Palace', category: 'Food', description: 'Roast beef dinner catered by Best Western at the Price-Schonstrom Food Palace.' },
  { id: 'sat-music-tommy-youngsteen', day: 'Saturday', date: 'August 1', time: '9:00pm–1:00am', title: 'Dance (19+) The Fifth Hour Opening for Tommy Youngsteen', location: 'RMP Welding Bandshell', category: 'Music', description: 'Dance (19+) with The Fifth Hour opening for Tommy Youngsteen at the RMP Welding Bandshell.' },
  { id: 'sun-hot-breakfast', day: 'Sunday', date: 'August 2', time: '8:00am–10:00am', title: 'Hot Breakfast', location: 'Price-Schonstrom Food Palace', category: 'Food', description: 'Hot breakfast at the Price-Schonstrom Food Palace.' },
  { id: 'sun-chair-yoga', day: 'Sunday', date: 'August 2', time: '9:00am–10:00am', title: 'Chair Yoga*', location: "Auditorium - Lang's Home Energy Event Arena", category: 'Community Events', description: "Chair Yoga in the auditorium at Lang's Home Energy Event Arena. Pre-registration required; see website." },
  { id: 'sun-survivor-walkerton', day: 'Sunday', date: 'August 2', time: '9:00am–4:30pm', title: 'Survivor Walkerton*', location: 'Little Rock Farm Trucking Special Events Area', category: 'Sports & Games', description: 'Survivor Walkerton at the Little Rock Farm Trucking Special Events Area. Pre-registration required; see website.' },
  { id: 'sun-road-hockey-tournament', day: 'Sunday', date: 'August 2', time: '9:00am–1:00pm', title: 'Road Hockey Tournament*', location: "Lang's Home Energy Event Arena", category: 'Sports & Games', description: "Road Hockey Tournament at Lang's Home Energy Event Arena. Pre-registration required; see website." },
  { id: 'sun-school-open-houses', day: 'Sunday', date: 'August 2', time: '10:00am–3:00pm', title: 'School Open Houses', location: 'SHHS, WDCS & St Teresa', category: 'Community Events', description: 'School open houses at SHHS, WDCS, and St Teresa.' },
  { id: 'sun-cornhole-tournament', day: 'Sunday', date: 'August 2', time: '10:00am–4:00pm', title: 'Cornhole Tournament*', location: 'Little Rock Farm Trucking Special Events Area', category: 'Sports & Games', description: 'Cornhole tournament at the Little Rock Farm Trucking Special Events Area. Pre-registration required; see website.' },
  { id: 'sun-basketball-tournament', day: 'Sunday', date: 'August 2', time: '10:00am–3:00pm', title: '3 on 3 Basketball Tournament*', location: 'WDCS Basketball Courts', category: 'Sports & Games', description: '3 on 3 basketball tournament at the WDCS basketball courts. Pre-registration required; see website.' },
  { id: 'sun-baby-races', day: 'Sunday', date: 'August 2', time: '10:00am–10:30am', title: 'Baby Races', location: "Brown's Pharmacy Children's Tent", category: 'Family', description: "Baby Races at Brown's Pharmacy Children's Tent." },
  { id: 'sun-caesar-sunday', day: 'Sunday', date: 'August 2', time: '10:00am–2:00pm', title: 'Caesar Sunday', location: '519 Table & Pour Bar', category: 'Food', description: 'Caesar Sunday at 519 Table & Pour Bar.' },
  { id: 'sun-painting-with-cara', day: 'Sunday', date: 'August 2', time: '10:30am–11:30am', title: 'Painting with Cara (Kids)', location: "Auditorium - Lang's Home Energy Event Arena", category: 'Family', description: "Painting with Cara for kids in the auditorium at Lang's Home Energy Event Arena." },
  { id: 'sun-escape-room', day: 'Sunday', date: 'August 2', time: '11:00am–4:00pm', title: 'Escape Room', location: 'Little Rock Farm Trucking Special Events Area', category: 'Community Events', description: 'Escape Room at the Little Rock Farm Trucking Special Events Area.' },
  { id: 'sun-free-swim', day: 'Sunday', date: 'August 2', time: '11:00am–2:00pm', title: 'Free Swim', location: 'Walkerton Centennial Pool', category: 'Family', description: 'Free swim at the Walkerton Centennial Pool.' },
  { id: 'sun-face-painting', day: 'Sunday', date: 'August 2', time: '11:30am–2:30pm', title: 'Face Painting & Airbrush Tattoos', location: "Brown's Pharmacy Children's Tent", category: 'Family', description: "Face painting and airbrush tattoos at Brown's Pharmacy Children's Tent." },
  { id: 'sun-dueling-pianos', day: 'Sunday', date: 'August 2', time: '11:30am–1:30pm', title: 'Dueling Pianos', location: 'Kisses | Lifeology Entertainment Tent', category: 'Music', description: 'Dueling Pianos at the Kisses | Lifeology Entertainment Tent.' },
  { id: 'sun-kids-inflatables', day: 'Sunday', date: 'August 2', time: '12:00pm–5:00pm', title: 'Kids Inflatables', location: "Brown's Pharmacy Children's Tent", category: 'Family', description: "Kids inflatables at Brown's Pharmacy Children's Tent." },
  { id: 'sun-dog-show', day: 'Sunday', date: 'August 2', time: '12:00pm & 2:00pm', title: 'Dog Shows', location: "Brown's Pharmacy Children's Tent", category: 'Community Events', description: "Dog shows at Brown's Pharmacy Children's Tent." },
  { id: 'sun-foam-party', day: 'Sunday', date: 'August 2', time: '1:00pm–2:30pm', title: 'Foam Party', location: "Brown's Pharmacy Children's Tent", category: 'Family', description: "Foam Party at Brown's Pharmacy Children's Tent." },
  { id: 'sun-cozy-coupe-drift', day: 'Sunday', date: 'August 2', time: '2:00pm–3:00pm', title: 'Cozy Coupe Drift*', location: "Brown's Pharmacy Children's Tent", category: 'Family', description: "Cozy Coupe Drift at Brown's Pharmacy Children's Tent. Pre-registration required; see website." },
  { id: 'sun-bed-races', day: 'Sunday', date: 'August 2', time: '1:30pm–3:30pm', title: 'Bed Races', location: 'Front of Arena', category: 'Sports & Games', description: 'Bed Races at the front of the arena.' },
  { id: 'sun-music-weekend-never-ends', day: 'Sunday', date: 'August 2', time: '2:00pm–6:00pm', title: 'Music by Weekend Never Ends', location: 'Kisses | Lifeology Entertainment Tent', category: 'Music', description: 'Music by Weekend Never Ends at the Kisses | Lifeology Entertainment Tent.' },
  { id: 'sun-matty-sings', day: 'Sunday', date: 'August 2', time: '3:30pm–4:30pm', title: 'Matty Sings', location: "Brown's Pharmacy Children's Tent", category: 'Family', description: "Matty Sings at Brown's Pharmacy Children's Tent." },
  { id: 'sun-tie-dye-booth', day: 'Sunday', date: 'August 2', time: '3:30pm–5:00pm', title: 'Tye Dye Booth (Bring Item to Dye)', location: 'Pellow Pharmacy Agriculture Building', category: 'Family', description: 'Tye Dye Booth in the Pellow Pharmacy Agriculture Building. Bring an item to dye.' },
  { id: 'sun-trivia-night', day: 'Sunday', date: 'August 2', time: '6:00pm–8:00pm', title: 'Trivia Night*', location: "Auditorium - Lang's Home Energy Event Arena", category: 'Community Events', description: "Trivia Night in the auditorium at Lang's Home Energy Event Arena. Pre-registration required; see website." },
  { id: 'sun-pork-dinner', day: 'Sunday', date: 'August 2', time: '5:00pm–7:00pm', title: 'Pork Dinner', location: 'Price-Schonstrom Food Palace', category: 'Food', description: 'Pork dinner catered by Culinary Designs Catering at the Price-Schonstrom Food Palace.' },
  { id: 'sun-little-rock-dance', day: 'Sunday', date: 'August 2', time: '9:00pm–1:00am', title: 'Dance (19+) He Said, She Said Opening for Little Rock', location: 'RMP Welding Bandshell', category: 'Music', description: 'Dance (19+) with He Said, She Said opening for Little Rock at the RMP Welding Bandshell.' },
  { id: 'mon-grab-go-breakfast', day: 'Monday', date: 'August 3', time: '8:00am–10:00am', title: 'Grab N Go Breakfast', location: 'Price-Schonstrom Food Palace', category: 'Food', description: 'Grab N Go Breakfast at the Price-Schonstrom Food Palace.' },
  { id: 'mon-yoga-sound-bath', day: 'Monday', date: 'August 3', time: '9:00am–10:00am', title: 'Yoga Sound Bath*', location: "Auditorium - Lang's Home Energy Event Arena", category: 'Community Events', description: "Yoga Sound Bath in the auditorium at Lang's Home Energy Event Arena. Pre-registration required; see website." },
  { id: 'mon-painting-with-cara', day: 'Monday', date: 'August 3', time: '10:00am–11:30am', title: 'Painting with Cara (Kids)', location: "Auditorium - Lang's Home Energy Event Arena", category: 'Family', description: "Painting with Cara for kids in the auditorium at Lang's Home Energy Event Arena." },
  { id: 'mon-parade', day: 'Monday', date: 'August 3', time: '11:00am', title: 'Parade', location: 'Parade Route', category: 'Community Events', description: 'Parade on the Homecoming parade route.' },
  { id: 'mon-music-greg-mclean', day: 'Monday', date: 'August 3', time: '1:00pm–2:30pm', title: 'Music by Greg McLean', location: 'Kisses | Lifeology Entertainment Tent', category: 'Music', description: 'Music by Greg McLean at the Kisses | Lifeology Entertainment Tent.' },
  { id: 'mon-music-andrew-mcveety', day: 'Monday', date: 'August 3', time: '3:00pm–4:30pm', title: 'Music by Andrew McVeety', location: 'Kisses | Lifeology Entertainment Tent', category: 'Music', description: 'Music by Andrew McVeety at the Kisses | Lifeology Entertainment Tent.' },
  { id: 'mon-kids-inflatables', day: 'Monday', date: 'August 3', time: '12:00pm–5:00pm', title: 'Kids Inflatables', location: 'Event Grounds', category: 'Family', description: 'Kids inflatables in the event grounds.' },
  { id: 'mon-bike-strider-parade', day: 'Monday', date: 'August 3', time: '2:00pm–3:30pm', title: 'Kids Bike/Strider Parade', location: "Brown's Pharmacy Children's Tent", category: 'Family', description: "Kids Bike/Strider Parade at Brown's Pharmacy Children's Tent." },
  { id: 'mon-face-painting', day: 'Monday', date: 'August 3', time: '2:00pm–4:00pm', title: 'Face Painting & Air Brush Tattoos', location: "Brown's Pharmacy Children's Tent", category: 'Family', description: "Face painting and air brush tattoos at Brown's Pharmacy Children's Tent." },
  { id: 'mon-chuckles-the-clown', day: 'Monday', date: 'August 3', time: '2:00pm–5:00pm', title: 'Chuckles the Clown', location: "Brown's Pharmacy Children's Tent", category: 'Family', description: "Chuckles the Clown at Brown's Pharmacy Children's Tent." },
  { id: 'mon-matty-sings', day: 'Monday', date: 'August 3', time: '2:30pm–3:30pm', title: 'Matty Sings', location: "Brown's Pharmacy Children's Tent", category: 'Family', description: "Matty Sings at Brown's Pharmacy Children's Tent." },
  { id: 'mon-talent-show', day: 'Monday', date: 'August 3', time: '4:00pm–5:30pm', title: 'Talent Show*', location: "Brown's Pharmacy Children's Tent", category: 'Family', description: "Talent Show at Brown's Pharmacy Children's Tent. Pre-registration required; see website." },
  { id: 'mon-music-born-in-the-eighties', day: 'Monday', date: 'August 3', time: '6:00pm–9:00pm', title: 'Born in the Eighties', location: 'Kisses | Lifeology Entertainment Tent', category: 'Music', description: 'Born in the Eighties at the Kisses | Lifeology Entertainment Tent.' },
  { id: 'mon-pulled-pork-dinner', day: 'Monday', date: 'August 3', time: '5:00pm–7:00pm', title: 'Pulled Pork Dinner', location: 'Price-Schonstrom Food Palace', category: 'Food', description: 'Pulled Pork Dinner catered by 519 Table & Pour at the Price-Schonstrom Food Palace.' },
  { id: 'mon-fireworks', day: 'Monday', date: 'August 3', time: 'Dusk', title: 'Fireworks', location: 'Event Grounds', category: 'Community Events', description: 'Fireworks at dusk in the event grounds.' },
];

export const productionHomeEvents: ProductionHomeEvent[] = [
  { id: 'thu-roller-skating', date: '2026-07-30', time: '7:00 PM', title: 'Roller Skating', category: 'Community' },
  { id: 'fri-opening-ceremonies', date: '2026-07-31', time: '4:00 PM', title: 'Opening Ceremonies', category: 'Community' },
  { id: 'fri-dance-pages-big-shiny-90s', date: '2026-07-31', time: '9:00 PM', title: "The Pages Opening for Big Shiny 90's", category: 'Music' },
  { id: 'sat-craft-vendor-market', date: '2026-08-01', time: '9:00 AM', title: 'Craft and Vendor Market', category: 'Community' },
  { id: 'sat-music-tommy-youngsteen', date: '2026-08-01', time: '9:00 PM', title: 'Tommy Youngsteen', category: 'Music' },
  { id: 'sun-hot-breakfast', date: '2026-08-02', time: '8:00 AM', title: 'Hot Breakfast', category: 'Food' },
  { id: 'sun-dueling-pianos', date: '2026-08-02', time: '11:30 AM', title: 'Dueling Pianos', category: 'Music' },
  { id: 'mon-parade', date: '2026-08-03', time: '11:00 AM', title: 'Homecoming Parade', category: 'Parade' },
  { id: 'mon-fireworks', date: '2026-08-03', time: 'Dusk', title: 'Fireworks', category: 'Community' },
];
