import { createContext, useContext } from "react";
import type { BudgyEvent } from "../relay/events";
import type { ConsentRenewalState } from "../hooks/useConsentState";

export type AccountEventListener = (event: BudgyEvent) => void;

export interface SyncErrorState {
  account: string | null;
  at: string;
}

export interface BudgyNotificationsContextValue {
  registerAccountsListener: (listener: AccountEventListener) => () => void;
  registerAccountListener: (
    accountId: string,
    listener: AccountEventListener
  ) => () => void;
  syncError: SyncErrorState | null;
  dismissSyncError: () => void;
  consentRenewalState: ConsentRenewalState;
  reloadConsents: () => void;
}

export const BudgyNotificationsContext =
  createContext<BudgyNotificationsContextValue | null>(null);

export function useBudgyNotifications(): BudgyNotificationsContextValue {
  const value = useContext(BudgyNotificationsContext);
  if (!value) {
    throw new Error(
      "useBudgyNotifications must be used within BudgyNotificationsProvider"
    );
  }
  return value;
}
