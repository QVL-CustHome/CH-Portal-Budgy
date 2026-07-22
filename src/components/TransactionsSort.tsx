import {
  SegmentedControl,
  Stack,
  useTranslation,
  type ChSegmentedControlOption,
} from "canopui";
import type { TransactionSortField, TransactionSortOrder } from "../api/budgy";
import {
  TRANSACTION_SORT_FIELDS,
  TRANSACTION_SORT_ORDERS,
} from "../lib/transactions";
import FieldLabel from "./FieldLabel";

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

  const fieldOptions: ChSegmentedControlOption<TransactionSortField>[] =
    TRANSACTION_SORT_FIELDS.map((option) => ({
      value: option,
      label: t(`budgy.transactions.sort.field.${option}`),
      disabled,
    }));

  const orderOptions: ChSegmentedControlOption<TransactionSortOrder>[] =
    TRANSACTION_SORT_ORDERS.map((option) => ({
      value: option,
      label: t(`budgy.transactions.sort.${field}.${option}`),
      disabled,
    }));

  return (
    <Stack gap="sm">
      <FieldLabel>{t("budgy.transactions.sort.label")}</FieldLabel>
      <Stack direction="row" gap="md" wrap>
        <SegmentedControl
          options={fieldOptions}
          value={field}
          onChange={onFieldChange}
          ariaLabel={t("budgy.transactions.sort.fieldLabel")}
          size="small"
        />
        <SegmentedControl
          options={orderOptions}
          value={order}
          onChange={onOrderChange}
          ariaLabel={t("budgy.transactions.sort.orderLabel")}
          size="small"
        />
      </Stack>
    </Stack>
  );
}
