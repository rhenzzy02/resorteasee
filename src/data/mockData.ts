import {
  PropertyUnit,
  Reservation,
  AmenityItem,
  AmenityBooking,
  InventoryItem,
  GuestProfile,
  ServiceRequest,
  GuestMessage,
  StaffMember,
  CommunicationWorkflow,
  CommunicationLogEntry,
  FolioEntry,
  AuthUser,
} from '../types/resort';

export const DEMO_USERS: AuthUser[] = [
  {
    id: 'user-admin',
    name: 'Maria Santos',
    email: '',
    role: 'admin',
    department: 'management',
    title: 'Resort Operations Director',
    avatar: '/src/assets/images/avatar_resort_director_1792633830513.jpg',
    assignedZone: 'Executive Management & Operations',
  },
  {
    id: 'user-worker-hk',
    name: 'Elena Rostova',
    email: '',
    role: 'worker',
    department: 'housekeeping',
    title: 'Lead Villa Turnover Specialist',
    avatar: '/src/assets/images/avatar_resort_director_1792633830513.jpg',
    assignedZone: 'Overwater Villas Pier (101-108)',
    shift: '07:00 – 15:30 (Morning Turnaround)',
  },
  {
    id: 'user-worker-fd',
    name: 'Maya Lin',
    email: '',
    role: 'worker',
    department: 'frontdesk',
    title: 'Front Desk & Speedboat Host',
    assignedZone: 'Welcome Jetty & Port Logistics',
    shift: '08:00 – 16:30 (Arrivals & Concierge)',
  },
  {
    id: 'user-worker-tech',
    name: 'Tomas Richter',
    email: '',
    role: 'worker',
    department: 'maintenance',
    title: 'Chief Facilities Engineer',
    assignedZone: 'Pool Thermal Systems & Villas',
    shift: '07:30 – 16:00 (Engineering)',
  },
];

export const INITIAL_UNITS: PropertyUnit[] = [
  {
    id: 'unit-1',
    name: 'Azure Overwater Villa 101',
    code: 'OV-101',
    category: 'villa',
    capacity: 2,
    baseRatePerNight: 850,
    hasPrivatePool: true,
    viewType: 'Lagoon & Sunset View',
    status: 'available',
    description: 'Stilted wooden villa perched over crystal turquoise waters with private infinity plunge pool and glass floor ocean portal.',
    squareMeters: 145,
    image: '/src/assets/images/resort_hero_aerial_1792633829110.jpg',
    amenityFeatures: ['Private Plunge Pool', 'Direct Ocean Ladder', 'Outdoor Rain Shower', 'King Canopy Bed', 'Nespresso Bar'],
  },
  {
    id: 'unit-2',
    name: 'Azure Overwater Villa 102',
    code: 'OV-102',
    category: 'villa',
    capacity: 3,
    baseRatePerNight: 890,
    hasPrivatePool: true,
    viewType: 'Panoramic Reef View',
    status: 'available',
    description: 'Spacious sunrise-facing overwater villa with expansive sundeck, heated saltwater plunge pool, and butler service.',
    squareMeters: 155,
    image: '/src/assets/images/resort_hero_aerial_1792633829110.jpg',
    amenityFeatures: ['Saltwater Plunge Pool', 'Catamaran Net Lounger', 'Wine Chiller', 'Freestanding Stone Tub'],
  },
  {
    id: 'unit-3',
    name: 'Beachfront Cottage & Dip Pool 201',
    code: 'BC-201',
    category: 'cottage',
    capacity: 4,
    baseRatePerNight: 720,
    hasPrivatePool: true,
    viewType: 'Direct White Sand Beach',
    status: 'available',
    description: 'Thatched-roof sanctuary nestled directly on powdery sands, featuring a private freshwater plunge pool and teak sun deck.',
    squareMeters: 130,
    image: '/src/assets/images/cottage_private_pool_1792633828892.jpg',
    amenityFeatures: ['Private Teak Dip Pool', 'Private Beach Hammock', 'Dual Stone Vanities', 'Alfresco Dining Patio'],
  },
  {
    id: 'unit-4',
    name: 'Beachfront Cottage & Dip Pool 202',
    code: 'BC-202',
    category: 'cottage',
    capacity: 4,
    baseRatePerNight: 720,
    hasPrivatePool: true,
    viewType: 'Direct White Sand Beach',
    status: 'available',
    description: 'Beachfront escape with private walled tropical garden, plunge pool, and floor-to-ceiling glass sliding doors.',
    squareMeters: 130,
    image: '/src/assets/images/cottage_private_pool_1792633828892.jpg',
    amenityFeatures: ['Private Dip Pool', 'Outdoor Daybed', 'Mini Bar Cart', 'Bose Surround Sound'],
  },
  {
    id: 'unit-5',
    name: 'Botanical Garden Heritage Suite 301',
    code: 'GS-301',
    category: 'suite',
    capacity: 2,
    baseRatePerNight: 480,
    hasPrivatePool: false,
    viewType: 'Tropical Orchid Garden',
    status: 'available',
    description: 'Secluded luxury suite framed by ancient banyan trees and orchid groves, featuring an open-air terrazzo soaking tub.',
    squareMeters: 95,
    image: '/src/assets/images/amenity_spa_pavilion_1792633829971.jpg',
    amenityFeatures: ['Open-air Terrazzo Tub', 'Private Veranda', 'Organic Herbal Bar', 'Yoga Mat & Blocks'],
  },
  {
    id: 'unit-6',
    name: 'Botanical Garden Heritage Suite 302',
    code: 'GS-302',
    category: 'suite',
    capacity: 2,
    baseRatePerNight: 480,
    hasPrivatePool: false,
    viewType: 'Tropical Water Lily Pond',
    status: 'available',
    description: 'Peaceful garden suite with handcrafted bamboo fixtures, vaulted ceilings, and views of the resort water lily lagoon.',
    squareMeters: 95,
    image: '/src/assets/images/amenity_spa_pavilion_1792633829971.jpg',
    amenityFeatures: ['Balcony Daybed', 'Rain Shower', 'Aromatherapy Diffuser', 'Custom Tea Selection'],
  },
  {
    id: 'unit-7',
    name: 'Royal Oceanfront Penthouse 401',
    code: 'PH-401',
    category: 'penthouse',
    capacity: 6,
    baseRatePerNight: 1650,
    hasPrivatePool: true,
    viewType: '360° Ocean & Coral Atoll',
    status: 'available',
    description: 'Two-story luxury residence featuring an elevated rooftop private glass-bottom pool, personal chef kitchen, and private boat captain.',
    squareMeters: 310,
    image: '/src/assets/images/resort_hero_aerial_1792633829110.jpg',
    amenityFeatures: ['Rooftop Glass Pool', 'Private Butler 24/7', 'Full Kitchen', 'Jacuzzi Spa Deck', 'Private Speedboat Access'],
  },
];

export const INITIAL_AMENITIES: AmenityItem[] = [
  {
    id: 'amenity-pool-a',
    name: 'Laguna Private Pool Sanctuary (East)',
    category: 'private_pool',
    capacity: 8,
    hourlyRate: 120,
    prepBufferMinutes: 30,
    description: 'Exclusive heated infinity pool reserved by session, with private cabana attendant and chilled fruit service.',
    location: 'East Lagoon Bluff',
    features: ['Heated Saltwater', 'Private Cabana & Daybed', 'Fresh Towel Bar', 'Dedicated Attendant'],
    image: '/src/assets/images/cottage_private_pool_1792633828892.jpg',
  },
  {
    id: 'amenity-pool-b',
    name: 'Laguna Private Pool Sanctuary (West Sunset)',
    category: 'private_pool',
    capacity: 8,
    hourlyRate: 140,
    prepBufferMinutes: 30,
    description: 'Prime western oceanfront private pool optimized for golden hour sunset sessions with champagne service.',
    location: 'West Sunset Point',
    features: ['Sunset Infinity Edge', 'Surround Sound Audio', 'Champagne Chiller', 'Sunken Lounge Firepit'],
    image: '/src/assets/images/cottage_private_pool_1792633828892.jpg',
  },
  {
    id: 'amenity-spa-1',
    name: 'Zen Wellness & Open-Air Spa Pavilion',
    category: 'spa',
    capacity: 2,
    hourlyRate: 180,
    prepBufferMinutes: 45,
    description: 'Open-air stone sanctuary with dual massage tables, botanical herbal steam bath, and quiet koi pond.',
    location: 'Lotus Garden',
    features: ['Couples Massage Beds', 'Botanical Herbal Steam', 'Aromatherapy Oils', 'Reflecting Pond'],
    image: '/src/assets/images/amenity_spa_pavilion_1792633829971.jpg',
  },
  {
    id: 'amenity-cabana-1',
    name: 'VIP Beachfront Daybed Cabana #1',
    category: 'cabana',
    capacity: 4,
    hourlyRate: 75,
    prepBufferMinutes: 20,
    description: 'Shaded bamboo daybed cabana on the white sand beach with cooling mist fans and personalized cocktail service.',
    location: 'Central Beach',
    features: ['Double King Daybed', 'Cooling Water Mist', 'USB Charging Ports', 'Beach Butler Bell'],
    image: '/src/assets/images/cottage_private_pool_1792633828892.jpg',
  },
  {
    id: 'amenity-watersports',
    name: 'Coral Explorer Kayak & Seabob Hub',
    category: 'watersports',
    capacity: 6,
    hourlyRate: 90,
    prepBufferMinutes: 15,
    description: 'Clear-bottom sea kayaks, motorized underwater seabobs, and guided reef snorkeling excursions.',
    location: 'Water Sports Pier',
    features: ['Clear Bottom Kayaks', 'Seabob Scooters', 'Safety Life Vests', 'Underwater GoPros'],
    image: '/src/assets/images/resort_hero_aerial_1792633829110.jpg',
  },
];

// Clean slate: All reservation history cleared as requested
export const INITIAL_RESERVATIONS: Reservation[] = [];

// Clean slate: All amenity bookings cleared as requested
export const INITIAL_AMENITY_BOOKINGS: AmenityBooking[] = [];

// Clean slate: All guest profiles cleared as requested
export const INITIAL_GUESTS: GuestProfile[] = [];

// Clean slate: All service requests cleared as requested
export const INITIAL_SERVICE_REQUESTS: ServiceRequest[] = [];

// Clean slate: All messages cleared as requested
export const INITIAL_MESSAGES: GuestMessage[] = [];

// Clean slate: All folio billing history cleared as requested
export const INITIAL_FOLIO_ENTRIES: FolioEntry[] = [];

// Clean slate: All communication dispatch logs cleared as requested
export const INITIAL_COMM_LOGS: CommunicationLogEntry[] = [];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'LIN-EGY-01',
    name: '600-Thread Egyptian Cotton Bed Set (King)',
    category: 'linens',
    currentStock: 18,
    minParLevel: 15,
    maxCapacity: 40,
    unitCost: 110,
    unitName: 'Sets',
    supplier: 'Nile Artisan Textiles Ltd.',
    lastRestocked: '2026-10-12',
  },
  {
    id: 'inv-2',
    sku: 'TOW-PLU-02',
    name: 'Plush Turkish Pool Towel (Ocean Teal)',
    category: 'pool_spa',
    currentStock: 44,
    minParLevel: 50,
    maxCapacity: 120,
    unitCost: 28,
    unitName: 'Pieces',
    supplier: 'Anatolian Cotton Co.',
    lastRestocked: '2026-09-28',
  },
  {
    id: 'inv-3',
    sku: 'BEV-CHA-01',
    name: 'Veuve Clicquot Brut Champagne (750ml)',
    category: 'minibar',
    currentStock: 9,
    minParLevel: 12,
    maxCapacity: 36,
    unitCost: 65,
    unitName: 'Bottles',
    supplier: 'Cellar Prestige Imports',
    lastRestocked: '2026-10-04',
  },
  {
    id: 'inv-4',
    sku: 'SPA-OIL-03',
    name: 'Pure Balinese Lemongrass & Sandalwood Oil',
    category: 'pool_spa',
    currentStock: 22,
    minParLevel: 10,
    maxCapacity: 30,
    unitCost: 34,
    unitName: 'Liters',
    supplier: 'Ubud Botanicals',
    lastRestocked: '2026-10-15',
  },
  {
    id: 'inv-5',
    sku: 'TOI-KIT-01',
    name: 'Organic Bamboo & Sea Kelp Toiletries Amenity Kit',
    category: 'toiletries',
    currentStock: 85,
    minParLevel: 60,
    maxCapacity: 200,
    unitCost: 12,
    unitName: 'Kits',
    supplier: 'EcoLuxe Amenities',
    lastRestocked: '2026-10-18',
  },
  {
    id: 'inv-6',
    sku: 'EQP-SEB-01',
    name: 'Underwater Seabob Jet Electric Scooters',
    category: 'equipment',
    currentStock: 4,
    minParLevel: 4,
    maxCapacity: 6,
    unitCost: 4500,
    unitName: 'Units',
    supplier: 'Cayago Americas',
    lastRestocked: '2026-08-10',
  },
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Elena Rostova',
    role: 'Lead Villa Turnover Specialist',
    department: 'housekeeping',
    shift: 'morning',
    assignedZone: 'Overwater Villas Pier',
    workloadScore: 40,
    currentTask: 'All villas sanitized and ready for guest arrivals',
    status: 'active',
  },
  {
    id: 'staff-2',
    name: 'Carlos Mendez',
    role: 'Cottage & Garden Attendant',
    department: 'housekeeping',
    shift: 'morning',
    assignedZone: 'Beach Cottages 201-208',
    workloadScore: 35,
    currentTask: 'Beachfront gardens and plunge pools inspected',
    status: 'active',
  },
  {
    id: 'staff-3',
    name: 'Amina Diallo',
    role: 'VIP Butler & Guest Relations',
    department: 'frontdesk',
    shift: 'morning',
    assignedZone: 'Penthouse Residences',
    workloadScore: 30,
    currentTask: 'Jetty arrival lounge prepared for guests',
    status: 'active',
  },
  {
    id: 'staff-4',
    name: 'Julian Thorne',
    role: 'Aquatic Safety & Pool Supervisor',
    department: 'pool',
    shift: 'mid',
    assignedZone: 'Laguna Infinity Pools A & B',
    workloadScore: 30,
    currentTask: 'Pool sanitation and water chemistry certified',
    status: 'active',
  },
  {
    id: 'staff-5',
    name: 'Tomas Richter',
    role: 'Chief Facilities Engineer',
    department: 'maintenance',
    shift: 'morning',
    assignedZone: 'Resort-Wide Systems',
    workloadScore: 35,
    currentTask: 'HVAC and plunge pool heating verification',
    status: 'active',
  },
  {
    id: 'staff-6',
    name: 'Maya Lin',
    role: 'Concierge & Boat Logistics',
    department: 'frontdesk',
    shift: 'mid',
    assignedZone: 'Welcome Jetty & Lounge',
    workloadScore: 25,
    currentTask: 'Speedboat transfer schedule standing by',
    status: 'active',
  },
];

export const INITIAL_WORKFLOWS: CommunicationWorkflow[] = [
  {
    id: 'wf-1',
    type: 'booking_confirmation',
    title: 'Instant Booking Confirmation & Deposit Receipt',
    description: 'Dispatched immediately upon reservation confirmation. Delivers full booking itinerary, room unit specifics, deposit invoice, and check-in guarantees.',
    subject: 'Your Sanctuary is Confirmed: Reservation #{confirmation_code} at Resort Ease',
    channel: 'both',
    triggerSchedule: 'Immediate upon confirmation',
    isActive: true,
    targetAudience: 'All newly confirmed reservations',
    emailBody: `Dear {guest_name},

Thank you for choosing Resort Ease for your upcoming getaway. We are delighted to confirm your reservation.

RESERVATION DETAILS:
• Confirmation Code: {confirmation_code}
• Accommodations: {unit_name}
• Check-In: {check_in_date} (from 14:00)
• Check-Out: {check_out_date} (until 11:00)
• Total Reserved Stay: {total_amount}
• Deposit Secured: {deposit_paid}
• Balance Due upon Check-in: {balance_due}

YOUR INCLUDED PRIVILEGES:
• Dedicated Resort Host & Welcome Speedboat Pier Transfer
• Daily Artisan Tropical Breakfast at The Veranda
• Priority reservation access to Laguna Private Pools & Zen Spa
• High-speed fiber WiFi across island grounds

If you have any dietary preferences, special anniversary celebrations, or arrival details to share, simply reply to this email or contact us at {resort_phone}.

Warmest regards,
The Concierge Team
Resort Ease Eco-Luxury Sanctuary`,
    smsBody: `Resort Ease: Welcome {guest_name}! Your stay at {unit_name} is confirmed (#{confirmation_code}) for {check_in_date}. We look forward to hosting you!`,
    stats: {
      sentTotal: 0,
      openRate: 100,
      responseRate: 0,
    },
  },
  {
    id: 'wf-2',
    type: 'pre_arrival',
    title: 'Pre-Arrival Briefing & Digital Key PIN',
    description: 'Automatically delivered 48 hours before check-in. Informs the guest of arrival logistics, weather forecasts, private pool reservation slots, and keyless access code.',
    subject: 'Preparing for Your Arrival at Resort Ease: Arrival Details & Digital Key',
    channel: 'both',
    triggerSchedule: '48 hours prior to check-in (09:00 AM)',
    isActive: true,
    targetAudience: 'Upcoming arrivals with valid contact',
    emailBody: `Dear {guest_name},

In just two days, your escape to Resort Ease begins. We are preparing {unit_name} to perfection for your arrival on {check_in_date}.

ARRIVAL & TRANSFER LOGISTICS:
• Private Speedboat Pier: Our marine team is stationed at International Terminal Pier 4. Look for the Resort Ease uniformed host holding your name placard.
• Check-In Time: 14:00 (Early arrival hospitality lounge available from 10:00).
• Keyless Digital Passcode: #{digital_key} (active upon arrival).

RESERVE YOUR PRIVATE AMENITIES IN ADVANCE:
Due to high guest demand and our strict zero-overlap sanitation intervals, we recommend pre-booking your favorite experiences:
1. Laguna Private Infinity Pool (Morning & Sunset 3-hour sessions)
2. Zen Wellness Spa: Botanical Couples Massage
3. Sunset Catamaran Snorkeling & Seabob Excursion

To lock in your preferred slots, reply directly to this message or text our Concierge desk at {resort_phone}.

Safe travels,
The Concierge Team | Resort Ease`,
    smsBody: `Resort Ease: In 48 hours we welcome you to {unit_name}! Digital Key PIN: {digital_key}. Reply to pre-book private pool sunset sessions.`,
    stats: {
      sentTotal: 0,
      openRate: 100,
      responseRate: 0,
    },
  },
  {
    id: 'wf-3',
    type: 'mid_stay',
    title: 'Mid-Stay Experience Check-in & Pool Care',
    description: 'Dispatched at 10:00 AM on Day 2 of stay. Inquires about guest comfort, housekeeping preferences, and amenity replenishment.',
    subject: 'Good Morning from Resort Ease: How is Your Stay at {unit_name}?',
    channel: 'both',
    triggerSchedule: 'Day 2 of stay at 10:00 AM',
    isActive: true,
    targetAudience: 'In-house guests on stays of 2+ nights',
    emailBody: `Good morning {guest_name},

We hope you enjoyed a restful night in {unit_name}.

Our commitment is to ensure your sanctuary experience is effortless. Please let us know if we can enhance your stay today:
• Would you like your private plunge pool water temperature fine-tuned?
• Do you need additional plush beach towels or aromatherapy botanical bath salts?
• Would you like our culinary team to prepare an alfresco sunset dinner on your private deck?

Simply reply with any request—our turnaround team is standing by.

With warm regards,
Guest Experience Management | Resort Ease`,
    smsBody: `Good morning {guest_name}! How is everything at {unit_name}? Reply here for fresh towels, private pool temp adjustment, or in-room dining.`,
    stats: {
      sentTotal: 0,
      openRate: 100,
      responseRate: 0,
    },
  },
  {
    id: 'wf-4',
    type: 'post_stay',
    title: 'Post-Stay Gratitude, Digital Folio & Review',
    description: 'Dispatched 2 hours following check-out. Expresses heartfelt gratitude, provides final itemized folio receipt, and invites authentic feedback.',
    subject: 'Thank You for Staying with Us: Your Folio & Memories at Resort Ease',
    channel: 'email',
    triggerSchedule: '2 hours post check-out',
    isActive: true,
    targetAudience: 'Checked-out guests',
    emailBody: `Dear {guest_name},

On behalf of the entire team at Resort Ease, thank you for allowing us to be part of your travel story. It was an honor hosting you in {unit_name}.

ITEMIZED FOLIO & RECEIPT:
Your final folio statement has been reconciled and settled. A complete receipt is attached to your reservation record (#{confirmation_code}).

WE VALUE YOUR PERSPECTIVE:
Your comfort inspires everything we do. If there was a memorable moment or a team member who went above and beyond, we would be deeply grateful if you could share a few words.

We look forward to welcoming you back to your island home.

With sincere gratitude,
Maria Santos, General Manager & The Resort Ease Family`,
    smsBody: `Thank you {guest_name} for choosing Resort Ease! Your final folio has been prepared. We hope to welcome you back soon!`,
    stats: {
      sentTotal: 0,
      openRate: 100,
      responseRate: 0,
    },
  },
];
