import {
  SegmentedControl,
  Stack,
  useTranslation,
  type ChSegmentedControlOption,
} from "canopui";
import type { TransactionType } from "../api/budgy";
import { TRANSACTION_TYPES } from "../lib/transactions";
import FieldLabel from "./FieldLabel";

export interface TransactionTypeFilterProps {
  value: TransactionType | null;
  disabled?: boolean;
  onChange: (value: TransactionType | null) => void;
}

type TypeValue = TransactionType | "all";

const OPTIONS: readonly TypeValue[] = ["all", ...TRANSACTION_TYPES];

export default function TransactionTypeFilter({
  value,
  disabled,
  onChange,
}: TransactionTypeFilterProps) {
  const { t } = useTranslation();
  const current: TypeValue = value ?? "all";

  const options: ChSegmentedControlOption<TypeValue>[] = OPTIONS.map(
    (option) => ({
      value: option,
      label: t(`budgy.transactions.type.${option}`),
      disabled,
    })
  );

  return (
    <Stack gap="sm">
      <FieldLabel>{t("budgy.transactions.type.label")}</FieldLabel>
      <SegmentedControl
        options={options}
        value={current}
        onChange={(next) => onChange(next === "all" ? null : next)}
        ariaLabel={t("budgy.transactions.type.label")}
        size="small"
      />
    </Stack>
  );
}
