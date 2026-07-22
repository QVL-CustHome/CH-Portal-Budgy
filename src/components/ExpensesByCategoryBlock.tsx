import { useMemo } from "react";
import Typography from "@mui/material/Typography";
import {
  Button,
  Card,
  Donut,
  Feedback,
  Spinner,
  Stack,
  useTranslation,
  type ChDonutSegment,
} from "canopui";
import { useExpensesByCategory } from "../hooks/useExpensesByCategory";
import { formatMonthLabel } from "../lib/budget";
import { formatMoneyCents } from "../lib/money";
import MonthNavigator from "./MonthNavigator";

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

  const donutSegments = useMemo<ChDonutSegment[]>(
    () =>
      segments.map((segment) => ({
        id: segment.key,
        label: segment.label ?? t("budgy.dashboard.expenses.uncategorized"),
        value: segment.montantCents,
      })),
    [segments, t]
  );

  const formatSegmentValue = useMemo(
    () => (segment: ChDonutSegment, percentage: number) => {
      const amount = formatMoneyCents(segment.value, currency, locale);
      return `${amount} · ${Math.round(percentage)} %`;
    },
    [currency, locale]
  );

  const monthSelector = (
    <MonthNavigator
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
        <Donut
          segments={donutSegments}
          size="14rem"
          thickness="thick"
          showLegend
          ariaLabel={t("budgy.dashboard.expenses.chartAria")}
          formatValue={formatSegmentValue}
          centerContent={
            <Stack gap="xs" alignItems="center">
              <Typography
                component="span"
                color="text.primary"
                sx={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.1 }}
              >
                {formatMoneyCents(totalCents, currency, locale)}
              </Typography>
              <Typography
                component="span"
                color="text.secondary"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                }}
              >
                {t("budgy.dashboard.expenses.totalCaption")}
              </Typography>
            </Stack>
          }
        />
      )}
    </Card>
  );
}
