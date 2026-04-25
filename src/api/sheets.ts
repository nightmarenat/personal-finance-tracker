import type { Transaction, PaymentMethod, ValueAlignment } from '../types'

const SHEETS_BASE = 'https://sheets.googleapis.com/v4/spreadsheets'

// Sheet IDs are fixed — no env var needed for reads/writes
const TRANSACTIONS_SHEET_ID =
  import.meta.env.VITE_TRANSACTIONS_SHEET_ID ?? '1Cp0-u1N_n7VXPz773rZUGLUshoTPV_NDGmYaZjQn7Gw'

async function sheetsGet(token: string, sheetId: string, range: string) {
  const url = `${SHEETS_BASE}/${sheetId}/values/${encodeURIComponent(range)}`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`Sheets API error ${res.status}: ${await res.text()}`)
  return res.json()
}

export async function fetchTransactions(token: string): Promise<Transaction[]> {
  const data = await sheetsGet(token, TRANSACTIONS_SHEET_ID, 'A:H')
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

export async function appendTransaction(token: string, transaction: Transaction): Promise<void> {
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
  const encodedRange = encodeURIComponent('A:H')
  const url =
    `${SHEETS_BASE}/${TRANSACTIONS_SHEET_ID}/values/${encodedRange}:append` +
    `?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [row] }),
  })
  if (!res.ok) throw new Error(`Sheets API error ${res.status}: ${await res.text()}`)
}
