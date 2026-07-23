import type { ForecastCategory } from "../api/budgy";

export const FORECAST_POSITIVE_COLOR = "var(--ch-palette-success-main)";
export const FORECAST_NEGATIVE_COLOR = "var(--ch-palette-error-main)";

const UNCATEGORIZED_KEY = "__uncategorized__";

export interface ForecastCategoryView {
  key: string;
  label: string | null;
  netCents: number;
  revenusCents: number;
  depensesCents: number;
  budgetCents: number;
  fraction: number;
  color: string;
}

export function buildForecastCategoryViews(
  categories: readonly ForecastCategory[]
): ForecastCategoryView[] {
  const lines = (categories ?? [])
    .filter(
      (category) =>
        category.revenus_recurrents_cents > 0 ||
        category.depenses_recurrentes_cents > 0 ||
        category.budget_cents > 0
    )
    .map((category) => ({
      key: category.category_id || UNCATEGORIZED_KEY,
      label: category.category,
      netCents:
        category.revenus_recurrents_cents -
        category.depenses_recurrentes_cents -
        category.budget_cents,
      revenusCents: category.revenus_recurrents_cents,
      depensesCents: category.depenses_recurrentes_cents,
      budgetCents: category.budget_cents,
    }));

  const maxAbsNet = lines.reduce(
    (max, line) => Math.max(max, Math.abs(line.netCents)),
    0
  );

  return lines
    .sort((a, b) => b.netCents - a.netCents)
    .map((line) => ({
      ...line,
      fraction: maxAbsNet > 0 ? Math.abs(line.netCents) / maxAbsNet : 0,
      color: line.netCents >= 0 ? FORECAST_POSITIVE_COLOR : FORECAST_NEGATIVE_COLOR,
    }));
}
