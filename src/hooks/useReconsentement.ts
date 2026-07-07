import { useCallback, useEffect, useMemo, useState } from "react";
import { apiErrorMessage, useTranslation } from "canopui";
import { ApiError } from "../api/client";
import {
  listConsents,
  renouvelerConsentement,
  type Consent,
} from "../api/budgy";
import { navigateTo } from "../lib/navigation";
import { markRenewFlow } from "../lib/consent-flow";

function isRenewable(consent: Consent): boolean {
  return consent.renewable || consent.renewal !== "up-to-date";
}

interface UseReconsentementResult {
  consents: Consent[];
  renewableConsents: Consent[];
  hasRenewable: boolean;
  loading: boolean;
  error: string | null;
  renewingConsentId: string | null;
  renewError: string | null;
  reload: () => void;
  renew: (consentId: string) => void;
}

export function useReconsentement(): UseReconsentementResult {
  const { t } = useTranslation();
  const [consents, setConsents] = useState<Consent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renewingConsentId, setRenewingConsentId] = useState<string | null>(
    null
  );
  const [renewError, setRenewError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listConsents();
      setConsents(response.data);
    } catch (caught) {
      const code = caught instanceof ApiError ? caught.code : undefined;
      setError(apiErrorMessage(t, code, t("budgy.consents.error")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const renew = useCallback(
    async (consentId: string) => {
      setRenewingConsentId(consentId);
      setRenewError(null);
      try {
        const { authorization_url } = await renouvelerConsentement(consentId);
        markRenewFlow();
        navigateTo(authorization_url);
      } catch (caught) {
        const code = caught instanceof ApiError ? caught.code : undefined;
        setRenewError(apiErrorMessage(t, code, t("budgy.consents.renewError")));
        setRenewingConsentId(null);
      }
    },
    [t]
  );

  const renewableConsents = useMemo(
    () => consents.filter(isRenewable),
    [consents]
  );

  return {
    consents,
    renewableConsents,
    hasRenewable: renewableConsents.length > 0,
    loading,
    error,
    renewingConsentId,
    renewError,
    reload: () => void load(),
    renew: (consentId: string) => void renew(consentId),
  };
}
