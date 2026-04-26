import type { TabId } from '../types'

interface Props {
  active: TabId
  onChange: (tab: TabId) => void
}

function IconSummary({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function IconBreakdown({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  )
}

export function BottomTabBar({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-slate-900/96 backdrop-blur-md border-t border-slate-700/40 bottom-tab-bar">
      <div className="flex items-center h-[56px]">
        {/* Summary — 44pt min touch target */}
        <button
          onClick={() => onChange('summary')}
          className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition-colors active:opacity-70 ${
            active === 'summary' ? 'text-violet-400' : 'text-slate-500'
          }`}
        >
          <IconSummary active={active === 'summary'} />
          <span className="text-[11px] font-semibold">Summary</span>
        </button>

        {/* Add — elevated FAB in centre */}
        <div className="flex-1 flex justify-center items-center">
          <button
            onClick={() => onChange('add')}
            className={`w-[56px] h-[56px] -translate-y-3 rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-90 ${
              active === 'add'
                ? 'bg-violet-500 shadow-violet-600/60'
                : 'bg-violet-600 shadow-violet-900/60'
            }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.8} strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        {/* Breakdown — 44pt min touch target */}
        <button
          onClick={() => onChange('breakdown')}
          className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition-colors active:opacity-70 ${
            active === 'breakdown' ? 'text-violet-400' : 'text-slate-500'
          }`}
        >
          <IconBreakdown active={active === 'breakdown'} />
          <span className="text-[11px] font-semibold">Breakdown</span>
        </button>
      </div>
    </nav>
  )
}
