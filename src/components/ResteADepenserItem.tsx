import type { CSSProperties } from "react";
import { Heading, Stack, useTranslation } from "canopui";
import type { RemainingBudgetCategory } from "../api/budgy";
import { spendRatio } from "../lib/budget";
import { formatMoneyCents } from "../lib/money";
import { toCategoryIcon } from "../lib/categories";
import CategoryBadge from "./CategoryBadge";

export interface ResteADepenserItemProps {
  category: RemainingBudgetCategory;
}

type ProgressStyle = CSSProperties & {
  "--reste-ratio": string;
  "--reste-fill": string;
};

const CURRENCY = "EUR";

export default function ResteADepenserItem({
  category,
}: ResteADepenserItemProps) {
  const { t, locale } = useTranslation();

  const ratio = spendRatio(category.depense_cents, category.montant_prevu_cents);
  const progressStyle: ProgressStyle = {
    "--reste-ratio": String(ratio),
    "--reste-fill": category.color,
  };

  const spent = formatMoneyCents(category.depense_cents, CURRENCY, locale);
  const planned = formatMoneyCents(
    category.montant_prevu_cents,
    CURRENCY,
    locale
  );
  const remaining = formatMoneyCents(category.reste_cents, CURRENCY, locale);
  const overspent = formatMoneyCents(
    category.depassement_cents,
    CURRENCY,
    locale
  );

  return (
    <div className="reste-item" data-depasse={category.depasse}>
      <Stack gap="sm">
        <Stack direction="row" alignItems="center" gap="md">
          <CategoryBadge
            color={category.color}
            icon={toCategoryIcon(category.icon)}
            size="md"
          />
          <Stack gap="xs" fill>
            <Heading level={3} size={5}>
              {category.category_name}
            </Heading>
            <span className="reste-subline">
              {t("budgy.dashboard.remaining.spentOfPlanned", {
                spent,
                planned,
              })}
            </span>
          </Stack>
          {category.depasse ? (
            <span className="reste-chip">
              {t("budgy.dashboard.remaining.overspentBy", { amount: overspent })}
            </span>
          ) : null}
        </Stack>

        <div
          className="reste-progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(ratio * 100)}
          aria-label={t("budgy.dashboard.remaining.progressAria", {
            spent,
            planned,
          })}
        >
          <div className="reste-progress-fill" style={progressStyle} />
        </div>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="baseline"
        >
          <span className="reste-label">
            {t("budgy.dashboard.remaining.remainingLabel")}
          </span>
          <span className="reste-value" data-depasse={category.depasse}>
            {remaining}
          </span>
        </Stack>
      </Stack>
    </div>
  );
}
