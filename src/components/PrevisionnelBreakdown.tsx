import { useTranslation } from "canopui";
import type { PrevisionnelSummary } from "../hooks/usePrevisionnel";
import { formatMoneyCents } from "../lib/money";

const CURRENCY = "EUR";

type BreakdownTone = "positive" | "negative";

interface BreakdownItem {
  key: string;
  label: string;
  amountCents: number;
  tone: BreakdownTone;
}

export interface PrevisionnelBreakdownProps {
  summary: PrevisionnelSummary;
}

export default function PrevisionnelBreakdown({
  summary,
}: PrevisionnelBreakdownProps) {
  const { t, locale } = useTranslation();

  const items: BreakdownItem[] = [
    {
      key: "revenus",
      label: t("budgy.dashboard.forecast.revenusLabel"),
      amountCents: summary.revenusRecurrentsCents,
      tone: "positive",
    },
    {
      key: "depenses",
      label: t("budgy.dashboard.forecast.depensesLabel"),
      amountCents: summary.depensesRecurrentesCents,
      tone: "negative",
    },
    {
      key: "budgets",
      label: t("budgy.dashboard.forecast.budgetsLabel"),
      amountCents: summary.budgetsCents,
      tone: "negative",
    },
  ];

  return (
    <ul className="previsionnel-breakdown">
      {items.map((item, index) => {
        const signedCents =
          item.tone === "negative" ? -item.amountCents : item.amountCents;
        return (
          <li
            key={item.key}
            className="previsionnel-breakdown-item"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <span
              className="previsionnel-breakdown-dot"
              data-tone={item.tone}
            />
            <span className="previsionnel-breakdown-label">{item.label}</span>
            <span
              className="previsionnel-breakdown-value"
              data-tone={item.tone}
            >
              {formatMoneyCents(signedCents, CURRENCY, locale, {
                signDisplay: true,
              })}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
