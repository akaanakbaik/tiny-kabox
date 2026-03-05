/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string
  readonly VITE_PUBLIC_BASE_URL?: string
  readonly VITE_LOGO_URL?: string
  readonly VITE_TELEGRAM_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}