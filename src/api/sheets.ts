/**
 * All reads and writes go through a Google Apps Script web app URL.
 * No OAuth, no Google Cloud account required.
 */
import type { Transaction, PaymentMethod, ValueAlignment } from '../types'

export async function fetchTransactions(scriptUrl: string): Promise<Transaction[]> {
  const url = `${scriptUrl}?action=read`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)

  const rows: string[][] = data.values ?? []
  return rows.slice(1).flatMap((row) => {
    const [date, type, amount, categoryGroup, subcategory, paymentMethod, valueAlignment, note] = row
    if (!date || !type || !amount) return []
    return [{
      date: date.trim(),
      type: type.trim() as Transaction['type'],
      amount: parseFloat(amount.replace(/,/g, '')) || 0,
      categoryGroup: (categoryGroup ?? '').trim(),
      subcategory: (subcategory ?? '').trim(),
      paymentMethod: ((paymentMethod ?? 'Cash').trim()) as PaymentMethod,
      valueAlignment: ((valueAlignment ?? '').trim()) as ValueAlignment,
      note: (note ?? '').trim(),
    }]
  })
}

export async function appendTransaction(
  scriptUrl: string,
  transaction: Transaction,
): Promise<void> {
  const row = [
    transaction.date,
    transaction.type,
    transaction.amount.toString(),
    transaction.categoryGroup,
    transaction.subcategory,
    transaction.paymentMethod,
    transaction.valueAlignment,
    transaction.note,
  ]
  // Send as GET to avoid CORS preflight issues with Apps Script
  const encoded = encodeURIComponent(JSON.stringify(row))
  const url = `${scriptUrl}?action=append&row=${encoded}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to save: ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
}
