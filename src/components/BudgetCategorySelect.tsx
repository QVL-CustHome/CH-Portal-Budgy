import { useMemo } from "react";
import { MultiSelect, useTranslation, type ChMultiSelectOption } from "canopui";
import type { Category } from "../api/budgy";

export interface BudgetCategorySelectProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
}

export default function BudgetCategorySelect({
  categories,
  selectedCategoryId,
  onSelect,
}: BudgetCategorySelectProps) {
  const { t } = useTranslation();

  const options = useMemo<ChMultiSelectOption[]>(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [categories]
  );

  const value = selectedCategoryId ? [selectedCategoryId] : [];

  function handleChange(next: string[]) {
    onSelect(next.length > 0 ? next[next.length - 1] : null);
  }

  return (
    <MultiSelect
      label={t("budgy.budgets.form.categoryLabel")}
      placeholder={t("budgy.budgets.form.categoryPlaceholder")}
      options={options}
      value={value}
      onChange={handleChange}
    />
  );
}
