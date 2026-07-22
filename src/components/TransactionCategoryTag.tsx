import Typography from "@mui/material/Typography";
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
      <Typography component="span" color="text.secondary" noWrap>
        {t("budgy.transactions.uncategorized")}
      </Typography>
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
      <Typography component="span" color="text.primary" noWrap>
        {category.name}
      </Typography>
    </Stack>
  );
}
