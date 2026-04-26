import { useState, useCallback } from 'react'
import { BottomTabBar } from './components/BottomTabBar'
import { SummaryTab } from './pages/SummaryTab'
import { AddTab } from './pages/AddTab'
import { BreakdownTab } from './pages/BreakdownTab'
import { EditTransactionSheet } from './components/EditTransactionSheet'
import { useAuth } from './context/AuthContext'
import { useTransactions } from './hooks/useTransactions'
import { updateTransaction } from './api/sheets'
import { MOCK_TRANSACTIONS } from './data/mockTransactions'
import type { TabId, Transaction } from './types'

// ─── Setup screen ─────────────────────────────────────────────────────────────
function SetupScreen({ onDemo }: { onDemo: () => void }) {
  const { saveScriptUrl } = useAuth()
  const [url, setUrl] = useState('')
  const [showSteps, setShowSteps] = useState(false)

  const isValid = url.trim().includes('script.google.com')

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col px-5 pt-14 pb-10 overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-900/50">
          <span className="text-3xl">💎</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Personal Finance</h1>
        <p className="text-slate-400 text-sm mt-1">Connect your Google Sheet — no Cloud account needed</p>
      </div>

      {/* Demo */}
      <button
        onClick={onDemo}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-base mb-3 active:opacity-90 shadow-lg shadow-violet-900/40"
      >
        ✨ Try Demo First
      </button>
      <p className="text-center text-xs text-slate-500 mb-6">Explore with sample data — no setup needed</p>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-slate-800" />
        <span className="text-xs text-slate-600 font-medium">CONNECT YOUR SHEET</span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      {/* URL input */}
      <div className="bg-slate-800 rounded-2xl p-5 mb-3">
        <p className="text-white font-semibold mb-1">Apps Script URL</p>
        <p className="text-slate-400 text-xs mb-3 leading-relaxed">
          Paste the web app URL from your Google Sheet's Apps Script.
        </p>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://script.google.com/macros/s/…"
          className="w-full bg-slate-900 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 mb-3"
          autoCapitalize="none"
          autoCorrect="off"
        />
        <button
          onClick={() => { if (isValid) saveScriptUrl(url.trim()) }}
          disabled={!isValid}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
            isValid ? 'bg-violet-600 text-white active:bg-violet-700' : 'bg-slate-700 text-slate-500'
          }`}
        >
          Connect My Sheet →
        </button>
      </div>

      {/* Step-by-step guide */}
      <div className="bg-slate-800 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowSteps(!showSteps)}
          className="w-full flex items-center justify-between px-5 py-4 active:bg-slate-700"
        >
          <span className="text-white font-semibold text-sm">📋 How to get the URL (2 min)</span>
          <svg className={`w-4 h-4 text-slate-400 transition-transform ${showSteps ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showSteps && (
          <div className="px-5 pb-5 border-t border-slate-700/50 space-y-4 animate-fade-in">
            {[
              {
                n: 1,
                title: 'Open your Google Sheet',
                body: 'Go to the sheet that holds your transactions.',
              },
              {
                n: 2,
                title: 'Open Apps Script',
                body: 'In the top menu: Extensions → Apps Script',
              },
              {
                n: 3,
                title: 'Paste the script',
                body: 'Delete everything in the editor and paste the script from the code block below.',
              },
              {
                n: 4,
                title: 'Deploy as Web App',
                body: 'Click Deploy → New deployment → Type: Web app\n\nSet:\n• Execute as: Me\n• Who has access: Anyone\n\nClick Deploy → copy the URL.',
              },
              {
                n: 5,
                title: 'Paste the URL above',
                body: 'Paste the deployment URL into the field above and tap "Connect My Sheet".',
              },
            ].map((s) => (
              <div key={s.n} className="flex gap-3 pt-4">
                <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[11px] font-bold text-white">{s.n}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold mb-0.5">{s.title}</p>
                  <p className="text-slate-400 text-xs leading-relaxed whitespace-pre-line">{s.body}</p>
                </div>
              </div>
            ))}

            {/* Script code block */}
            <div className="mt-2 bg-slate-900 rounded-xl p-4">
              <p className="text-xs text-violet-400 font-semibold mb-2">📄 Paste this script in Apps Script:</p>
              <pre className="text-[11px] text-green-400 leading-relaxed overflow-x-auto whitespace-pre">{`const SHEET = 'Sheet1'

function doGet(e) {
  try {
    const action = e.parameter.action
    const s = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET)

    if (action === 'read') {
      return ok({ values: s.getDataRange().getValues() })
    }
    if (action === 'append') {
      const row = JSON.parse(
        decodeURIComponent(e.parameter.row)
      )
      s.appendRow(row)
      return ok({ success: true })
    }
    if (action === 'update') {
      const rowIndex = parseInt(e.parameter.rowIndex)
      const row = JSON.parse(
        decodeURIComponent(e.parameter.row)
      )
      s.getRange(rowIndex, 1, 1, row.length)
       .setValues([row])
      return ok({ success: true })
    }
    return ok({ error: 'Unknown action' })
  } catch(e) {
    return ok({ error: e.message })
  }
}

function ok(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
}`}</pre>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 space-y-2">
              <p className="text-xs text-amber-400 leading-relaxed">
                ⚠️ After deploying, if you edit the script again you must click <strong>Deploy → Manage deployments → ✏️ edit → New version</strong> to apply changes.
              </p>
              <p className="text-xs text-amber-400 leading-relaxed">
                💡 If you already deployed an older version of this script, paste the new script above and redeploy as a new version — this enables the <strong>Edit transaction</strong> feature.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Demo banner ──────────────────────────────────────────────────────────────
function DemoBanner({ onExit }: { onExit: () => void }) {
  return (
    <div className="flex items-center justify-between bg-violet-600/20 border-b border-violet-500/30 px-4 py-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-violet-300">✨ DEMO MODE</span>
        <span className="text-xs text-violet-400">· Sample data</span>
      </div>
      <button onClick={onExit} className="text-xs text-violet-300 font-medium active:opacity-70">
        Exit demo →
      </button>
    </div>
  )
}

// ─── App shell ────────────────────────────────────────────────────────────────
function AppShell({
  transactions,
  loading,
  error,
  onSaved,
  onUpdated,
  isDemo,
  onExitDemo,
}: {
  transactions: Transaction[]
  loading: boolean
  error: string | null
  onSaved: (t?: Transaction) => void
  onUpdated: (updated: Transaction) => Promise<void>
  isDemo: boolean
  onExitDemo: () => void
}) {
  const [activeTab, setActiveTab] = useState<TabId>('summary')
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  // Shared month state — Summary and Breakdown always show the same month
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const prevMonth = useCallback(() => {
    setYear((y) => month === 0 ? y - 1 : y)
    setMonth((m) => m === 0 ? 11 : m - 1)
  }, [month])
  const nextMonth = useCallback(() => {
    setYear((y) => month === 11 ? y + 1 : y)
    setMonth((m) => m === 11 ? 0 : m + 1)
  }, [month])
  const goToday = useCallback(() => {
    setYear(now.getFullYear())
    setMonth(now.getMonth())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <div className="safe-top bg-slate-950" />
      {isDemo && <DemoBanner onExit={onExitDemo} />}

      {editingTransaction && (
        <EditTransactionSheet
          transaction={editingTransaction}
          onSave={onUpdated}
          onClose={() => setEditingTransaction(null)}
        />
      )}

      <main className="flex-1 overflow-hidden">
        <div className={activeTab === 'summary' ? 'block h-full' : 'hidden'}>
          <SummaryTab
            transactions={transactions} loading={loading} error={error}
            year={year} month={month} onPrev={prevMonth} onNext={nextMonth}
            isCurrentMonth={isCurrentMonth} onGoToday={goToday}
            onEdit={isDemo ? undefined : setEditingTransaction}
          />
        </div>
        <div className={activeTab === 'add' ? 'block h-full' : 'hidden'}>
          <AddTab onSaved={onSaved} isDemo={isDemo} />
        </div>
        <div className={activeTab === 'breakdown' ? 'block h-full' : 'hidden'}>
          <BreakdownTab
            transactions={transactions} loading={loading}
            year={year} month={month} onPrev={prevMonth} onNext={nextMonth}
            isCurrentMonth={isCurrentMonth} onGoToday={goToday}
          />
        </div>
      </main>
      <BottomTabBar active={activeTab} onChange={setActiveTab} />
    </div>
  )
}

// ─── Real data app ────────────────────────────────────────────────────────────
function RealApp() {
  const { scriptUrl } = useAuth()
  const { transactions, loading, error, refetch } = useTransactions(scriptUrl)

  const handleUpdate = useCallback(async (updated: Transaction) => {
    if (!scriptUrl || !updated.rowIndex) throw new Error('Cannot update: missing row info')
    await updateTransaction(scriptUrl, updated.rowIndex, updated)
    refetch()
  }, [scriptUrl, refetch])

  return (
    <AppShell
      transactions={transactions}
      loading={loading}
      error={error}
      onSaved={refetch}
      onUpdated={handleUpdate}
      isDemo={false}
      onExitDemo={() => {}}
    />
  )
}

// ─── Demo app ─────────────────────────────────────────────────────────────────
function DemoApp({ onExit }: { onExit: () => void }) {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)
  return (
    <AppShell
      transactions={transactions}
      loading={false}
      error={null}
      onSaved={(t) => { if (t) setTransactions((prev) => [...prev, t]) }}
      onUpdated={async () => {}}   // no-op for demo
      isDemo={true}
      onExitDemo={onExit}
    />
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const { scriptUrl } = useAuth()
  const [demoMode, setDemoMode] = useState(false)

  if (demoMode) return <DemoApp onExit={() => setDemoMode(false)} />
  if (!scriptUrl) return <SetupScreen onDemo={() => setDemoMode(true)} />
  return <RealApp />
}
