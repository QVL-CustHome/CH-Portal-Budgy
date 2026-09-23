import { palette, type CanopIconName } from "canopui";
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

export const CATEGORY_ICON_OPTIONS: readonly CanopIconName[] = [
  // Argent / finance
  "wallet",
  "card",
  "bank",
  "university",
  "invoice",
  "receipt",
  "briefcase",
  "barChart",
  "chartPie",
  "award",
  "diamond",
  "exchange",
  // Achats / alimentation
  "shoppingCart",
  "bag",
  "box",
  "gift",
  "present",
  "tag",
  "utensils",
  "coffee",
  // Transport / voyage
  "car",
  "plane",
  "globe",
  "navigation",
  "location",
  "mapLocation",
  "pin",
  // Maison / factures
  "home",
  "key",
  "lightbulb",
  "fire",
  "lightning",
  "umbrella",
  "cloud",
  "printer",
  // Santé
  "heartPulse",
  "heartbeat",
  "heart",
  "medkit",
  "flask",
  // Loisirs / hobbies
  "gamepad",
  "music",
  "headphone",
  "book",
  "bookOpen",
  "bookmark",
  "palette",
  "camera",
  "video",
  "star",
  "watch",
  "alarm",
  "clock",
  "timer",
  "sun",
  "moon",
  // Tech / communication
  "desktop",
  "mobilePhone",
  "phone",
  "mail",
  "send",
  "share",
  "chat",
  "comment",
  "notification",
  "contacts",
  "userPlus",
  // Documents / général
  "fileText",
  "file",
  "document",
  "folder",
  "image",
  "calendar",
  "user",
  "shield",
  "lock",
  "settings",
  "search",
  "info",
  "save",
  "download",
  "upload",
  "plusCircle",
  "apps",
  "more",
];

const BACK_ICON_TO_CH: Readonly<Record<string, CanopIconName>> = {
  briefcase: "briefcase",
  "plus-circle": "plusCircle",
  home: "home",
  "shopping-cart": "shoppingCart",
  car: "car",
  "gamepad-2": "gamepad",
  "heart-pulse": "heartPulse",
  utensils: "utensils",
  "file-text": "fileText",
  ellipsis: "more",
};

export const DEFAULT_CATEGORY_COLOR = CATEGORY_COLOR_OPTIONS[0];
export const DEFAULT_CATEGORY_ICON: CanopIconName = CATEGORY_ICON_OPTIONS[0];
export const DEFAULT_CATEGORY_KIND: CategoryKind = "depense";

const KNOWN_CH_ICONS: ReadonlySet<string> = new Set<string>([
  ...CATEGORY_ICON_OPTIONS,
  ...Object.values(BACK_ICON_TO_CH),
]);

export function isCanopIconName(value: string): value is CanopIconName {
  return KNOWN_CH_ICONS.has(value);
}

export function toCategoryIcon(value: string): CanopIconName {
  const mapped = BACK_ICON_TO_CH[value];
  if (mapped) {
    return mapped;
  }
  return isCanopIconName(value) ? value : DEFAULT_CATEGORY_ICON;
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
