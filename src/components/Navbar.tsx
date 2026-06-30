import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, UserCheck, PlusCircle, LayoutDashboard, Database, LogOut, ChevronDown, User as UserIcon, ShieldAlert } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { User } from '../types';

interface NavbarProps {
  currentTab: 'dashboard' | 'new-audit';
  setCurrentTab: (tab: 'dashboard' | 'new-audit') => void;
  currentUser: User;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, currentUser, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl medical-gradient flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg text-slate-900 tracking-tight">SIAK3-RS</h1>
                <span className="bg-sky-100 text-sky-800 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  K3 Rumah Sakit
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Sistem Informasi Audit K3RS</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                currentTab === 'dashboard'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200/80 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentTab('new-audit')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all duration-150 ${
                currentTab === 'new-audit'
                  ? 'bg-sky-600 text-white shadow-sky-500/25 shadow-md hover:bg-sky-700'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20 shadow-md'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Audit Baru</span>
            </button>
          </nav>

          {/* User Profile & Dropdown */}
          <div className="hidden md:flex items-center space-x-3 pl-4 border-l border-slate-200 relative" ref={dropdownRef}>
            
            {/* Status Cloud Database Tag */}
            <div
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                isSupabaseConfigured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
              title={isSupabaseConfigured ? 'Terhubung ke Cloud Supabase' : 'Mode Offline / Local DB'}
            >
              <Database className="w-3 h-3" />
              <span>{isSupabaseConfigured ? 'Supabase' : 'Local DB'}</span>
            </div>

            {/* Profile Pill Button */}
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-full transition-all cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left">
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
              <div className="absolute right-0 top-14 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3 z-50 animate-scaleUp">
                
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 mb-2">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-bold text-slate-900">{currentUser.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono pl-6">{currentUser.email}</p>
                  <p className="text-[10px] text-slate-400 pl-6">NIP: {currentUser.nip}</p>
                  <div className="pt-1 pl-6">
                    <span className="inline-block bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {currentUser.role}
                    </span>
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
      </div>
    </header>
  );
};
