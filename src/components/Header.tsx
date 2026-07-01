import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { NavView } from './Sidebar';
import { LogOut, ChevronDown, User as UserIcon, Bell, Menu } from 'lucide-react';

interface HeaderProps {
  currentView: NavView;
  currentUser: User;
  onLogout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  currentUser,
  onLogout,
  isCollapsed,
  setIsCollapsed,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getViewTitle = (view: NavView) => {
    switch (view) {
      case 'dashboard':
        return { title: 'Dashboard Eksekutif', sub: 'Ringkasan pelaksanaan dan statistik mutu audit K3RS' };
      case 'new-audit':
        return { title: 'Formulir Audit Baru', sub: 'Pencatatan inspeksi dan evaluasi standar K3 unit kerja' };
      case 'findings':
        return { title: 'Manajemen Temuan & Risiko', sub: 'Daftar ketidaksesuaian standar dan rekomendasi perbaikan' };
      default:
        return { title: 'SIAK3-RS', sub: 'Sistem Informasi Audit K3 Rumah Sakit' };
    }
  };

  const currentInfo = getViewTitle(currentView);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      
      {/* Left Title & Mobile Toggle */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl bg-slate-100 text-slate-600 sm:hidden hover:bg-slate-200"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {currentInfo.title}
          </h2>
          <p className="text-xs text-slate-500 hidden sm:block font-medium">
            {currentInfo.sub}
          </p>
        </div>
      </div>

      {/* Right Actions & User Profile */}
      <div className="flex items-center space-x-3">
        


        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-sky-700 transition-colors">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
                {currentUser.role}
              </p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-scaleUp">
              
              <div className="p-2 flex items-center space-x-3 mb-2 border-b border-slate-100 pb-3">
                <div className="w-9 h-9 rounded-xl bg-sky-600 text-white font-extrabold flex items-center justify-center text-sm shrink-0 shadow-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-extrabold text-slate-900 truncate">{currentUser.name}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold truncate">{currentUser.role}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    onLogout();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar / Logout</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </header>
  );
};
