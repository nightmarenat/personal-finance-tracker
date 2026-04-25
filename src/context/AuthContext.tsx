import { createContext, useContext, useState, useEffect } from 'react'

const SCOPE = 'https://www.googleapis.com/auth/spreadsheets'
const CLIENT_ID_KEY = 'finance_google_client_id'

interface AuthContextType {
  token: string | null
  clientId: string | null
  saveClientId: (id: string) => void
  clearClientId: () => void
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  clientId: null,
  saveClientId: () => {},
  clearClientId: () => {},
  login: () => {},
  logout: () => {},
})

function initiateLogin(clientId: string) {
  const redirectUri = window.location.origin  // e.g. http://localhost:5173
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'token',
    scope: SCOPE,
    include_granted_scopes: 'true',
  })
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

function consumeTokenFromHash(): string | null {
  const hash = window.location.hash.slice(1)
  if (!hash) return null
  const params = new URLSearchParams(hash)
  const token = params.get('access_token')
  if (token) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  }
  return token
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [clientId, setClientId] = useState<string | null>(
    () => localStorage.getItem(CLIENT_ID_KEY),
  )
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = consumeTokenFromHash()
    if (t) setToken(t)
  }, [])

  const saveClientId = (id: string) => {
    const trimmed = id.trim()
    localStorage.setItem(CLIENT_ID_KEY, trimmed)
    setClientId(trimmed)
  }

  const clearClientId = () => {
    localStorage.removeItem(CLIENT_ID_KEY)
    setClientId(null)
    setToken(null)
  }

  const login = () => {
    if (clientId) initiateLogin(clientId)
  }

  return (
    <AuthContext.Provider value={{ token, clientId, saveClientId, clearClientId, login, logout: () => setToken(null) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
