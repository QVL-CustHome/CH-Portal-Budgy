import {
  SegmentedControl,
  Stack,
  useTranslation,
  type ChSegmentedControlOption,
} from "canopui";
import type { TransactionCategoryFilter as Filter } from "../api/budgy";
import FieldLabel from "./FieldLabel";

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

  const options: ChSegmentedControlOption<Filter>[] = OPTIONS.map((option) => ({
    value: option,
    label: t(`budgy.transactions.filter.${option}`),
    disabled,
  }));

  return (
    <Stack gap="sm">
      <FieldLabel>{t("budgy.transactions.filter.label")}</FieldLabel>
      <SegmentedControl
        options={options}
        value={value}
        onChange={onChange}
        ariaLabel={t("budgy.transactions.filter.label")}
        size="small"
      />
    </Stack>
  );
}
