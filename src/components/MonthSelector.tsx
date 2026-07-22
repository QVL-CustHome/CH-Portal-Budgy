import { useMemo } from "react";
import { MultiSelect, useTranslation, type ChMultiSelectOption } from "canopui";
import { formatMonthLabel } from "../lib/budget";

export interface MonthSelectorProps {
  months: string[];
  value: string;
  onChange: (month: string) => void;
}

export default function MonthSelector({
  months,
  value,
  onChange,
}: MonthSelectorProps) {
  const { t, locale } = useTranslation();

  const options = useMemo<ChMultiSelectOption[]>(
    () =>
      months.map((month) => ({
        value: month,
        label: formatMonthLabel(month, locale),
      })),
    [months, locale]
  );

  function handleChange(next: string[]) {
    const selected = next.length > 0 ? next[next.length - 1] : value;
    onChange(selected);
  }

  return (
    <MultiSelect
      label={t("budgy.dashboard.remaining.month")}
      options={options}
      value={[value]}
      onChange={handleChange}
    />
  );
}
