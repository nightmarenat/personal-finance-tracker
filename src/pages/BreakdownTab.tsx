import { useState, useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { MonthNavigator } from '../components/MonthNavigator'
import { BreakdownSkeleton } from '../components/LoadingSkeleton'
import { useMonthNavigation } from '../hooks/useMonthNavigation'
import { GROUP_CONFIGS, getGroupConfig } from '../constants/categories'
import { formatAmount, isInMonth } from '../utils/format'
import type { Transaction } from '../types'

interface Props {
  transactions: Transaction[]
  loading: boolean
}

type ViewMode = 'group' | 'subcategory'

export function BreakdownTab({ transactions, loading }: Props) {
  const { year, month, prev, next } = useMonthNavigation()
  const [viewMode, setViewMode] = useState<ViewMode>('group')

  const expenses = useMemo(
    () =>
      transactions.filter(
        (t) => t.type === 'Expense' && isInMonth(t.date, year, month),
      ),
    [transactions, year, month],
  )

  const totalExpense = useMemo(
    () => expenses.reduce((s, t) => s + t.amount, 0),
    [expenses],
  )

  // By group
  const groupData = useMemo(() => {
    const map: Record<string, number> = {}
    expenses.forEach((t) => {
      map[t.categoryGroup] = (map[t.categoryGroup] ?? 0) + t.amount
    })
    return GROUP_CONFIGS.filter((gc) => gc.type === 'Expense' && map[gc.group])
      .map((gc) => ({
        name: gc.group,
        value: map[gc.group],
        color: gc.color,
        icon: gc.icon,
        pct: totalExpense > 0 ? (map[gc.group] / totalExpense) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value)
  }, [expenses, totalExpense])

  // By subcategory
  const subcatData = useMemo(() => {
    const map: Record<string, { amount: number; group: string }> = {}
    expenses.forEach((t) => {
      if (!map[t.subcategory]) map[t.subcategory] = { amount: 0, group: t.categoryGroup }
      map[t.subcategory].amount += t.amount
    })
    return Object.entries(map)
      .map(([sub, { amount, group }]) => {
        const gc = getGroupConfig(group)
        return {
          name: sub,
          amount,
          group,
          color: gc?.color ?? '#6b7280',
          groupIcon: gc?.icon ?? '📦',
          pct: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
        }
      })
      .sort((a, b) => b.amount - a.amount)
  }, [expenses, totalExpense])

  if (loading) return <BreakdownSkeleton />

  const isEmpty = expenses.length === 0

  return (
    <div className="pb-tab-bar overflow-y-auto scrollbar-hide">
      <MonthNavigator year={year} month={month} onPrev={prev} onNext={next} />

      {/* View toggle */}
      <div className="flex mx-4 mb-4 bg-slate-800 rounded-2xl p-1 gap-1">
        <button
          onClick={() => setViewMode('group')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
            viewMode === 'group' ? 'bg-violet-600 text-white' : 'text-slate-400'
          }`}
        >
          By Group
        </button>
        <button
          onClick={() => setViewMode('subcategory')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
            viewMode === 'subcategory' ? 'bg-violet-600 text-white' : 'text-slate-400'
          }`}
        >
          By Subcategory
        </button>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-slate-400 text-sm">No expenses this month</p>
        </div>
      ) : (
        <>
          {/* Chart */}
          {viewMode === 'group' ? (
            <div className="mx-4 mb-4 bg-slate-800 rounded-2xl p-2 relative">
              <div className="relative h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={groupData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {groupData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center label overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Total</p>
                    <p className="text-lg font-bold text-white leading-tight">
                      {formatAmount(totalExpense)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center pb-2">
                {groupData.map((g) => (
                  <div key={g.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
                    <span className="text-xs text-slate-300">{g.name}</span>
                    <span className="text-xs text-slate-500">{g.pct.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-4 mb-4 bg-slate-800 rounded-2xl overflow-hidden">
              <ResponsiveContainer
                width="100%"
                height={Math.max(subcatData.length * 44 + 20, 200)}
              >
                <BarChart
                  layout="vertical"
                  data={subcatData}
                  margin={{ top: 10, right: 16, bottom: 10, left: 110 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={105}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(v: number) => formatAmount(v)}
                    contentStyle={{
                      background: '#1e293b',
                      border: 'none',
                      borderRadius: 12,
                      color: '#f8fafc',
                    }}
                  />
                  <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                    {subcatData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Ranked subcategory list */}
          <div className="px-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 px-1 mb-3">
              Ranked
            </p>
            {subcatData.map((item, i) => (
              <div key={item.name} className="bg-slate-800 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-slate-500 text-sm font-bold w-5 text-center">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">{item.name}</span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0"
                        style={{ backgroundColor: item.color + '33', color: item.color }}
                      >
                        {item.groupIcon} {item.group}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-white flex-shrink-0">
                    {formatAmount(item.amount)}
                  </span>
                </div>
                {/* Percentage bar */}
                <div className="flex items-center gap-2 pl-8">
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${item.pct}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 w-9 text-right">
                    {item.pct.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="h-4" />
        </>
      )}
    </div>
  )
}
