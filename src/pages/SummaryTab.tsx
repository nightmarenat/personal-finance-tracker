import { useState, useMemo } from 'react'
import { MonthNavigator } from '../components/MonthNavigator'
import { SummaryTabSkeleton } from '../components/LoadingSkeleton'
import { getGroupConfig, GROUP_CONFIGS } from '../constants/categories'
import { formatAmount, formatDisplayDate, isInMonth, parseSheetDate } from '../utils/format'
import type { Transaction } from '../types'

interface Props {
  transactions: Transaction[]
  loading: boolean
  error: string | null
  year: number
  month: number
  onPrev: () => void
  onNext: () => void
  isCurrentMonth: boolean
  onGoToday: () => void
  onEdit?: (t: Transaction) => void
}

export function SummaryTab({ transactions, loading, error, year, month, onPrev, onNext, isCurrentMonth, onGoToday, onEdit }: Props) {
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
      <MonthNavigator year={year} month={month} onPrev={onPrev} onNext={onNext} isCurrentMonth={isCurrentMonth} onGoToday={onGoToday} />

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
          Expenses by Category
        </p>

        {filtered.filter(t => t.type === 'Expense').length === 0 && (
          <div className="rounded-2xl bg-slate-800 p-6 text-center">
            <p className="text-2xl mb-2">🌙</p>
            <p className="text-slate-400 text-sm">No expenses this month</p>
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

      {/* Income sources */}
      {totalIncome > 0 && (
        <div className="px-4 mt-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 px-1">
            Income Sources
          </p>
          {(() => {
            const incomeMap: Record<string, number> = {}
            filtered.filter(t => t.type === 'Income').forEach(t => {
              incomeMap[t.subcategory] = (incomeMap[t.subcategory] ?? 0) + t.amount
            })
            return Object.entries(incomeMap)
              .sort(([, a], [, b]) => b - a)
              .map(([sub, amount]) => (
                <div key={sub} className="rounded-2xl bg-slate-800 overflow-hidden" style={{ borderLeft: '3px solid #10b981' }}>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">💰</span>
                      <span className="font-semibold text-white text-sm">{sub}</span>
                    </div>
                    <span className="font-semibold text-emerald-400 text-sm">{formatAmount(amount)}</span>
                  </div>
                </div>
              ))
          })()}
        </div>
      )}

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
                    <span className="text-sm font-medium text-white truncate block">
                      {t.subcategory}
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatDisplayDate(t.date)}
                      {t.note ? ` · ${t.note}` : ''}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold flex-shrink-0 ${isExpense ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isExpense ? '-' : '+'}{formatAmount(t.amount)}
                  </span>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(t)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-700/60 text-slate-400 active:bg-slate-600 transition-colors flex-shrink-0"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  )}
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
