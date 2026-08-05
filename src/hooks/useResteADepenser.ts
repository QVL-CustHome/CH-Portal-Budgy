import { useCallback, useEffect, useMemo, useState } from "react";
import { apiErrorMessage, useTranslation } from "canopui";
import { ApiError } from "../api/client";
import {
  getRemainingBudgets,
  type RemainingBudgetCategory,
  type RemainingBudgetTotal,
} from "../api/budgy";
import { currentMonth, recentMonths } from "../lib/budget";

const MONTH_OPTIONS_COUNT = 12;

interface UseResteADepenserResult {
  month: string;
  monthOptions: string[];
  categories: RemainingBudgetCategory[];
  total: RemainingBudgetTotal | null;
  isEmpty: boolean;
  loading: boolean;
  error: string | null;
  selectMonth: (month: string) => void;
  reload: () => void;
}

export function useResteADepenser(): UseResteADepenserResult {
  const { t } = useTranslation();
  const [month, setMonth] = useState(() => currentMonth());
  const [categories, setCategories] = useState<RemainingBudgetCategory[]>([]);
  const [total, setTotal] = useState<RemainingBudgetTotal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRemainingBudgets(month);
      setCategories(response?.categories ?? []);
      setTotal(response?.total ?? null);
    } catch (caught) {
      const code = caught instanceof ApiError ? caught.code : undefined;
      setError(apiErrorMessage(t, code, t("budgy.dashboard.remaining.error")));
    } finally {
      setLoading(false);
    }
  }, [month, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const monthOptions = useMemo(
    () => recentMonths(currentMonth(), MONTH_OPTIONS_COUNT),
    []
  );

  return {
    month,
    monthOptions,
    categories,
    total,
    isEmpty: categories.length === 0,
    loading,
    error,
    selectMonth: setMonth,
    reload: () => void load(),
  };
}
