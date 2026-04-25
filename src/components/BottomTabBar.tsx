import type { TabId } from '../types'

interface Props {
  active: TabId
  onChange: (tab: TabId) => void
}

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'summary', label: 'Summary', icon: '📊' },
  { id: 'add', label: 'Add', icon: '➕' },
  { id: 'breakdown', label: 'Breakdown', icon: '🥧' },
]

export function BottomTabBar({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50 bottom-tab-bar">
      <div className="flex">
        {TABS.map((tab) => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
                isActive ? 'text-violet-400' : 'text-slate-500'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span
                className={`text-[10px] font-medium tracking-wide ${
                  isActive ? 'text-violet-400' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
