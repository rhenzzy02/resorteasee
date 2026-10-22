import React, { useState } from 'react';
import {
  GuestProfile,
  ServiceRequest,
  GuestMessage,
  StaffMember,
  Reservation,
  PropertyUnit,
} from '../types/resort';
import {
  MessageSquare,
  Send,
  User,
  Crown,
  Bell,
  Clock,
  CheckCircle,
  Plus,
  AlertCircle,
  Phone,
  Mail,
  X,
} from 'lucide-react';

interface Props {
  guests: GuestProfile[];
  requests: ServiceRequest[];
  messages: GuestMessage[];
  staff: StaffMember[];
  reservations: Reservation[];
  units: PropertyUnit[];
  onSendMessage: (guestId: string, text: string) => void;
  onUpdateServiceStatus: (
    requestId: string,
    status: ServiceRequest['status'],
    assignedTo?: string
  ) => void;
  onCreateServiceRequest: (request: Omit<ServiceRequest, 'id' | 'requestedAt'>) => void;
}

export const GuestServicesHub: React.FC<Props> = ({
  guests,
  requests,
  messages,
  staff,
  reservations,
  units,
  onSendMessage,
  onUpdateServiceStatus,
  onCreateServiceRequest,
}) => {
  const [selectedGuestId, setSelectedGuestId] = useState<string>(guests[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);

  // New request form state
  const [reqGuestName, setReqGuestName] = useState('Eleanor Vance');
  const [reqRoom, setReqRoom] = useState('OV-101');
  const [reqCategory, setReqCategory] = useState<ServiceRequest['category']>('housekeeping');
  const [reqDescription, setReqDescription] = useState('');
  const [reqUrgency, setReqUrgency] = useState<ServiceRequest['urgency']>('normal');

  const selectedGuest = guests.find((g) => g.id === selectedGuestId) || guests[0];
  const guestMessages = messages.filter((m) => m.guestId === selectedGuest?.id);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedGuest) return;
    onSendMessage(selectedGuest.id, replyText.trim());
    setReplyText('');
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqDescription.trim()) return;

    onCreateServiceRequest({
      guestName: reqGuestName,
      roomNumber: reqRoom,
      category: reqCategory,
      description: reqDescription.trim(),
      urgency: reqUrgency,
      status: 'pending',
    });

    setReqDescription('');
    setShowNewRequestModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-stone-900 tracking-tight">
            Guest Concierge & Live Service Dispatch
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Two-way guest communication channel, instant service ticket dispatch, and VIP guest registry.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewRequestModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Service Request Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: VIP Guest Registry & Active Requests (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Guest Directory */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                In-House Guest Registry ({guests.length})
              </h3>
              <span className="text-[11px] text-stone-400">Click to open chat</span>
            </div>

            <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto">
              {guests.map((g) => {
                const isSelected = g.id === selectedGuest?.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGuestId(g.id)}
                    className={`p-3.5 cursor-pointer transition-colors flex items-center justify-between text-xs ${
                      isSelected ? 'bg-teal-50/70 border-l-2 border-teal-800' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                        <span>{g.name}</span>
                        {g.vipTier === 'Diamond' && (
                          <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-xs flex items-center gap-0.5">
                            <Crown className="w-2.5 h-2.5" /> VIP Diamond
                          </span>
                        )}
                        {g.vipTier === 'Gold' && (
                          <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded-xs">
                            Gold
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Room {g.roomNumber} · {g.totalVisits} Prior Visits · Lifetime $
                        {g.lifetimeSpend.toLocaleString()}
                      </div>
                    </div>
                    <span className="text-stone-400 text-xs font-mono">→</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Service Requests */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-teal-800" />
                <span>Active Service Tickets ({requests.length})</span>
              </h3>
            </div>

            <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto text-xs">
              {requests.map((req) => (
                <div key={req.id} className="p-3.5 space-y-2 hover:bg-stone-50/50">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                      <span>[{req.roomNumber}]</span>
                      <span>{req.guestName}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        req.urgency === 'urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : req.urgency === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {req.urgency}
                    </span>
                  </div>

                  <p className="text-stone-700 text-[11px] leading-relaxed">{req.description}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[11px]">
                    <span className="text-stone-400 font-mono">Req {req.requestedAt}</span>

                    <div className="flex items-center gap-2">
                      <select
                        value={req.status}
                        onChange={(e) =>
                          onUpdateServiceStatus(req.id, e.target.value as any, req.assignedTo)
                        }
                        className="p-1 text-[11px] border border-stone-300 rounded bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>

                      {req.assignedTo && (
                        <span className="text-[10px] font-mono text-stone-500">
                          {req.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 2-Way Guest Conversation Feed (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-800 text-white font-bold flex items-center justify-center text-sm">
                {selectedGuest?.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-sm flex items-center gap-2">
                  <span>{selectedGuest?.name}</span>
                  <span className="font-mono text-teal-300 text-xs">[{selectedGuest?.roomNumber}]</span>
                </div>
                <div className="text-[11px] text-stone-300 mt-0.5">
                  Direct Two-Way Messaging Channel (WhatsApp / In-Room Tablet)
                </div>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-stone-400 block text-[10px]">VIP Tier</span>
              <span className="font-semibold text-amber-300">{selectedGuest?.vipTier}</span>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-stone-50/50">
            {guestMessages.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400">
                No recent chat messages with this guest. Send an initial greeting or service update
                below.
              </div>
            ) : (
              guestMessages.map((msg) => {
                const isStaff = msg.sender === 'staff';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-xl text-xs leading-relaxed ${
                        isStaff
                          ? 'bg-teal-900 text-white rounded-br-none'
                          : 'bg-white border border-stone-200 text-stone-900 rounded-bl-none shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono mt-1 px-1">
                      {isStaff ? 'Resort Host' : msg.guestName} · {msg.timestamp}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Replies Bar */}
          <div className="px-4 py-2 bg-stone-100 border-t border-stone-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-stone-400 shrink-0 font-medium">Quick Replies:</span>
            <button
              type="button"
              onClick={() =>
                setReplyText(
                  'Delighted to help! Our housekeeping specialist has been dispatched with extra towels.'
                )
              }
              className="px-2 py-1 bg-white border border-stone-300 rounded hover:bg-stone-50 text-stone-700 whitespace-nowrap"
            >
              Towels Dispatched
            </button>
            <button
              type="button"
              onClick={() =>
                setReplyText(
                  'Your private pool reservation is confirmed and prepared with fresh chilled amenities.'
                )
              }
              className="px-2 py-1 bg-white border border-stone-300 rounded hover:bg-stone-50 text-stone-700 whitespace-nowrap"
            >
              Pool Confirmed
            </button>
            <button
              type="button"
              onClick={() =>
                setReplyText(
                  'Warm greetings! Please let our team know if we can arrange in-villa dining tonight.'
                )
              }
              className="px-2 py-1 bg-white border border-stone-300 rounded hover:bg-stone-50 text-stone-700 whitespace-nowrap"
            >
              In-Villa Dining
            </button>
          </div>

          {/* Chat Composer */}
          <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-stone-200 flex gap-2">
            <input
              type="text"
              placeholder={`Type message to ${selectedGuest?.name}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="px-4 py-2 bg-teal-800 hover:bg-teal-700 disabled:opacity-40 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* New Service Ticket Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-stone-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-semibold">Dispatch New Guest Service Ticket</h3>
              <button
                onClick={() => setShowNewRequestModal(false)}
                className="p-1 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    required
                    value={reqGuestName}
                    onChange={(e) => setReqGuestName(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Room / Villa #
                  </label>
                  <input
                    type="text"
                    required
                    value={reqRoom}
                    onChange={(e) => setReqRoom(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value as any)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-stone-50"
                  >
                    <option value="housekeeping">Housekeeping / Linens</option>
                    <option value="room_service">Food & Beverage</option>
                    <option value="maintenance">Maintenance & Facilities</option>
                    <option value="concierge">Concierge / Transport</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Priority</label>
                  <select
                    value={reqUrgency}
                    onChange={(e) => setReqUrgency(e.target.value as any)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-stone-50"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ticket Details
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Guest requested luggage assistance and buggy escort to Pier 4 at 11:30"
                  value={reqDescription}
                  onChange={(e) => setReqDescription(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg bg-stone-50"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowNewRequestModal(false)}
                  className="px-3 py-1.5 border border-stone-300 rounded-md text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-800 hover:bg-teal-700 text-white font-medium rounded-md"
                >
                  Dispatch Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
