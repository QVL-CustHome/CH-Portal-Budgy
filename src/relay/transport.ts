export interface RelayMessage {
  topic: string;
  payload: string;
}

export type RelayMessageHandler = (message: RelayMessage) => void;

export interface RelaySubscription {
  unsubscribe: () => void;
}

export interface RelayTransport {
  enabled: boolean;
  subscribe: (topic: string, onMessage: RelayMessageHandler) => RelaySubscription;
}
