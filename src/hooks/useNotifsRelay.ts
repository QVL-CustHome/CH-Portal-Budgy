import { useEffect, useRef } from "react";
import { parseBudgyEvent, type BudgyEvent } from "../relay/events";
import { topicBelongsToUser, userWildcardTopic } from "../relay/topics";
import type { RelayTransport } from "../relay/transport";

export type BudgyEventHandler = (event: BudgyEvent) => void;

interface UseNotifsRelayParams {
  sub: string;
  transport: RelayTransport;
  topicPrefix: string;
  onEvent: BudgyEventHandler;
}

export function useNotifsRelay({
  sub,
  transport,
  topicPrefix,
  onEvent,
}: UseNotifsRelayParams): void {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (!transport.enabled || !sub) {
      return;
    }

    const subscription = transport.subscribe(
      userWildcardTopic(topicPrefix, sub),
      ({ topic, payload }) => {
        if (!topicBelongsToUser(topicPrefix, sub, topic)) {
          return;
        }
        const event = parseBudgyEvent(payload);
        if (!event || event.sub !== sub) {
          return;
        }
        onEventRef.current(event);
      }
    );

    return () => subscription.unsubscribe();
  }, [sub, transport, topicPrefix]);
}
