import { formatMonthYear } from '../utils/format'

interface Props {
  year: number
  month: number
  onPrev: () => void
  onNext: () => void
  isCurrentMonth?: boolean
  onGoToday?: () => void
}

export function MonthNavigator({ year, month, onPrev, onNext, isCurrentMonth, onGoToday }: Props) {
  return (
    <div className="flex items-center justify-between px-2 py-2">
      {/* 44pt touch target */}
      <button
        onClick={onPrev}
        className="w-11 h-11 flex items-center justify-center rounded-2xl text-slate-400 active:bg-slate-700/60 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold text-white tracking-tight">
          {formatMonthYear(year, month)}
        </h2>
        {!isCurrentMonth && onGoToday && (
          <button
            onClick={onGoToday}
            className="text-xs font-semibold text-violet-400 bg-violet-500/15 px-2.5 py-1 rounded-full active:bg-violet-500/30 transition-colors"
          >
            Today
          </button>
        )}
      </div>

      <button
        onClick={onNext}
        className="w-11 h-11 flex items-center justify-center rounded-2xl text-slate-400 active:bg-slate-700/60 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
