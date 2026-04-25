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
    <div className="flex items-center justify-between px-4 py-3">
      <button
        onClick={onPrev}
        className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 active:bg-slate-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-white">
          {formatMonthYear(year, month)}
        </h2>
        {!isCurrentMonth && onGoToday && (
          <button
            onClick={onGoToday}
            className="text-[10px] font-semibold text-violet-400 bg-violet-500/15 px-2 py-0.5 rounded-full active:bg-violet-500/30 transition-colors"
          >
            Today
          </button>
        )}
      </div>

      <button
        onClick={onNext}
        className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 active:bg-slate-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
