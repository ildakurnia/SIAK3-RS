import { useState, useEffect } from 'react';
import { Sidebar, NavView } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AuditForm } from './components/AuditForm';
import { FindingsView } from './components/FindingsView';
import { AuditSummaryModal } from './components/AuditSummaryModal';
import { ReportViewModal } from './components/ReportViewModal';
import { Login, MOCK_USERS } from './components/Login';
import { AuditRecord, Category, HospitalUnit, Predicate, AuditChecklistResult, Finding, AuditType, User } from './types';
import { fetchAudits, fetchCategories, saveAuditRecord, saveCategory } from './lib/supabase';
import { INITIAL_HOSPITAL_UNITS } from './lib/mockData';

const LOCAL_STORAGE_USER_KEY = 'siak3_current_user';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return MOCK_USERS[0]; // Default user Dian Kurnia
  });

  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [units] = useState<HospitalUnit[]>(INITIAL_HOSPITAL_UNITS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [audits, setAudits] = useState<AuditRecord[]>([]);

  // Active Draft for Summary Calculation
  const [activeDraft, setActiveDraft] = useState<{
    auditNumber: string;
    auditDate: string;
    auditorName: string;
    unitId: number;
    unitName: string;
    auditType: AuditType;
    checklistResults: AuditChecklistResult[];
    findings: Finding[];
  } | null>(null);

  // Modal Views
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedReportAudit, setSelectedReportAudit] = useState<AuditRecord | null>(null);

  // Load Initial Data
  useEffect(() => {
    async function loadInitialData() {
      const cats = await fetchCategories();
      setCategories(cats);
      const auds = await fetchAudits();
      setAudits(auds);
    }
    loadInitialData();
  }, []);

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  // Handle Add Category
  const handleAddCategory = async (catName: string) => {
    const newCat = await saveCategory(catName);
    setCategories((prev) => [...prev, newCat]);
  };

  // Handle Audit Form Submit Request -> Opens Summary Modal
  const handleSaveAuditRequest = (draftData: {
    auditNumber: string;
    auditDate: string;
    auditorName: string;
    unitId: number;
    unitName: string;
    auditType: AuditType;
    checklistResults: AuditChecklistResult[];
    findings: Finding[];
  }) => {
    setActiveDraft(draftData);
    setShowSummaryModal(true);
  };

  // Handle Final Confirm Save after score calculation
  const handleConfirmFinalSave = async (finalScore: number, predicate: Predicate) => {
    if (!activeDraft || !currentUser) return;

    const totalChecklist = activeDraft.checklistResults.length;
    const totalCompliant = activeDraft.checklistResults.filter((r) => r.status === 'Sesuai').length;
    const totalNonCompliant = activeDraft.checklistResults.filter((r) => r.status === 'Tidak Sesuai').length;

    const savedRecord = await saveAuditRecord({
      auditNumber: activeDraft.auditNumber,
      auditDate: activeDraft.auditDate,
      auditorName: currentUser.name,
      unitId: activeDraft.unitId,
      unitName: activeDraft.unitName,
      auditType: activeDraft.auditType,
      totalChecklist,
      totalCompliant,
      totalNonCompliant,
      finalScore,
      predicate,
      checklistResults: activeDraft.checklistResults,
      findings: activeDraft.findings,
    });

    setAudits((prev) => [savedRecord, ...prev]);
    setShowSummaryModal(false);
    setActiveDraft(null);
    setCurrentView('dashboard');
  };

  // Render Login screen if not authenticated
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const totalFindingsCount = audits.reduce((acc, a) => acc + (a.findings?.length || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Collapsible Left Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        totalFindingsCount={totalFindingsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <Header
          currentView={currentView}
          currentUser={currentUser}
          onLogout={handleLogout}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Dynamic View Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && (
              <Dashboard
                audits={audits}
                onNewAudit={() => setCurrentView('new-audit')}
                onViewReport={(audit) => setSelectedReportAudit(audit)}
                auditorName={currentUser.name}
              />
            )}

            {currentView === 'new-audit' && (
              <AuditForm
                units={units}
                categories={categories}
                auditorName={currentUser.name}
                audits={audits}
                onAddCategory={handleAddCategory}
                onSaveAuditRequest={handleSaveAuditRequest}
              />
            )}

            {currentView === 'findings' && (
              <FindingsView
                audits={audits}
                onViewReport={(audit) => setSelectedReportAudit(audit)}
              />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200/80 py-4 px-8 text-center text-xs text-slate-500 shrink-0">
          <p>© {new Date().getFullYear()} SIAK3-RS — Sistem Informasi Audit K3 Rumah Sakit Enterprise Edition.</p>
        </footer>
      </div>

      {/* Summary Calculation Modal */}
      {showSummaryModal && activeDraft && (
        <AuditSummaryModal
          totalChecklist={activeDraft.checklistResults.length}
          totalCompliant={activeDraft.checklistResults.filter((r) => r.status === 'Sesuai').length}
          totalNonCompliant={activeDraft.checklistResults.filter((r) => r.status === 'Tidak Sesuai').length}
          onConfirmFinalSave={handleConfirmFinalSave}
          onClose={() => setShowSummaryModal(false)}
        />
      )}

      {/* Printable Report View Modal */}
      {selectedReportAudit && (
        <ReportViewModal
          audit={selectedReportAudit}
          onClose={() => setSelectedReportAudit(null)}
        />
      )}

    </div>
  );
}
