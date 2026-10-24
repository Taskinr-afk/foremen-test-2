'use client';

import { useAppStore } from '@/lib/stores/app-store';
import { motion, AnimatePresence } from 'framer-motion';

export function AppHeader() {
  const { setSidebarOpen, activeView } = useAppStore();

  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    report: 'Report Incident',
    incidents: 'All Incidents',
    review: 'Review Queue',
    log: 'OSHA 300 Log',
    forms: 'Export Forms',
    audit: 'Audit Trail',
    settings: 'Settings',
  };

  return (
    <header className="h-14 border-b border-[var(--border)] bg-[var(--card)] flex items-center px-4 gap-3 lg:px-6">
      <motion.button
        onClick={() => setSidebarOpen(true)}
        aria-label="Open navigation"
        className="lg:hidden p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--card-hover)] text-[var(--ink-muted)]"
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      </motion.button>
      <AnimatePresence mode="wait">
        <motion.h1
          key={activeView}
          className="text-base font-semibold text-[var(--ink)]"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {titles[activeView] || 'Dashboard'}
        </motion.h1>
      </AnimatePresence>
      <div className="flex-1" />
      <span className="hidden sm:inline text-[11px] tracking-[0.15em] uppercase text-[var(--ink-faint)]" style={{ fontFamily: 'var(--font-mono)' }}>
        Sample data
      </span>
      <motion.button
        onClick={() => { window.location.hash = ''; }}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] border border-[var(--border-strong)] hover:bg-[var(--card-hover)] text-[var(--ink-muted)] transition-colors"
        style={{ transitionDuration: 'var(--duration-fast)' }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 3H3.5v10H10M7 8h7M11.5 5.5L14 8l-2.5 2.5" />
        </svg>
        Exit demo
      </motion.button>
    </header>
  );
}
