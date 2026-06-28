import type {
  RelayMessage,
  RelayMessageHandler,
  RelaySubscription,
  RelayTransport,
} from "./transport";

export interface MqttTransportConfig {
  url: string;
  token?: string;
  clientId?: string;
}

interface MqttLikeClient {
  on(
    event: "message",
    listener: (topic: string, payload: Uint8Array) => void
  ): void;
  subscribe(topic: string, options?: { qos?: 0 | 1 | 2 }): void;
  unsubscribe(topic: string): void;
}

interface MqttModule {
  connect(
    url: string,
    options?: {
      username?: string;
      password?: string;
      clientId?: string;
      protocolVersion?: 3 | 4 | 5;
      reconnectPeriod?: number;
    }
  ): MqttLikeClient;
}

const QOS_AT_LEAST_ONCE = 1;

function decodePayload(payload: Uint8Array): string {
  return new TextDecoder().decode(payload);
}

const MQTT_MODULE_SPECIFIER = "mqtt";

async function loadMqttModule(): Promise<MqttModule> {
  const imported = (await import(
    /* @vite-ignore */ MQTT_MODULE_SPECIFIER
  )) as unknown;
  const candidate = imported as { default?: MqttModule } & Partial<MqttModule>;
  if (typeof candidate.connect === "function") {
    return candidate as MqttModule;
  }
  if (candidate.default && typeof candidate.default.connect === "function") {
    return candidate.default;
  }
  throw new Error("mqtt module does not expose connect()");
}

export function createMqttTransport(
  config: MqttTransportConfig
): RelayTransport {
  const handlersByTopic = new Map<string, Set<RelayMessageHandler>>();
  let clientPromise: Promise<MqttLikeClient> | null = null;

  const ensureClient = (): Promise<MqttLikeClient> => {
    if (!clientPromise) {
      clientPromise = loadMqttModule().then((mqtt) => {
        const client = mqtt.connect(config.url, {
          username: config.token ? "jwt" : undefined,
          password: config.token,
          clientId: config.clientId,
          protocolVersion: 5,
          reconnectPeriod: 5000,
        });
        client.on("message", (topic, payload) => {
          const handlers = handlersByTopic.get(topic);
          if (!handlers) {
            return;
          }
          const message: RelayMessage = {
            topic,
            payload: decodePayload(payload),
          };
          handlers.forEach((handler) => handler(message));
        });
        return client;
      });
    }
    return clientPromise;
  };

  const subscribe = (
    topic: string,
    onMessage: RelayMessageHandler
  ): RelaySubscription => {
    const existing = handlersByTopic.get(topic);
    const handlers = existing ?? new Set<RelayMessageHandler>();
    handlers.add(onMessage);
    handlersByTopic.set(topic, handlers);

    void ensureClient().then((client) => {
      if (!existing) {
        client.subscribe(topic, { qos: QOS_AT_LEAST_ONCE });
      }
    });

    return {
      unsubscribe: () => {
        const current = handlersByTopic.get(topic);
        if (!current) {
          return;
        }
        current.delete(onMessage);
        if (current.size === 0) {
          handlersByTopic.delete(topic);
          void ensureClient().then((client) => client.unsubscribe(topic));
        }
      },
    };
  };

  return { enabled: true, subscribe };
}
