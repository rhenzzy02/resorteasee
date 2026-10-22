import React from 'react';
import { Plus, LogOut, User } from 'lucide-react';
import { AuthUser } from '../types/resort';

export type ActiveTab =
  | 'dashboard'
  | 'calendar'
  | 'reservations'
  | 'amenities'
  | 'communications'
  | 'inventory'
  | 'staff'
  | 'finance';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenNewReservation: () => void;
  currentUser: AuthUser | null;
  onSignOut: () => void;
  onOpenEditAccount?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenNewReservation,
  currentUser,
  onSignOut,
  onOpenEditAccount,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-stone-200 sticky top-0 z-40 shadow-xs">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onTabChange('dashboard');
        }}
        className="text-lg font-bold tracking-tight text-teal-950 whitespace-nowrap shrink-0 hover:text-teal-800 transition-colors"
      >
        Resort Ease
      </a>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden xl:flex items-center gap-5 text-xs font-medium text-stone-600 overflow-x-auto">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
            activeTab === 'dashboard'
              ? 'border-teal-800 text-teal-950 font-bold'
              : 'border-transparent text-stone-600'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onTabChange('calendar')}
          className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
            activeTab === 'calendar'
              ? 'border-teal-800 text-teal-950 font-bold'
              : 'border-transparent text-stone-600'
          }`}
        >
          Availability Calendar
        </button>
        <button
          onClick={() => onTabChange('reservations')}
          className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
            activeTab === 'reservations'
              ? 'border-teal-800 text-teal-950 font-bold'
              : 'border-transparent text-stone-600'
          }`}
        >
          Reservations
        </button>
        <button
          onClick={() => onTabChange('amenities')}
          className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
            activeTab === 'amenities'
              ? 'border-teal-800 text-teal-950 font-bold'
              : 'border-transparent text-stone-600'
          }`}
        >
          Private Pools
        </button>
        <button
          onClick={() => onTabChange('communications')}
          className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
            activeTab === 'communications'
              ? 'border-teal-800 text-teal-950 font-bold'
              : 'border-transparent text-stone-600'
          }`}
        >
          Automated Communications
        </button>
        <button
          onClick={() => onTabChange('inventory')}
          className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
            activeTab === 'inventory'
              ? 'border-teal-800 text-teal-950 font-bold'
              : 'border-transparent text-stone-600'
          }`}
        >
          Inventory
        </button>
        <button
          onClick={() => onTabChange('staff')}
          className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
            activeTab === 'staff'
              ? 'border-teal-800 text-teal-950 font-bold'
              : 'border-transparent text-stone-600'
          }`}
        >
          Staff Allocation
        </button>
        <button
          onClick={() => onTabChange('finance')}
          className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
            activeTab === 'finance'
              ? 'border-teal-800 text-teal-950 font-bold'
              : 'border-transparent text-stone-600'
          }`}
        >
          Financial Ledger
        </button>
      </nav>

      {/* Zone 3: 1 primary action + user profile control */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onOpenNewReservation}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap shrink-0 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Reservation</span>
        </button>

        {currentUser && (
          <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
            <button
              type="button"
              onClick={onOpenEditAccount}
              className="text-right hidden sm:block p-1 rounded-md hover:bg-stone-50 transition-colors group cursor-pointer"
              title="Click to edit name, email, or account details"
            >
              <div className="text-xs font-semibold text-stone-900 group-hover:text-teal-800 transition-colors truncate max-w-[120px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-stone-500 capitalize">
                {currentUser.role === 'admin' ? 'Administrator' : `${currentUser.department} Staff`} · Edit
              </div>
            </button>

            <button
              type="button"
              onClick={onSignOut}
              className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
              title="Sign Out / Switch User"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

