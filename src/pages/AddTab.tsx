import { useState, useCallback, useRef } from 'react'
import { Toast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import { appendTransaction } from '../api/sheets'
import { EXPENSE_GROUPS, INCOME_GROUPS, getGroupConfig } from '../constants/categories'
import { formatAmount, formatDateBar, toSheetDate } from '../utils/format'
import type { Transaction, TransactionType, PaymentMethod, ValueAlignment } from '../types'

// ─── Numpad ──────────────────────────────────────────────────────────────────

interface NumpadProps {
  value: string
  onChange: (v: string) => void
  onClose: () => void
}

function Numpad({ value, onChange, onClose }: NumpadProps) {
  const press = useCallback(
    (key: string) => {
      onChange(
        (() => {
          if (key === '⌫') return value.slice(0, -1)
          if (key === '.') {
            if (value.includes('.') || value === '') return value
            return value + '.'
          }
          if (value === '' && key === '0') return '0'
          if (value === '0' && key !== '.') return key
          if (value.includes('.')) {
            const [, dec] = value.split('.')
            if (dec.length >= 2) return value
          }
          return value + key
        })(),
      )
    },
    [value, onChange],
  )

  const displayAmount = value
    ? parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: value.endsWith('.') ? 1 : 0 })
    : '0'

  const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '⌫']

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-fade-in">
      {/* Amount display */}
      <div className="flex-1 flex flex-col items-center justify-center pb-4">
        <p className="text-slate-400 text-sm mb-1">Amount</p>
        <p className="text-5xl font-bold text-white tracking-tight">
          ฿{value.endsWith('.') ? value.replace('.', '') + '.' : displayAmount}
        </p>
      </div>

      {/* Numpad grid */}
      <div className="grid grid-cols-3 gap-px bg-slate-700/30 border-t border-slate-700/50">
        {KEYS.map((k) => (
          <button
            key={k}
            onPointerDown={(e) => { e.preventDefault(); press(k) }}
            className={`h-16 text-2xl font-semibold flex items-center justify-center active:bg-slate-600 transition-colors ${
              k === '⌫' ? 'text-slate-400 text-xl' : 'text-white bg-slate-800'
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Done button */}
      <button
        onPointerDown={(e) => { e.preventDefault(); onClose() }}
        className="bg-violet-600 active:bg-violet-700 text-white font-semibold text-lg py-5 transition-colors"
        style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
      >
        Done ✓
      </button>
    </div>
  )
}

// ─── Date Picker Sheet ────────────────────────────────────────────────────────

interface DateSheetProps {
  value: Date
  onChange: (d: Date) => void
  onClose: () => void
}

function DateSheet({ value, onChange, onClose }: DateSheetProps) {
  const toInputVal = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60 animate-fade-in" onClick={onClose}>
      <div
        className="w-full bg-slate-900 rounded-t-3xl p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      >
        <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-5" />
        <p className="text-base font-semibold text-white mb-4">Select Date</p>
        <input
          type="date"
          value={toInputVal(value)}
          onChange={(e) => {
            const [y, m, d] = e.target.value.split('-').map(Number)
            onChange(new Date(y, m - 1, d))
          }}
          className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 text-base border border-slate-600 focus:outline-none focus:border-violet-500"
        />
        <button
          onClick={onClose}
          className="mt-4 w-full bg-violet-600 text-white font-semibold py-3.5 rounded-xl active:bg-violet-700 transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  )
}

// ─── Main AddTab ──────────────────────────────────────────────────────────────

interface Props {
  onSaved: (transaction?: Transaction) => void
  isDemo?: boolean
}

export function AddTab({ onSaved, isDemo = false }: Props) {
  const { token, login } = useAuth()
  const [date, setDate] = useState(new Date())
  const [type, setType] = useState<TransactionType>('Expense')
  const [amountStr, setAmountStr] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [selectedSub, setSelectedSub] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash')
  const [valueAlignment, setValueAlignment] = useState<ValueAlignment | null>(null)
  const [note, setNote] = useState('')
  const [showNumpad, setShowNumpad] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const noteRef = useRef<HTMLInputElement>(null)

  const groups = type === 'Expense' ? EXPENSE_GROUPS : INCOME_GROUPS
  const selectedGroupConfig = selectedGroup ? getGroupConfig(selectedGroup) : null
  const amount = parseFloat(amountStr) || 0
  const canSave = amount > 0 && selectedSub !== null

  const handleTypeChange = (t: TransactionType) => {
    setType(t)
    setSelectedGroup(null)
    setSelectedSub(null)
  }

  const handleGroupSelect = (group: string) => {
    setSelectedGroup(group === selectedGroup ? null : group)
    setSelectedSub(null)
  }

  const handleSave = async () => {
    if (!canSave) return

    const transaction: Transaction = {
      date: toSheetDate(date),
      type,
      amount,
      categoryGroup: selectedGroup!,
      subcategory: selectedSub!,
      paymentMethod,
      valueAlignment: valueAlignment ?? '',
      note,
    }

    // Demo mode — save locally without API
    if (isDemo) {
      setToast({ msg: 'Saved to demo!', type: 'success' })
      setAmountStr('')
      setSelectedGroup(null)
      setSelectedSub(null)
      setValueAlignment(null)
      setNote('')
      onSaved(transaction)
      return
    }

    if (!token) { login(); return }

    setSaving(true)
    try {
      await appendTransaction(token, transaction)
      setToast({ msg: 'Transaction saved!', type: 'success' })
      // Reset form but keep date and type
      setAmountStr('')
      setSelectedGroup(null)
      setSelectedSub(null)
      setValueAlignment(null)
      setNote('')
      onSaved()
    } catch (err) {
      setToast({
        msg: err instanceof Error ? err.message : 'Failed to save',
        type: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col min-h-full pb-tab-bar">
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      {showNumpad && (
        <Numpad
          value={amountStr}
          onChange={setAmountStr}
          onClose={() => setShowNumpad(false)}
        />
      )}

      {showDatePicker && (
        <DateSheet
          value={date}
          onChange={setDate}
          onClose={() => setShowDatePicker(false)}
        />
      )}

      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 p-4">
        {/* Date bar */}
        <button
          onClick={() => setShowDatePicker(true)}
          className="w-full flex items-center justify-between bg-slate-800 rounded-2xl px-4 py-3.5 active:bg-slate-700 transition-colors"
        >
          <span className="text-white font-medium">{formatDateBar(date)}</span>
          <span className="text-slate-400 text-lg">✏️</span>
        </button>

        {/* Type toggle */}
        <div className="flex gap-3">
          <button
            onClick={() => handleTypeChange('Expense')}
            className={`flex-1 py-3.5 rounded-2xl font-semibold text-base transition-all ${
              type === 'Expense'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            💸 Expense
          </button>
          <button
            onClick={() => handleTypeChange('Income')}
            className={`flex-1 py-3.5 rounded-2xl font-semibold text-base transition-all ${
              type === 'Income'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            💰 Income
          </button>
        </div>

        {/* Amount display */}
        <button
          onClick={() => setShowNumpad(true)}
          className="w-full bg-slate-800 rounded-2xl py-5 flex flex-col items-center active:bg-slate-700 transition-colors"
        >
          <p className="text-xs text-slate-500 mb-1">Tap to enter amount</p>
          <p className={`text-4xl font-bold tracking-tight ${amount > 0 ? 'text-white' : 'text-slate-500'}`}>
            {amount > 0 ? formatAmount(amount) : '฿0'}
          </p>
        </button>

        {/* Category Group tiles */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2.5 px-1">
            Category
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {groups.map((gc) => {
              const isSelected = selectedGroup === gc.group
              return (
                <button
                  key={gc.group}
                  onClick={() => handleGroupSelect(gc.group)}
                  style={isSelected ? { backgroundColor: gc.color } : {}}
                  className={`rounded-2xl p-3 flex flex-col items-center gap-1.5 transition-all active:scale-95 ${
                    isSelected
                      ? 'text-white shadow-lg'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="text-2xl">{gc.icon}</span>
                  <span className="text-[11px] font-medium leading-tight text-center">
                    {gc.group}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Subcategory pills */}
        {selectedGroupConfig && (
          <div className="animate-fade-in">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2.5 px-1">
              Subcategory
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedGroupConfig.subcategories.map((sub) => {
                const isSelected = selectedSub === sub
                return (
                  <button
                    key={sub}
                    onClick={() => setSelectedSub(isSelected ? null : sub)}
                    style={isSelected ? { backgroundColor: selectedGroupConfig.color } : {}}
                    className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
                      isSelected
                        ? 'text-white shadow-md'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {sub}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Payment method */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2.5 px-1">
            Payment
          </p>
          <div className="flex gap-2">
            {(['Cash', 'Credit Card', 'Transfer'] as PaymentMethod[]).map((pm) => {
              const icons: Record<PaymentMethod, string> = {
                Cash: '💵',
                'Credit Card': '💳',
                Transfer: '🏦',
              }
              return (
                <button
                  key={pm}
                  onClick={() => setPaymentMethod(pm)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-full text-sm font-medium transition-all ${
                    paymentMethod === pm
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <span>{icons[pm]}</span>
                  <span className="text-xs">{pm === 'Credit Card' ? 'Card' : pm}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Value alignment */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2.5 px-1">
            Value Alignment
          </p>
          <div className="flex gap-2">
            {(
              [
                { val: 'Worth It', emoji: '✅' },
                { val: 'Neutral', emoji: '😐' },
                { val: 'Not Worth It', emoji: '❌' },
              ] as { val: ValueAlignment; emoji: string }[]
            ).map(({ val, emoji }) => (
              <button
                key={val}
                onClick={() => setValueAlignment(valueAlignment === val ? null : val)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl text-sm transition-all ${
                  valueAlignment === val
                    ? 'bg-slate-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <span className="text-xl">{emoji}</span>
                <span className="text-[10px] leading-tight text-center">
                  {val === 'Not Worth It' ? 'No Worth' : val}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2.5 px-1">
            Note
          </p>
          <input
            ref={noteRef}
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            className="w-full bg-slate-800 text-white placeholder-slate-500 rounded-2xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
        </div>
      </div>

      {/* Save button */}
      <div className="px-4 py-3 bg-slate-950/80 backdrop-blur-sm border-t border-slate-800/50">
        <button
          onClick={handleSave}
          disabled={!canSave || saving}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-all ${
            canSave && !saving
              ? 'bg-violet-600 text-white active:bg-violet-700 shadow-lg shadow-violet-900/40'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          {saving ? 'Saving...' : !token ? '🔑 Connect Google & Save' : 'Save Transaction'}
        </button>
      </div>
    </div>
  )
}
