import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { AvailabilityCalendar } from './components/AvailabilityCalendar';
import { ReservationsManager } from './components/ReservationsManager';
import { AmenityScheduler } from './components/AmenityScheduler';
import { CommunicationWorkflows } from './components/CommunicationWorkflows';
import { InventoryTracker } from './components/InventoryTracker';
import { GuestServicesHub } from './components/GuestServicesHub';
import { StaffOptimization } from './components/StaffOptimization';
import { FinancialReporting } from './components/FinancialReporting';
import { NewReservationModal } from './components/NewReservationModal';
import { NewAmenityModal } from './components/NewAmenityModal';
import { FolioModal } from './components/FolioModal';
import { EditAccountModal } from './components/EditAccountModal';
import { CreateAccountPage } from './components/CreateAccountPage';
import { LoginPage } from './components/LoginPage';

import {
  INITIAL_UNITS,
  INITIAL_AMENITIES,
  INITIAL_RESERVATIONS,
  INITIAL_AMENITY_BOOKINGS,
  INITIAL_INVENTORY,
  INITIAL_GUESTS,
  INITIAL_SERVICE_REQUESTS,
  INITIAL_MESSAGES,
  INITIAL_STAFF,
  INITIAL_WORKFLOWS,
  INITIAL_COMM_LOGS,
  INITIAL_FOLIO_ENTRIES,
  DEMO_USERS,
} from './data/mockData';

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
} from './types/resort';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('resortease_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Core State with LocalStorage persistence - Clean reservation history slate
  const [units, setUnits] = useState<PropertyUnit[]>(() => {
    const saved = localStorage.getItem('resortease_units_clean');
    return saved ? JSON.parse(saved) : INITIAL_UNITS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('resortease_reservations_clean');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [amenities, setAmenities] = useState<AmenityItem[]>(() => {
    const saved = localStorage.getItem('resortease_amenities');
    return saved ? JSON.parse(saved) : INITIAL_AMENITIES;
  });

  const [amenityBookings, setAmenityBookings] = useState<AmenityBooking[]>(() => {
    const saved = localStorage.getItem('resortease_amenity_bookings');
    return saved ? JSON.parse(saved) : INITIAL_AMENITY_BOOKINGS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('resortease_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [guests, setGuests] = useState<GuestProfile[]>(() => {
    const saved = localStorage.getItem('resortease_guests');
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem('resortease_service_requests');
    return saved ? JSON.parse(saved) : INITIAL_SERVICE_REQUESTS;
  });

  const [messages, setMessages] = useState<GuestMessage[]>(() => {
    const saved = localStorage.getItem('resortease_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('resortease_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [workflows, setWorkflows] = useState<CommunicationWorkflow[]>(() => {
    const saved = localStorage.getItem('resortease_workflows');
    return saved ? JSON.parse(saved) : INITIAL_WORKFLOWS;
  });

  const [commLogs, setCommLogs] = useState<CommunicationLogEntry[]>(() => {
    const saved = localStorage.getItem('resortease_comm_logs');
    return saved ? JSON.parse(saved) : INITIAL_COMM_LOGS;
  });

  const [folioEntries, setFolioEntries] = useState<FolioEntry[]>(() => {
    const saved = localStorage.getItem('resortease_folio_entries');
    return saved ? JSON.parse(saved) : INITIAL_FOLIO_ENTRIES;
  });

  // Modal control states
  const [isResModalOpen, setIsResModalOpen] = useState(false);
  const [resModalUnitId, setResModalUnitId] = useState<string | undefined>(undefined);
  const [resModalCheckIn, setResModalCheckIn] = useState<string | undefined>(undefined);

  const [isAmenityModalOpen, setIsAmenityModalOpen] = useState(false);
  const [amenityModalId, setAmenityModalId] = useState<string | undefined>(undefined);
  const [amenityModalDate, setAmenityModalDate] = useState<string | undefined>(undefined);

  const [folioModalReservation, setFolioModalReservation] = useState<Reservation | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('resortease_reservations_clean', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('resortease_amenity_bookings', JSON.stringify(amenityBookings));
  }, [amenityBookings]);

  useEffect(() => {
    localStorage.setItem('resortease_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('resortease_workflows', JSON.stringify(workflows));
  }, [workflows]);

  useEffect(() => {
    localStorage.setItem('resortease_comm_logs', JSON.stringify(commLogs));
  }, [commLogs]);

  useEffect(() => {
    localStorage.setItem('resortease_folio_entries', JSON.stringify(folioEntries));
  }, [folioEntries]);

  useEffect(() => {
    localStorage.setItem('resortease_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('resortease_service_requests', JSON.stringify(serviceRequests));
  }, [serviceRequests]);

  useEffect(() => {
    localStorage.setItem('resortease_messages', JSON.stringify(messages));
  }, [messages]);

  // Handlers
  const handleOpenNewReservation = (unitId?: string, checkInDate?: string) => {
    setResModalUnitId(unitId);
    setResModalCheckIn(checkInDate);
    setIsResModalOpen(true);
  };

  const handleOpenNewAmenity = (amenityId?: string, date?: string) => {
    setAmenityModalId(amenityId);
    setAmenityModalDate(date);
    setIsAmenityModalOpen(true);
  };

  const handleSaveReservation = (
    newResData: Omit<Reservation, 'id' | 'confirmationCode' | 'createdAt'>
  ) => {
    const codeNumber = Math.floor(1000 + Math.random() * 9000);
    const newReservation: Reservation = {
      ...newResData,
      id: `res-${Date.now()}`,
      confirmationCode: `RE-2026-${codeNumber}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setReservations((prev) => [newReservation, ...prev]);

    // Initial folio entry for room nights & deposit
    const newFolioRoom: FolioEntry = {
      id: `fol-${Date.now()}-1`,
      reservationId: newReservation.id,
      date: newReservation.checkInDate,
      category: 'room',
      description: `Accommodations (${newReservation.totalNights} nights)`,
      amount: newReservation.totalAmount,
    };

    const newFolioDeposit: FolioEntry = {
      id: `fol-${Date.now()}-2`,
      reservationId: newReservation.id,
      date: newReservation.checkInDate,
      category: 'payment',
      description: 'Advance Deposit Secured',
      amount: newReservation.depositPaid,
      isCredit: true,
    };

    setFolioEntries((prev) => [newFolioRoom, newFolioDeposit, ...prev]);

    // Automatically trigger Instant Booking Confirmation communication workflow!
    const bookingWorkflow = workflows.find((w) => w.type === 'booking_confirmation');
    if (bookingWorkflow && bookingWorkflow.isActive) {
      const logEntry: CommunicationLogEntry = {
        id: `log-${Date.now()}`,
        workflowId: bookingWorkflow.id,
        workflowTitle: bookingWorkflow.title,
        guestName: newReservation.guestName,
        recipientEmail: newReservation.guestEmail,
        roomNumber: units.find((u) => u.id === newReservation.unitId)?.code || 'Villa',
        channel: bookingWorkflow.channel === 'both' ? 'email' : (bookingWorkflow.channel as any),
        status: 'delivered',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        renderedSubject: bookingWorkflow.subject.replace(
          /{confirmation_code}/g,
          newReservation.confirmationCode
        ),
        renderedBody: `Dear ${newReservation.guestName},\nThank you for choosing Resort Ease. Your booking is confirmed with confirmation #${newReservation.confirmationCode}.`,
      };

      setCommLogs((prev) => [logEntry, ...prev]);
    }
  };

  const handleUpdateReservationStatus = (
    reservationId: string,
    newStatus: Reservation['status']
  ) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status: newStatus } : r))
    );

    // If checked out, trigger post-stay workflow
    if (newStatus === 'checked_out') {
      const res = reservations.find((r) => r.id === reservationId);
      const postStayWf = workflows.find((w) => w.type === 'post_stay');
      if (res && postStayWf && postStayWf.isActive) {
        const logEntry: CommunicationLogEntry = {
          id: `log-${Date.now()}`,
          workflowId: postStayWf.id,
          workflowTitle: postStayWf.title,
          guestName: res.guestName,
          recipientEmail: res.guestEmail,
          roomNumber: units.find((u) => u.id === res.unitId)?.code || 'Villa',
          channel: 'email',
          status: 'delivered',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          renderedSubject: postStayWf.subject.replace(
            /{confirmation_code}/g,
            res.confirmationCode
          ),
          renderedBody: `Dear ${res.guestName},\nThank you for staying at Resort Ease. Your folio has been settled.`,
        };
        setCommLogs((prev) => [logEntry, ...prev]);
      }
    }
  };

  const handleSaveAmenityBooking = (bookingData: Omit<AmenityBooking, 'id' | 'sanitized'>) => {
    const newBooking: AmenityBooking = {
      ...bookingData,
      id: `ab-${Date.now()}`,
      sanitized: true,
    };
    setAmenityBookings((prev) => [newBooking, ...prev]);
  };

  const handleUpdateAmenityStatus = (
    bookingId: string,
    status: AmenityBooking['status'],
    sanitized?: boolean
  ) => {
    setAmenityBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status,
              sanitized: sanitized !== undefined ? sanitized : b.sanitized,
            }
          : b
      )
    );
  };

  const handleUpdateStock = (
    itemId: string,
    delta: number,
    type: 'consumed' | 'restocked' | 'damaged',
    notes: string
  ) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newStock = Math.max(0, item.currentStock + delta);
          return {
            ...item,
            currentStock: newStock,
            lastRestocked:
              type === 'restocked' ? new Date().toISOString().split('T')[0] : item.lastRestocked,
          };
        }
        return item;
      })
    );
  };

  const handleSendMessage = (guestId: string, text: string) => {
    const guest = guests.find((g) => g.id === guestId);
    const newMsg: GuestMessage = {
      id: `msg-${Date.now()}`,
      guestId,
      guestName: guest?.name || 'Guest',
      roomNumber: guest?.roomNumber || 'Villa',
      timestamp: new Date().toTimeString().slice(0, 5),
      sender: 'staff',
      text,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleUpdateServiceStatus = (
    requestId: string,
    status: ServiceRequest['status'],
    assignedTo?: string
  ) => {
    setServiceRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status, assignedTo } : r))
    );
  };

  const handleCreateServiceRequest = (
    reqData: Omit<ServiceRequest, 'id' | 'requestedAt'>
  ) => {
    const newReq: ServiceRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      requestedAt: new Date().toTimeString().slice(0, 5),
    };
    setServiceRequests((prev) => [newReq, ...prev]);
  };

  const handleUpdateWorkflow = (updated: CommunicationWorkflow) => {
    setWorkflows((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  const handleDispatchWorkflowManual = (workflowId: string, reservationId: string) => {
    const wf = workflows.find((w) => w.id === workflowId);
    const res = reservations.find((r) => r.id === reservationId);
    if (!wf || !res) return;

    const unit = units.find((u) => u.id === res.unitId);

    const newLog: CommunicationLogEntry = {
      id: `log-${Date.now()}`,
      workflowId: wf.id,
      workflowTitle: wf.title,
      guestName: res.guestName,
      recipientEmail: res.guestEmail,
      roomNumber: unit?.code || 'Villa',
      channel: wf.channel === 'both' ? 'email' : (wf.channel as any),
      status: 'delivered',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      renderedSubject: wf.subject.replace(/{confirmation_code}/g, res.confirmationCode),
      renderedBody: wf.emailBody
        .replace(/{guest_name}/g, res.guestName)
        .replace(/{unit_name}/g, unit?.name || 'Sanctuary')
        .replace(/{check_in_date}/g, res.checkInDate)
        .replace(/{check_out_date}/g, res.checkOutDate)
        .replace(/{digital_key}/g, '8492'),
    };

    setCommLogs((prev) => [newLog, ...prev]);
  };

  const handleAddFolioCharge = (entryData: Omit<FolioEntry, 'id'>) => {
    const newEntry: FolioEntry = {
      ...entryData,
      id: `fol-${Date.now()}`,
    };
    setFolioEntries((prev) => [...prev, newEntry]);
  };

  const handleSettlePayment = (reservationId: string, amount: number, method: string) => {
    const paymentEntry: FolioEntry = {
      id: `fol-pay-${Date.now()}`,
      reservationId,
      date: new Date().toISOString().split('T')[0],
      category: 'payment',
      description: `Settlement via ${method.toUpperCase()}`,
      amount,
      isCredit: true,
    };
    setFolioEntries((prev) => [...prev, paymentEntry]);

    // Update reservation balance due
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId
          ? {
              ...r,
              balanceDue: Math.max(0, r.balanceDue - amount),
            }
          : r
      )
    );
  };

  const handleUpdateUnitStatus = (unitId: string, status: PropertyUnit['status']) => {
    setUnits((prev) => prev.map((u) => (u.id === unitId ? { ...u, status } : u)));
  };

  const handleUpdateProfile = (updated: AuthUser) => {
    setCurrentUser(updated);
    localStorage.setItem('resortease_auth_user', JSON.stringify(updated));
    try {
      const existingStr = localStorage.getItem('resortease_registered_users');
      const existing: AuthUser[] = existingStr ? JSON.parse(existingStr) : [];
      const updatedList = existing.map((u) => (u.id === updated.id ? { ...u, ...updated } : u));
      localStorage.setItem('resortease_registered_users', JSON.stringify(updatedList));
    } catch {
      // ignore
    }
  };

  // If not logged in, display the dedicated Login Portal or Create Account page
  if (!currentUser) {
    if (authScreen === 'register') {
      return (
        <CreateAccountPage
          onRegister={(user) => {
            setCurrentUser(user);
            localStorage.setItem('resortease_auth_user', JSON.stringify(user));
            try {
              const existingStr = localStorage.getItem('resortease_registered_users');
              const existing: AuthUser[] = existingStr ? JSON.parse(existingStr) : [];
              if (!existing.some((u) => u.email === user.email)) {
                localStorage.setItem('resortease_registered_users', JSON.stringify([...existing, user]));
              }
            } catch {
              // ignore
            }
          }}
          onNavigateToLogin={() => setAuthScreen('login')}
        />
      );
    }

    return (
      <LoginPage
        onLogin={(user) => {
          setCurrentUser(user);
          localStorage.setItem('resortease_auth_user', JSON.stringify(user));
        }}
        onNavigateToCreateAccount={() => setAuthScreen('register')}
      />
    );
  }

  // Selected reservation's unit for Folio Modal
  const folioUnit = units.find((u) => u.id === folioModalReservation?.unitId) || units[0];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* 3-Zone Top Navigation Contract */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenNewReservation={() => handleOpenNewReservation()}
        currentUser={currentUser}
        onSignOut={() => {
          setCurrentUser(null);
          localStorage.removeItem('resortease_auth_user');
        }}
        onOpenEditAccount={() => setIsEditAccountOpen(true)}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Secondary Mobile Tab Switcher */}
        <div className="xl:hidden flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200">
          {(
            [
              ['dashboard', 'Dashboard'],
              ['calendar', 'Availability Calendar'],
              ['reservations', 'Reservations'],
              ['amenities', 'Private Pools'],
              ['communications', 'Automated Comms'],
              ['inventory', 'Inventory'],
              ['staff', 'Staff Allocation'],
              ['finance', 'Finances'],
            ] as [ActiveTab, string][]
          ).map(([tabKey, label]) => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tabKey
                  ? 'bg-teal-900 text-white'
                  : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content by Active Tab */}
        {activeTab === 'dashboard' && (
          <DashboardOverview
            currentUser={currentUser}
            units={units}
            reservations={reservations}
            amenities={amenities}
            amenityBookings={amenityBookings}
            serviceRequests={serviceRequests}
            inventory={inventory}
            staff={staff}
            onNavigate={setActiveTab}
            onOpenNewReservation={() => handleOpenNewReservation()}
            onOpenNewAmenity={() => handleOpenNewAmenity()}
            onUpdateUnitStatus={handleUpdateUnitStatus}
            onUpdateServiceStatus={handleUpdateServiceStatus}
            onOpenEditAccount={() => setIsEditAccountOpen(true)}
          />
        )}

        {activeTab === 'calendar' && (
          <AvailabilityCalendar
            units={units}
            reservations={reservations}
            amenities={amenities}
            amenityBookings={amenityBookings}
            onOpenNewReservation={handleOpenNewReservation}
            onOpenNewAmenity={handleOpenNewAmenity}
            onSelectReservation={(res) => setFolioModalReservation(res)}
          />
        )}

        {activeTab === 'reservations' && (
          <ReservationsManager
            units={units}
            reservations={reservations}
            onOpenNewReservation={handleOpenNewReservation}
            onUpdateReservationStatus={handleUpdateReservationStatus}
            onOpenFolio={(res) => setFolioModalReservation(res)}
          />
        )}

        {activeTab === 'amenities' && (
          <AmenityScheduler
            amenities={amenities}
            bookings={amenityBookings}
            units={units}
            onOpenNewBooking={handleOpenNewAmenity}
            onUpdateBookingStatus={handleUpdateAmenityStatus}
          />
        )}

        {activeTab === 'communications' && (
          <div className="space-y-6">
            <CommunicationWorkflows
              workflows={workflows}
              logs={commLogs}
              reservations={reservations}
              units={units}
              onUpdateWorkflow={handleUpdateWorkflow}
              onDispatchWorkflow={handleDispatchWorkflowManual}
            />

            {/* Guest Services & 2-Way messaging console integrated below */}
            <div className="pt-6 border-t border-stone-200">
              <GuestServicesHub
                guests={guests}
                requests={serviceRequests}
                messages={messages}
                staff={staff}
                reservations={reservations}
                units={units}
                onSendMessage={handleSendMessage}
                onUpdateServiceStatus={handleUpdateServiceStatus}
                onCreateServiceRequest={handleCreateServiceRequest}
              />
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <InventoryTracker inventory={inventory} onUpdateStock={handleUpdateStock} />
        )}

        {activeTab === 'staff' && (
          <StaffOptimization
            staff={staff}
            reservations={reservations}
            amenityBookings={amenityBookings}
            units={units}
            onRebalanceStaff={setStaff}
          />
        )}

        {activeTab === 'finance' && (
          <FinancialReporting
            reservations={reservations}
            units={units}
            amenityBookings={amenityBookings}
            folioEntries={folioEntries}
            onOpenFolio={(res) => setFolioModalReservation(res)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-4 px-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Resort Ease Integrated Property Management & Guest Services System</span>
          <span className="font-mono text-[11px] text-stone-400">
            Zero-Overlap Buffer Protection Active · October 21, 2026
          </span>
        </div>
      </footer>

      {/* Modals */}
      <NewReservationModal
        isOpen={isResModalOpen}
        onClose={() => setIsResModalOpen(false)}
        units={units}
        reservations={reservations}
        onSaveReservation={handleSaveReservation}
        initialUnitId={resModalUnitId}
        initialCheckIn={resModalCheckIn}
      />

      <NewAmenityModal
        isOpen={isAmenityModalOpen}
        onClose={() => setIsAmenityModalOpen(false)}
        amenities={amenities}
        bookings={amenityBookings}
        activeReservations={reservations.filter((r) => r.status !== 'cancelled')}
        units={units}
        onSaveBooking={handleSaveAmenityBooking}
        initialAmenityId={amenityModalId}
        initialDate={amenityModalDate}
      />

      {folioModalReservation && (
        <FolioModal
          isOpen={!!folioModalReservation}
          onClose={() => setFolioModalReservation(null)}
          reservation={folioModalReservation}
          unit={folioUnit}
          folioEntries={folioEntries}
          onAddFolioCharge={handleAddFolioCharge}
          onSettlePayment={handleSettlePayment}
        />
      )}

      {currentUser && (
        <EditAccountModal
          isOpen={isEditAccountOpen}
          onClose={() => setIsEditAccountOpen(false)}
          currentUser={currentUser}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </div>
  );
}
