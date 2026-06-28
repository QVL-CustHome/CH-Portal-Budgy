/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RELAY_WS_URL?: string;
  readonly VITE_RELAY_TOPIC_PREFIX?: string;
  readonly VITE_RELAY_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
