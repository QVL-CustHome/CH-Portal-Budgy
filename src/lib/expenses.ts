import type { ExpenseCategoryLine } from "../api/budgy";

export const EXPENSE_SEGMENT_COLORS: readonly string[] = [
  "var(--canop-palette-primary-main)",
  "var(--canop-palette-accent-main)",
  "var(--canop-palette-info-main)",
  "var(--canop-palette-success-main)",
  "var(--canop-palette-warning-main)",
  "var(--canop-palette-primary-light)",
  "var(--canop-palette-info-dark)",
  "var(--canop-palette-accent-dark)",
  "var(--canop-palette-secondary-dark)",
  "var(--canop-palette-error-main)",
];

export const UNCATEGORIZED_SEGMENT_COLOR = "var(--canop-palette-text-disabled)";

const UNCATEGORIZED_KEY = "__uncategorized__";

export interface ExpenseSegment {
  key: string;
  label: string | null;
  montantCents: number;
  fraction: number;
  startFraction: number;
  color: string;
}

export function buildExpenseSegments(
  lines: readonly ExpenseCategoryLine[],
  totalCents: number
): ExpenseSegment[] {
  if (!lines?.length || !(totalCents > 0)) {
    return [];
  }
  const sorted = lines
    .filter((line) => line.montant_cents > 0)
    .sort((a, b) => b.montant_cents - a.montant_cents);

  let cumulative = 0;
  return sorted.map((line, index) => {
    const fraction = line.montant_cents / totalCents;
    const startFraction = cumulative;
    cumulative += fraction;
    return {
      key: line.category ?? UNCATEGORIZED_KEY,
      label: line.category,
      montantCents: line.montant_cents,
      fraction,
      startFraction,
      color:
        line.category === null
          ? UNCATEGORIZED_SEGMENT_COLOR
          : EXPENSE_SEGMENT_COLORS[index % EXPENSE_SEGMENT_COLORS.length],
    };
  });
}
