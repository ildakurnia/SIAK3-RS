import React from 'react';
import { AuditRecord } from '../types';
import { ShieldCheck, Printer, X, Calendar, User, Building2, AlertTriangle, FileText, Award } from 'lucide-react';

interface ReportViewModalProps {
  audit: AuditRecord;
  onClose: () => void;
}

export const ReportViewModal: React.FC<ReportViewModalProps> = ({ audit, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Tinggi':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Sedang':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl my-auto border border-slate-200 animate-scaleUp print:shadow-none print:m-0 print:w-full print:max-w-none print:max-h-none">
        
        {/* Printable Action Header (Fixed Top) */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/80 rounded-t-2xl shrink-0 print:hidden">
          <div className="flex items-center space-x-2 text-sky-700 font-bold text-xs sm:text-sm">
            <FileText className="w-4 h-4" />
            <span>Laporan Hasil Audit K3RS</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINT CONTENT AREA (Scrollable Body) */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          
          {/* Header Kop Surat Laporan */}
          <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1.5">
            <div className="flex items-center justify-center space-x-2.5">
              <ShieldCheck className="w-8 h-8 text-sky-600" />
              <div className="text-left">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-wide">RUMAH SAKIT UTAMA K3</h1>
                <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">Komite Keselamatan dan Kesehatan Kerja Rumah Sakit (K3RS)</p>
              </div>
            </div>
            <h2 className="text-xs sm:text-sm font-extrabold text-sky-800 uppercase tracking-wider pt-1">
              LAPORAN EVALUASI AUDIT K3RS
            </h2>
          </div>

          {/* Metadata Audit */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Nomor Audit</span>
              <span className="font-bold text-slate-900">{audit.auditNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase flex items-center gap-1"><Calendar className="w-3 h-3"/> Tanggal</span>
              <span className="font-bold text-slate-900">{audit.auditDate}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase flex items-center gap-1"><Building2 className="w-3 h-3"/> Unit Kerja</span>
              <span className="font-bold text-slate-900">{audit.unitName}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase flex items-center gap-1"><User className="w-3 h-3"/> Auditor</span>
              <span className="font-bold text-slate-900">{audit.auditorName}</span>
            </div>
          </div>

          {/* Hasil Penilaian & Predikat Summary */}
          <div className="bg-gradient-to-r from-sky-900 to-slate-900 text-white rounded-xl p-4 sm:p-5 flex items-center justify-between flex-wrap gap-3 shadow-md">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-sky-300 font-bold">Hasil Akhir Nilai Audit</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-0.5">{audit.finalScore.toFixed(2)}%</h3>
              <p className="text-[11px] text-sky-100/90 mt-0.5">
                Total Evaluasi: {audit.totalChecklist} item ({audit.totalCompliant} Sesuai, {audit.totalNonCompliant} Temuan)
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-sky-300 font-bold block mb-1">Kualifikasi Predikat</span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white text-slate-900 text-sm sm:text-base font-extrabold shadow-sm">
                <Award className="w-4 h-4 text-amber-500 mr-1.5" /> {audit.predicate}
              </span>
            </div>
          </div>

          {/* Daftar Temuan Ketidaksesuaian */}
          <div className="space-y-3 pt-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Daftar Temuan Ketidaksesuaian ({audit.findings.length} Temuan)</span>
            </h3>

            {audit.findings.length === 0 ? (
              <div className="p-4 text-center bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-semibold">
                🎉 Tidak ditemukan ketidaksesuaian standar K3 pada unit kerja ini. Seluruh item dinilai Sesuai!
              </div>
            ) : (
              <div className="space-y-3">
                {audit.findings.map((finding, idx) => (
                  <div key={finding.id || idx} className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-2 text-xs">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        {finding.categoryName}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getRiskBadge(finding.riskLevel)}`}>
                        Risiko {finding.riskLevel}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{finding.itemDescription}</h4>
                      <p className="text-xs text-slate-600 mt-1 font-normal leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <strong className="text-slate-800">Uraian Temuan:</strong> {finding.findingDescription}
                      </p>
                    </div>

                    <div className="text-xs bg-sky-50/50 p-2 rounded-lg border border-sky-100 text-slate-700">
                      <strong className="text-sky-900 block text-[11px] mb-0.5">Rekomendasi Perbaikan:</strong>
                      <span>{finding.recommendation}</span>
                    </div>

                    {(finding.photoUrl || finding.photoPreview) && (
                      <div className="pt-1">
                        <span className="text-[10px] font-bold text-slate-500 block mb-1">Bukti Foto Visual:</span>
                        <img
                          src={finding.photoUrl || finding.photoPreview}
                          alt="Bukti Foto Temuan"
                          className="h-28 sm:h-36 w-auto object-cover rounded-lg border border-slate-200 shadow-xs"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
