import React, { useState } from 'react';
import { AuditRecord, RiskLevel } from '../types';
import { AlertTriangle, Building2, Calendar, Eye, ShieldAlert, CheckCircle2, Search } from 'lucide-react';

interface FindingsViewProps {
  audits: AuditRecord[];
  onViewReport: (audit: AuditRecord) => void;
}

export const FindingsView: React.FC<FindingsViewProps> = ({ audits, onViewReport }) => {
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all findings across all audits
  const allFindings = audits.flatMap((audit) =>
    audit.findings.map((f) => ({
      ...f,
      auditNumber: audit.auditNumber,
      auditDate: audit.auditDate,
      unitName: audit.unitName,
      auditorName: audit.auditorName,
      parentAudit: audit,
    }))
  );

  const filteredFindings = allFindings.filter((item) => {
    const matchesRisk = selectedRiskFilter === 'Semua' || item.riskLevel === selectedRiskFilter;
    const matchesSearch =
      item.itemDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.findingDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.unitName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const getRiskBadge = (level: RiskLevel) => {
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
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-600" /> Manajemen Temuan & Risiko
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Rekapitulasi seluruh ketidaksesuaian standar K3RS yang memerlukan tindak lanjut perbaikan.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500">Total Temuan:</span>
          <span className="bg-rose-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-xs">
            {allFindings.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between flex-wrap gap-4">
        
        {/* Risk Level Filter Pills */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500 mr-1">Filter Risiko:</span>
          {['Semua', 'Tinggi', 'Sedang', 'Rendah'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedRiskFilter(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                selectedRiskFilter === lvl
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Cari temuan atau unit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:ring-2 focus:ring-sky-500 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

      </div>

      {/* Findings Cards / Table Grid */}
      {filteredFindings.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <p className="text-slate-700 font-bold text-sm">Tidak Ada Temuan Risiko Ditemukan</p>
          <p className="text-slate-400 text-xs">Seluruh evaluasi sesuai standar atau belum ada filter yang cocok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFindings.map((finding, idx) => (
            <div
              key={finding.id || idx}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-sky-600" />
                    <span className="font-bold text-xs text-slate-900">{finding.unitName}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-slate-500 font-medium">{finding.categoryName}</span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getRiskBadge(finding.riskLevel)}`}>
                    Risiko {finding.riskLevel}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{finding.itemDescription}</h4>
                  <p className="text-xs text-slate-600 mt-1.5 font-normal leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-slate-800">Uraian Temuan:</strong> {finding.findingDescription}
                  </p>
                </div>

                <div className="text-xs bg-sky-50/60 p-2.5 rounded-xl border border-sky-100 text-slate-700">
                  <strong className="text-sky-900 block text-[11px] mb-0.5">Rekomendasi Perbaikan:</strong>
                  <span>{finding.recommendation}</span>
                </div>

                {(finding.photoUrl || finding.photoPreview) && (
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">Bukti Foto Visual:</span>
                    <img
                      src={finding.photoUrl || finding.photoPreview}
                      alt="Bukti Temuan"
                      className="h-28 w-auto object-cover rounded-xl border border-slate-200"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{finding.auditDate} ({finding.auditNumber})</span>
                </div>
                <button
                  onClick={() => onViewReport(finding.parentAudit)}
                  className="inline-flex items-center space-x-1 text-sky-700 font-bold hover:text-sky-800"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Audit</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
