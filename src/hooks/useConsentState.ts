import { useCallback, useEffect, useState } from "react";
import { apiErrorMessage, useTranslation } from "canopui";
import { ApiError } from "../api/client";
import { listConsents, type Consent } from "../api/budgy";
import type { BudgyEvent } from "../relay/events";

export type ConsentRenewalState =
  | "unknown"
  | "up-to-date"
  | "renewal-required"
  | "expired";

interface UseConsentStateResult {
  renewalState: ConsentRenewalState;
  consents: Consent[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  applyEvent: (event: BudgyEvent) => void;
}

function deriveRenewalState(consents: Consent[]): ConsentRenewalState {
  if (consents.length === 0) {
    return "unknown";
  }
  if (consents.some((consent) => consent.renewal === "expired")) {
    return "expired";
  }
  if (consents.some((consent) => consent.renewal === "renewal-required")) {
    return "renewal-required";
  }
  return "up-to-date";
}

export function useConsentState(): UseConsentStateResult {
  const { t } = useTranslation();
  const [consents, setConsents] = useState<Consent[]>([]);
  const [renewalState, setRenewalState] =
    useState<ConsentRenewalState>("unknown");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listConsents();
      setConsents(response.data);
      setRenewalState(deriveRenewalState(response.data));
    } catch (caught) {
      const code = caught instanceof ApiError ? caught.code : undefined;
      setError(apiErrorMessage(t, code, t("budgy.consent.error")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const applyEvent = useCallback((event: BudgyEvent) => {
    if (event.eventType === "consent.expired") {
      setRenewalState("expired");
      return;
    }
    if (event.eventType === "consent.renewal_required") {
      setRenewalState((current) =>
        current === "expired" ? current : "renewal-required"
      );
    }
  }, []);

  return {
    renewalState,
    consents,
    loading,
    error,
    reload: () => void load(),
    applyEvent,
  };
}
