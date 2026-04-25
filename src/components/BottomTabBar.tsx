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
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50 bottom-tab-bar">
      <div className="flex items-end">
        {/* Summary */}
        <button
          onClick={() => onChange('summary')}
          className={`flex-1 flex flex-col items-center gap-1 pt-3 pb-2 transition-colors ${
            active === 'summary' ? 'text-violet-400' : 'text-slate-500'
          }`}
        >
          <IconSummary active={active === 'summary'} />
          <span className="text-[10px] font-medium tracking-wide">Summary</span>
        </button>

        {/* Add — centre FAB */}
        <div className="flex-1 flex justify-center items-center pb-1">
          <button
            onClick={() => onChange('add')}
            className={`w-14 h-14 -mt-5 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 ${
              active === 'add'
                ? 'bg-violet-500 shadow-violet-700/50'
                : 'bg-violet-600 shadow-violet-900/50'
            }`}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        {/* Breakdown */}
        <button
          onClick={() => onChange('breakdown')}
          className={`flex-1 flex flex-col items-center gap-1 pt-3 pb-2 transition-colors ${
            active === 'breakdown' ? 'text-violet-400' : 'text-slate-500'
          }`}
        >
          <IconBreakdown active={active === 'breakdown'} />
          <span className="text-[10px] font-medium tracking-wide">Breakdown</span>
        </button>
      </div>
    </nav>
  )
}
