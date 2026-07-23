import { useCallback, useEffect, useMemo, useState } from "react";
import { apiErrorMessage, useTranslation } from "canopui";
import { ApiError } from "../api/client";
import { getExpensesByCategory, type ExpenseCategoryLine } from "../api/budgy";
import { currentMonth, isFutureMonth, shiftMonth } from "../lib/budget";
import { buildExpenseSegments, type ExpenseSegment } from "../lib/expenses";

const DISPLAY_CURRENCY = "EUR";

interface UseExpensesByCategoryResult {
  month: string;
  segments: ExpenseSegment[];
  totalCents: number;
  currency: string;
  isEmpty: boolean;
  loading: boolean;
  error: string | null;
  reload: () => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  canGoNext: boolean;
}

export function useExpensesByCategory(): UseExpensesByCategoryResult {
  const { t } = useTranslation();
  const [month, setMonth] = useState(() => currentMonth());
  const [totalCents, setTotalCents] = useState(0);
  const [lignes, setLignes] = useState<ExpenseCategoryLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (targetMonth: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getExpensesByCategory(targetMonth);
        setTotalCents(response?.total_cents ?? 0);
        setLignes(response?.lignes ?? []);
      } catch (caught) {
        const code = caught instanceof ApiError ? caught.code : undefined;
        setError(apiErrorMessage(t, code, t("budgy.dashboard.expenses.error")));
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    void load(month);
  }, [load, month]);

  const segments = useMemo(
    () => buildExpenseSegments(lignes, totalCents),
    [lignes, totalCents]
  );

  const goToPreviousMonth = useCallback(
    () => setMonth((current) => shiftMonth(current, -1)),
    []
  );
  const goToNextMonth = useCallback(
    () => setMonth((current) => shiftMonth(current, 1)),
    []
  );

  return {
    month,
    segments,
    totalCents,
    currency: DISPLAY_CURRENCY,
    isEmpty: segments.length === 0,
    loading,
    error,
    reload: () => void load(month),
    goToPreviousMonth,
    goToNextMonth,
    canGoNext: !isFutureMonth(shiftMonth(month, 1)),
  };
}
