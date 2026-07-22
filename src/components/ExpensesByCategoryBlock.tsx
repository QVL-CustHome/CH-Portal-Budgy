import { useMemo } from "react";
import { Button, Card, Feedback, Spinner, Stack, useTranslation } from "canopui";
import { useExpensesByCategory } from "../hooks/useExpensesByCategory";
import { formatMonthLabel } from "../lib/budget";
import { formatMoneyCents } from "../lib/money";
import MonthSelector from "./MonthSelector";
import ExpensesByCategoryChart, {
  type ExpenseSegmentView,
} from "./ExpensesByCategoryChart";
import ExpensesByCategoryLegend from "./ExpensesByCategoryLegend";

export default function ExpensesByCategoryBlock() {
  const { t, locale } = useTranslation();
  const {
    month,
    segments,
    totalCents,
    currency,
    isEmpty,
    loading,
    error,
    reload,
    goToPreviousMonth,
    goToNextMonth,
    canGoNext,
  } = useExpensesByCategory();

  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "percent",
        maximumFractionDigits: 1,
      }),
    [locale]
  );

  const views = useMemo<ExpenseSegmentView[]>(
    () =>
      segments.map((segment) => {
        const label =
          segment.label ?? t("budgy.dashboard.expenses.uncategorized");
        const amount = formatMoneyCents(segment.montantCents, currency, locale);
        const percent = percentFormatter.format(segment.fraction);
        return {
          key: segment.key,
          label,
          color: segment.color,
          amount,
          percent,
          fraction: segment.fraction,
          startFraction: segment.startFraction,
          title: `${label} : ${amount} (${percent})`,
        };
      }),
    [segments, currency, locale, percentFormatter, t]
  );

  const monthSelector = (
    <MonthSelector
      label={formatMonthLabel(month, locale)}
      previousLabel={t("budgy.dashboard.expenses.previousMonth")}
      nextLabel={t("budgy.dashboard.expenses.nextMonth")}
      canGoNext={canGoNext}
      disabled={loading}
      onPrevious={goToPreviousMonth}
      onNext={goToNextMonth}
    />
  );

  return (
    <Card
      title={t("budgy.dashboard.expenses.title")}
      actions={monthSelector}
      elevation="sm"
      fill
    >
      {loading ? (
        <Stack alignItems="center" padding="lg">
          <Spinner label={t("budgy.dashboard.expenses.loading")} />
        </Stack>
      ) : error ? (
        <Stack gap="md" alignItems="start">
          <Feedback severity="error">{error}</Feedback>
          <Button variant="secondary" onClick={reload}>
            {t("budgy.dashboard.expenses.retry")}
          </Button>
        </Stack>
      ) : isEmpty ? (
        <Feedback severity="info">
          {t("budgy.dashboard.expenses.empty")}
        </Feedback>
      ) : (
        <Stack gap="lg" alignItems="center">
          <ExpensesByCategoryChart
            segments={views}
            centerAmount={formatMoneyCents(totalCents, currency, locale)}
            centerCaption={t("budgy.dashboard.expenses.totalCaption")}
            ariaLabel={t("budgy.dashboard.expenses.chartAria")}
          />
          <ExpensesByCategoryLegend segments={views} />
        </Stack>
      )}
    </Card>
  );
}
