import React, { useState, useEffect } from 'react';
import { AuthUser, UserRole } from '../types/resort';
import {
  ShieldCheck,
  Lock,
  Mail,
  UserCheck,
  Building,
  KeyRound,
  AlertCircle,
  Database,
  UserPlus,
} from 'lucide-react';

interface Props {
  onLogin: (user: AuthUser) => void;
  onNavigateToCreateAccount?: () => void;
}

export const LoginPage: React.FC<Props> = ({ onLogin, onNavigateToCreateAccount }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'wrong_email' | 'wrong_password' | 'empty_db' | 'general' | null>(null);
  const [registeredCount, setRegisteredCount] = useState<number>(0);

  // Sync count of accounts registered in database
  useEffect(() => {
    try {
      const stored = localStorage.getItem('resortease_registered_users');
      if (stored) {
        const parsed: AuthUser[] = JSON.parse(stored);
        setRegisteredCount(Array.isArray(parsed) ? parsed.length : 0);
      } else {
        setRegisteredCount(0);
      }
    } catch {
      setRegisteredCount(0);
    }
  }, []);

  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    setErrorType(null);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setErrorType(null);

    const inputEmail = email.trim();
    const inputPassword = password.trim();

    if (!inputEmail) {
      setErrorType('general');
      setErrorMsg('Please enter your registered staff email or username.');
      return;
    }

    if (!inputPassword) {
      setErrorType('general');
      setErrorMsg('Please enter your access passcode.');
      return;
    }

    // Retrieve accounts strictly from registered accounts database in localStorage
    let registeredUsers: AuthUser[] = [];
    try {
      const storedUsersStr = localStorage.getItem('resortease_registered_users');
      registeredUsers = storedUsersStr ? JSON.parse(storedUsersStr) : [];
    } catch {
      registeredUsers = [];
    }

    setRegisteredCount(registeredUsers.length);

    // If database is currently empty
    if (registeredUsers.length === 0) {
      setErrorType('empty_db');
      setErrorMsg(
        'Database has 0 accounts registered. Only accounts created via the registration portal exist in this system. Please click "Create Staff Account" to register.'
      );
      return;
    }

    // Lookup account in database by email or full name (case-insensitive)
    const matchedAccount = registeredUsers.find(
      (u) =>
        (u.email && u.email.toLowerCase() === inputEmail.toLowerCase()) ||
        (u.name && u.name.toLowerCase() === inputEmail.toLowerCase())
    );

    // 1. Wrong Email check
    if (!matchedAccount) {
      setErrorType('wrong_email');
      setErrorMsg(
        `Wrong email. No account exists in the database with "${inputEmail}". Only accounts created in this system are authorized to access the terminal.`
      );
      return;
    }

    // 2. Wrong Password check
    if (matchedAccount.password && matchedAccount.password !== inputPassword) {
      setErrorType('wrong_password');
      setErrorMsg(
        'Wrong password. The password you entered is incorrect. Please check your credentials and try again.'
      );
      return;
    }

    // Successful authentication with registered database account
    onLogin(matchedAccount);
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

      {/* Top Header Wordmark */}
      <header className="relative z-10 px-8 py-6 flex items-center justify-between border-b border-stone-800/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-sm shadow-md">
            RE
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">Resort Ease</h1>
            <span className="text-[11px] text-teal-400 font-medium">Integrated Property & Guest Services</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateToCreateAccount && (
            <button
              type="button"
              onClick={onNavigateToCreateAccount}
              className="text-xs text-teal-300 hover:text-white border border-teal-800 hover:border-teal-600 bg-teal-950/60 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Staff Account</span>
            </button>
          )}
          <div className="text-xs text-stone-400 hidden sm:flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Encrypted Gateway</span>
          </div>
        </div>
      </header>

      {/* Main Login Card Section */}
      <div className="relative z-10 max-w-4xl w-full mx-auto p-4 sm:p-6 my-auto">
        <div className="bg-stone-950/90 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 backdrop-blur-md">
          {/* Left Hero Side (5 cols) */}
          <div className="md:col-span-5 p-6 md:p-8 bg-stone-900/90 border-b md:border-b-0 md:border-r border-stone-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-semibold block mb-2">
                Operational Staff Gateway
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
                Welcome to Resort Ease Portal
              </h2>
              <p className="text-xs text-stone-400 mt-2.5 leading-relaxed">
                Coordinate zero-overlap reservations, private pool sanitation intervals, inventory par levels, and real-time staff dispatch.
              </p>
            </div>

            <div className="mt-8 space-y-3 pt-6 border-t border-stone-800/80 text-xs">
              <div className="flex items-start gap-2.5 text-stone-300">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Admin Role:</strong> Complete property management, financial ledger, and workflow configuration.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-stone-300">
                <UserCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Worker Role:</strong> Personalized task queue, assigned villa turnovers, pool prep, and guest tickets.
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 text-[11px] text-stone-500 font-mono flex items-center justify-between">
              <span>System Version 2026.10</span>
              <span className="text-teal-400 flex items-center gap-1">
                <Database className="w-3 h-3" />
                <span>DB Protected</span>
              </span>
            </div>
          </div>

          {/* Right Login Form Side (7 cols) */}
          <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Database status banner */}
              <div className="mb-5 flex items-center justify-between px-3 py-2 bg-stone-900/80 border border-stone-800 rounded-xl text-xs">
                <div className="flex items-center gap-2 text-stone-300">
                  <Database className="w-3.5 h-3.5 text-teal-400" />
                  <span className="font-medium text-[11px]">Accounts Database:</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className={`w-2 h-2 rounded-full ${registeredCount > 0 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span className={registeredCount > 0 ? 'text-emerald-400 font-medium' : 'text-amber-400'}>
                    {registeredCount} Registered {registeredCount === 1 ? 'Account' : 'Accounts'}
                  </span>
                </div>
              </div>

              {/* Role Selector Segmented Control */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-stone-300 mb-2">
                  Select Access Level
                </label>
                <div className="grid grid-cols-2 p-1 bg-stone-900 rounded-xl border border-stone-800 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => handleRoleTabChange('admin')}
                    className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                      selectedRole === 'admin'
                        ? 'bg-teal-800 text-white shadow-sm font-semibold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Administrator / GM</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleTabChange('worker')}
                    className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                      selectedRole === 'worker'
                        ? 'bg-teal-800 text-white shadow-sm font-semibold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Operations Worker</span>
                  </button>
                </div>
              </div>

              {/* Empty DB Notice if 0 accounts exist */}
              {registeredCount === 0 && (
                <div className="mb-4 p-3 bg-teal-950/40 border border-teal-800/60 rounded-xl text-teal-200 text-xs flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">Database is currently empty</p>
                    <p className="text-[11px] text-stone-300 mt-0.5">
                      Create your staff account first to sign into the system.
                    </p>
                  </div>
                  {onNavigateToCreateAccount && (
                    <button
                      type="button"
                      onClick={onNavigateToCreateAccount}
                      className="px-2.5 py-1.5 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-[11px] font-semibold transition-colors shrink-0 ml-3"
                    >
                      Create Now
                    </button>
                  )}
                </div>
              )}

              {/* Staff Authentication Form */}
              <form onSubmit={handleManualLogin} className="space-y-3.5 text-xs">
                {/* Specific Wrong Email / Wrong Password Alert Banner */}
                {errorMsg && (
                  <div className="p-3 bg-rose-950/90 border border-rose-800/90 rounded-xl text-rose-200 text-xs flex items-start gap-2.5 shadow-lg">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold text-rose-300">
                        {errorType === 'wrong_email'
                          ? 'Wrong Email Address'
                          : errorType === 'wrong_password'
                          ? 'Wrong Password'
                          : errorType === 'empty_db'
                          ? 'Database Notice'
                          : 'Authentication Error'}
                      </p>
                      <p className="mt-0.5 leading-relaxed text-rose-100">{errorMsg}</p>

                      {errorType === 'wrong_email' && onNavigateToCreateAccount && (
                        <button
                          type="button"
                          onClick={onNavigateToCreateAccount}
                          className="mt-2 text-[11px] text-teal-300 hover:text-white font-semibold underline flex items-center gap-1 transition-colors"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>Create an account with this email now</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    Staff Email or Name <span className="text-teal-400 font-mono text-[10px]">(Registered in DB)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. your_email@resortease.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorType === 'wrong_email') setErrorMsg(null);
                      }}
                      className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-teal-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Passcode / Key</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorType === 'wrong_password') setErrorMsg(null);
                      }}
                      className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-teal-600 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-stone-700 bg-stone-900 text-teal-600 focus:ring-0"
                    />
                    <span>Remember terminal session</span>
                  </label>
                  <span className="text-stone-500">Authorized personnel only</span>
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 py-2.5 px-4 bg-teal-800 hover:bg-teal-700 font-semibold text-white text-xs rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Authenticate as {selectedRole === 'admin' ? 'Administrator' : 'Staff Worker'}</span>
                </button>

                {onNavigateToCreateAccount && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={onNavigateToCreateAccount}
                      className="text-stone-400 hover:text-teal-300 text-[11px] transition-colors"
                    >
                      New team member? <span className="text-teal-400 font-semibold underline">Create account here</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-4 text-center text-xs text-stone-500 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <span>Resort Ease Management System · Confidential & Authorized Hospitality Operations</span>
        <span className="font-mono text-[11px] text-stone-400">Database Authentication Active</span>
      </footer>
    </div>
  );
};
