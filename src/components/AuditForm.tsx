import React, { useState } from 'react';
import { HospitalUnit, Category, AuditType, Finding, AuditChecklistResult, AuditRecord } from '../types';
import { Plus, FolderPlus, FileCheck, AlertTriangle, Upload, CheckCircle2, XCircle, ChevronDown, Sparkles, Save } from 'lucide-react';
import { uploadFindingPhoto } from '../lib/supabase';

interface AuditFormProps {
  units: HospitalUnit[];
  categories: Category[];
  auditorName: string;
  audits: AuditRecord[];
  onAddCategory: (categoryName: string) => Promise<void>;
  onSaveAuditRequest: (auditData: {
    auditNumber: string;
    auditDate: string;
    auditorName: string;
    unitId: number;
    unitName: string;
    auditType: AuditType;
    checklistResults: AuditChecklistResult[];
    findings: Finding[];
  }) => void;
  editingAudit?: AuditRecord | null;
}

export const AuditForm: React.FC<AuditFormProps> = ({
  units,
  categories,
  auditorName,
  audits,
  onAddCategory,
  onSaveAuditRequest,
  editingAudit = null,
}) => {
  // Form Info Header State (Berurutan Bulanan: AUD-K3-YYYYMM-XXX)
  const [auditNumber] = useState(() => {
    if (editingAudit) return editingAudit.auditNumber;

    const now = new Date();
    const yearStr = now.getFullYear();
    const monthStr = String(now.getMonth() + 1).padStart(2, '0');
    const prefix = `AUD-K3-${yearStr}${monthStr}-`;
    
    // Filter audit pada bulan dan tahun aktif
    const monthlyAudits = audits.filter((a) => {
      if (!a.auditDate) return false;
      const [aYear, aMonth] = a.auditDate.split('-');
      return aYear === String(yearStr) && aMonth === monthStr;
    });

    const nextSeq = monthlyAudits.length + 1;
    const seqStr = String(nextSeq).padStart(3, '0');
    return `${prefix}${seqStr}`;
  });

  const [auditDate, setAuditDate] = useState(() => {
    return editingAudit ? editingAudit.auditDate : new Date().toISOString().split('T')[0];
  });
  const [auditor, setAuditor] = useState(() => {
    return editingAudit ? editingAudit.auditorName : auditorName;
  });
  const [selectedUnitId, setSelectedUnitId] = useState<number>(() => {
    return editingAudit ? editingAudit.unitId : (units[0]?.id || 1);
  });
  const [auditType, setAuditType] = useState<AuditType>(() => {
    return editingAudit ? editingAudit.auditType : 'Internal';
  });

  // Dynamic Items per Category State
  const [dynamicCategories, setDynamicCategories] = useState<Category[]>(categories);

  // Checklist Status State: {[itemId]: 'Sesuai' | 'Tidak Sesuai'}
  const [checklistValues, setChecklistValues] = useState<Record<string, 'Sesuai' | 'Tidak Sesuai'>>(() => {
    if (!editingAudit) return {};
    const initial: Record<string, 'Sesuai' | 'Tidak Sesuai'> = {};
    editingAudit.checklistResults.forEach((res) => {
      initial[res.itemId] = res.status;
    });
    return initial;
  });

  // Findings State: {[itemId]: Finding}
  const [findingsMap, setFindingsMap] = useState<Record<string, Finding>>(() => {
    if (!editingAudit) return {};
    const initial: Record<string, Finding> = {};
    editingAudit.checklistResults.forEach((res) => {
      if (res.finding) {
        initial[res.itemId] = res.finding;
      }
    });
    return initial;
  });

  // Sync with editingAudit if it changes
  React.useEffect(() => {
    if (editingAudit) {
      setAuditDate(editingAudit.auditDate);
      setAuditor(editingAudit.auditorName);
      setSelectedUnitId(editingAudit.unitId);
      setAuditType(editingAudit.auditType);

      const initialValues: Record<string, 'Sesuai' | 'Tidak Sesuai'> = {};
      const initialFindings: Record<string, Finding> = {};
      editingAudit.checklistResults.forEach((res) => {
        initialValues[res.itemId] = res.status;
        if (res.finding) {
          initialFindings[res.itemId] = res.finding;
        }
      });
      setChecklistValues(initialValues);
      setFindingsMap(initialFindings);
    }
  }, [editingAudit]);

  // Modal States
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [selectedCategoryForAddItem, setSelectedCategoryForAddItem] = useState<Category | null>(null);
  const [newItemInput, setNewItemInput] = useState('');

  const [showFindingModal, setShowFindingModal] = useState(false);
  const [activeItemForFinding, setActiveItemForFinding] = useState<{ id: string; categoryName: string; description: string } | null>(null);
  
  // Finding Modal Form Inputs
  const [findingDesc, setFindingDesc] = useState('');
  const [riskLevel, setRiskLevel] = useState<'Rendah' | 'Sedang' | 'Tinggi'>('Sedang');
  const [recommendation, setRecommendation] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Sync Categories prop changes
  React.useEffect(() => {
    setDynamicCategories(categories);
  }, [categories]);

  // Handle Radio Selection (Sesuai / Tidak Sesuai)
  const handleSelectStatus = (item: { id: string; categoryName: string; description: string }, status: 'Sesuai' | 'Tidak Sesuai') => {
    setChecklistValues((prev) => ({ ...prev, [item.id]: status }));

    if (status === 'Tidak Sesuai') {
      // Trigger Finding Modal automatically as required by prompt
      setActiveItemForFinding(item);
      const existing = findingsMap[item.id];
      if (existing) {
        setFindingDesc(existing.findingDescription);
        setRiskLevel(existing.riskLevel);
        setRecommendation(existing.recommendation);
        setPhotoPreviewUrl(existing.photoPreview || existing.photoUrl || '');
      } else {
        setFindingDesc('');
        setRiskLevel('Sedang');
        setRecommendation('');
        setPhotoPreviewUrl('');
      }
      setPhotoFile(null);
      setShowFindingModal(true);
    } else {
      // If changed back to Sesuai, clean up finding
      setFindingsMap((prev) => {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      });
    }
  };

  // Handle Finding Save
  const handleSaveFinding = async () => {
    if (!activeItemForFinding) return;

    let uploadedUrl = photoPreviewUrl;
    if (photoFile) {
      setIsUploadingPhoto(true);
      uploadedUrl = await uploadFindingPhoto(photoFile);
      setIsUploadingPhoto(false);
    }

    const newFinding: Finding = {
      id: 'finding-' + Date.now(),
      categoryName: activeItemForFinding.categoryName,
      itemDescription: activeItemForFinding.description,
      findingDescription: findingDesc || 'Ketidaksesuaian standar pada ' + activeItemForFinding.description,
      riskLevel,
      recommendation: recommendation || 'Perlu dilakukan perbaikan dan pemantauan ulang.',
      photoUrl: uploadedUrl,
      photoPreview: photoPreviewUrl,
    };

    setFindingsMap((prev) => ({
      ...prev,
      [activeItemForFinding.id]: newFinding,
    }));

    setShowFindingModal(false);
  };

  // Handle Add New Dynamic Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryInput.trim()) return;
    await onAddCategory(newCategoryInput.trim());
    setNewCategoryInput('');
    setShowAddCategoryModal(false);
  };

  // Handle Add New Dynamic Item under Category
  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryForAddItem || !newItemInput.trim()) return;

    const newItemId = 'custom-item-' + Date.now();
    const newItemObj = {
      id: newItemId,
      categoryId: selectedCategoryForAddItem.id,
      categoryName: selectedCategoryForAddItem.name,
      description: newItemInput.trim(),
      isDefault: false,
    };

    setDynamicCategories((prevCats) =>
      prevCats.map((cat) =>
        cat.id === selectedCategoryForAddItem.id
          ? { ...cat, items: [...cat.items, newItemObj] }
          : cat
      )
    );

    setNewItemInput('');
    setShowAddItemModal(false);
  };

  // Submit Audit Form
  const handleSubmitAudit = () => {
    const selectedUnitObj = units.find((u) => u.id === selectedUnitId) || units[0];
    
    // Collect all checklist items across categories
    const checklistResults: AuditChecklistResult[] = [];
    const findingsList: Finding[] = [];

    dynamicCategories.forEach((cat) => {
      cat.items.forEach((item) => {
        const status = checklistValues[item.id] || 'Sesuai'; // Default to Sesuai if untouched
        const finding = findingsMap[item.id];
        checklistResults.push({
          itemId: item.id,
          categoryName: cat.name,
          itemDescription: item.description,
          status,
          finding,
        });

        if (status === 'Tidak Sesuai' && finding) {
          findingsList.push(finding);
        }
      });
    });

    onSaveAuditRequest({
      auditNumber,
      auditDate,
      auditorName: auditor,
      unitId: selectedUnitId,
      unitName: selectedUnitObj.name,
      auditType,
      checklistResults,
      findings: findingsList,
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* 1. INFORMASI AUDIT (Header Section) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-sky-600" /> 1. Informasi Audit {editingAudit ? '(Edit)' : ''}
            </h2>
            <p className="text-xs text-slate-500 mt-1">Identitas transaksi audit K3 rumah sakit yang sedang {editingAudit ? 'diperbarui' : 'dilaksanakan'}.</p>
          </div>
          <span className="bg-sky-50 text-sky-800 text-xs font-bold px-3 py-1.5 rounded-full border border-sky-200">
            {auditNumber}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Nomor Audit */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nomor Audit</label>
            <input
              type="text"
              value={auditNumber}
              disabled
              className="w-full bg-slate-100/80 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl px-4 py-2.5 cursor-not-allowed"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">Otomatis dibuat oleh sistem</span>
          </div>

          {/* Tanggal Audit */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tanggal Audit</label>
            <input
              type="date"
              value={auditDate}
              onChange={(e) => setAuditDate(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-800 text-sm font-semibold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
            />
          </div>

          {/* Nama Auditor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nama Auditor</label>
            <input
              type="text"
              value={auditor}
              onChange={(e) => setAuditor(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-800 text-sm font-semibold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
            />
          </div>

          {/* Unit yang Diaudit */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Unit yang Diaudit</label>
            <div className="relative">
              <select
                value={selectedUnitId}
                onChange={(e) => setSelectedUnitId(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 text-slate-900 text-sm font-bold rounded-xl px-4 py-2.5 appearance-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all cursor-pointer pr-10"
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.id}. {unit.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Jenis Audit */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Jenis Audit</label>
            <div className="flex items-center space-x-3">
              {(['Internal', 'Berkala', 'Insidental'] as AuditType[]).map((type) => (
                <label
                  key={type}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border text-sm font-bold cursor-pointer transition-all ${
                    auditType === type
                      ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="auditType"
                    checked={auditType === type}
                    onChange={() => setAuditType(type)}
                    className="sr-only"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 2. CHECKLIST AUDIT K3 RUMAH SAKIT (Dynamic Categories & Items) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" /> 2. Checklist Audit K3 Rumah Sakit
            </h2>
            <p className="text-xs text-slate-500 mt-1">Isi evaluasi kesesuaian standar untuk seluruh kategori di bawah ini.</p>
          </div>
          
          {/* Button Tambah Kategori Audit Baru */}
          <button
            type="button"
            onClick={() => setShowAddCategoryModal(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ Tambah Kategori Audit Baru</span>
          </button>
        </div>

        {/* Categories Loop */}
        <div className="space-y-8">
          {dynamicCategories.map((cat, catIdx) => {
            const letterPrefix = String.fromCharCode(65 + catIdx); // A, B, C...
            return (
              <div key={cat.id} className="border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
                
                {/* Category Header */}
                <div className="bg-slate-100/90 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-sky-600 text-white text-xs font-extrabold flex items-center justify-center">
                      {letterPrefix}
                    </span>
                    <span>{cat.name}</span>
                  </h3>
                  <span className="text-xs font-medium text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    {cat.items.length} item checklist
                  </span>
                </div>

                {/* Checklist Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200/80">
                        <th className="py-3 px-4 w-12 text-center">No</th>
                        <th className="py-3 px-4">Checklist Standar Evaluasi</th>
                        <th className="py-3 px-4 text-center w-28">Sesuai</th>
                        <th className="py-3 px-4 text-center w-32">Tidak Sesuai</th>
                        <th className="py-3 px-4 text-center w-36">Status Temuan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {cat.items.map((item, idx) => {
                        const currentStatus = checklistValues[item.id] || 'Sesuai';
                        const hasFinding = Boolean(findingsMap[item.id]);

                        return (
                          <tr key={item.id} className={`hover:bg-slate-50/70 transition-colors ${currentStatus === 'Tidak Sesuai' ? 'bg-rose-50/30' : ''}`}>
                            <td className="py-3.5 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                            <td className="py-3.5 px-4 font-medium leading-relaxed">
                              {item.description}
                              {!item.isDefault && (
                                <span className="ml-2 text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded font-bold">Kustom</span>
                              )}
                            </td>

                            {/* Radio Sesuai */}
                            <td className="py-3.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleSelectStatus(item, 'Sesuai')}
                                className={`w-8 h-8 rounded-full inline-flex items-center justify-center transition-all ${
                                  currentStatus === 'Sesuai'
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-110'
                                    : 'border border-slate-300 text-slate-300 hover:border-emerald-500 hover:text-emerald-500'
                                }`}
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                            </td>

                            {/* Radio Tidak Sesuai */}
                            <td className="py-3.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleSelectStatus(item, 'Tidak Sesuai')}
                                className={`w-8 h-8 rounded-full inline-flex items-center justify-center transition-all ${
                                  currentStatus === 'Tidak Sesuai'
                                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 scale-110'
                                    : 'border border-slate-300 text-slate-300 hover:border-rose-500 hover:text-rose-500'
                                }`}
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </td>

                            {/* Status Detail Temuan */}
                            <td className="py-3.5 px-4 text-center">
                              {currentStatus === 'Tidak Sesuai' ? (
                                <button
                                  type="button"
                                  onClick={() => handleSelectStatus(item, 'Tidak Sesuai')}
                                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                    hasFinding
                                      ? 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                                      : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                                  }`}
                                >
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span>{hasFinding ? 'Edit Temuan' : 'Isi Temuan'}</span>
                                </button>
                              ) : (
                                <span className="text-xs text-slate-400 font-medium">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Button Tambah Item Checklist Footer */}
                <div className="bg-slate-50/80 p-3 border-t border-slate-200/80 text-left">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategoryForAddItem(cat);
                      setShowAddItemModal(true);
                    }}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors border border-sky-200/80"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Item Checklist ({cat.name})</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Simpan Audit Button */}
        <div className="pt-6 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={handleSubmitAudit}
            className="inline-flex items-center space-x-2.5 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white text-base font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-sky-600/25 transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            <Save className="w-5 h-5" />
            <span>{editingAudit ? 'Simpan Perubahan' : 'Simpan Audit'}</span>
          </button>
        </div>
      </div>

      {/* MODAL 1: Tambah Kategori Baru */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scaleUp">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-teal-600" /> Tambah Kategori Audit Baru
            </h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Kategori K3 Baru</label>
                <input
                  type="text"
                  placeholder="Contoh: Proteksi Radiasi / Keamanan Fasilitas"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Tambah Item Checklist */}
      {showAddItemModal && selectedCategoryForAddItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scaleUp">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-sky-600" /> Tambah Item Checklist
            </h3>
            <p className="text-xs text-slate-500">
              Kategori: <strong className="text-slate-800">{selectedCategoryForAddItem.name}</strong>
            </p>
            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi Standard / Checklist</label>
                <textarea
                  placeholder="Masukkan pernyataan standar K3 yang dievaluasi..."
                  value={newItemInput}
                  onChange={(e) => setNewItemInput(e.target.value)}
                  required
                  rows={3}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md"
                >
                  Tambah Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Detail Temuan Ketidaksesuaian & Upload Foto */}
      {showFindingModal && activeItemForFinding && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col p-5 space-y-4 shadow-2xl my-auto animate-scaleUp">
            <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between shrink-0">
              <h3 className="text-base font-bold text-rose-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> Detail Temuan Ketidaksesuaian
              </h3>
              <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                {activeItemForFinding.categoryName}
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs text-slate-700 shrink-0">
              <span className="font-bold block text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Item Evaluasi:</span>
              <p className="font-semibold leading-snug">{activeItemForFinding.description}</p>
            </div>

            <div className="space-y-3 text-xs overflow-y-auto pr-1">
              
              {/* Deskripsi Temuan */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Deskripsi Temuan Lapangan *</label>
                <textarea
                  placeholder="Jelaskan kondisi ketidaksesuaian fisik / prosedur yang ditemukan..."
                  value={findingDesc}
                  onChange={(e) => setFindingDesc(e.target.value)}
                  rows={2}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              {/* Tingkat Risiko */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Tingkat Risiko *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Rendah', 'Sedang', 'Tinggi'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setRiskLevel(lvl)}
                      className={`py-1.5 rounded-lg font-extrabold text-xs border transition-all ${
                        riskLevel === lvl
                          ? lvl === 'Tinggi'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : lvl === 'Sedang'
                            ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                            : 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rekomendasi Perbaikan */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Rekomendasi Perbaikan *</label>
                <textarea
                  placeholder="Tindakan korektif yang wajib dilakukan unit kerja..."
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  rows={2}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              {/* Upload Foto */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-[11px]">Upload Foto Bukti Visual</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-3 text-center hover:border-sky-500 transition-colors cursor-pointer bg-slate-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setPhotoFile(file);
                        setPhotoPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                    id="photo-upload-input"
                  />
                  <label htmlFor="photo-upload-input" className="cursor-pointer flex flex-col items-center space-y-1">
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-xs font-semibold text-sky-700">Klik untuk unggah foto bukti</span>
                    <span className="text-[10px] text-slate-400">Format PNG, JPG max 5MB</span>
                  </label>
                </div>

                {photoPreviewUrl && (
                  <div className="mt-2 relative inline-block rounded-lg overflow-hidden border border-slate-200 shadow-xs max-h-28">
                    <img src={photoPreviewUrl} alt="Preview Temuan" className="h-28 w-auto object-cover" />
                  </div>
                )}
              </div>

            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => setShowFindingModal(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isUploadingPhoto}
                onClick={handleSaveFinding}
                className="px-5 py-2 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs disabled:opacity-50 flex items-center space-x-1"
              >
                {isUploadingPhoto ? <span>Uploading...</span> : <span>Simpan Temuan</span>}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
