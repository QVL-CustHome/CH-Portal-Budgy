import Typography from "@mui/material/Typography";
import { Card, Heading, Stack, useTranslation } from "canopui";
import type { Budget, Category } from "../api/budgy";
import { formatBudgetAmount } from "../lib/budget";
import { toCategoryIcon } from "../lib/categories";
import CategoryBadge from "./CategoryBadge";

export interface MonthlyBudgetItemProps {
  budget: Budget;
  category: Category | null;
}

export default function MonthlyBudgetItem({
  budget,
  category,
}: MonthlyBudgetItemProps) {
  const { t, locale } = useTranslation();
  const name = category?.name ?? t("budgy.budgets.unknownCategory");

  return (
    <Card elevation="sm" fill>
      <Stack direction="row" alignItems="center" gap="md">
        {category ? (
          <CategoryBadge
            color={category.color}
            icon={toCategoryIcon(category.icon)}
            size="lg"
          />
        ) : null}
        <Stack gap="xs" fill>
          <Heading level={3} size={5}>
            {name}
          </Heading>
        </Stack>
        <Typography
          component="span"
          color="primary.main"
          sx={{ fontSize: "1.125rem", fontWeight: 700, whiteSpace: "nowrap" }}
        >
          {formatBudgetAmount(budget.montant_cents, locale)}
        </Typography>
      </Stack>
    </Card>
  );
}
