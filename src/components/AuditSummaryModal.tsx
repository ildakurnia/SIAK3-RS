import React, { useState } from 'react';
import { Predicate } from '../types';
import { Award, Calculator, CheckCircle2, XCircle, FileSpreadsheet, ArrowRight, X } from 'lucide-react';

interface AuditSummaryModalProps {
  totalChecklist: number;
  totalCompliant: number;
  totalNonCompliant: number;
  onConfirmFinalSave: (finalScore: number, predicate: Predicate) => void;
  onClose: () => void;
}

export const AuditSummaryModal: React.FC<AuditSummaryModalProps> = ({
  totalChecklist,
  totalCompliant,
  totalNonCompliant,
  onConfirmFinalSave,
  onClose,
}) => {
  const [hasCalculated, setHasCalculated] = useState(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [predicate, setPredicate] = useState<Predicate>('Cukup');

  // Handle Hitung Skor Button
  const handleCalculateScore = () => {
    if (totalChecklist === 0) return;
    const score = (totalCompliant / totalChecklist) * 100;
    const roundedScore = Math.round(score * 100) / 100; // 2 decimal places e.g. 88.57
    setFinalScore(roundedScore);

    // Predicate Thresholds
    let pred: Predicate = 'Sangat Kurang';
    if (roundedScore >= 95) {
      pred = 'Sangat Baik';
    } else if (roundedScore >= 85) {
      pred = 'Baik';
    } else if (roundedScore >= 70) {
      pred = 'Cukup';
    } else if (roundedScore >= 50) {
      pred = 'Kurang';
    } else {
      pred = 'Sangat Kurang';
    }

    setPredicate(pred);
    setHasCalculated(true);
  };

  const getPredicateBadgeClass = (pred: Predicate) => {
    switch (pred) {
      case 'Sangat Baik':
        return 'bg-emerald-600 text-white shadow-emerald-500/20';
      case 'Baik':
        return 'bg-blue-600 text-white shadow-blue-500/20';
      case 'Cukup':
        return 'bg-amber-500 text-white shadow-amber-500/20';
      case 'Kurang':
        return 'bg-orange-600 text-white shadow-orange-500/20';
      default:
        return 'bg-rose-600 text-white shadow-rose-500/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col p-5 sm:p-6 space-y-4 shadow-2xl my-auto border border-slate-200 animate-scaleUp relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 pr-6">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-1 shadow-xs">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">RINGKASAN AUDIT</h2>
          <p className="text-xs text-slate-500">Ringkasan hasil checklist K3RS yang telah diisi.</p>
        </div>

        {/* Scrollable Body */}
        <div className="space-y-4 overflow-y-auto pr-1">
          {/* Tabel Ringkasan Audit */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2 text-xs">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rekapitulasi Evaluasi</h4>
            <table className="w-full">
              <tbody className="divide-y divide-slate-200/60 font-semibold text-slate-700">
                <tr>
                  <td className="py-2">Total Checklist Evaluasi</td>
                  <td className="py-2 text-right font-extrabold text-slate-900">{totalChecklist}</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Checklist Sesuai
                  </td>
                  <td className="py-2 text-right font-extrabold text-emerald-600">{totalCompliant}</td>
                </tr>
                <tr>
                  <td className="py-2 flex items-center gap-1 text-rose-700">
                    <XCircle className="w-3.5 h-3.5" /> Checklist Tidak Sesuai
                  </td>
                  <td className="py-2 text-right font-extrabold text-rose-600">{totalNonCompliant}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action Button: Hitung Skor */}
          {!hasCalculated ? (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleCalculateScore}
                className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-sm font-extrabold px-5 py-3 rounded-xl shadow-md transition-all"
              >
                <Calculator className="w-4 h-4" />
                <span>Hitung Skor Otomatis</span>
              </button>
            </div>
          ) : (
            /* PERHITUNGAN SKOR & HASIL AUDIT */
            <div className="space-y-4 animate-fadeIn">
              
              <div className="bg-gradient-to-br from-sky-900 to-slate-900 rounded-xl p-4 text-white text-center space-y-2 shadow-md">
                <span className="text-[10px] uppercase tracking-wider text-sky-300 font-bold">PERHITUNGAN SKOR & HASIL AUDIT</span>
                
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-3xl sm:text-4xl font-black text-white">{finalScore.toFixed(2)}%</span>
                </div>

                <div className="pt-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-extrabold shadow-sm ${getPredicateBadgeClass(predicate)}`}>
                    <Award className="w-3.5 h-3.5 mr-1" /> Predikat: {predicate}
                  </span>
                </div>

                <div className="text-[10px] text-sky-200/80 pt-1.5 border-t border-white/10 mt-2 font-mono">
                  Formula: ({totalCompliant} ÷ {totalChecklist}) × 100% = {finalScore.toFixed(2)}%
                </div>
              </div>

              {/* Final Action Button */}
              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Kembali Edit
                </button>
                <button
                  type="button"
                  onClick={() => onConfirmFinalSave(finalScore, predicate)}
                  className="flex-2 py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-sky-600/20 transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>Simpan Rekap Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
