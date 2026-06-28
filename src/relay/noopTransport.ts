import type { RelayTransport } from "./transport";

export function createNoopTransport(): RelayTransport {
  return {
    enabled: false,
    subscribe: () => ({ unsubscribe: () => {} }),
  };
}
