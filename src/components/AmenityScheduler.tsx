import React, { useState } from 'react';
import { AmenityItem, AmenityBooking, PropertyUnit } from '../types/resort';
import {
  Waves,
  Sparkles,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface Props {
  amenities: AmenityItem[];
  bookings: AmenityBooking[];
  units: PropertyUnit[];
  onOpenNewBooking: (amenityId?: string) => void;
  onUpdateBookingStatus: (
    bookingId: string,
    status: AmenityBooking['status'],
    sanitized?: boolean
  ) => void;
}

export const AmenityScheduler: React.FC<Props> = ({
  amenities,
  bookings,
  units,
  onOpenNewBooking,
  onUpdateBookingStatus,
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-10-21');
  const [selectedAmenityCategory, setSelectedAmenityCategory] = useState<string>('all');

  const filteredAmenities = amenities.filter((a) => {
    if (selectedAmenityCategory === 'all') return true;
    return a.category === selectedAmenityCategory;
  });

  const dayBookings = bookings.filter((b) => b.date === selectedDate);

  return (
    <div className="space-y-6">
      {/* Top Banner & Date Picker */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-stone-900 tracking-tight">
            Private Pools & Amenity Scheduling Matrix
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Strict session allocation with mandatory 30-min sanitation intervals between guest parties.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category filter */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs font-medium">
            <button
              onClick={() => setSelectedAmenityCategory('all')}
              className={`px-3 py-1 rounded-md ${
                selectedAmenityCategory === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600'
              }`}
            >
              All Amenities
            </button>
            <button
              onClick={() => setSelectedAmenityCategory('private_pool')}
              className={`px-3 py-1 rounded-md ${
                selectedAmenityCategory === 'private_pool'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600'
              }`}
            >
              Private Pools
            </button>
            <button
              onClick={() => setSelectedAmenityCategory('spa')}
              className={`px-3 py-1 rounded-md ${
                selectedAmenityCategory === 'spa'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600'
              }`}
            >
              Spa & Wellness
            </button>
            <button
              onClick={() => setSelectedAmenityCategory('cabana')}
              className={`px-3 py-1 rounded-md ${
                selectedAmenityCategory === 'cabana'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600'
              }`}
            >
              Cabanas
            </button>
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-1.5 text-xs border border-stone-300 rounded-lg bg-stone-50 font-mono"
            />
          </div>

          <button
            onClick={() => onOpenNewBooking()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Private Session</span>
          </button>
        </div>
      </div>

      {/* Amenity Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredAmenities.map((amenity) => {
          const amenitySlots = dayBookings.filter((b) => b.amenityId === amenity.id);

          return (
            <div
              key={amenity.id}
              className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-stone-200 bg-stone-50/70 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-teal-900 text-white rounded-lg shrink-0">
                    <Waves className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">{amenity.name}</h3>
                    <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-2">
                      <span>{amenity.location}</span>
                      <span>·</span>
                      <span className="font-mono text-teal-900 font-semibold">
                        ${amenity.hourlyRate}/hour
                      </span>
                      <span>·</span>
                      <span>{amenity.prepBufferMinutes}m turnover buffer</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenNewBooking(amenity.id)}
                  className="px-2.5 py-1 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md transition-colors"
                >
                  + Add Slot
                </button>
              </div>

              {/* Slots List */}
              <div className="p-4 space-y-3 flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                  Scheduled Sessions for {selectedDate}
                </div>

                {amenitySlots.length === 0 ? (
                  <div className="p-6 border border-dashed border-stone-200 rounded-lg text-center text-xs text-stone-400">
                    No sessions reserved for this date. All morning, afternoon, and sunset slots
                    are open.
                  </div>
                ) : (
                  amenitySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-3 rounded-lg border border-stone-200 bg-stone-50 hover:bg-white transition-colors text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900 text-xs">
                            {slot.startTime} – {slot.endTime}
                          </span>
                          <span className="text-stone-300">·</span>
                          <span className="font-semibold text-stone-800">{slot.guestName}</span>
                          <span className="font-mono text-[11px] text-teal-800 font-medium">
                            [{slot.roomNumber}]
                          </span>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            slot.status === 'in_use'
                              ? 'bg-amber-100 text-amber-900'
                              : slot.status === 'completed'
                              ? 'bg-stone-200 text-stone-700'
                              : 'bg-teal-100 text-teal-900'
                          }`}
                        >
                          {slot.status === 'in_use' ? 'In Session' : slot.status}
                        </span>
                      </div>

                      {slot.specialNotes && (
                        <p className="text-[11px] text-stone-600 bg-white p-2 rounded border border-stone-100">
                          {slot.specialNotes}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-stone-200/80 text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="text-stone-500">
                            Sanitation Status:
                          </span>
                          {slot.sanitized ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Sanitized & Inspected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                              <Clock className="w-3.5 h-3.5" />
                              Turnover Buffer in Progress
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {slot.status === 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => onUpdateBookingStatus(slot.id, 'in_use')}
                              className="px-2 py-0.5 text-[11px] bg-stone-800 text-white rounded hover:bg-stone-900"
                            >
                              Check-In Session
                            </button>
                          )}
                          {slot.status === 'in_use' && (
                            <button
                              type="button"
                              onClick={() => onUpdateBookingStatus(slot.id, 'completed', true)}
                              className="px-2 py-0.5 text-[11px] bg-teal-800 text-white rounded hover:bg-teal-700"
                            >
                              Complete & Sanitize
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Amenity Features Tag strip */}
              <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-200 text-[11px] text-stone-500 flex flex-wrap gap-2">
                {amenity.features.map((f, i) => (
                  <span key={i} className="text-stone-600">
                    {f}
                    {i < amenity.features.length - 1 ? ' ·' : ''}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
