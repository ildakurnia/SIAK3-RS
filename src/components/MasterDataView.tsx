import React from 'react';
import { HospitalUnit, Category } from '../types';
import { Building2, Layers, CheckCircle2, ShieldCheck } from 'lucide-react';

interface MasterDataViewProps {
  units: HospitalUnit[];
  categories: Category[];
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({ units, categories }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-sky-600" /> Data Master K3 Rumah Sakit
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Daftar unit kerja dan master kategori standar checklist K3RS yang terdaftar dalam sistem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Unit Kerja Column (1/3) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-600" /> Master Unit Kerja ({units.length})
            </h4>
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {units.map((unit) => (
              <div
                key={unit.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-[11px]">
                    {unit.id}
                  </span>
                  <span>{unit.name}</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Aktif
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Kategori Standar Column (2/3) */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" /> Master Kategori Audit K3RS ({categories.length})
            </h4>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {categories.map((cat, idx) => (
              <div key={cat.id || idx} className="bg-slate-50/80 rounded-xl border border-slate-200 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{cat.name}</span>
                  </h5>
                  <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                    {cat.items.length} Standar Checklist
                  </span>
                </div>

                <div className="pl-8 space-y-1">
                  {cat.items.map((item) => (
                    <p key={item.id} className="text-xs text-slate-600 flex items-center gap-1.5 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item.description}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
