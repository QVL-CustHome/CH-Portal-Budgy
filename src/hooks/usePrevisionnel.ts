import { useCallback, useEffect, useMemo, useState } from "react";
import { apiErrorMessage, useTranslation } from "canopui";
import { ApiError } from "../api/client";
import { getForecast, type Forecast } from "../api/budgy";
import { currentMonth, recentMonths } from "../lib/budget";

const MONTH_OPTIONS_COUNT = 12;

export interface PrevisionnelSummary {
  /** Solde attendu au dernier jour du cycle. */
  soldePrevisionnelCents: number;
  soldeActuelCents: number;
  revenusRestantsCents: number;
  depensesRestantesCents: number;
}

interface UsePrevisionnelResult {
  month: string;
  monthOptions: string[];
  summary: PrevisionnelSummary | null;
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
      soldeActuelCents: forecast.solde_actuel_cents,
      revenusRestantsCents: forecast.revenus_restants_cents,
      depensesRestantesCents: forecast.depenses_restantes_cents,
    };
  }, [forecast]);

  return {
    month,
    monthOptions,
    summary,
    hasEnoughData,
    loading,
    error,
    selectMonth: setMonth,
    reload: () => void load(),
  };
}
