export type AuditType = 'Internal' | 'Berkala' | 'Insidental';

export type RiskLevel = 'Rendah' | 'Sedang' | 'Tinggi';

export type Predicate = 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang' | 'Sangat Kurang';

export type UserRole = 'Auditor K3' | 'Manajemen / Kepala K3RS';

export interface User {
  id: string;
  name: string;
  email: string;
  nip: string;
  role: UserRole;
}

export interface HospitalUnit {
  id: number;
  name: string;
}

export interface ChecklistItem {
  id: string;
  categoryId: string;
  categoryName: string;
  description: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  isDefault?: boolean;
  items: ChecklistItem[];
}

export interface Finding {
  id: string;
  auditId?: string;
  categoryName: string;
  itemDescription: string;
  findingDescription: string;
  riskLevel: RiskLevel;
  recommendation: string;
  photoUrl?: string;
  photoPreview?: string;
}

export interface AuditChecklistResult {
  itemId: string;
  categoryName: string;
  itemDescription: string;
  status: 'Sesuai' | 'Tidak Sesuai';
  finding?: Finding;
}

export interface AuditRecord {
  id: string;
  auditNumber: string;
  auditDate: string;
  auditorName: string;
  unitId: number;
  unitName: string;
  auditType: AuditType;
  totalChecklist: number;
  totalCompliant: number;
  totalNonCompliant: number;
  finalScore: number;
  predicate: Predicate;
  checklistResults: AuditChecklistResult[];
  findings: Finding[];
  createdAt: string;
}
