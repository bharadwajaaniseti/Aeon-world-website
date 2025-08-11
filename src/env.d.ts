/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCKS: string
  readonly VITE_API_BASE: string
  readonly VITE_WORLD_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}