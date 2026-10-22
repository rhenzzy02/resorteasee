import React, { useState, useMemo } from 'react';
import { AmenityItem, AmenityBooking, PropertyUnit, Reservation } from '../types/resort';
import { checkAmenityConflict } from '../utils/overlapDetection';
import { ShieldAlert, CheckCircle, Clock, X, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amenities: AmenityItem[];
  bookings: AmenityBooking[];
  activeReservations: Reservation[];
  units: PropertyUnit[];
  onSaveBooking: (booking: Omit<AmenityBooking, 'id' | 'sanitized'>) => void;
  initialAmenityId?: string;
  initialDate?: string;
}

export const NewAmenityModal: React.FC<Props> = ({
  isOpen,
  onClose,
  amenities,
  bookings,
  activeReservations,
  units,
  onSaveBooking,
  initialAmenityId,
  initialDate,
}) => {
  const [amenityId, setAmenityId] = useState(initialAmenityId || amenities[0]?.id || '');
  const [date, setDate] = useState(initialDate || '2026-10-21');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('17:00');
  const [selectedResId, setSelectedResId] = useState(activeReservations[0]?.id || '');
  const [customGuestName, setCustomGuestName] = useState('');
  const [customRoomNumber, setCustomRoomNumber] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [specialNotes, setSpecialNotes] = useState('');

  const selectedAmenity = useMemo(
    () => amenities.find((a) => a.id === amenityId),
    [amenities, amenityId]
  );

  const selectedReservation = useMemo(
    () => activeReservations.find((r) => r.id === selectedResId),
    [activeReservations, selectedResId]
  );

  // Derive guest info
  const effectiveGuestName = selectedReservation ? selectedReservation.guestName : customGuestName;
  const assignedUnit = units.find((u) => u.id === selectedReservation?.unitId);
  const effectiveRoomNumber = selectedReservation ? assignedUnit?.code || 'Villa' : customRoomNumber;

  // Calculate duration & price
  const durationHours = useMemo(() => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const totalMinutes = endH * 60 + endM - (startH * 60 + startM);
    return totalMinutes > 0 ? totalMinutes / 60 : 0;
  }, [startTime, endTime]);

  const totalPrice = Math.round(durationHours * (selectedAmenity?.hourlyRate || 0));

  // Conflict detection including sanitation turnaround buffer
  const conflict = useMemo(() => {
    if (!amenityId || !date || !startTime || !endTime || durationHours <= 0) {
      return { hasConflict: false };
    }
    return checkAmenityConflict(
      bookings,
      amenityId,
      date,
      startTime,
      endTime,
      selectedAmenity?.prepBufferMinutes || 30
    );
  }, [bookings, amenityId, date, startTime, endTime, selectedAmenity, durationHours]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (conflict.hasConflict || durationHours <= 0) return;

    onSaveBooking({
      amenityId,
      guestName: effectiveGuestName.trim() || 'Resort Guest',
      roomNumber: effectiveRoomNumber.trim() || 'Day Guest',
      date,
      startTime,
      endTime,
      guestsCount,
      totalPrice,
      status: 'confirmed',
      specialNotes: specialNotes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-teal-950 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Schedule Private Pool & Amenity</h2>
            <p className="text-xs text-teal-200/80 mt-0.5">
              Includes automated 30-min sanitation buffers to eliminate double bookings.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-teal-300 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Conflict Alert */}
          {conflict.hasConflict ? (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block mb-0.5">Time Slot Conflict Detected!</span>
                  <span>{conflict.message}</span>
                </div>
              </div>
            </div>
          ) : (
            durationHours > 0 && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Slot available! Automatically reserving {selectedAmenity?.prepBufferMinutes || 30}
                  m post-session sanitation buffer.
                </span>
              </div>
            )
          )}

          {/* Amenity Picker */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Select Facility / Private Pool
            </label>
            <select
              value={amenityId}
              onChange={(e) => setAmenityId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg bg-stone-50"
              required
            >
              {amenities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} — ${a.hourlyRate}/hr ({a.location})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 font-mono"
                required
              />
            </div>
          </div>

          {/* Guest Link */}
          <div className="border-t border-stone-200 pt-3">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Link to In-House Guest Folio
            </label>
            <select
              value={selectedResId}
              onChange={(e) => setSelectedResId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg bg-stone-50 mb-2"
            >
              <option value="">— Or specify external / walk-in guest below —</option>
              {activeReservations.map((r) => {
                const u = units.find((un) => un.id === r.unitId);
                return (
                  <option key={r.id} value={r.id}>
                    {r.guestName} [{u?.code || 'Room'}] · Dep {r.checkOutDate}
                  </option>
                );
              })}
            </select>

            {!selectedResId && (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <input
                  type="text"
                  placeholder="Guest Name"
                  value={customGuestName}
                  onChange={(e) => setCustomGuestName(e.target.value)}
                  className="px-3 py-2 text-xs border border-stone-300 rounded-lg"
                  required={!selectedResId}
                />
                <input
                  type="text"
                  placeholder="Room / Villa #"
                  value={customRoomNumber}
                  onChange={(e) => setCustomRoomNumber(e.target.value)}
                  className="px-3 py-2 text-xs border border-stone-300 rounded-lg"
                  required={!selectedResId}
                />
              </div>
            )}
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-xs text-stone-600 mb-1">
              Setup & Amenity Notes (e.g. Towel count, champagne setup, fruit plate)
            </label>
            <textarea
              rows={2}
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Chilled coconuts and four beach towels setup at 14:00"
              className="w-full p-2.5 text-xs border border-stone-300 rounded-lg bg-stone-50"
            />
          </div>

          {/* Price Bar */}
          <div className="flex items-center justify-between p-3 bg-stone-100 rounded-lg text-xs font-medium">
            <span className="text-stone-600">
              Session: {durationHours.toFixed(1)} hrs @ ${selectedAmenity?.hourlyRate}/hr
            </span>
            <span className="font-mono tabular-nums text-base font-bold text-stone-900">
              Total: ${totalPrice}
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={conflict.hasConflict || durationHours <= 0}
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-700 disabled:opacity-40 rounded-lg"
            >
              Confirm Amenity Slot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
