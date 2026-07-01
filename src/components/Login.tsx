import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ShieldCheck, Lock, Mail, UserCheck, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Dian Dwi Martha',
    email: 'dian@k3.com',
    nip: '19920815 202012 2 004',
    role: 'Auditor K3',
  },
];

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [selectedPreset, setSelectedPreset] = useState<User>(MOCK_USERS[0]);
  const [emailOrNip, setEmailOrNip] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectPreset = (u: User) => {
    setSelectedPreset(u);
    setEmailOrNip(u.email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailOrNip,
          password: password,
        });

        setIsLoading(false);

        if (error) {
          setErrorMessage(error.message === 'Invalid login credentials' ? 'Email atau Kata Sandi salah.' : error.message);
          return;
        }

        if (data.user) {
          const name = data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Auditor';
          const nip = data.user.user_metadata?.nip || '19920815 202012 2 004';
          const role = data.user.user_metadata?.role || 'Auditor K3';

          onLoginSuccess({
            id: data.user.id,
            name,
            email: data.user.email || '',
            nip,
            role: role as any,
          });
        }
      } catch (err: any) {
        setIsLoading(false);
        setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
      }
    } else {
      // Mock login fallback
      setTimeout(() => {
        setIsLoading(false);
        const matched = MOCK_USERS.find(
          (u) => u.email.toLowerCase() === emailOrNip.toLowerCase() || u.nip === emailOrNip
        ) || {
          ...selectedPreset,
          email: emailOrNip,
        };
        onLoginSuccess(matched);
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Background Glow Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[400px] w-full relative z-10 space-y-6 animate-scaleUp">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl medical-gradient flex items-center justify-center text-white mx-auto shadow-xl shadow-sky-500/25 border border-white/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">SIAK3-RS</h1>
          <p className="text-xs text-sky-200/90 font-medium max-w-[320px] mx-auto">Sistem Informasi Audit Keselamatan & Kesehatan Kerja Rumah Sakit</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-2xl border border-white/20 space-y-6">
          
          <div className="text-center">
            <h2 className="text-lg font-extrabold text-slate-900">Masuk Akun</h2>
            <p className="text-xs text-slate-500 mt-0.5">Silakan masuk untuk mengakses dashboard audit K3RS.</p>
          </div>

          {/* Quick Preset Selector for Easy Testing */}
          {MOCK_USERS.length > 1 && (
            <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pilih Akun Demo (Uji Coba):</span>
              <div className="grid grid-cols-2 gap-2">
                {MOCK_USERS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectPreset(u)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedPreset.id === u.id
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <p className="text-xs font-bold truncate">{u.name}</p>
                    <p className={`text-[10px] truncate mt-0.5 ${selectedPreset.id === u.id ? 'text-sky-100' : 'text-slate-500'}`}>
                      {u.role}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {errorMessage && (
              <div className="bg-rose-50 text-rose-700 text-xs font-bold p-3 rounded-xl border border-rose-200 text-center animate-fadeIn">
                {errorMessage}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email / NIP Pegawai</label>
              <div className="relative">
                <input
                  type="text"
                  value={emailOrNip}
                  onChange={(e) => setEmailOrNip(e.target.value)}
                  required
                  placeholder="Masukkan email atau NIP..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Kata Sandi</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white text-sm font-extrabold rounded-xl shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
            >
              {isLoading ? (
                <span>Memproses Masuk...</span>
              ) : (
                <>
                  <span>Masuk Ke Sistem Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-sky-200/60">
          © {new Date().getFullYear()} Komite K3 Rumah Sakit. Hak Cipta Dilindungi.
        </p>

      </div>
    </div>
  );
};
