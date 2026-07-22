import { Stack, useTranslation } from "canopui";
import type { TransactionType } from "../api/budgy";
import { TRANSACTION_TYPES } from "../lib/transactions";

export interface TransactionTypeFilterProps {
  value: TransactionType | null;
  disabled?: boolean;
  onChange: (value: TransactionType | null) => void;
}

const OPTIONS: readonly (TransactionType | "all")[] = ["all", ...TRANSACTION_TYPES];

export default function TransactionTypeFilter({
  value,
  disabled,
  onChange,
}: TransactionTypeFilterProps) {
  const { t } = useTranslation();
  const current = value ?? "all";

  return (
    <Stack gap="sm">
      <span className="category-field-label">
        {t("budgy.transactions.type.label")}
      </span>
      <div
        className="transaction-filter"
        role="radiogroup"
        aria-label={t("budgy.transactions.type.label")}
      >
        {OPTIONS.map((option) => {
          const selected = option === current;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              className="transaction-filter-option"
              data-selected={selected}
              disabled={disabled}
              onClick={() => onChange(option === "all" ? null : option)}
            >
              {t(`budgy.transactions.type.${option}`)}
            </button>
          );
        })}
      </div>
    </Stack>
  );
}
