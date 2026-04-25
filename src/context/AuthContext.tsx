/**
 * AuthContext — no OAuth, no Google Cloud.
 * The user just pastes their Apps Script URL once.
 * It's stored in localStorage and used for all reads/writes.
 */
import { createContext, useContext, useState } from 'react'

const SCRIPT_URL_KEY = 'finance_script_url'

interface AuthContextType {
  scriptUrl: string | null
  saveScriptUrl: (url: string) => void
  clearScriptUrl: () => void
}

const AuthContext = createContext<AuthContextType>({
  scriptUrl: null,
  saveScriptUrl: () => {},
  clearScriptUrl: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [scriptUrl, setScriptUrl] = useState<string | null>(
    () => localStorage.getItem(SCRIPT_URL_KEY),
  )

  const saveScriptUrl = (url: string) => {
    const trimmed = url.trim()
    localStorage.setItem(SCRIPT_URL_KEY, trimmed)
    setScriptUrl(trimmed)
  }

  const clearScriptUrl = () => {
    localStorage.removeItem(SCRIPT_URL_KEY)
    setScriptUrl(null)
  }

  return (
    <AuthContext.Provider value={{ scriptUrl, saveScriptUrl, clearScriptUrl }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
