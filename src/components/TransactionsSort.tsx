import { Stack, useTranslation } from "canopui";
import type { TransactionSortField, TransactionSortOrder } from "../api/budgy";
import {
  TRANSACTION_SORT_FIELDS,
  TRANSACTION_SORT_ORDERS,
} from "../lib/transactions";

export interface TransactionsSortProps {
  field: TransactionSortField;
  order: TransactionSortOrder;
  disabled?: boolean;
  onFieldChange: (value: TransactionSortField) => void;
  onOrderChange: (value: TransactionSortOrder) => void;
}

export default function TransactionsSort({
  field,
  order,
  disabled,
  onFieldChange,
  onOrderChange,
}: TransactionsSortProps) {
  const { t } = useTranslation();

  return (
    <Stack gap="sm">
      <span className="category-field-label">
        {t("budgy.transactions.sort.label")}
      </span>
      <Stack direction="row" gap="md" wrap>
        <div
          className="transaction-filter"
          role="radiogroup"
          aria-label={t("budgy.transactions.sort.fieldLabel")}
        >
          {TRANSACTION_SORT_FIELDS.map((option) => {
            const selected = option === field;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={selected}
                className="transaction-filter-option"
                data-selected={selected}
                disabled={disabled}
                onClick={() => onFieldChange(option)}
              >
                {t(`budgy.transactions.sort.field.${option}`)}
              </button>
            );
          })}
        </div>
        <div
          className="transaction-filter"
          role="radiogroup"
          aria-label={t("budgy.transactions.sort.orderLabel")}
        >
          {TRANSACTION_SORT_ORDERS.map((option) => {
            const selected = option === order;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={selected}
                className="transaction-filter-option"
                data-selected={selected}
                disabled={disabled}
                onClick={() => onOrderChange(option)}
              >
                {t(`budgy.transactions.sort.${field}.${option}`)}
              </button>
            );
          })}
        </div>
      </Stack>
    </Stack>
  );
}
