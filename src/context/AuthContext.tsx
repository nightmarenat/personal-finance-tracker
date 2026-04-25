/**
 * AuthContext — stores the Apps Script URL in both localStorage and a
 * 1-year cookie so it survives Safari's 7-day localStorage purge.
 */
import { createContext, useContext, useState } from 'react'

const KEY = 'finance_script_url'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year in seconds

function readCookie(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)finance_script_url=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

function writeCookie(value: string) {
  document.cookie = `${KEY}=${encodeURIComponent(value)};max-age=${COOKIE_MAX_AGE};path=/;SameSite=Strict`
}

function deleteCookie() {
  document.cookie = `${KEY}=;max-age=0;path=/`
}

function loadUrl(): string | null {
  return localStorage.getItem(KEY) ?? readCookie()
}

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
  const [scriptUrl, setScriptUrl] = useState<string | null>(loadUrl)

  const saveScriptUrl = (url: string) => {
    const trimmed = url.trim()
    localStorage.setItem(KEY, trimmed)
    writeCookie(trimmed)
    setScriptUrl(trimmed)
  }

  const clearScriptUrl = () => {
    localStorage.removeItem(KEY)
    deleteCookie()
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
