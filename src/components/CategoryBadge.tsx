import { Icon, type ChIconName, type ChIconSize } from "canopui";
import { isLightCategoryColor } from "../lib/categories";

export interface CategoryBadgeProps {
  color: string;
  icon: ChIconName;
  size?: "md" | "lg";
  title?: string;
}

const ICON_SIZE: Record<NonNullable<CategoryBadgeProps["size"]>, ChIconSize> = {
  md: "md",
  lg: "lg",
};

export default function CategoryBadge({
  color,
  icon,
  size = "md",
  title,
}: CategoryBadgeProps) {
  return (
    <span
      className={`category-badge category-badge--${size}`}
      data-tone={isLightCategoryColor(color) ? "light" : "dark"}
      style={{ backgroundColor: color }}
    >
      <Icon
        name={icon}
        variant="solid"
        size={ICON_SIZE[size]}
        color="inherit"
        title={title}
      />
    </span>
  );
}
