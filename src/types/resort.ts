export type UnitCategory = 'villa' | 'cottage' | 'suite' | 'cabana' | 'penthouse';

export type UserRole = 'admin' | 'worker';
export type UserDepartment = 'management' | 'housekeeping' | 'frontdesk' | 'maintenance' | 'pool';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department: UserDepartment;
  title: string;
  avatar?: string;
  assignedZone: string;
  shift?: string;
}

export type UnitStatus = 'available' | 'occupied' | 'reserved' | 'turnover' | 'maintenance';

export interface PropertyUnit {
  id: string;
  name: string;
  code: string;
  category: UnitCategory;
  capacity: number;
  baseRatePerNight: number;
  hasPrivatePool: boolean;
  viewType: string;
  status: UnitStatus;
  description: string;
  squareMeters: number;
  image?: string;
  amenityFeatures: string[];
}

export type ReservationStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';

export interface Reservation {
  id: string;
  confirmationCode: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  unitId: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  checkInTime?: string;
  checkOutTime?: string;
  adults: number;
  children: number;
  totalNights: number;
  nightlyRate: number;
  totalAmount: number;
  depositPaid: number;
  balanceDue: number;
  status: ReservationStatus;
  specialRequests: string[];
  assignedHousekeeper?: string;
  notes?: string;
  createdAt: string;
}

export type AmenityCategory = 'private_pool' | 'spa' | 'watersports' | 'dining' | 'cabana';

export interface AmenityItem {
  id: string;
  name: string;
  category: AmenityCategory;
  capacity: number;
  hourlyRate: number;
  prepBufferMinutes: number; // buffer between bookings (cleaning/inspection)
  description: string;
  location: string;
  features: string[];
  image?: string;
}

export interface AmenityBooking {
  id: string;
  amenityId: string;
  guestName: string;
  roomNumber: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  guestsCount: number;
  totalPrice: number;
  status: 'confirmed' | 'in_use' | 'completed' | 'cancelled';
  specialNotes?: string;
  sanitized: boolean;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'linens' | 'pool_spa' | 'minibar' | 'toiletries' | 'equipment';
  currentStock: number;
  minParLevel: number;
  maxCapacity: number;
  unitCost: number;
  unitName: string;
  supplier: string;
  lastRestocked: string;
}

export interface StockTransaction {
  id: string;
  itemId: string;
  itemName: string;
  type: 'consumed' | 'restocked' | 'damaged';
  quantity: number;
  date: string;
  notes: string;
  loggedBy: string;
}

export interface GuestProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  vipTier: 'Standard' | 'Silver' | 'Gold' | 'Diamond';
  totalVisits: number;
  lifetimeSpend: number;
  roomNumber?: string;
  status: 'in_house' | 'arriving_today' | 'departing_today' | 'reserved';
  notes: string;
}

export type ServiceUrgency = 'normal' | 'high' | 'urgent';
export type ServiceStatus = 'pending' | 'dispatched' | 'in_progress' | 'completed';

export interface ServiceRequest {
  id: string;
  guestName: string;
  roomNumber: string;
  category: 'housekeeping' | 'room_service' | 'maintenance' | 'concierge' | 'luggage';
  description: string;
  urgency: ServiceUrgency;
  status: ServiceStatus;
  requestedAt: string;
  assignedTo?: string;
  completedAt?: string;
}

export interface GuestMessage {
  id: string;
  guestId: string;
  guestName: string;
  roomNumber: string;
  timestamp: string;
  sender: 'guest' | 'staff';
  text: string;
}

export interface FolioEntry {
  id: string;
  reservationId: string;
  date: string;
  category: 'room' | 'amenity' | 'dining' | 'spa' | 'tax' | 'payment';
  description: string;
  amount: number;
  isCredit?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: 'housekeeping' | 'pool' | 'frontdesk' | 'maintenance' | 'fb';
  shift: 'morning' | 'mid' | 'evening';
  assignedZone: string;
  workloadScore: number; // 0 to 100%
  currentTask: string;
  status: 'active' | 'on_break' | 'dispatched';
}

export interface OverlapConflict {
  hasConflict: boolean;
  message?: string;
  conflictingBookingId?: string;
  conflictingGuest?: string;
  conflictingDates?: string;
  suggestedAlternativeUnit?: PropertyUnit;
}

export type WorkflowType = 'booking_confirmation' | 'pre_arrival' | 'mid_stay' | 'post_stay';

export interface CommunicationWorkflow {
  id: string;
  type: WorkflowType;
  title: string;
  description: string;
  subject: string;
  channel: 'email' | 'sms' | 'both';
  triggerSchedule: string; // e.g. "Immediate", "48h before arrival", "Mid-stay (Day 2, 10:00 AM)", "2h after checkout"
  isActive: boolean;
  emailBody: string;
  smsBody: string;
  targetAudience: string;
  stats: {
    sentTotal: number;
    openRate: number; // %
    responseRate: number; // %
  };
}

export interface CommunicationLogEntry {
  id: string;
  workflowId: string;
  workflowTitle: string;
  guestName: string;
  recipientEmail: string;
  roomNumber: string;
  channel: 'email' | 'sms' | 'both';
  status: 'delivered' | 'sent' | 'opened';
  timestamp: string;
  renderedSubject: string;
  renderedBody: string;
}

