export type TransactionType = 'Income' | 'Expense'
export type PaymentMethod = 'Cash' | 'Credit Card' | 'Transfer'
export type ValueAlignment = 'Worth It' | 'Neutral' | 'Not Worth It' | ''

export interface Transaction {
  rowIndex?: number    // 1-based sheet row (undefined for new / demo transactions)
  date: string        // M/D/YYYY stored in sheet
  type: TransactionType
  amount: number
  categoryGroup: string
  subcategory: string
  paymentMethod: PaymentMethod
  valueAlignment: ValueAlignment
  note: string
}

export interface GroupConfig {
  group: string
  type: TransactionType
  subcategories: string[]
  color: string
  bgColor: string
  borderColor: string
  lightBg: string
  icon: string
}

export type TabId = 'summary' | 'add' | 'breakdown'
