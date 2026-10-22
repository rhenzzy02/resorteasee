import React, { useState, useMemo } from 'react';
import { PropertyUnit, Reservation, AmenityItem, AmenityBooking } from '../types/resort';
import { detectTurnaroundRisks } from '../utils/overlapDetection';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Plus,
  Sparkles,
  Info,
  Clock,
  ShieldAlert,
  Waves,
  Building,
} from 'lucide-react';

interface Props {
  units: PropertyUnit[];
  reservations: Reservation[];
  amenities: AmenityItem[];
  amenityBookings: AmenityBooking[];
  onOpenNewReservation: (unitId?: string, checkInDate?: string) => void;
  onOpenNewAmenity: (amenityId?: string, date?: string) => void;
  onSelectReservation: (reservation: Reservation) => void;
}

export const AvailabilityCalendar: React.FC<Props> = ({
  units,
  reservations,
  amenities,
  amenityBookings,
  onOpenNewReservation,
  onOpenNewAmenity,
  onSelectReservation,
}) => {
  // Base date anchor (default around today in demo: 2026-10-21)
  const [baseDateStr, setBaseDateStr] = useState<string>('2026-10-20');
  const [daysCount, setDaysCount] = useState<7 | 10 | 14>(7);
  const [filterType, setFilterType] = useState<'all' | 'rooms' | 'pools'>('all');

  // Compute array of date strings
  const calendarDates = useMemo(() => {
    const dates: string[] = [];
    const base = new Date(baseDateStr);
    for (let i = 0; i < daysCount; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }, [baseDateStr, daysCount]);

  // Turnaround and Overbooking risk analysis
  const turnaroundRisks = useMemo(
    () => detectTurnaroundRisks(units, reservations),
    [units, reservations]
  );

  // Filter items based on tab
  const displayUnits = useMemo(() => {
    if (filterType === 'pools') return [];
    return units;
  }, [units, filterType]);

  const displayPools = useMemo(() => {
    if (filterType === 'rooms') return [];
    return amenities.filter((a) => a.category === 'private_pool' || a.category === 'cabana');
  }, [amenities, filterType]);

  const shiftDate = (deltaDays: number) => {
    const d = new Date(baseDateStr);
    d.setDate(d.getDate() + deltaDays);
    setBaseDateStr(d.toISOString().split('T')[0]);
  };

  const jumpToToday = () => {
    setBaseDateStr('2026-10-21');
  };

  return (
    <div className="space-y-6">
      {/* Risk Alert / Overbooking Radar Banner */}
      {turnaroundRisks.length > 0 ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold">
                  Turnaround & Scheduling Overlap Risk Radar ({turnaroundRisks.length} Notice
                  {turnaroundRisks.length > 1 ? 's' : ''})
                </h4>
                <div className="mt-1 space-y-1 text-xs text-amber-800">
                  {turnaroundRisks.map((risk, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="font-semibold text-amber-950 font-mono">[{risk.unitCode}]</span>
                      <span>{risk.details}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-medium text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md shrink-0">
              Auto-Buffer Active
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">
              Zero Overbooking Collisions Detected · All rooms, cottages, and private pools have
              mandatory 30–120min sanitation buffers.
            </span>
          </div>
          <span className="text-emerald-700 font-mono text-[11px]">Real-time Sync Active</span>
        </div>
      )}

      {/* Calendar Controls & Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        {/* Date Navigator */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => shiftDate(-daysCount)}
            className="p-1.5 border border-stone-300 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
            title="Previous period"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={jumpToToday}
            className="px-3 py-1.5 text-xs font-semibold text-stone-800 hover:bg-stone-100 border border-stone-300 rounded-lg transition-colors"
          >
            Today (Oct 21, 2026)
          </button>
          <button
            onClick={() => shiftDate(daysCount)}
            className="p-1.5 border border-stone-300 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
            title="Next period"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-xs font-medium text-stone-600 ml-2">
            Showing{' '}
            <span className="font-semibold text-stone-900">
              {calendarDates[0]} to {calendarDates[calendarDates.length - 1]}
            </span>
          </span>
        </div>

        {/* View Mode Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs font-medium">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterType === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Assets
            </button>
            <button
              onClick={() => setFilterType('rooms')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterType === 'rooms'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Rooms & Cottages
            </button>
            <button
              onClick={() => setFilterType('pools')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterType === 'pools'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Private Pools & Cabanas
            </button>
          </div>

          <div className="hidden sm:flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs font-medium">
            <button
              onClick={() => setDaysCount(7)}
              className={`px-2.5 py-1 rounded-md ${
                daysCount === 7 ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setDaysCount(14)}
              className={`px-2.5 py-1 rounded-md ${
                daysCount === 14 ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              14 Days
            </button>
          </div>

          <button
            onClick={() => onOpenNewReservation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Accommodations</span>
          </button>
        </div>
      </div>

      {/* Main Gantt / Timeline Matrix */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {/* Legend */}
        <div className="px-5 py-3 border-b border-stone-200 bg-stone-50/70 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-3">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-50 border border-emerald-300"></span>
              <span>Available Slot (Click to Book)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-teal-800"></span>
              <span>Confirmed Stay</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-100 border border-amber-300"></span>
              <span>Turnover / Sanitizing Buffer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-rose-500"></span>
              <span>Potential Risk / Overlap</span>
            </div>
          </div>
          <span className="text-[11px] text-stone-500">
            Click any cell to manage reservation or create instant booking
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-100 text-stone-700 text-xs">
                <th className="p-3 text-left w-64 min-w-[240px] font-semibold sticky left-0 bg-stone-100 z-10 border-r border-stone-200">
                  Asset & Inventory Code
                </th>
                {calendarDates.map((d) => {
                  const dateObj = new Date(d + 'T00:00:00');
                  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum = dateObj.getDate();
                  const isToday = d === '2026-10-21';

                  return (
                    <th
                      key={d}
                      className={`p-2.5 text-center min-w-[110px] font-medium border-r border-stone-200 ${
                        isToday ? 'bg-teal-50/80 text-teal-900 font-bold' : ''
                      }`}
                    >
                      <div className="text-[11px] uppercase tracking-wider text-stone-500">
                        {dayName}
                      </div>
                      <div className="text-sm font-mono mt-0.5">
                        {dayNum} {d.slice(5, 7) === '10' ? 'Oct' : ''}
                      </div>
                      {isToday && (
                        <span className="inline-block mt-0.5 text-[9px] uppercase px-1.5 py-0.2 bg-teal-800 text-white rounded-xs">
                          Today
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-200 text-xs">
              {/* Rooms & Cottages Section */}
              {displayUnits.length > 0 && (
                <>
                  <tr className="bg-stone-50/90 text-stone-600 font-semibold text-[11px] uppercase tracking-wider">
                    <td
                      colSpan={calendarDates.length + 1}
                      className="px-4 py-2 border-b border-stone-200"
                    >
                      <div className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-teal-700" />
                        <span>Villas, Cottages & Penthouses</span>
                      </div>
                    </td>
                  </tr>

                  {displayUnits.map((unit) => (
                    <tr key={unit.id} className="hover:bg-stone-50/50 transition-colors">
                      {/* Unit Column Header */}
                      <td className="p-3 sticky left-0 bg-white hover:bg-stone-50 z-10 border-r border-stone-200 shadow-xs">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                              <span className="font-mono text-teal-900">[{unit.code}]</span>
                              <span className="truncate max-w-[150px]">{unit.name}</span>
                            </div>
                            <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1.5">
                              <span>${unit.baseRatePerNight}/night</span>
                              <span>·</span>
                              <span>{unit.hasPrivatePool ? 'Has Plunge Pool' : 'Garden View'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Date Cells */}
                      {calendarDates.map((dateStr) => {
                        // Find if this unit is booked on this date
                        const activeRes = reservations.find(
                          (r) =>
                            r.unitId === unit.id &&
                            (r.status === 'confirmed' || r.status === 'checked_in') &&
                            dateStr >= r.checkInDate &&
                            dateStr < r.checkOutDate
                        );

                        // Check if today is checkout date (turnover buffer)
                        const isTurnoverDate = reservations.some(
                          (r) =>
                            r.unitId === unit.id &&
                            (r.status === 'confirmed' || r.status === 'checked_in') &&
                            dateStr === r.checkOutDate
                        );

                        // Check if there is an incoming guest on the same day as checkout
                        const hasIncomingGuest = reservations.some(
                          (r) =>
                            r.unitId === unit.id &&
                            (r.status === 'confirmed' || r.status === 'checked_in') &&
                            dateStr === r.checkInDate
                        );

                        const isTurnaroundRisk = isTurnoverDate && hasIncomingGuest;

                        return (
                          <td
                            key={dateStr}
                            className={`p-1.5 border-r border-stone-200 align-top h-14 relative ${
                              dateStr === '2026-10-21' ? 'bg-teal-50/20' : ''
                            }`}
                          >
                            {activeRes ? (
                              <button
                                type="button"
                                onClick={() => onSelectReservation(activeRes)}
                                className={`w-full h-full text-left p-1.5 rounded-md flex flex-col justify-between transition-opacity ${
                                  activeRes.status === 'checked_in'
                                    ? 'bg-teal-800 text-white hover:bg-teal-900'
                                    : 'bg-stone-800 text-white hover:bg-stone-900'
                                }`}
                              >
                                <div className="font-semibold truncate text-[11px] leading-tight">
                                  {activeRes.guestName}
                                </div>
                                <div className="text-[10px] text-teal-200/90 font-mono flex items-center justify-between">
                                  <span>{activeRes.totalNights}n</span>
                                  <span className="capitalize text-[9px] opacity-90">
                                    {activeRes.status === 'checked_in' ? 'In-House' : 'Reserved'}
                                  </span>
                                </div>
                              </button>
                            ) : isTurnoverDate ? (
                              <div
                                onClick={() => onOpenNewReservation(unit.id, dateStr)}
                                className={`w-full h-full p-1.5 rounded-md border flex flex-col justify-between cursor-pointer ${
                                  isTurnaroundRisk
                                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                                    : 'bg-amber-50/70 border-dashed border-amber-300 text-amber-800 hover:bg-amber-100'
                                }`}
                              >
                                <span className="text-[10px] font-medium leading-tight">
                                  {isTurnaroundRisk ? 'Express Turnover' : 'Checkout & Buffer'}
                                </span>
                                <span className="text-[9px] font-mono opacity-80">Avail 14:00+</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onOpenNewReservation(unit.id, dateStr)}
                                className="w-full h-full rounded-md border border-dashed border-stone-200 bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-800 flex items-center justify-center text-[11px] font-medium transition-all group"
                              >
                                <span className="opacity-0 group-hover:opacity-100 text-emerald-700 font-semibold flex items-center gap-1">
                                  <Plus className="w-3 h-3" /> Book
                                </span>
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </>
              )}

              {/* Private Pools & Cabanas Section */}
              {displayPools.length > 0 && (
                <>
                  <tr className="bg-stone-50/90 text-stone-600 font-semibold text-[11px] uppercase tracking-wider">
                    <td
                      colSpan={calendarDates.length + 1}
                      className="px-4 py-2 border-b border-stone-200"
                    >
                      <div className="flex items-center gap-2">
                        <Waves className="w-3.5 h-3.5 text-teal-700" />
                        <span>Private Pools, Sanctuary Cabanas & Wellness Facilities</span>
                      </div>
                    </td>
                  </tr>

                  {displayPools.map((pool) => (
                    <tr key={pool.id} className="hover:bg-stone-50/50 transition-colors">
                      {/* Pool Header */}
                      <td className="p-3 sticky left-0 bg-white hover:bg-stone-50 z-10 border-r border-stone-200 shadow-xs">
                        <div className="font-semibold text-stone-900 truncate max-w-[220px]">
                          {pool.name}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1.5">
                          <span>${pool.hourlyRate}/hr</span>
                          <span>·</span>
                          <span>{pool.prepBufferMinutes}m Sanitation Buffer</span>
                        </div>
                      </td>

                      {/* Date Cells */}
                      {calendarDates.map((dateStr) => {
                        // Find bookings for this amenity on this date
                        const dayBookings = amenityBookings.filter(
                          (b) =>
                            b.amenityId === pool.id &&
                            b.date === dateStr &&
                            (b.status === 'confirmed' || b.status === 'in_use')
                        );

                        return (
                          <td
                            key={dateStr}
                            className={`p-1.5 border-r border-stone-200 align-top h-14 ${
                              dateStr === '2026-10-21' ? 'bg-teal-50/20' : ''
                            }`}
                          >
                            {dayBookings.length > 0 ? (
                              <div className="space-y-1">
                                {dayBookings.map((b) => (
                                  <div
                                    key={b.id}
                                    className="p-1 bg-teal-900 text-white rounded text-[10px] leading-tight"
                                  >
                                    <div className="font-medium truncate">{b.guestName}</div>
                                    <div className="font-mono text-[9px] text-teal-200 flex justify-between">
                                      <span>
                                        {b.startTime}-{b.endTime}
                                      </span>
                                      <span>{b.roomNumber}</span>
                                    </div>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => onOpenNewAmenity(pool.id, dateStr)}
                                  className="w-full text-center text-[9px] text-teal-800 hover:text-teal-950 font-medium py-0.5 border border-dashed border-teal-300 rounded"
                                >
                                  + Add Slot
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onOpenNewAmenity(pool.id, dateStr)}
                                className="w-full h-full rounded-md border border-dashed border-stone-200 bg-emerald-50/20 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-800 flex items-center justify-center text-[10px] transition-all group"
                              >
                                <span className="opacity-0 group-hover:opacity-100 font-semibold flex items-center gap-1">
                                  <Plus className="w-3 h-3" /> Book Pool
                                </span>
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
