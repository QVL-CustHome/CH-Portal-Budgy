import type {
  TransactionSortField,
  TransactionSortOrder,
  TransactionType,
} from "../api/budgy";

export type TransactionPeriod =
  | "all"
  | "this-month"
  | "last-30-days"
  | "last-3-months"
  | "this-year";

export const TRANSACTION_PERIODS: readonly TransactionPeriod[] = [
  "all",
  "this-month",
  "last-30-days",
  "last-3-months",
  "this-year",
];

export const TRANSACTION_TYPES: readonly TransactionType[] = [
  "credit",
  "debit",
];

export const TRANSACTION_SORT_FIELDS: readonly TransactionSortField[] = [
  "date",
  "amount",
];

export const TRANSACTION_SORT_ORDERS: readonly TransactionSortOrder[] = [
  "desc",
  "asc",
];

export interface PeriodRange {
  from?: string;
  to?: string;
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function periodRange(
  period: TransactionPeriod,
  now: Date = new Date()
): PeriodRange {
  if (period === "all") {
    return {};
  }
  const start = new Date(now);
  switch (period) {
    case "this-month":
      start.setDate(1);
      break;
    case "last-30-days":
      start.setDate(start.getDate() - 29);
      break;
    case "last-3-months":
      start.setMonth(start.getMonth() - 3);
      break;
    case "this-year":
      start.setMonth(0, 1);
      break;
  }
  return { from: toIsoDate(start), to: toIsoDate(now) };
}
