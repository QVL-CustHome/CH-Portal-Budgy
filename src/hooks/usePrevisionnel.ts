import { useCallback, useEffect, useMemo, useState } from "react";
import { apiErrorMessage, useTranslation } from "canopui";
import { ApiError } from "../api/client";
import { getForecast, type Forecast } from "../api/budgy";
import { currentMonth, recentMonths } from "../lib/budget";
import {
  buildForecastCategoryViews,
  type ForecastCategoryView,
} from "../lib/forecast";

const MONTH_OPTIONS_COUNT = 12;

export interface PrevisionnelSummary {
  soldePrevisionnelCents: number;
  revenusRecurrentsCents: number;
  depensesRecurrentesCents: number;
  budgetsCents: number;
}

interface UsePrevisionnelResult {
  month: string;
  monthOptions: string[];
  summary: PrevisionnelSummary | null;
  categories: ForecastCategoryView[];
  hasEnoughData: boolean;
  loading: boolean;
  error: string | null;
  selectMonth: (month: string) => void;
  reload: () => void;
}

export function usePrevisionnel(): UsePrevisionnelResult {
  const { t } = useTranslation();
  const [month, setMonth] = useState(() => currentMonth());
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getForecast(month);
      setForecast(response ?? null);
    } catch (caught) {
      const code = caught instanceof ApiError ? caught.code : undefined;
      setError(apiErrorMessage(t, code, t("budgy.dashboard.forecast.error")));
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

  const hasEnoughData = forecast?.donnees_suffisantes ?? false;

  const summary = useMemo<PrevisionnelSummary | null>(() => {
    if (!forecast || !forecast.donnees_suffisantes) {
      return null;
    }
    return {
      soldePrevisionnelCents: forecast.solde_previsionnel_cents,
      revenusRecurrentsCents: forecast.revenus_recurrents_cents,
      depensesRecurrentesCents: forecast.depenses_recurrentes_cents,
      budgetsCents: forecast.budgets_cents,
    };
  }, [forecast]);

  const categories = useMemo<ForecastCategoryView[]>(() => {
    if (!forecast || !forecast.donnees_suffisantes) {
      return [];
    }
    return buildForecastCategoryViews(forecast.categories);
  }, [forecast]);

  return {
    month,
    monthOptions,
    summary,
    categories,
    hasEnoughData,
    loading,
    error,
    selectMonth: setMonth,
    reload: () => void load(),
  };
}
