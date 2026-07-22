import { CardGrid } from "canopui";
import type { Budget, Category } from "../api/budgy";
import { resolveCategory } from "../lib/categories";
import AnimatedListItem from "./AnimatedListItem";
import MonthlyBudgetItem from "./MonthlyBudgetItem";

export interface MonthlyBudgetListProps {
  budgets: Budget[];
  categoriesById: Map<string, Category>;
}

export default function MonthlyBudgetList({
  budgets,
  categoriesById,
}: MonthlyBudgetListProps) {
  return (
    <CardGrid minItemWidth="20rem" gap="md">
      {budgets.map((budget, index) => (
        <AnimatedListItem key={budget.id} index={index}>
          <MonthlyBudgetItem
            budget={budget}
            category={resolveCategory(categoriesById, budget.category_id)}
          />
        </AnimatedListItem>
      ))}
    </CardGrid>
  );
}
