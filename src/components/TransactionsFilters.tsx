import { useMemo } from "react";
import {
  MultiSelect,
  Stack,
  useTranslation,
  type ChMultiSelectOption,
} from "canopui";
import type { Account, Category, TransactionType } from "../api/budgy";
import {
  TRANSACTION_PERIODS,
  type TransactionPeriod,
} from "../lib/transactions";
import TransactionTypeFilter from "./TransactionTypeFilter";

export interface TransactionsFiltersProps {
  accounts: Account[];
  categories: Category[];
  accountId: string | null;
  categoryId: string | null;
  period: TransactionPeriod;
  type: TransactionType | null;
  disabled?: boolean;
  onAccountChange: (value: string | null) => void;
  onCategoryChange: (value: string | null) => void;
  onPeriodChange: (value: TransactionPeriod) => void;
  onTypeChange: (value: TransactionType | null) => void;
}

function lastOrNull(values: string[]): string | null {
  return values.length > 0 ? values[values.length - 1] : null;
}

function toPeriod(value: string | null): TransactionPeriod {
  return TRANSACTION_PERIODS.find((period) => period === value) ?? "all";
}

export default function TransactionsFilters({
  accounts,
  categories,
  accountId,
  categoryId,
  period,
  type,
  disabled,
  onAccountChange,
  onCategoryChange,
  onPeriodChange,
  onTypeChange,
}: TransactionsFiltersProps) {
  const { t } = useTranslation();

  const accountOptions = useMemo<ChMultiSelectOption[]>(
    () =>
      accounts.map((account) => ({
        value: account.id,
        label: account.iban_masked,
      })),
    [accounts]
  );

  const categoryOptions = useMemo<ChMultiSelectOption[]>(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [categories]
  );

  const periodOptions = useMemo<ChMultiSelectOption[]>(
    () =>
      TRANSACTION_PERIODS.map((value) => ({
        value,
        label: t(`budgy.transactions.period.${value}`),
      })),
    [t]
  );

  return (
    <Stack direction="row" gap="md" wrap alignItems="end">
      <MultiSelect
        label={t("budgy.transactions.filters.account")}
        placeholder={t("budgy.transactions.filters.accountAll")}
        options={accountOptions}
        value={accountId ? [accountId] : []}
        onChange={(next) => onAccountChange(lastOrNull(next))}
      />
      <MultiSelect
        label={t("budgy.transactions.filters.category")}
        placeholder={t("budgy.transactions.filters.categoryAll")}
        options={categoryOptions}
        value={categoryId ? [categoryId] : []}
        onChange={(next) => onCategoryChange(lastOrNull(next))}
      />
      <MultiSelect
        label={t("budgy.transactions.filters.period")}
        options={periodOptions}
        value={[period]}
        onChange={(next) => onPeriodChange(toPeriod(lastOrNull(next)))}
      />
      <TransactionTypeFilter
        value={type}
        disabled={disabled}
        onChange={onTypeChange}
      />
    </Stack>
  );
}
