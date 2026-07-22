import { Stack, useTranslation } from "canopui";
import type { Category } from "../api/budgy";
import { toCategoryIcon } from "../lib/categories";
import CategoryBadge from "./CategoryBadge";

export interface TransactionCategoryTagProps {
  category: Category | null;
}

export default function TransactionCategoryTag({
  category,
}: TransactionCategoryTagProps) {
  const { t } = useTranslation();

  if (!category) {
    return (
      <span className="transaction-category-name" data-empty="true">
        {t("budgy.transactions.uncategorized")}
      </span>
    );
  }

  return (
    <Stack direction="row" gap="sm" alignItems="center">
      <CategoryBadge
        color={category.color}
        icon={toCategoryIcon(category.icon)}
        size="sm"
        title={category.name}
      />
      <span className="transaction-category-name">{category.name}</span>
    </Stack>
  );
}
