import type { GroupConfig } from '../types'

export const GROUP_CONFIGS: GroupConfig[] = [
  {
    group: 'Survival',
    type: 'Expense',
    subcategories: ['Food', 'Delivery', 'Public Transport', 'Car', 'Utilities', 'Healthcare'],
    color: '#2563eb',
    bgColor: 'bg-blue-600',
    borderColor: 'border-blue-500',
    lightBg: 'bg-blue-900/30',
    icon: '🍔',
  },
  {
    group: 'Fulfillment',
    type: 'Expense',
    subcategories: [
      'Drink & Cafe',
      'Restaurant',
      'Travel',
      'Sport',
      'Shopping',
      'Game & Entertainment',
    ],
    color: '#9333ea',
    bgColor: 'bg-purple-600',
    borderColor: 'border-purple-500',
    lightBg: 'bg-purple-900/30',
    icon: '🎉',
  },
  {
    group: 'Capital',
    type: 'Expense',
    subcategories: ['Books', 'Course', 'Tools', 'Investment'],
    color: '#16a34a',
    bgColor: 'bg-green-600',
    borderColor: 'border-green-500',
    lightBg: 'bg-green-900/30',
    icon: '📚',
  },
  {
    group: 'Giving',
    type: 'Expense',
    subcategories: ['Donation', 'Gift', 'Family support'],
    color: '#ea580c',
    bgColor: 'bg-orange-600',
    borderColor: 'border-orange-500',
    lightBg: 'bg-orange-900/30',
    icon: '🤝',
  },
  {
    group: 'Unconscious',
    type: 'Expense',
    subcategories: ['Subscription', 'Convenience spend', 'Random'],
    color: '#6b7280',
    bgColor: 'bg-gray-500',
    borderColor: 'border-gray-400',
    lightBg: 'bg-gray-800/50',
    icon: '💭',
  },
  {
    group: 'Income',
    type: 'Income',
    subcategories: ['Salary', 'Bonus', 'Side Job', 'Investment Income'],
    color: '#059669',
    bgColor: 'bg-emerald-600',
    borderColor: 'border-emerald-500',
    lightBg: 'bg-emerald-900/30',
    icon: '💰',
  },
]

export const EXPENSE_GROUPS = GROUP_CONFIGS.filter((g) => g.type === 'Expense')
export const INCOME_GROUPS = GROUP_CONFIGS.filter((g) => g.type === 'Income')

export function getGroupConfig(group: string): GroupConfig | undefined {
  return GROUP_CONFIGS.find((g) => g.group === group)
}
