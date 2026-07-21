import { palette, type ChIconName } from "canopui";
import type { Category, CategoryKind } from "../api/budgy";

export const CATEGORY_NAME_MIN = 1;
export const CATEGORY_NAME_MAX = 30;

export const CATEGORY_COLOR_OPTIONS: readonly string[] = [
  palette.primary.main,
  palette.primary.light,
  palette.secondary.main,
  palette.secondary.dark,
  palette.accent.main,
  palette.accent.dark,
  palette.success.main,
  palette.info.main,
  palette.info.dark,
  palette.warning.main,
  palette.error.main,
  palette.error.dark,
];

export const CATEGORY_ICON_OPTIONS: readonly ChIconName[] = [
  "home",
  "apps",
  "folder",
  "file",
  "image",
  "user",
  "mail",
  "shield",
  "save",
  "settings",
  "search",
  "sun",
  "moon",
  "download",
  "upload",
  "info",
];

export const DEFAULT_CATEGORY_COLOR = CATEGORY_COLOR_OPTIONS[0];
export const DEFAULT_CATEGORY_ICON: ChIconName = CATEGORY_ICON_OPTIONS[0];
export const DEFAULT_CATEGORY_KIND: CategoryKind = "depense";

export function isChIconName(value: string): value is ChIconName {
  return (CATEGORY_ICON_OPTIONS as readonly string[]).includes(value);
}

export function toCategoryIcon(value: string): ChIconName {
  return isChIconName(value) ? value : DEFAULT_CATEGORY_ICON;
}

export type CategoryNameError = "required" | "too-long";

export function validateCategoryName(name: string): CategoryNameError | null {
  const length = name.trim().length;
  if (length < CATEGORY_NAME_MIN) {
    return "required";
  }
  if (length > CATEGORY_NAME_MAX) {
    return "too-long";
  }
  return null;
}

export function indexCategoriesById(
  categories: readonly Category[]
): Map<string, Category> {
  return new Map(categories.map((category) => [category.id, category]));
}

export function resolveCategory(
  categoriesById: Map<string, Category>,
  categoryId: string | null
): Category | null {
  return categoryId ? (categoriesById.get(categoryId) ?? null) : null;
}

export function isLightCategoryColor(hex: string): boolean {
  const value = hex.replace("#", "");
  if (value.length !== 6) {
    return false;
  }
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance > 0.62;
}
