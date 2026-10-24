'use client';

import { useAppStore } from '@/lib/stores/app-store';
import { Sidebar } from './sidebar';
import { AppHeader } from './app-header';
import { DashboardView } from '@/components/dashboard/dashboard-view';
import { ReportForm } from '@/components/intake/report-form';
import { ReviewQueue } from '@/components/review/review-queue';
import { OshaLog } from '@/components/log/osha-log';
import { SettingsView } from '@/components/settings/settings-view';
import { AuditTrail } from '@/components/audit/audit-trail';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

const pageTransition = {
  initial: { opacity: 0, y: 8, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -4, filter: 'blur(2px)' },
  transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
};

function PlaceholderView({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-12 h-12 rounded-full bg-[var(--border)] flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-[var(--ink-faint)]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
            <path d="M1.5 6h13" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[var(--ink)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h3>
        <p className="text-sm text-[var(--ink-muted)]">{description}</p>
      </motion.div>
    </div>
  );
}

function ViewRouter({ onSwitch }: { onSwitch: () => void }) {
  const { activeView, facility } = useAppStore();

  return (
    <AnimatePresence mode="wait" onExitComplete={onSwitch}>
      <motion.div
        key={activeView}
        {...pageTransition}
      >
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'report' && <ReportForm key={facility} />}
        {activeView === 'review' && <ReviewQueue />}
        {activeView === 'log' && <OshaLog />}
        {activeView === 'incidents' && <PlaceholderView title="All Incidents" description="Full incident list with filtering and search. Coming next." />}
        {activeView === 'forms' && <PlaceholderView title="Export Forms" description="Generate OSHA 300A summary, 301 forms, and ITA CSV exports." />}
        {activeView === 'audit' && <AuditTrail />}
        {activeView === 'settings' && <SettingsView />}
      </motion.div>
    </AnimatePresence>
  );
}

export function AppShell() {
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem('foreman-theme');
      if (saved === 'light' || saved === 'dark') {
        document.documentElement.setAttribute('data-theme', saved);
      }
    } catch {}
  }, []);

  return (
    <div className="flex h-dvh w-full bg-[var(--bg)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        {/* Scroll container: focusable so keyboard users can scroll views with no other focusable content */}
        <main ref={mainRef} tabIndex={0} className="flex-1 overflow-y-auto p-4 lg:p-6 focus-visible:outline-offset-[-2px]">
          <ViewRouter onSwitch={() => mainRef.current?.scrollTo({ top: 0 })} />
        </main>
      </div>
    </div>
  );
}
