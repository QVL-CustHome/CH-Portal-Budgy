import { DEFAULT_TOPIC_PREFIX } from "./topics";

export interface RelayConfig {
  wsUrl: string | null;
  topicPrefix: string;
  token: string | null;
}

export function readRelayConfig(): RelayConfig {
  const wsUrl = import.meta.env.VITE_RELAY_WS_URL?.trim();
  return {
    wsUrl: wsUrl && wsUrl.length > 0 ? wsUrl : null,
    topicPrefix:
      import.meta.env.VITE_RELAY_TOPIC_PREFIX?.trim() || DEFAULT_TOPIC_PREFIX,
    token: import.meta.env.VITE_RELAY_TOKEN?.trim() || null,
  };
}
