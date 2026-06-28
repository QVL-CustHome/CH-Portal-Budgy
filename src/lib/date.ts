import type { ChLocale } from "@custhome/ui";

export function formatDate(
  value: string | null | undefined,
  locale: ChLocale
): string {
  if (!value) {
    return "";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(parsed);
}
