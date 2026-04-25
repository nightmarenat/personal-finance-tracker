import { useState } from 'react'
import { BottomTabBar } from './components/BottomTabBar'
import { SummaryTab } from './pages/SummaryTab'
import { AddTab } from './pages/AddTab'
import { BreakdownTab } from './pages/BreakdownTab'
import { useAuth } from './context/AuthContext'
import { useTransactions } from './hooks/useTransactions'
import { MOCK_TRANSACTIONS } from './data/mockTransactions'
import type { TabId, Transaction } from './types'

// ─── Step 1: Enter Client ID ──────────────────────────────────────────────────
function ClientIdScreen({ onDemo }: { onDemo: () => void }) {
  const { saveClientId } = useAuth()
  const [input, setInput] = useState('')
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col px-5 pt-14 pb-10 overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-900/50">
          <span className="text-3xl">💎</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Personal Finance</h1>
        <p className="text-slate-400 text-sm mt-1">Track expenses · powered by Google Sheets</p>
      </div>

      {/* Demo button */}
      <button
        onClick={onDemo}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-base mb-3 active:opacity-90 transition-opacity shadow-lg shadow-violet-900/40"
      >
        ✨ Try Demo
      </button>
      <p className="text-center text-xs text-slate-500 mb-6">
        Explore with sample data — no account needed
      </p>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-slate-800" />
        <span className="text-xs text-slate-600 font-medium">OR CONNECT YOUR SHEETS</span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      {/* Client ID input */}
      <div className="bg-slate-800 rounded-2xl p-5 mb-4">
        <p className="text-white font-semibold mb-1">Google OAuth Client ID</p>
        <p className="text-slate-400 text-xs mb-3 leading-relaxed">
          Paste your Client ID to connect your real Google Sheets data.
        </p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your Client ID here…"
          className="w-full bg-slate-900 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 mb-3"
          autoCapitalize="none"
          autoCorrect="off"
        />
        <button
          onClick={() => { if (input.trim()) saveClientId(input.trim()) }}
          disabled={!input.trim()}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
            input.trim()
              ? 'bg-violet-600 text-white active:bg-violet-700'
              : 'bg-slate-700 text-slate-500'
          }`}
        >
          Save & Continue →
        </button>
      </div>

      {/* How to get Client ID */}
      <div className="bg-slate-800 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="w-full flex items-center justify-between px-5 py-4 active:bg-slate-700 transition-colors"
        >
          <span className="text-white font-semibold text-sm">How to get a Client ID?</span>
          <svg className={`w-4 h-4 text-slate-400 transition-transform ${showHelp ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showHelp && (
          <div className="px-5 pb-5 border-t border-slate-700/50 animate-fade-in">
            <ol className="space-y-3 mt-4">
              {[
                { e: '🌐', t: 'Go to console.cloud.google.com' },
                { e: '📁', t: 'Create a new project (any name)' },
                { e: '📋', t: 'APIs & Services → Library → "Google Sheets API" → Enable' },
                { e: '🔑', t: 'APIs & Services → Credentials → + Create Credentials → OAuth client ID' },
                { e: '🌍', t: 'Type: Web application\n\nAuthorized JavaScript origins + Authorized redirect URIs — add both:\n• https://your-app.vercel.app\n• http://localhost:5173' },
                { e: '📋', t: 'Copy the Client ID → paste above' },
              ].map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-base flex-shrink-0">{s.e}</span>
                  <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line">{s.t}</p>
                </li>
              ))}
            </ol>
            <div className="mt-4 bg-slate-900 rounded-xl p-3">
              <p className="text-xs text-slate-400">
                💡 OAuth consent screen: set type to <em>External</em>, add your email as a test user.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Step 2: Connect Google Account ──────────────────────────────────────────
function ConnectScreen({ onDemo }: { onDemo: () => void }) {
  const { login, clearClientId } = useAuth()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center bg-slate-950">
      <div className="mb-8">
        <div className="w-20 h-20 rounded-3xl bg-violet-600 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-violet-900/50">
          <span className="text-4xl">💎</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Connect Google</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Sign in to read and write your Sheets data.
        </p>
      </div>

      <button
        onClick={login}
        className="w-full max-w-xs flex items-center justify-center gap-3 bg-white text-slate-900 font-semibold py-4 px-6 rounded-2xl shadow-xl active:scale-95 transition-transform mb-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Connect Google Account
      </button>

      <button onClick={onDemo} className="text-sm text-violet-400 font-medium py-2 mb-2 active:opacity-70">
        ✨ Try Demo instead
      </button>
      <button onClick={clearClientId} className="text-xs text-slate-600 active:text-slate-400">
        ← Change Client ID
      </button>
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
      <button
        onClick={onExit}
        className="text-xs text-violet-300 font-medium active:opacity-70"
      >
        Exit demo →
      </button>
    </div>
  )
}

// ─── Shared app shell ─────────────────────────────────────────────────────────
function AppShell({
  transactions,
  loading,
  error,
  onSaved,
  isDemo,
  onExitDemo,
}: {
  transactions: Transaction[]
  loading: boolean
  error: string | null
  onSaved: (t?: Transaction) => void
  isDemo: boolean
  onExitDemo: () => void
}) {
  const [activeTab, setActiveTab] = useState<TabId>('summary')

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <div className="safe-top bg-slate-950" />
      {isDemo && <DemoBanner onExit={onExitDemo} />}
      <main className="flex-1 overflow-hidden">
        <div className={activeTab === 'summary' ? 'block h-full' : 'hidden'}>
          <SummaryTab transactions={transactions} loading={loading} error={error} />
        </div>
        <div className={activeTab === 'add' ? 'block h-full' : 'hidden'}>
          <AddTab onSaved={onSaved} isDemo={isDemo} />
        </div>
        <div className={activeTab === 'breakdown' ? 'block h-full' : 'hidden'}>
          <BreakdownTab transactions={transactions} loading={loading} />
        </div>
      </main>
      <BottomTabBar active={activeTab} onChange={setActiveTab} />
    </div>
  )
}

// ─── Authenticated (real data) ────────────────────────────────────────────────
function AuthenticatedApp({ onExitDemo }: { onExitDemo: () => void }) {
  const { token } = useAuth()
  const { transactions, loading, error, refetch } = useTransactions(token)
  return (
    <AppShell
      transactions={transactions}
      loading={loading}
      error={error}
      onSaved={refetch}
      isDemo={false}
      onExitDemo={onExitDemo}
    />
  )
}

// ─── Demo app (mock data) ─────────────────────────────────────────────────────
function DemoApp({ onExit }: { onExit: () => void }) {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)
  return (
    <AppShell
      transactions={transactions}
      loading={false}
      error={null}
      onSaved={(t) => { if (t) setTransactions((prev) => [...prev, t]) }}
      isDemo={true}
      onExitDemo={onExit}
    />
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const { clientId, token } = useAuth()
  const [demoMode, setDemoMode] = useState(false)

  if (demoMode) return <DemoApp onExit={() => setDemoMode(false)} />
  if (!clientId) return <ClientIdScreen onDemo={() => setDemoMode(true)} />
  if (!token) return <ConnectScreen onDemo={() => setDemoMode(true)} />
  return <AuthenticatedApp onExitDemo={() => setDemoMode(false)} />
}
