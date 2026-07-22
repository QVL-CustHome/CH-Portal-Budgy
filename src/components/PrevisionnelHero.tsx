import { Stack, useTranslation } from "canopui";
import type { PrevisionnelSummary } from "../hooks/usePrevisionnel";
import { formatMoneyCents } from "../lib/money";
import PrevisionnelBreakdown from "./PrevisionnelBreakdown";

const CURRENCY = "EUR";

export interface PrevisionnelHeroProps {
  summary: PrevisionnelSummary;
}

export default function PrevisionnelHero({ summary }: PrevisionnelHeroProps) {
  const { t, locale } = useTranslation();
  const isPositive = summary.soldePrevisionnelCents >= 0;
  const formattedSolde = formatMoneyCents(
    summary.soldePrevisionnelCents,
    CURRENCY,
    locale,
    { signDisplay: true }
  );

  return (
    <Stack gap="md">
      <div
        className="previsionnel-hero"
        data-sign={isPositive ? "positive" : "negative"}
      >
        <span className="previsionnel-hero-label">
          {t("budgy.dashboard.forecast.soldeLabel")}
        </span>
        <span className="previsionnel-hero-amount">{formattedSolde}</span>
      </div>
      <PrevisionnelBreakdown summary={summary} />
    </Stack>
  );
}
