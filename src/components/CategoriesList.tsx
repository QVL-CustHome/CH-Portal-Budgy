import { CardGrid } from "canopui";
import type { Category } from "../api/budgy";
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
        <div
          key={category.id}
          className="category-list-item"
          style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
        >
          <CategoryCard
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </CardGrid>
  );
}
