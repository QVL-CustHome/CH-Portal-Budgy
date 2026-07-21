import { Stack, useTranslation } from "canopui";
import type { TransactionCategoryFilter as Filter } from "../api/budgy";

export interface TransactionCategoryFilterProps {
  value: Filter;
  disabled?: boolean;
  onChange: (value: Filter) => void;
}

const OPTIONS: readonly Filter[] = ["all", "uncategorized"];

export default function TransactionCategoryFilter({
  value,
  disabled,
  onChange,
}: TransactionCategoryFilterProps) {
  const { t } = useTranslation();

  return (
    <Stack gap="sm">
      <span className="category-field-label">
        {t("budgy.transactions.filter.label")}
      </span>
      <div
        className="transaction-filter"
        role="radiogroup"
        aria-label={t("budgy.transactions.filter.label")}
      >
        {OPTIONS.map((option) => {
          const selected = option === value;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              className="transaction-filter-option"
              data-selected={selected}
              disabled={disabled}
              onClick={() => onChange(option)}
            >
              {t(`budgy.transactions.filter.${option}`)}
            </button>
          );
        })}
      </div>
    </Stack>
  );
}
