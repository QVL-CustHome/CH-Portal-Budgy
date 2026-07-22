import type { ExpenseCategoryLine } from "../api/budgy";

export const EXPENSE_SEGMENT_COLORS: readonly string[] = [
  "var(--ch-palette-primary-main)",
  "var(--ch-palette-accent-main)",
  "var(--ch-palette-info-main)",
  "var(--ch-palette-success-main)",
  "var(--ch-palette-warning-main)",
  "var(--ch-palette-primary-light)",
  "var(--ch-palette-info-dark)",
  "var(--ch-palette-accent-dark)",
  "var(--ch-palette-secondary-dark)",
  "var(--ch-palette-error-main)",
];

export const UNCATEGORIZED_SEGMENT_COLOR = "var(--ch-palette-text-disabled)";

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
  if (totalCents <= 0) {
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
