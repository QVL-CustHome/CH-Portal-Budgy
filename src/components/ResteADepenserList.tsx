import { Stack } from "canopui";
import type { RemainingBudgetCategory } from "../api/budgy";
import ResteADepenserItem from "./ResteADepenserItem";

export interface ResteADepenserListProps {
  categories: RemainingBudgetCategory[];
}

export default function ResteADepenserList({
  categories,
}: ResteADepenserListProps) {
  return (
    <Stack gap="md">
      {categories.map((category, index) => (
        <div
          key={category.category_id}
          className="reste-list-item"
          style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
        >
          <ResteADepenserItem category={category} />
        </div>
      ))}
    </Stack>
  );
}
