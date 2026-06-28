import type { RelayConfig } from "./config";
import { createMqttTransport } from "./mqttTransport";
import { createNoopTransport } from "./noopTransport";
import type { RelayTransport } from "./transport";

export function createRelayTransport(config: RelayConfig): RelayTransport {
  if (!config.wsUrl) {
    return createNoopTransport();
  }
  return createMqttTransport({
    url: config.wsUrl,
    token: config.token ?? undefined,
  });
}
