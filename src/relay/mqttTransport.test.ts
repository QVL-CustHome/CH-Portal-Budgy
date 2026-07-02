import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMqttTransport } from "./mqttTransport";

const broker = vi.hoisted(() => ({
  listeners: [] as Array<(topic: string, payload: Uint8Array) => void>,
  subscribed: [] as string[],
  unsubscribed: [] as string[],
}));

vi.mock("mqtt", () => {
  const connect = () => ({
    on: (
      event: string,
      listener: (topic: string, payload: Uint8Array) => void
    ) => {
      if (event === "message") {
        broker.listeners.push(listener);
      }
    },
    subscribe: (topic: string) => {
      broker.subscribed.push(topic);
    },
    unsubscribe: (topic: string) => {
      broker.unsubscribed.push(topic);
    },
  });
  return { connect, default: { connect } };
});

function emit(topic: string, payload = "{}") {
  const bytes = new TextEncoder().encode(payload);
  broker.listeners.forEach((listener) => listener(topic, bytes));
}

async function subscribeAndConnect(filter: string, handler: (message: unknown) => void) {
  const transport = createMqttTransport({ url: "wss://relay.test/mqtt" });
  const subscription = transport.subscribe(filter, handler);
  await vi.waitFor(() => expect(broker.listeners.length).toBeGreaterThan(0));
  return subscription;
}

beforeEach(() => {
  broker.listeners.length = 0;
  broker.subscribed.length = 0;
  broker.unsubscribed.length = 0;
});

describe("createMqttTransport dispatch", () => {
  it("invoque le handler wildcard # pour un topic concret couvert, en portant le topic concret", async () => {
    const handler = vi.fn();
    await subscribeAndConnect("budgy/123/#", handler);

    emit("budgy/123/sync/succeeded", '{"ok":true}');

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      topic: "budgy/123/sync/succeeded",
      payload: '{"ok":true}',
    });
  });

  it("n'invoque pas le handler wildcard # pour un topic non couvert", async () => {
    const handler = vi.fn();
    await subscribeAndConnect("budgy/123/#", handler);

    emit("budgy/456/sync/succeeded");

    expect(handler).not.toHaveBeenCalled();
  });

  it("invoque le handler + pour tout segment unique correspondant", async () => {
    const handler = vi.fn();
    await subscribeAndConnect("budgy/+/sync/succeeded", handler);

    emit("budgy/123/sync/succeeded");
    emit("budgy/999/sync/succeeded");

    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler).toHaveBeenNthCalledWith(1, {
      topic: "budgy/123/sync/succeeded",
      payload: "{}",
    });
    expect(handler).toHaveBeenNthCalledWith(2, {
      topic: "budgy/999/sync/succeeded",
      payload: "{}",
    });
  });

  it("n'invoque pas le handler + pour un topic plus profond ou divergent", async () => {
    const handler = vi.fn();
    await subscribeAndConnect("budgy/+/sync/succeeded", handler);

    emit("budgy/123/sync/succeeded/extra");
    emit("budgy/123/other");
    emit("budgy/123/sync/failed");

    expect(handler).not.toHaveBeenCalled();
  });

  it("invoque un abonnement exact uniquement pour son topic exact", async () => {
    const handler = vi.fn();
    await subscribeAndConnect("budgy/123/sync/succeeded", handler);

    emit("budgy/123/sync/succeeded", '{"ok":true}');
    emit("budgy/123/sync/failed");
    emit("budgy/123/sync/succeeded/extra");

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      topic: "budgy/123/sync/succeeded",
      payload: '{"ok":true}',
    });
  });

  it("invoque le handler # pour le niveau parent du filtre", async () => {
    const handler = vi.fn();
    await subscribeAndConnect("budgy/123/#", handler);

    emit("budgy/123", '{"level":"parent"}');

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      topic: "budgy/123",
      payload: '{"level":"parent"}',
    });
  });

  it("désabonne le client uniquement après le retrait du dernier handler du filtre", async () => {
    const transport = createMqttTransport({ url: "wss://relay.test/mqtt" });
    const firstSubscription = transport.subscribe("budgy/123/#", vi.fn());
    const secondSubscription = transport.subscribe("budgy/123/#", vi.fn());
    await vi.waitFor(() => expect(broker.listeners.length).toBeGreaterThan(0));

    firstSubscription.unsubscribe();
    await Promise.resolve();
    expect(broker.unsubscribed).not.toContain("budgy/123/#");

    secondSubscription.unsubscribe();
    await vi.waitFor(() =>
      expect(broker.unsubscribed).toContain("budgy/123/#")
    );
  });
});
