import { Stack } from "canopui";
import type { RemainingBudgetCategory } from "../api/budgy";
import AnimatedListItem from "./AnimatedListItem";
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
        <AnimatedListItem key={category.category_id} index={index}>
          <ResteADepenserItem category={category} />
        </AnimatedListItem>
      ))}
    </Stack>
  );
}
