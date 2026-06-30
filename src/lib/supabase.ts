import { createClient } from '@supabase/supabase-js';
import { AuditRecord, Category } from '../types';
import { INITIAL_CATEGORIES } from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// LocalStorage Persistence Keys
const LOCAL_STORAGE_AUDITS_KEY = 'siak3_audits_data';
const LOCAL_STORAGE_CATEGORIES_KEY = 'siak3_categories_data';

// Helper to get initial sample audit for initial showcase
const getSampleAudits = (): AuditRecord[] => [
  {
    id: 'sample-audit-1',
    auditNumber: 'AUD-K3-202606-001',
    auditDate: '2026-06-28',
    auditorName: 'Dian Dwi Martha',
    unitId: 1,
    unitName: 'IGD',
    auditType: 'Internal',
    totalChecklist: 35,
    totalCompliant: 31,
    totalNonCompliant: 4,
    finalScore: 88.57,
    predicate: 'Baik',
    checklistResults: [],
    findings: [
      {
        id: 'find-1',
        categoryName: 'Alat Pelindung Diri (APD)',
        itemDescription: 'APD digunakan oleh petugas',
        findingDescription: 'Beberapa petugas triase IGD tidak menggunakan goggle saat penanganan sampel cairan.',
        riskLevel: 'Sedang',
        recommendation: 'Lakukan re-edukasi penggunaan APD lengkap dan penyediaan stok goggle di meja triase.',
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

// Load Categories
export async function fetchCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error && data && data.length > 0) {
        // Map database categories
        return data.map((c) => ({
          id: String(c.id),
          name: c.category_name,
          isDefault: c.is_default,
          items: INITIAL_CATEGORIES.find((ic) => ic.name === c.category_name)?.items || [],
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local storage', e);
    }
  }

  const stored = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  return INITIAL_CATEGORIES;
}

// Save New Dynamic Category
export async function saveCategory(categoryName: string): Promise<Category> {
  const newCat: Category = {
    id: 'cat-' + Date.now(),
    name: categoryName,
    isDefault: false,
    items: [],
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('categories').insert({ category_name: categoryName, is_default: false });
    } catch (e) {
      console.error(e);
    }
  }

  const current = await fetchCategories();
  const updated = [...current, newCat];
  localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(updated));
  return newCat;
}

// Load Audits
export async function fetchAudits(): Promise<AuditRecord[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('audits').select('*, units(unit_name)').order('created_at', { ascending: false });
      if (!error && data) {
        return data.map((a: any) => ({
          id: a.id,
          auditNumber: a.audit_number,
          auditDate: a.audit_date,
          auditorName: a.auditor_name,
          unitId: a.unit_id,
          unitName: a.units?.unit_name || 'Unit ' + a.unit_id,
          auditType: a.audit_type,
          totalChecklist: a.total_checklist,
          totalCompliant: a.total_compliant,
          totalNonCompliant: a.total_non_compliant,
          finalScore: Number(a.final_score),
          predicate: a.predicate,
          checklistResults: [],
          findings: [],
          createdAt: a.created_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch audits failed, using local storage', e);
    }
  }

  const stored = localStorage.getItem(LOCAL_STORAGE_AUDITS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  
  // Initialize sample if empty
  const samples = getSampleAudits();
  localStorage.setItem(LOCAL_STORAGE_AUDITS_KEY, JSON.stringify(samples));
  return samples;
}

// Save Audit Record
export async function saveAuditRecord(audit: Omit<AuditRecord, 'id' | 'createdAt'>): Promise<AuditRecord> {
  const newRecord: AuditRecord = {
    ...audit,
    id: 'audit-' + Date.now(),
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('audits')
        .insert({
          audit_number: audit.auditNumber,
          audit_date: audit.auditDate,
          auditor_name: audit.auditorName,
          unit_id: audit.unitId,
          audit_type: audit.auditType,
          total_checklist: audit.totalChecklist,
          total_compliant: audit.totalCompliant,
          total_non_compliant: audit.totalNonCompliant,
          final_score: audit.finalScore,
          predicate: audit.predicate,
        })
        .select()
        .single();

      if (!error && data) {
        newRecord.id = data.id;
        // Save findings to supabase if any
        if (audit.findings && audit.findings.length > 0) {
          const findingsToInsert = audit.findings.map((f) => ({
            audit_id: data.id,
            category_name: f.categoryName,
            item_description: f.itemDescription,
            risk_level: f.riskLevel,
            finding_description: f.findingDescription,
            recommendation: f.recommendation,
            photo_url: f.photoUrl || null,
          }));
          await supabase.from('findings').insert(findingsToInsert);
        }
      }
    } catch (e) {
      console.error('Failed to save to Supabase:', e);
    }
  }

  const current = await fetchAudits();
  const updated = [newRecord, ...current];
  localStorage.setItem(LOCAL_STORAGE_AUDITS_KEY, JSON.stringify(updated));
  return newRecord;
}

// Upload photo helper
export async function uploadFindingPhoto(file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    try {
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const { data, error } = await supabase.storage.from('finding-photos').upload(fileName, file);
      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from('finding-photos').getPublicUrl(fileName);
        return publicUrlData.publicUrl;
      }
    } catch (e) {
      console.error('Supabase upload error:', e);
    }
  }

  // Fallback to Base64 data URL for local preview storage
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}
