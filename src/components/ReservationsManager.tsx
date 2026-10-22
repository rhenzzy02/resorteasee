import React, { useState, useMemo } from 'react';
import { PropertyUnit, Reservation, FolioEntry } from '../types/resort';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  User,
  ShieldAlert,
  ArrowRight,
  Receipt,
  LogOut,
  LogIn,
  Bed,
  Waves,
} from 'lucide-react';

interface Props {
  units: PropertyUnit[];
  reservations: Reservation[];
  onOpenNewReservation: (unitId?: string) => void;
  onUpdateReservationStatus: (
    reservationId: string,
    newStatus: Reservation['status']
  ) => void;
  onOpenFolio: (reservation: Reservation) => void;
}

export const ReservationsManager: React.FC<Props> = ({
  units,
  reservations,
  onOpenNewReservation,
  onUpdateReservationStatus,
  onOpenFolio,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked_in' | 'confirmed' | 'checked_out'>('all');
  const [selectedUnitCategory, setSelectedUnitCategory] = useState<string>('all');

  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      const matchSearch =
        r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.confirmationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.guestEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'all' || r.status === statusFilter;

      const unit = units.find((u) => u.id === r.unitId);
      const matchCategory =
        selectedUnitCategory === 'all' || unit?.category === selectedUnitCategory;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [reservations, searchQuery, statusFilter, selectedUnitCategory, units]);

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by guest name, confirmation code, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs font-medium">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All ({reservations.length})
            </button>
            <button
              onClick={() => setStatusFilter('checked_in')}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === 'checked_in'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              In-House ({reservations.filter((r) => r.status === 'checked_in').length})
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === 'confirmed'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Upcoming ({reservations.filter((r) => r.status === 'confirmed').length})
            </button>
            <button
              onClick={() => setStatusFilter('checked_out')}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === 'checked_out'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Checked Out
            </button>
          </div>

          <button
            onClick={() => onOpenNewReservation()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Reservation</span>
          </button>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-600 font-semibold border-b border-stone-200">
              <tr>
                <th className="px-4 py-3">Confirmation & Guest</th>
                <th className="px-4 py-3">Accommodations</th>
                <th className="px-4 py-3">Stay Dates</th>
                <th className="px-4 py-3">Financials</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-stone-400">
                    No reservations matched your query.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => {
                  const unit = units.find((u) => u.id === res.unitId);

                  return (
                    <tr key={res.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Guest & Code */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-stone-900 flex items-center gap-2">
                          <span>{res.guestName}</span>
                          <span className="font-mono text-[10px] text-stone-500 font-normal">
                            #{res.confirmationCode}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {res.guestEmail} · {res.adults} Adults
                          {res.children > 0 ? `, ${res.children} Kids` : ''}
                        </div>
                      </td>

                      {/* Unit */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-stone-900 flex items-center gap-1.5">
                          <span className="font-mono text-teal-800 font-semibold">
                            [{unit?.code || 'N/A'}]
                          </span>
                          <span className="truncate max-w-[170px]">{unit?.name}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1">
                          {unit?.hasPrivatePool && (
                            <span className="text-teal-800 font-medium">Private Plunge Pool ·</span>
                          )}
                          <span>${unit?.baseRatePerNight}/night</span>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="px-4 py-3 font-mono text-[11px]">
                        <div className="font-medium text-stone-800">
                          {res.checkInDate} → {res.checkOutDate}
                        </div>
                        <div className="text-[10px] text-stone-500 font-sans">
                          {res.totalNights} Night(s) Stay
                        </div>
                      </td>

                      {/* Financials */}
                      <td className="px-4 py-3 font-mono text-[11px] tabular-nums">
                        <div className="font-bold text-stone-900">
                          ${res.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-stone-500 font-sans">
                          Paid: ${res.depositPaid.toLocaleString()} · Due: ${res.balanceDue.toLocaleString()}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            res.status === 'checked_in'
                              ? 'bg-teal-100 text-teal-900'
                              : res.status === 'confirmed'
                              ? 'bg-stone-200 text-stone-800'
                              : res.status === 'checked_out'
                              ? 'bg-stone-100 text-stone-500'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {res.status === 'checked_in'
                            ? 'In-House'
                            : res.status === 'confirmed'
                            ? 'Confirmed'
                            : res.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {res.status === 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => onUpdateReservationStatus(res.id, 'checked_in')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-white bg-teal-800 hover:bg-teal-700 rounded-md transition-colors"
                              title="Check In Guest"
                            >
                              <LogIn className="w-3 h-3" />
                              <span>Check In</span>
                            </button>
                          )}

                          {res.status === 'checked_in' && (
                            <button
                              type="button"
                              onClick={() => onUpdateReservationStatus(res.id, 'checked_out')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md transition-colors"
                              title="Check Out Guest (Triggers Cleaning Buffer)"
                            >
                              <LogOut className="w-3 h-3" />
                              <span>Check Out</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onOpenFolio(res)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md transition-colors"
                            title="Open Guest Folio Statement"
                          >
                            <Receipt className="w-3 h-3" />
                            <span>Folio</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
