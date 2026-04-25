import { useState, useMemo } from 'react'
import { MonthNavigator } from '../components/MonthNavigator'
import { SummaryTabSkeleton } from '../components/LoadingSkeleton'
import { useMonthNavigation } from '../hooks/useMonthNavigation'
import { getGroupConfig, GROUP_CONFIGS } from '../constants/categories'
import { formatAmount, formatDisplayDate, isInMonth, parseSheetDate } from '../utils/format'
import type { Transaction } from '../types'

interface Props {
  transactions: Transaction[]
  loading: boolean
  error: string | null
}

export function SummaryTab({ transactions, loading, error }: Props) {
  const { year, month, prev, next } = useMonthNavigation()
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

  const filtered = useMemo(
    () => transactions.filter((t) => isInMonth(t.date, year, month)),
    [transactions, year, month],
  )

  const totalIncome = useMemo(
    () => filtered.filter((t) => t.type === 'Income').reduce((s, t) => s + t.amount, 0),
    [filtered],
  )

  const totalExpense = useMemo(
    () => filtered.filter((t) => t.type === 'Expense').reduce((s, t) => s + t.amount, 0),
    [filtered],
  )

  const groupTotals = useMemo(() => {
    const map: Record<string, Record<string, number>> = {}
    filtered
      .filter((t) => t.type === 'Expense')
      .forEach((t) => {
        if (!map[t.categoryGroup]) map[t.categoryGroup] = {}
        map[t.categoryGroup][t.subcategory] =
          (map[t.categoryGroup][t.subcategory] ?? 0) + t.amount
      })
    return map
  }, [filtered])

  const recentTransactions = useMemo(
    () =>
      [...filtered]
        .sort((a, b) => parseSheetDate(b.date).getTime() - parseSheetDate(a.date).getTime())
        .slice(0, 10),
    [filtered],
  )

  if (loading) return <SummaryTabSkeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 px-8 text-center">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="pb-tab-bar overflow-y-auto scrollbar-hide">
      <MonthNavigator year={year} month={month} onPrev={prev} onNext={next} />

      {/* Net balance hero card */}
      {(() => {
        const net = totalIncome - totalExpense
        const savingsRate = totalIncome > 0 ? Math.round((net / totalIncome) * 100) : null
        const isPositive = net >= 0
        return (
          <div className="mx-4 mb-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/60 p-5 border border-slate-700/40">
            <p className="text-xs text-slate-400 mb-1 font-medium">Net Balance</p>
            <p className={`text-3xl font-bold tracking-tight ${isPositive ? 'text-white' : 'text-rose-400'}`}>
              {isPositive ? '' : '-'}{formatAmount(Math.abs(net))}
            </p>
            {savingsRate !== null && (
              <p className={`text-xs mt-1 font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? `🎯 Saving ${savingsRate}% of income` : '⚠️ Spending more than earned'}
              </p>
            )}
          </div>
        )
      })()}

      {/* Income / Expense stat cards */}
      <div className="flex gap-3 px-4 pb-4">
        <div className="flex-1 rounded-2xl bg-slate-800 p-4">
          <p className="text-xs text-slate-400 mb-1">Income</p>
          <p className="text-lg font-bold text-emerald-400 truncate">{formatAmount(totalIncome)}</p>
        </div>
        <div className="flex-1 rounded-2xl bg-slate-800 p-4">
          <p className="text-xs text-slate-400 mb-1">Expense</p>
          <p className="text-lg font-bold text-rose-400 truncate">{formatAmount(totalExpense)}</p>
          {totalIncome > 0 && (
            <p className="text-[10px] text-slate-500 mt-0.5">
              {Math.round((totalExpense / totalIncome) * 100)}% of income
            </p>
          )}
        </div>
      </div>

      {/* Category group cards */}
      <div className="px-4 space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 px-1">
          By Category
        </p>

        {filtered.length === 0 && (
          <div className="rounded-2xl bg-slate-800 p-8 text-center">
            <p className="text-3xl mb-2">🌙</p>
            <p className="text-slate-400 text-sm">No transactions this month</p>
          </div>
        )}

        {GROUP_CONFIGS.filter((g) => g.type === 'Expense' && groupTotals[g.group]).map((gc) => {
          const groupTotal = Object.values(groupTotals[gc.group] ?? {}).reduce(
            (s, v) => s + v,
            0,
          )
          const isExpanded = expandedGroup === gc.group
          const subcats = groupTotals[gc.group] ?? {}

          return (
            <div
              key={gc.group}
              className="rounded-2xl bg-slate-800 overflow-hidden"
              style={{ borderLeft: `3px solid ${gc.color}` }}
            >
              <button
                className="w-full flex items-center justify-between p-4 active:bg-slate-700 transition-colors"
                onClick={() => setExpandedGroup(isExpanded ? null : gc.group)}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{gc.icon}</span>
                  <span className="font-semibold text-white text-sm">{gc.group}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">
                    {formatAmount(groupTotal)}
                  </span>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-slate-700/50 animate-fade-in">
                  {Object.entries(subcats)
                    .sort(([, a], [, b]) => b - a)
                    .map(([sub, amount]) => (
                      <div
                        key={sub}
                        className="flex justify-between items-center px-4 py-2.5 border-b border-slate-700/30 last:border-0"
                      >
                        <span className="text-sm text-slate-300">{sub}</span>
                        <span className="text-sm font-medium text-white">
                          {formatAmount(amount)}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <div className="px-4 mt-5 mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 px-1 mb-2.5">
            Recent
          </p>
          <div className="rounded-2xl bg-slate-800 overflow-hidden divide-y divide-slate-700/40">
            {recentTransactions.map((t, i) => {
              const gc = getGroupConfig(t.categoryGroup)
              const isExpense = t.type === 'Expense'
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  {/* Category icon bubble */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                    style={{ backgroundColor: (gc?.color ?? '#6b7280') + '22' }}
                  >
                    {gc?.icon ?? '💸'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-white truncate">
                        {t.subcategory}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatDisplayDate(t.date)}
                      {t.note ? ` · ${t.note}` : ''}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold flex-shrink-0 ${isExpense ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isExpense ? '-' : '+'}{formatAmount(t.amount)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="h-4" />
    </div>
  )
}
