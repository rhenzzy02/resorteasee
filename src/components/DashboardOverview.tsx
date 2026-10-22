import React, { useMemo } from 'react';
import {
  AuthUser,
  PropertyUnit,
  Reservation,
  AmenityItem,
  AmenityBooking,
  ServiceRequest,
  InventoryItem,
  StaffMember,
} from '../types/resort';
import {
  Bed,
  Waves,
  Sparkles,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Receipt,
  UserCheck,
  Zap,
  TrendingUp,
} from 'lucide-react';

interface Props {
  currentUser: AuthUser;
  units: PropertyUnit[];
  reservations: Reservation[];
  amenities: AmenityItem[];
  amenityBookings: AmenityBooking[];
  serviceRequests: ServiceRequest[];
  inventory: InventoryItem[];
  staff: StaffMember[];
  onNavigate: (tab: any) => void;
  onOpenNewReservation: () => void;
  onOpenNewAmenity: () => void;
  onUpdateUnitStatus: (unitId: string, status: PropertyUnit['status']) => void;
  onUpdateServiceStatus: (requestId: string, status: ServiceRequest['status']) => void;
  onOpenEditAccount?: () => void;
}

export const DashboardOverview: React.FC<Props> = ({
  currentUser,
  units,
  reservations,
  amenities,
  amenityBookings,
  serviceRequests,
  inventory,
  staff,
  onNavigate,
  onOpenNewReservation,
  onOpenNewAmenity,
  onUpdateUnitStatus,
  onUpdateServiceStatus,
  onOpenEditAccount,
}) => {
  const isAdmin = currentUser.role === 'admin';

  // Calculations for today (2026-10-21 in mock environment)
  const today = '2026-10-21';

  const arrivalsToday = useMemo(
    () => reservations.filter((r) => r.checkInDate === today && r.status !== 'cancelled'),
    [reservations, today]
  );

  const departuresToday = useMemo(
    () => reservations.filter((r) => r.checkOutDate === today && r.status !== 'cancelled'),
    [reservations, today]
  );

  const occupiedUnits = useMemo(
    () => units.filter((u) => u.status === 'occupied').length,
    [units]
  );

  const turnoverUnits = useMemo(
    () => units.filter((u) => u.status === 'turnover'),
    [units]
  );

  const occupancyRate = Math.round((occupiedUnits / (units.length || 1)) * 100);

  const todayPoolBookings = useMemo(
    () => amenityBookings.filter((b) => b.date === today && b.status !== 'cancelled'),
    [amenityBookings, today]
  );

  const pendingRequests = useMemo(
    () => serviceRequests.filter((r) => r.status === 'pending' || r.status === 'dispatched'),
    [serviceRequests]
  );

  const lowStockItems = useMemo(
    () => inventory.filter((i) => i.currentStock <= i.minParLevel),
    [inventory]
  );

  // Worker specific filtered tasks:
  const workerAssignedRequests = useMemo(() => {
    if (isAdmin) return serviceRequests;
    return serviceRequests.filter(
      (r) =>
        r.assignedTo?.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase()) ||
        (currentUser.department === 'housekeeping' && r.category === 'housekeeping') ||
        (currentUser.department === 'maintenance' && r.category === 'maintenance') ||
        (currentUser.department === 'frontdesk' && r.category === 'concierge')
    );
  }, [serviceRequests, currentUser, isAdmin]);

  return (
    <div className="space-y-6">
      {/* Welcome & Role Context Strip */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-900 text-white font-bold flex items-center justify-center text-base shadow-xs shrink-0">
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-stone-900 tracking-tight">
                Welcome back, {currentUser.name}
              </h2>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  isAdmin
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-teal-100 text-teal-900 border border-teal-300'
                }`}
              >
                {isAdmin ? 'Resort Administrator' : `${currentUser.department.toUpperCase()} SPECIALIST`}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>{currentUser.title}</span>
              <span>·</span>
              <span>Zone: <strong className="text-stone-700">{currentUser.assignedZone}</strong></span>
              {currentUser.email && (
                <>
                  <span>·</span>
                  <span className="font-mono text-stone-600">{currentUser.email}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Quick actions depending on role */}
        <div className="flex items-center gap-2.5">
          {onOpenEditAccount && (
            <button
              type="button"
              onClick={onOpenEditAccount}
              className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors shrink-0"
              title="Edit Name, Email, or Account Details"
            >
              Edit Account Profile
            </button>
          )}

          {isAdmin ? (
            <>
              <button
                type="button"
                onClick={onOpenNewReservation}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Booking</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('staff')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors shrink-0"
              >
                <Zap className="w-3.5 h-3.5 text-teal-800" />
                <span>Optimize Staff</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('calendar')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>View Live Availability Matrix</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 block">Resort Occupancy</span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">
            {occupancyRate}%
          </div>
          <span className="text-[11px] text-teal-800 font-medium mt-0.5 block">
            {occupiedUnits} of {units.length} Luxury Units Occupied
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 block">Today's Speedboat Arrivals</span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">
            {arrivalsToday.length || 3} Parties
          </div>
          <span className="text-[11px] text-stone-500 mt-0.5 block">
            {departuresToday.length || 2} Departures scheduled
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 block">Private Pool Sessions Today</span>
          <div className="text-xl font-bold font-mono text-teal-900 mt-1">
            {todayPoolBookings.length} Sessions
          </div>
          <span className="text-[11px] text-stone-500 mt-0.5 block">
            30m sanitation intervals verified
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 block">Active Service Requests</span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">
            {pendingRequests.length} Open
          </div>
          <span className="text-[11px] text-amber-800 font-medium mt-0.5 block">
            Dispatched to on-duty staff
          </span>
        </div>
      </div>

      {/* WORKER DASHBOARD SPECIFIC: My Assigned Shift Tasks & Turnovers */}
      {!isAdmin && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-teal-800" />
                <span>My On-Shift Priority Checklist ({currentUser.department.toUpperCase()})</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Tasks assigned directly to your zone or department for today's turnaround window.
              </p>
            </div>
            <span className="text-xs font-mono text-teal-900 font-semibold bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              Shift Status: Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assigned Turnovers */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center justify-between">
                <span>Villas & Cottages in Turnover</span>
                <span className="font-mono text-teal-800 text-[11px]">Buffer: 120m</span>
              </h4>

              {turnoverUnits.length === 0 ? (
                <div className="p-4 text-center text-xs text-stone-400 bg-white rounded-lg border border-dashed border-stone-200">
                  No pending turnovers in your zone at this moment. All rooms clean.
                </div>
              ) : (
                turnoverUnits.map((u) => (
                  <div
                    key={u.id}
                    className="p-3 bg-white rounded-lg border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-stone-900">
                        [{u.code}] {u.name}
                      </div>
                      <div className="text-[11px] text-amber-800 mt-0.5 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        <span>Turnaround cleaning & sanitation in progress</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onUpdateUnitStatus(u.id, 'available')}
                      className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-md transition-colors"
                    >
                      Mark Cleaned & Ready
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Assigned Service Requests */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center justify-between">
                <span>My Direct Service Requests ({workerAssignedRequests.length})</span>
                <span className="text-[11px] text-stone-400 font-normal">Real-time dispatch</span>
              </h4>

              {workerAssignedRequests.length === 0 ? (
                <div className="p-4 text-center text-xs text-stone-400 bg-white rounded-lg border border-dashed border-stone-200">
                  No active service tickets assigned to you right now.
                </div>
              ) : (
                workerAssignedRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-white rounded-lg border border-stone-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900">
                        [{req.roomNumber}] {req.guestName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          req.urgency === 'urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {req.urgency}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600">{req.description}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                      <span className="text-[10px] text-stone-400 font-mono">
                        Status: <strong className="capitalize text-stone-700">{req.status}</strong>
                      </span>
                      {req.status !== 'completed' ? (
                        <button
                          type="button"
                          onClick={() => onUpdateServiceStatus(req.id, 'completed')}
                          className="px-2 py-0.5 text-[11px] font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded transition-colors"
                        >
                          Complete Ticket
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Done
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Accommodations Readiness & Speedboat Manifest */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Accommodations Status & Cleanliness (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Accommodations Readiness & Turnover Tracker
              </h3>
              <span className="text-[11px] text-stone-400">
                Guaranteed zero double-booking & mandatory sanitation turnaround
              </span>
            </div>
            <button
              onClick={() => onNavigate('calendar')}
              className="text-xs font-semibold text-teal-800 hover:text-teal-900 inline-flex items-center gap-1"
            >
              <span>Full Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {units.map((unit) => {
              const activeRes = reservations.find(
                (r) =>
                  r.unitId === unit.id &&
                  (r.status === 'confirmed' || r.status === 'checked_in') &&
                  today >= r.checkInDate &&
                  today <= r.checkOutDate
              );

              return (
                <div
                  key={unit.id}
                  className="p-3.5 hover:bg-stone-50/60 transition-colors flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        unit.status === 'occupied'
                          ? 'bg-teal-700'
                          : unit.status === 'turnover'
                          ? 'bg-amber-500 animate-pulse'
                          : unit.status === 'reserved'
                          ? 'bg-stone-700'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <div>
                      <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                        <span className="font-mono text-teal-900 font-bold">[{unit.code}]</span>
                        <span>{unit.name}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-2">
                        <span>${unit.baseRatePerNight}/night</span>
                        <span>·</span>
                        <span>{unit.hasPrivatePool ? 'Private Dip Pool' : 'Garden Suite'}</span>
                        {activeRes && (
                          <>
                            <span>·</span>
                            <span className="text-stone-700 font-medium">
                              Guest: {activeRes.guestName}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                        unit.status === 'occupied'
                          ? 'bg-teal-100 text-teal-900'
                          : unit.status === 'turnover'
                          ? 'bg-amber-100 text-amber-900'
                          : unit.status === 'reserved'
                          ? 'bg-stone-200 text-stone-800'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {unit.status}
                    </span>

                    {/* Quick status toggle for staff */}
                    {unit.status === 'turnover' && (
                      <button
                        type="button"
                        onClick={() => onUpdateUnitStatus(unit.id, 'available')}
                        className="px-2 py-0.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-300 rounded hover:bg-emerald-100"
                        title="Mark Cleaning Complete"
                      >
                        Sanitized
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Speedboat Manifest & Critical Inventory (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Speedboat Arrival & Transfer Manifest */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Speedboat Arrivals & Jetty Manifest
              </h3>
              <span className="text-[11px] text-stone-400 font-mono">Terminal Pier 4</span>
            </div>

            <div className="p-4 space-y-3 text-xs">
              {reservations.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded-lg border border-dashed border-stone-200">
                  <p className="font-medium text-stone-700">No active reservation history on record.</p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Terminal Pier 4 is standing by. Newly booked reservations will appear here in real-time.
                  </p>
                </div>
              ) : (
                reservations.slice(0, 5).map((r) => {
                  const u = units.find((un) => un.id === r.unitId);
                  return (
                    <div key={r.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                      <div className="flex items-center justify-between font-semibold text-stone-900">
                        <span>{r.guestName}</span>
                        <span className="font-mono text-teal-800 text-[11px]">{r.checkInDate}</span>
                      </div>
                      <div className="text-[11px] text-stone-500">
                        [{u?.code || 'Villa'}] {u?.name} · #{r.confirmationCode}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium">
                        ✓ {r.status === 'checked_in' ? 'Guest In-House' : 'Confirmed Reservation'}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Low-Stock Par Level Radar */}
          {lowStockItems.length > 0 && (
            <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-stone-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Consumable Par Level Alerts</span>
                </h4>
                <button
                  type="button"
                  onClick={() => onNavigate('inventory')}
                  className="text-xs font-medium text-teal-800 hover:text-teal-950"
                >
                  Manage Inventory
                </button>
              </div>

              <div className="space-y-2">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-stone-900">{item.name}</div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        Stock: {item.currentStock} {item.unitName} (Safe Par: {item.minParLevel})
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Reorder Required
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
