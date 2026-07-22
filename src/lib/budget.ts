import type { ChLocale } from "canopui";

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const AMOUNT_PATTERN = /^\d+([.,]\d{1,2})?$/;

export function currentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function parseBudgetAmountCents(raw: string): number | null {
  const normalized = raw.trim().replace(",", ".");
  if (!AMOUNT_PATTERN.test(normalized)) {
    return null;
  }
  const euros = Number(normalized);
  if (!Number.isFinite(euros) || euros < 0) {
    return null;
  }
  return Math.round(euros * 100);
}

export function centsToInput(cents: number): string {
  const euros = cents / 100;
  return Number.isInteger(euros) ? String(euros) : euros.toFixed(2);
}

export function formatBudgetAmount(cents: number, locale: ChLocale): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function formatMonthLabel(month: string, locale: ChLocale): string {
  if (!MONTH_PATTERN.test(month)) {
    return month;
  }
  const [year, monthIndex] = month.split("-").map(Number);
  const date = new Date(year, monthIndex - 1, 1);
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}
