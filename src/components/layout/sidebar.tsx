'use client';

import { useAppStore } from '@/lib/stores/app-store';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useSyncExternalStore } from 'react';
import { ForemanMark } from '@/components/brand/foreman-mark';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: GridIcon },
  { id: 'report', label: 'Report Incident', icon: PlusCircleIcon },
  { id: 'review', label: 'Review Queue', icon: CheckCircleIcon },
  { id: 'log', label: 'OSHA 300 Log', icon: TableIcon },
  { id: 'audit', label: 'Audit Trail', icon: ClockIcon },
  { id: 'settings', label: 'Settings', icon: GearIcon },
];

const DESKTOP = '(min-width: 1024px)';

function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

export function Sidebar() {
  const { sidebarOpen, activeView, setActiveView, setSidebarOpen, incidents } = useAppStore();
  const pendingCount = incidents.filter((i) => i.review.status === 'pending').length;
  const isDesktop = useSyncExternalStore(subscribeDesktop, () => window.matchMedia(DESKTOP).matches, () => true);
  // The mobile drawer is only translated off-screen, so keep keyboard focus out of it while closed
  const hidden = !isDesktop && !sidebarOpen;

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-[2px]"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      <aside
        inert={hidden}
        className={clsx(
          'fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r lg:translate-x-0 lg:sticky lg:top-0 lg:h-dvh lg:z-auto',
          'bg-[var(--card)] border-[var(--border)] shrink-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'w-[260px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]'
        )}
      >
        <div className="flex items-center gap-3 px-5 h-16 border-b border-[var(--border)]">
          <ForemanMark height={30} className="text-[var(--ink)]" />
          <div>
            <p className="m-0 text-sm font-bold tracking-tight text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
              FOREMAN
            </p>
            <p className="m-0 text-[10px] tracking-[0.15em] uppercase text-[var(--ink-faint)]" style={{ fontFamily: 'var(--font-mono)' }}>OSHA Recordkeeping</p>
          </div>
        </div>

        <nav aria-label="Dashboard" className="flex-1 py-2 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <motion.button
                key={item.id}
                aria-current={active ? 'page' : undefined}
                onClick={() => {
                  setActiveView(item.id);
                  setSidebarOpen(false);
                }}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm relative',
                  active
                    ? 'text-[var(--accent)] font-medium'
                    : 'text-[var(--ink-muted)]'
                )}
                style={{ fontFamily: 'var(--font-body)' }}
                whileHover={{ x: active ? 0 : 2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-[var(--radius-md)] bg-[var(--accent-subtle)]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3 w-full">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                  {item.id === 'review' && pendingCount > 0 && (
                    <motion.span
                      className="ml-auto text-[11px] font-medium bg-[var(--accent)] text-[var(--on-accent)] px-1.5 py-0.5 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.2 }}
                    >
                      {pendingCount}
                    </motion.span>
                  )}
                </span>
              </motion.button>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-[var(--border)]">
          <motion.div className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)]">
            <div className="w-7 h-7 rounded-full bg-[var(--border)] flex items-center justify-center">
              <span className="text-xs font-medium text-[var(--ink-muted)]">TM</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--ink)] truncate">Test Manager</p>
              <p className="text-[11px] text-[var(--ink-faint)]">Safety Admin</p>
            </div>
          </motion.div>
        </div>
      </aside>
    </>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="1.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="1.5" width="5" height="5" rx="1" />
      <rect x="1.5" y="9.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
    </svg>
  );
}

function PlusCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 5.5v5M5.5 8h5" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M5.5 8l2 2 3.5-3.5" />
    </svg>
  );
}

function TableIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
      <path d="M1.5 6h13M1.5 9.5h13M5.5 6v7.5M10.5 6v7.5" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 4.5V8l2.5 1.5" />
    </svg>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2" />
      <path d="M13.3 10a1.1 1.1 0 00.2 1.2l.04.04a1.33 1.33 0 11-1.89 1.89l-.04-.04a1.1 1.1 0 00-1.2-.2 1.1 1.1 0 00-.67 1.01v.11a1.33 1.33 0 11-2.67 0v-.06a1.1 1.1 0 00-.72-1.01 1.1 1.1 0 00-1.2.2l-.04.04a1.33 1.33 0 11-1.89-1.89l.04-.04a1.1 1.1 0 00.2-1.2 1.1 1.1 0 00-1.01-.67H2.13a1.33 1.33 0 110-2.67h.06a1.1 1.1 0 001.01-.72 1.1 1.1 0 00-.2-1.2l-.04-.04A1.33 1.33 0 114.85 2.7l.04.04a1.1 1.1 0 001.2.2h.05a1.1 1.1 0 00.67-1.01V1.83a1.33 1.33 0 112.67 0v.06a1.1 1.1 0 00.67 1.01 1.1 1.1 0 001.2-.2l.04-.04a1.33 1.33 0 111.89 1.89l-.04.04a1.1 1.1 0 00-.2 1.2v.05a1.1 1.1 0 001.01.67h.11a1.33 1.33 0 110 2.67h-.06a1.1 1.1 0 00-1.01.67z" />
    </svg>
  );
}
