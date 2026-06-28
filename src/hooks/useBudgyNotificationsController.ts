import { useCallback, useMemo, useRef, useState } from "react";
import { useCurrentUser } from "../context/current-user";
import { readRelayConfig } from "../relay/config";
import { createRelayTransport } from "../relay/createRelayTransport";
import type { BudgyEvent } from "../relay/events";
import { useNotifsRelay } from "./useNotifsRelay";
import { useConsentState } from "./useConsentState";
import type {
  AccountEventListener,
  BudgyNotificationsContextValue,
  SyncErrorState,
} from "../context/budgy-notifications";

const ACCOUNT_RELOAD_EVENTS = new Set<BudgyEvent["eventType"]>([
  "sync.succeeded",
  "account.transactions",
  "account.balance",
]);

const CONSENT_EVENTS = new Set<BudgyEvent["eventType"]>([
  "consent.renewal_required",
  "consent.expired",
]);

export function useBudgyNotificationsController(): BudgyNotificationsContextValue {
  const me = useCurrentUser();
  const sub = me.user_id;

  const config = useMemo(() => readRelayConfig(), []);
  const transport = useMemo(() => createRelayTransport(config), [config]);

  const accountsListeners = useRef(new Set<AccountEventListener>());
  const accountListeners = useRef(new Map<string, Set<AccountEventListener>>());

  const [syncError, setSyncError] = useState<SyncErrorState | null>(null);

  const {
    renewalState: consentRenewalState,
    applyEvent: applyConsentEvent,
    reload: reloadConsents,
  } = useConsentState();

  const registerAccountsListener = useCallback(
    (listener: AccountEventListener) => {
      const listeners = accountsListeners.current;
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    []
  );

  const registerAccountListener = useCallback(
    (accountId: string, listener: AccountEventListener) => {
      const byAccount = accountListeners.current;
      const listeners = byAccount.get(accountId) ?? new Set();
      listeners.add(listener);
      byAccount.set(accountId, listeners);
      return () => {
        const current = byAccount.get(accountId);
        if (!current) {
          return;
        }
        current.delete(listener);
        if (current.size === 0) {
          byAccount.delete(accountId);
        }
      };
    },
    []
  );

  const dispatchToAccount = useCallback((event: BudgyEvent) => {
    accountsListeners.current.forEach((listener) => listener(event));
    if (event.account) {
      accountListeners.current
        .get(event.account)
        ?.forEach((listener) => listener(event));
    }
  }, []);

  const handleEvent = useCallback(
    (event: BudgyEvent) => {
      if (event.eventType === "sync.failed") {
        setSyncError({ account: event.account, at: event.at });
        return;
      }
      if (ACCOUNT_RELOAD_EVENTS.has(event.eventType)) {
        dispatchToAccount(event);
        return;
      }
      if (CONSENT_EVENTS.has(event.eventType)) {
        applyConsentEvent(event);
      }
    },
    [dispatchToAccount, applyConsentEvent]
  );

  useNotifsRelay({
    sub,
    transport,
    topicPrefix: config.topicPrefix,
    onEvent: handleEvent,
  });

  const dismissSyncError = useCallback(() => setSyncError(null), []);

  return {
    registerAccountsListener,
    registerAccountListener,
    syncError,
    dismissSyncError,
    consentRenewalState,
    reloadConsents,
  };
}
