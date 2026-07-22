import { CardGrid } from "canopui";
import type { Category } from "../api/budgy";
import AnimatedListItem from "./AnimatedListItem";
import CategoryCard from "./CategoryCard";

export interface CategoriesListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => Promise<void>;
}

export default function CategoriesList({
  categories,
  onEdit,
  onDelete,
}: CategoriesListProps) {
  return (
    <CardGrid minItemWidth="20rem" gap="md">
      {categories.map((category, index) => (
        <AnimatedListItem key={category.id} index={index}>
          <CategoryCard
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </AnimatedListItem>
      ))}
    </CardGrid>
  );
}
