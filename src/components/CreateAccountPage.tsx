import React, { useState } from 'react';
import { AuthUser, UserRole, UserDepartment } from '../types/resort';
import {
  ShieldCheck,
  Building,
  UserCheck,
  Lock,
  Mail,
  User,
  MapPin,
  Clock,
  KeyRound,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

interface Props {
  onRegister: (newUser: AuthUser) => void;
  onNavigateToLogin: () => void;
}

export const CreateAccountPage: React.FC<Props> = ({
  onRegister,
  onNavigateToLogin,
}) => {
  const [role, setRole] = useState<UserRole>('worker');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState<UserDepartment>('housekeeping');
  const [jobTitle, setJobTitle] = useState('Villa Turnover Specialist');
  const [assignedZone, setAssignedZone] = useState('Overwater Villas Pier (101-108)');
  const [shift, setShift] = useState('07:00 – 15:30 (Morning Turnaround)');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityCode, setSecurityCode] = useState('RESORT2026');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync default job titles when department changes
  const handleDepartmentChange = (dept: UserDepartment) => {
    setDepartment(dept);
    if (dept === 'management') {
      setRole('admin');
      setJobTitle('Operations Duty Manager');
      setAssignedZone('Executive Management & Operations');
      setShift('08:00 – 17:00 (Full-day Executive)');
    } else if (dept === 'housekeeping') {
      setRole('worker');
      setJobTitle('Villa Turnover Specialist');
      setAssignedZone('Overwater Villas Pier (101-108)');
      setShift('07:00 – 15:30 (Morning Turnaround)');
    } else if (dept === 'frontdesk') {
      setRole('worker');
      setJobTitle('Concierge & Guest Host');
      setAssignedZone('Welcome Jetty & Lounge');
      setShift('08:00 – 16:30 (Arrivals & Concierge)');
    } else if (dept === 'maintenance') {
      setRole('worker');
      setJobTitle('Facilities & Pool Systems Technician');
      setAssignedZone('Pool Thermal Systems & Villas');
      setShift('07:30 – 16:00 (Engineering)');
    } else if (dept === 'pool') {
      setRole('worker');
      setJobTitle('Aquatic Safety & Cabana Attendant');
      setAssignedZone('Laguna Infinity Pools & Cabanas');
      setShift('09:00 – 17:30 (Day Pool Shift)');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim()) {
      setErrorMsg('Please enter your full legal name and resort email address.');
      return;
    }

    if (!password || password.trim().length < 4) {
      setErrorMsg('Please enter a terminal passcode of at least 4 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify and re-enter your credentials.');
      return;
    }

    if (securityCode.trim().toUpperCase() !== 'RESORT2026' && securityCode.trim().length < 4) {
      setErrorMsg('Invalid staff authorization verification code. Use RESORT2026 for demo access.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('You must acknowledge the Resort Guest Privacy & Operations protocol.');
      return;
    }

    // Check if email already exists in registered database
    try {
      const storedUsersStr = localStorage.getItem('resortease_registered_users');
      const registeredUsers: AuthUser[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];
      if (registeredUsers.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
        setErrorMsg('An account with this email is already registered in the system database. Please sign in or use another email.');
        return;
      }
    } catch {
      // ignore
    }

    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role,
      department,
      title: jobTitle.trim(),
      assignedZone,
      shift,
    };

    try {
      const storedUsersStr = localStorage.getItem('resortease_registered_users');
      const registeredUsers: AuthUser[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];
      localStorage.setItem('resortease_registered_users', JSON.stringify([...registeredUsers, newUser]));
    } catch {
      // ignore
    }

    onRegister(newUser);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Ambience with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/resort_hero_aerial_1792633829110.jpg"
          alt="Resort Ease Sanctuary"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-25 filter blur-xs scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-900/70" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 px-6 sm:px-8 py-5 flex items-center justify-between border-b border-stone-800/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-sm shadow-md">
            RE
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">Resort Ease</h1>
            <span className="text-[11px] text-teal-400 font-medium">
              Staff Registration & Onboarding
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToLogin}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-300 hover:text-white border border-stone-700 hover:border-stone-500 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Terminal Sign-In</span>
        </button>
      </header>

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl w-full mx-auto p-4 sm:p-6 my-auto">
        <div className="bg-stone-950/90 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 backdrop-blur-md">
          {/* Left Info Column (5 cols) */}
          <div className="md:col-span-5 p-6 md:p-8 bg-stone-900/90 border-b md:border-b-0 md:border-r border-stone-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-semibold block mb-2">
                New Staff Terminal Enrollment
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
                Create Your Resort Operations Account
              </h2>
              <p className="text-xs text-stone-400 mt-2.5 leading-relaxed">
                Register to gain authenticated access to room turnovers, private pool sanitation buffers, inventory par tracking, and guest requests.
              </p>

              <div className="mt-6 space-y-3.5 text-xs">
                <div className="p-3 bg-stone-950/80 border border-stone-800 rounded-xl space-y-1">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-teal-400" />
                    <span>Administrator Profile</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    Full supervisory privileges: Financial folios, staff rebalancing heuristics, reservation overrides, and communication workflows.
                  </p>
                </div>

                <div className="p-3 bg-stone-950/80 border border-stone-800 rounded-xl space-y-1">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>Operations Worker Profile</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    Dedicated shift dashboard: Assigned villa turnover checklists, private pool prep logs, and direct guest service tickets.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-800/80 text-[11px] text-stone-400 flex items-center gap-2 font-mono">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Authorization PIN: <strong className="text-teal-300">RESORT2026</strong></span>
            </div>
          </div>

          {/* Right Form Column (7 cols) */}
          <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <h3 className="text-sm font-semibold text-white">Staff Member Information</h3>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Complete the fields below to enroll in the Resort Ease management network.
                </p>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-rose-950/80 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Role Selection */}
              <div>
                <label className="block text-stone-300 font-semibold mb-1.5">Account Role</label>
                <div className="grid grid-cols-2 p-1 bg-stone-900 rounded-xl border border-stone-800 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('admin');
                      setDepartment('management');
                      setJobTitle('Operations Duty Manager');
                      setAssignedZone('Executive Management & Operations');
                    }}
                    className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                      role === 'admin'
                        ? 'bg-teal-800 text-white font-semibold shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Administrator</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('worker');
                      setDepartment('housekeeping');
                      setJobTitle('Villa Turnover Specialist');
                      setAssignedZone('Overwater Villas Pier (101-108)');
                    }}
                    className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                      role === 'worker'
                        ? 'bg-teal-800 text-white font-semibold shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Operations Worker</span>
                  </button>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Full Legal Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Julian Thorne"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-teal-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Work Email</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="name@resortease.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-teal-600"
                    />
                  </div>
                </div>
              </div>

              {/* Department & Job Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => handleDepartmentChange(e.target.value as UserDepartment)}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-stone-100 focus:outline-hidden focus:border-teal-600"
                  >
                    {role === 'admin' ? (
                      <option value="management">Executive & Operations Management</option>
                    ) : (
                      <>
                        <option value="housekeeping">Housekeeping & Sanitization</option>
                        <option value="frontdesk">Front Desk & Speedboat Logistics</option>
                        <option value="pool">Aquatic Safety & Private Pools</option>
                        <option value="maintenance">Facilities Engineering</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Job Designation</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-stone-100 focus:outline-hidden focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Assigned Zone & Shift */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Assigned Resort Zone</label>
                  <select
                    value={assignedZone}
                    onChange={(e) => setAssignedZone(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-stone-100 focus:outline-hidden focus:border-teal-600"
                  >
                    <option value="Overwater Villas Pier (101-108)">Overwater Villas Pier (101-108)</option>
                    <option value="Beachfront Cottages (201-208)">Beachfront Cottages (201-208)</option>
                    <option value="Laguna Infinity Pools & Cabanas">Laguna Infinity Pools & Cabanas</option>
                    <option value="Botanical Garden Suites & Spa">Botanical Garden Suites & Spa</option>
                    <option value="Welcome Jetty & Terminal Pier 4">Welcome Jetty & Terminal Pier 4</option>
                    <option value="Executive Management & Operations">Executive Management & Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Shift Schedule</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-stone-100 focus:outline-hidden focus:border-teal-600"
                  >
                    <option value="07:00 – 15:30 (Morning Turnaround)">07:00 – 15:30 (Morning)</option>
                    <option value="08:00 – 16:30 (Arrivals & Concierge)">08:00 – 16:30 (Arrivals)</option>
                    <option value="10:00 – 18:30 (Mid-Day Peak)">10:00 – 18:30 (Mid-Day)</option>
                    <option value="14:00 – 22:30 (Sunset & Dinner)">14:00 – 22:30 (Evening)</option>
                  </select>
                </div>
              </div>

              {/* Password & Security Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Terminal Passcode</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-stone-100 focus:outline-hidden focus:border-teal-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Confirm Passcode</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-stone-100 focus:outline-hidden focus:border-teal-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Auth Code</label>
                  <input
                    type="text"
                    required
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-teal-400 font-mono font-bold uppercase focus:outline-hidden focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Agreement */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-stone-400">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-stone-700 bg-stone-900 text-teal-600 focus:ring-0"
                  />
                  <span>
                    I acknowledge and agree to uphold the Resort Ease Guest Privacy Standard, zero double-booking rules, and sanitation protocol.
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-3 space-y-2.5">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-teal-800 hover:bg-teal-700 font-semibold text-white text-xs rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Create Account & Enter Portal</span>
                </button>

                <div className="text-center text-[11px] text-stone-400">
                  <span>Already enrolled? </span>
                  <button
                    type="button"
                    onClick={onNavigateToLogin}
                    className="text-teal-400 hover:text-teal-300 font-semibold underline ml-1"
                  >
                    Sign in to existing staff account
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-4 text-center text-xs text-stone-500 border-t border-stone-900">
        Resort Ease Management System · Confidential & Authorized Hospitality Operations
      </footer>
    </div>
  );
};
