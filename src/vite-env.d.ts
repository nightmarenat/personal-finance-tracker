/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_TRANSACTIONS_SHEET_ID: string
  readonly VITE_CATEGORIES_SHEET_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
