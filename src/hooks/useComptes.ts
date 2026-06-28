import { useCallback, useEffect, useState } from "react";
import { apiErrorMessage, useTranslation } from "@custhome/ui";
import { ApiError } from "../api/client";
import { listAccounts, type Account } from "../api/budgy";

interface UseComptesResult {
  comptes: Account[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useComptes(): UseComptesResult {
  const { t } = useTranslation();
  const [comptes, setComptes] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listAccounts();
      setComptes(response.data);
    } catch (caught) {
      const code = caught instanceof ApiError ? caught.code : undefined;
      setError(apiErrorMessage(t, code, t("budgy.accounts.error")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    comptes,
    loading,
    error,
    reload: () => void load(),
  };
}
