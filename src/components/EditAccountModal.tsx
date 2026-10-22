import React, { useState } from 'react';
import { AuthUser } from '../types/resort';
import { X, User, Mail, Shield, Building, MapPin, CheckCircle, Save } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser;
  onUpdateProfile: (updated: AuthUser) => void;
}

export const EditAccountModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [title, setTitle] = useState(currentUser.title);
  const [assignedZone, setAssignedZone] = useState(currentUser.assignedZone);
  const [shift, setShift] = useState(currentUser.shift || '07:00 – 15:30 (Morning Turnaround)');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim()) {
      setErrorMsg('Full name and email are required fields.');
      return;
    }

    const updatedUser: AuthUser = {
      ...currentUser,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      title: title.trim(),
      assignedZone: assignedZone.trim(),
      shift: shift.trim(),
    };

    onUpdateProfile(updatedUser);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-xs">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight">Edit Account & Profile</h2>
              <p className="text-[11px] text-stone-300">
                Update your name, work email address, or assigned resort zone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Account profile updated successfully!</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Role badge */}
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-stone-400 block">
                Account Privileges
              </span>
              <span className="font-semibold text-stone-900 capitalize">
                {currentUser.role === 'admin' ? 'Resort Administrator (Full Control)' : 'Operations Worker'}
              </span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                currentUser.role === 'admin'
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-teal-100 text-teal-900'
              }`}
            >
              {currentUser.department}
            </span>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Full Legal / Staff Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maria Santos"
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@resortease.com"
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-700 font-mono"
              />
            </div>
            <span className="text-[10px] text-stone-400 mt-1 block">
              Used for system notifications, shifts, and terminal sign-in.
            </span>
          </div>

          {/* Job Title / Role */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Designation / Job Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:bg-white"
            />
          </div>

          {/* Assigned Zone */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Assigned Resort Zone
            </label>
            <select
              value={assignedZone}
              onChange={(e) => setAssignedZone(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:bg-white"
            >
              <option value="Executive Management & Operations">Executive Management & Operations</option>
              <option value="Overwater Villas Pier (101-108)">Overwater Villas Pier (101-108)</option>
              <option value="Beachfront Cottages (201-208)">Beachfront Cottages (201-208)</option>
              <option value="Laguna Infinity Pools & Cabanas">Laguna Infinity Pools & Cabanas</option>
              <option value="Botanical Garden Suites & Spa">Botanical Garden Suites & Spa</option>
              <option value="Welcome Jetty & Terminal Pier 4">Welcome Jetty & Terminal Pier 4</option>
            </select>
          </div>

          {/* Shift Schedule */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              Shift Schedule
            </label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:bg-white"
            >
              <option value="07:00 – 15:30 (Morning Turnaround)">07:00 – 15:30 (Morning Turnaround)</option>
              <option value="08:00 – 16:30 (Arrivals & Concierge)">08:00 – 16:30 (Arrivals & Concierge)</option>
              <option value="10:00 – 18:30 (Mid-Day Peak)">10:00 – 18:30 (Mid-Day Peak)</option>
              <option value="14:00 – 22:30 (Sunset & Dinner)">14:00 – 22:30 (Sunset & Dinner)</option>
              <option value="08:00 – 17:00 (Full-day Executive)">08:00 – 17:00 (Full-day Executive)</option>
            </select>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs border border-stone-300 rounded-lg text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Account Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
