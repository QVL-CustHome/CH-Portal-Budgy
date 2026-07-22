import { useCallback, useEffect, useState } from "react";
import { apiErrorMessage, useTranslation } from "canopui";
import { ApiError } from "../api/client";
import { listBudgets, type Budget } from "../api/budgy";

interface UseBudgetsResult {
  budgets: Budget[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useBudgets(month: string): UseBudgetsResult {
  const { t } = useTranslation();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listBudgets(month);
      setBudgets(response.data);
    } catch (caught) {
      const code = caught instanceof ApiError ? caught.code : undefined;
      setError(apiErrorMessage(t, code, t("budgy.budgets.error")));
    } finally {
      setLoading(false);
    }
  }, [month, t]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    budgets,
    loading,
    error,
    reload: () => void load(),
  };
}
