import React, { useState, useMemo } from 'react';
import { PropertyUnit, Reservation, OverlapConflict } from '../types/resort';
import { checkReservationConflict } from '../utils/overlapDetection';
import { AlertTriangle, CheckCircle, Calendar, User, Phone, Mail, ShieldAlert, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  units: PropertyUnit[];
  reservations: Reservation[];
  onSaveReservation: (reservation: Omit<Reservation, 'id' | 'confirmationCode' | 'createdAt'>) => void;
  initialUnitId?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
}

export const NewReservationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  units,
  reservations,
  onSaveReservation,
  initialUnitId,
  initialCheckIn,
  initialCheckOut,
}) => {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [unitId, setUnitId] = useState(initialUnitId || units[0]?.id || '');
  const [checkInDate, setCheckInDate] = useState(initialCheckIn || '2026-10-22');
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut || '2026-10-25');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [specialRequestsText, setSpecialRequestsText] = useState('');
  const [notes, setNotes] = useState('');

  // Selected unit details
  const selectedUnit = useMemo(() => units.find((u) => u.id === unitId), [units, unitId]);

  // Calculate nights
  const totalNights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    return diff > 0 ? diff : 0;
  }, [checkInDate, checkOutDate]);

  const nightlyRate = selectedUnit?.baseRatePerNight || 0;
  const totalAmount = totalNights * nightlyRate;
  const depositPaid = Math.round(totalAmount * 0.3); // 30% standard deposit
  const balanceDue = totalAmount - depositPaid;

  // Real-time Overlap Conflict Detection!
  const conflict: OverlapConflict = useMemo(() => {
    if (!unitId || !checkInDate || !checkOutDate || totalNights <= 0) {
      return { hasConflict: false };
    }
    return checkReservationConflict(reservations, unitId, checkInDate, checkOutDate, units);
  }, [reservations, unitId, checkInDate, checkOutDate, units, totalNights]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (conflict.hasConflict) {
      return;
    }
    if (totalNights <= 0) {
      return;
    }

    const specialReqs = specialRequestsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    onSaveReservation({
      guestId: `guest-${Date.now()}`,
      guestName: guestName.trim() || 'Valued Guest',
      guestEmail: guestEmail.trim() || 'guest@example.com',
      guestPhone: guestPhone.trim() || '+1 (555) 000-0000',
      unitId,
      checkInDate,
      checkOutDate,
      adults,
      children,
      totalNights,
      nightlyRate,
      totalAmount,
      depositPaid,
      balanceDue,
      status: 'confirmed',
      specialRequests: specialReqs,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Create Overlap-Free Reservation</h2>
            <p className="text-xs text-stone-300 mt-0.5">
              Automated clash detection guarantees zero double-booking for rooms & cottages.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Real-time Overlap Conflict Warning Banner */}
          {conflict.hasConflict && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-900">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <div className="font-semibold text-sm">Booking Collision Detected!</div>
                  <p className="text-xs leading-relaxed text-rose-800">{conflict.message}</p>
                  {conflict.suggestedAlternativeUnit && (
                    <div className="pt-2">
                      <div className="text-xs font-medium text-rose-900 mb-1">
                        Recommended Available Alternative:
                      </div>
                      <button
                        type="button"
                        onClick={() => setUnitId(conflict.suggestedAlternativeUnit!.id)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-900 text-white text-xs font-medium rounded-md hover:bg-rose-800 transition-colors"
                      >
                        Switch to {conflict.suggestedAlternativeUnit.name} (
                        {conflict.suggestedAlternativeUnit.code}) · $
                        {conflict.suggestedAlternativeUnit.baseRatePerNight}/night
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!conflict.hasConflict && totalNights > 0 && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Unit verified available for selected dates with proper cleaning buffer.</span>
            </div>
          )}

          {/* Unit & Dates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Select Accommodations
              </label>
              <select
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700"
                required
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    [{u.code}] {u.name} — ${u.baseRatePerNight}/night ({u.viewType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Check-In Date
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Check-Out Date
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Guests (Adults + Kids)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-1/2 px-3 py-2 text-sm border border-stone-300 rounded-lg bg-stone-50 text-center"
                  placeholder="Adults"
                />
                <input
                  type="number"
                  min="0"
                  max="6"
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="w-1/2 px-3 py-2 text-sm border border-stone-300 rounded-lg bg-stone-50 text-center"
                  placeholder="Kids"
                />
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="border-t border-stone-200 pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
              Primary Guest Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-stone-600 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Liam Henderson"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg bg-stone-50 focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-stone-600 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="guest@domain.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg bg-stone-50 focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-stone-600 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2834"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg bg-stone-50 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Summary Box */}
          <div className="p-4 bg-stone-100 rounded-lg border border-stone-200">
            <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
              <span>
                {totalNights} Night(s) × ${nightlyRate.toLocaleString()}
              </span>
              <span className="font-mono tabular-nums font-medium text-stone-900">
                ${totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
              <span>30% Advance Deposit Due</span>
              <span className="font-mono tabular-nums font-semibold text-teal-800">
                ${depositPaid.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-200">
              <span className="font-semibold text-stone-900">Remaining Balance upon Arrival</span>
              <span className="font-mono tabular-nums font-bold text-stone-900 text-sm">
                ${balanceDue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Special Requests & Operations Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-stone-600 mb-1">
                Guest Requests (one per line)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Champagne setup upon arrival&#10;Speedboat transfer arrival at 14:00"
                value={specialRequestsText}
                onChange={(e) => setSpecialRequestsText(e.target.value)}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-lg bg-stone-50"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-600 mb-1">
                Internal Operations Notes
              </label>
              <textarea
                rows={2}
                placeholder="e.g. VIP guest referral from corporate partner"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-lg bg-stone-50"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={conflict.hasConflict || totalNights <= 0}
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors"
            >
              Confirm & Lock Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
