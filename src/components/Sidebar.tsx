import React from 'react';
import { ShieldCheck, LayoutDashboard, PlusCircle, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

export type NavView = 'dashboard' | 'new-audit' | 'findings';

interface MenuItem {
  id: NavView;
  label: string;
  icon: React.ElementType;
  highlight?: boolean;
  badge?: number;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

interface SidebarProps {
  currentView: NavView;
  setCurrentView: (view: NavView) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  totalFindingsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  isCollapsed,
  setIsCollapsed,
  totalFindingsCount,
}) => {
  const menuGroups: MenuGroup[] = [
    {
      title: 'UTAMA',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'new-audit', label: 'Audit Baru', icon: PlusCircle, highlight: true },
      ],
    },
    {
      title: 'MANAJEMEN K3',
      items: [
        {
          id: 'findings',
          label: 'Temuan & Risiko',
          icon: AlertTriangle,
          badge: totalFindingsCount > 0 ? totalFindingsCount : undefined,
        },
      ],
    },
  ];

  return (
    <aside
      className={`bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-all duration-300 relative z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Floating Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-5 w-6.5 h-6.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-50 hidden sm:flex"
        title={isCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Sidebar Header Brand */}
      <div className={`h-16 flex items-center border-b border-slate-800/80 ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
        <div
          className={`flex items-center cursor-pointer overflow-hidden ${isCollapsed ? 'justify-center w-full' : 'space-x-3'}`}
          onClick={() => setCurrentView('dashboard')}
        >
          <div className="w-10 h-10 rounded-xl medical-gradient flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <h1 className="font-bold text-base text-white tracking-tight leading-tight">SIAK3-RS</h1>
              <p className="text-[10px] text-sky-400 font-medium truncate">Audit K3 Rumah Sakit</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1.5">
            {!isCollapsed && (
              <p className="px-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                {group.title}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center transition-all duration-150 group relative ${
                    isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
                  } rounded-xl text-xs sm:text-sm font-semibold ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25 font-bold'
                      : item.highlight
                      ? 'text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className={`flex items-center truncate ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive
                          ? 'text-white'
                          : item.highlight
                          ? 'text-emerald-400'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {item.badge !== undefined && (
                    isCollapsed ? (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-600 rounded-full border border-slate-900" />
                    ) : (
                      <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        {item.badge}
                      </span>
                    )
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer info */}
      <div className="p-3 border-t border-slate-800/80 text-center">
        {!isCollapsed ? (
          <div className="bg-slate-800/60 p-2.5 rounded-xl text-[11px] text-slate-400 space-y-0.5">
            <p className="font-semibold text-slate-300">Versi 1.0 (Enterprise)</p>
            <p className="text-[10px] text-slate-500">Standar K3RS & KARS</p>
          </div>
        ) : (
          <div className="w-3 h-3 rounded-full bg-emerald-500 mx-auto" title="System Online" />
        )}
      </div>
    </aside>
  );
};
