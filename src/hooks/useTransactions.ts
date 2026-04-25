import { useState, useEffect, useCallback } from 'react'
import { fetchTransactions } from '../api/sheets'
import type { Transaction } from '../types'

interface UseTransactionsReturn {
  transactions: Transaction[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useTransactions(scriptUrl: string | null): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!scriptUrl) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchTransactions(scriptUrl)
      setTransactions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }, [scriptUrl])

  useEffect(() => { load() }, [load])

  return { transactions, loading, error, refetch: load }
}
