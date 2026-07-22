import { CardGrid } from "canopui";
import type { Budget, Category } from "../api/budgy";
import { resolveCategory } from "../lib/categories";
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
        <div
          key={budget.id}
          className="budget-list-item"
          style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
        >
          <MonthlyBudgetItem
            budget={budget}
            category={resolveCategory(categoriesById, budget.category_id)}
          />
        </div>
      ))}
    </CardGrid>
  );
}
