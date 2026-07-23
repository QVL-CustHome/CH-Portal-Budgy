import { useCallback, useEffect, useMemo, useState } from "react";
import { apiErrorMessage, useTranslation } from "canopui";
import { ApiError } from "../api/client";
import { getSoldesConsolides, type ConsolidatedAccount } from "../api/budgy";

const DEFAULT_CURRENCY = "EUR";

interface UseSoldesConsolidesResult {
  totalCents: number;
  comptes: ConsolidatedAccount[];
  displayCurrency: string;
  hasAccounts: boolean;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useSoldesConsolides(): UseSoldesConsolidesResult {
  const { t } = useTranslation();
  const [totalCents, setTotalCents] = useState(0);
  const [comptes, setComptes] = useState<ConsolidatedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSoldesConsolides();
      setTotalCents(response?.total_cents ?? 0);
      setComptes(response?.accounts ?? []);
    } catch (caught) {
      const code = caught instanceof ApiError ? caught.code : undefined;
      setError(apiErrorMessage(t, code, t("budgy.dashboard.balances.error")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const displayCurrency = useMemo(
    () => comptes.find((compte) => compte.currency)?.currency ?? DEFAULT_CURRENCY,
    [comptes]
  );

  return {
    totalCents,
    comptes,
    displayCurrency,
    hasAccounts: comptes.length > 0,
    loading,
    error,
    reload: () => void load(),
  };
}
