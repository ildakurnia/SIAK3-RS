import React from 'react';
import { AuditRecord } from '../types';
import { ClipboardList, AlertTriangle, Building2, Eye, Award, PlusCircle, Calendar, FileCheck2, Pencil, Trash2 } from 'lucide-react';

interface DashboardProps {
  audits: AuditRecord[];
  onNewAudit: () => void;
  onViewReport: (audit: AuditRecord) => void;
  onEditAudit: (audit: AuditRecord) => void;
  onDeleteAudit: (id: string) => void;
  auditorName: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ audits, onNewAudit, onViewReport, onEditAudit, onDeleteAudit, auditorName }) => {
  const totalAudits = audits.length;
  const totalFindings = audits.reduce((acc, a) => acc + (a.totalNonCompliant || 0), 0);
  const uniqueUnits = new Set(audits.map((a) => a.unitName)).size;

  const getPredicateBadgeClass = (predicate: string) => {
    switch (predicate) {
      case 'Sangat Baik':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Baik':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Cukup':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Kurang':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl medical-gradient p-6 sm:p-8 text-white shadow-xl shadow-sky-900/10">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-sky-50 border border-white/30">
            <SparklesIcon className="w-3.5 h-3.5 text-amber-300" />
            <span>Sistem Informasi Audit K3RS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Selamat Datang, {auditorName}! 👋
          </h2>
          <p className="text-sky-100 text-sm sm:text-base leading-relaxed font-normal">
            Selamat datang di Sistem Informasi Audit K3 Rumah Sakit. Gunakan menu yang tersedia untuk melakukan audit baru, melihat rekapitulasi data audit, dan mengakses laporan hasil audit unit kerja.
          </p>
          <div className="pt-2">
            <button
              onClick={onNewAudit}
              className="inline-flex items-center space-x-2 bg-white text-sky-800 hover:bg-sky-50 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4 text-sky-600" />
              <span>Mulai Audit Baru</span>
            </button>
          </div>
        </div>
        
        {/* Background Decorative Pattern */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-20 top-0 w-32 h-32 bg-sky-400/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Card 1: Total Audit */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pelaksanaan Audit</p>
            <h3 className="text-3xl font-extrabold text-slate-900">{totalAudits} <span className="text-sm font-normal text-slate-500">kali</span></h3>
            <p className="text-xs text-emerald-600 font-medium flex items-center pt-1">
              <FileCheck2 className="w-3.5 h-3.5 mr-1" /> Terrekam di sistem
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform duration-200">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total Temuan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jumlah Temuan Risiko</p>
            <h3 className="text-3xl font-extrabold text-slate-900">{totalFindings} <span className="text-sm font-normal text-slate-500">temuan</span></h3>
            <p className="text-xs text-amber-600 font-medium flex items-center pt-1">
              <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Ketidaksesuaian standar
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform duration-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Jumlah Unit Diaudit */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit Telah Diaudit</p>
            <h3 className="text-3xl font-extrabold text-slate-900">{uniqueUnits} <span className="text-sm font-normal text-slate-500">unit kerja</span></h3>
            <p className="text-xs text-indigo-600 font-medium flex items-center pt-1">
              <Building2 className="w-3.5 h-3.5 mr-1" /> Teridentifikasi aktif
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-200">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Riwayat Audit Terbaru Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-sky-600" /> Riwayat Audit Terbaru
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Daftar rekapitulasi pelaksanaan audit K3RS yang telah diselesaikan.</p>
          </div>
          <button
            onClick={onNewAudit}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-3.5 py-2 rounded-lg transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Audit Baru</span>
          </button>
        </div>

        {audits.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <ClipboardList className="w-8 h-8" />
            </div>
            <p className="text-slate-600 font-medium text-sm">Belum ada riwayat audit yang tersimpan.</p>
            <button
              onClick={onNewAudit}
              className="inline-flex items-center space-x-2 bg-sky-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-sky-700"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Audit Pertama Now</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200/80">
                  <th className="py-3.5 px-4 sm:px-6">No. Audit / Tanggal</th>
                  <th className="py-3.5 px-4">Unit Kerja / Jenis</th>
                  <th className="py-3.5 px-4 text-center">Hasil Checklist</th>
                  <th className="py-3.5 px-4 text-center">Nilai Audit</th>
                  <th className="py-3.5 px-4 text-center">Predikat</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {audits.map((audit) => (
                  <tr key={audit.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="font-bold text-sky-700">{audit.auditNumber}</div>
                      <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{audit.auditDate}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{audit.unitName}</div>
                      <div className="mt-1">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                          {audit.auditType}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className="text-emerald-700 font-bold">{audit.totalCompliant} Sesuai</span>
                      <span className="text-slate-400 mx-1">/</span>
                      <span className="text-rose-600 font-bold">{audit.totalNonCompliant} Temuan</span>
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className="text-base font-extrabold text-slate-900">{audit.finalScore.toFixed(2)}%</span>
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold border ${getPredicateBadgeClass(audit.predicate)}`}>
                        <Award className="w-3 h-3 mr-1" />
                        {audit.predicate}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onViewReport(audit)}
                          className="p-2 bg-sky-50 hover:bg-sky-100 active:bg-sky-200 text-sky-700 rounded-xl transition-all border border-sky-200/50 hover:scale-105"
                          title="Detail Laporan"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditAudit(audit)}
                          className="p-2 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-700 rounded-xl transition-all border border-amber-200/50 hover:scale-105"
                          title="Edit Audit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Apakah Anda yakin ingin menghapus data audit ${audit.auditNumber} beserta seluruh temuannya?`)) {
                              onDeleteAudit(audit.id);
                            }
                          }}
                          className="p-2 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 rounded-xl transition-all border border-rose-200/50 hover:scale-105"
                          title="Hapus Audit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}
