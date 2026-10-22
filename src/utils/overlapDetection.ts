import { Reservation, AmenityBooking, PropertyUnit, OverlapConflict } from '../types/resort';

/**
 * Checks if two date ranges (YYYY-MM-DD) overlap.
 * In hotels/resorts, standard convention is check-out day is available for check-in afternoon,
 * but if checkInDate < existingCheckOut && checkOutDate > existingCheckIn, there is an overlap.
 */
export function datesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  return startA < endB && endA > startB;
}

/**
 * Checks whether booking dates conflict with any existing confirmed or checked-in reservation.
 */
export function checkReservationConflict(
  reservations: Reservation[],
  unitId: string,
  checkInDate: string,
  checkOutDate: string,
  allUnits: PropertyUnit[],
  excludeReservationId?: string
): OverlapConflict {
  // Filter active reservations for this unit
  const unitReservations = reservations.filter(
    (r) =>
      r.unitId === unitId &&
      r.id !== excludeReservationId &&
      (r.status === 'confirmed' || r.status === 'checked_in')
  );

  const conflicting = unitReservations.find((r) =>
    datesOverlap(checkInDate, checkOutDate, r.checkInDate, r.checkOutDate)
  );

  if (conflicting) {
    // Find alternative unit of same or higher category
    const currentUnit = allUnits.find((u) => u.id === unitId);
    const alternative = allUnits.find(
      (u) =>
        u.id !== unitId &&
        (u.category === currentUnit?.category || u.baseRatePerNight >= (currentUnit?.baseRatePerNight || 0)) &&
        !reservations.some(
          (r) =>
            r.unitId === u.id &&
            (r.status === 'confirmed' || r.status === 'checked_in') &&
            datesOverlap(checkInDate, checkOutDate, r.checkInDate, r.checkOutDate)
        )
    );

    return {
      hasConflict: true,
      message: `Overbooking collision detected! This unit is already reserved by ${conflicting.guestName} (${conflicting.checkInDate} to ${conflicting.checkOutDate}).`,
      conflictingBookingId: conflicting.confirmationCode,
      conflictingGuest: conflicting.guestName,
      conflictingDates: `${conflicting.checkInDate} – ${conflicting.checkOutDate}`,
      suggestedAlternativeUnit: alternative,
    };
  }

  return { hasConflict: false };
}

/**
 * Time string (HH:MM) to minutes from midnight
 */
export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Minutes from midnight to HH:MM string
 */
export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Check if private pool or amenity slot has overlap, considering sanitation buffer
 */
export function checkAmenityConflict(
  bookings: AmenityBooking[],
  amenityId: string,
  date: string,
  startTime: string,
  endTime: string,
  bufferMinutes: number = 30,
  excludeBookingId?: string
): { hasConflict: boolean; message?: string; conflictingBooking?: AmenityBooking } {
  const startMin = timeToMinutes(startTime);
  const endMin = timeToMinutes(endTime);

  const sameDayBookings = bookings.filter(
    (b) =>
      b.amenityId === amenityId &&
      b.date === date &&
      b.id !== excludeBookingId &&
      (b.status === 'confirmed' || b.status === 'in_use')
  );

  for (const b of sameDayBookings) {
    const existingStart = timeToMinutes(b.startTime);
    // Add turnaround / sanitation buffer to existing end time
    const existingEndWithBuffer = timeToMinutes(b.endTime) + bufferMinutes;
    const requestEndWithBuffer = endMin + bufferMinutes;

    // Check overlap: (StartA < EndB) and (EndA > StartB)
    if (startMin < existingEndWithBuffer && requestEndWithBuffer > existingStart) {
      return {
        hasConflict: true,
        message: `Amenity conflict: Slot overlaps with reservation for ${b.guestName} (Room ${b.roomNumber}, ${b.startTime} - ${b.endTime}) plus ${bufferMinutes}m sanitation turnaround.`,
        conflictingBooking: b,
      };
    }
  }

  return { hasConflict: false };
}

/**
 * Identify potential risk warnings across all units (e.g. back-to-back same day turnarounds under 2 hours)
 */
export interface TurnaroundRisk {
  unitId: string;
  unitCode: string;
  unitName: string;
  date: string;
  departureGuest: string;
  arrivalGuest: string;
  type: 'same_day_turnaround' | 'overlap_error';
  severity: 'warning' | 'critical';
  details: string;
}

export function detectTurnaroundRisks(
  units: PropertyUnit[],
  reservations: Reservation[]
): TurnaroundRisk[] {
  const risks: TurnaroundRisk[] = [];

  units.forEach((unit) => {
    const activeRes = reservations
      .filter(
        (r) =>
          r.unitId === unit.id &&
          (r.status === 'confirmed' || r.status === 'checked_in')
      )
      .sort((a, b) => a.checkInDate.localeCompare(b.checkInDate));

    for (let i = 0; i < activeRes.length - 1; i++) {
      const current = activeRes[i];
      const next = activeRes[i + 1];

      // Direct overlap
      if (current.checkOutDate > next.checkInDate) {
        risks.push({
          unitId: unit.id,
          unitCode: unit.code,
          unitName: unit.name,
          date: next.checkInDate,
          departureGuest: current.guestName,
          arrivalGuest: next.guestName,
          type: 'overlap_error',
          severity: 'critical',
          details: `Direct double-booking overlap! ${current.guestName} dep ${current.checkOutDate} vs ${next.guestName} arr ${next.checkInDate}`,
        });
      } else if (current.checkOutDate === next.checkInDate) {
        // Same-day checkout & checkin: 3-hour turnaround buffer
        risks.push({
          unitId: unit.id,
          unitCode: unit.code,
          unitName: unit.name,
          date: current.checkOutDate,
          departureGuest: current.guestName,
          arrivalGuest: next.guestName,
          type: 'same_day_turnaround',
          severity: 'warning',
          details: `Tight turnover: ${current.guestName} checks out at 11:00 AM, ${next.guestName} arrives at 2:00 PM. Requires express housekeeping team.`,
        });
      }
    }
  });

  return risks;
}
