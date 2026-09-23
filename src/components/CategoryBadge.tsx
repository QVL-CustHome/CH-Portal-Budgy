import Box from "@mui/material/Box";
import { Icon, type CanopIconName, type CanopIconSize } from "canopui";
import { isLightCategoryColor } from "../lib/categories";

export interface CategoryBadgeProps {
  color: string;
  icon: CanopIconName;
  size?: "sm" | "md" | "lg";
  title?: string;
}

const ICON_SIZE: Record<NonNullable<CategoryBadgeProps["size"]>, CanopIconSize> = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

const BADGE_SIZE: Record<NonNullable<CategoryBadgeProps["size"]>, string> = {
  sm: "1.75rem",
  md: "2.5rem",
  lg: "3rem",
};

const BADGE_RADIUS: Record<NonNullable<CategoryBadgeProps["size"]>, string> = {
  sm: "var(--canop-radius-sm)",
  md: "var(--canop-radius-md)",
  lg: "var(--canop-radius-md)",
};

export default function CategoryBadge({
  color,
  icon,
  size = "md",
  title,
}: CategoryBadgeProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "none",
        color: isLightCategoryColor(color)
          ? "text.primary"
          : "background.default",
        width: BADGE_SIZE[size],
        height: BADGE_SIZE[size],
        borderRadius: BADGE_RADIUS[size],
        backgroundColor: color,
      }}
    >
      <Icon
        name={icon}
        variant="solid"
        size={ICON_SIZE[size]}
        color="inherit"
        title={title}
      />
    </Box>
  );
}
