import type { ChLocale } from "@custhome/ui";

interface FormatMoneyOptions {
  signDisplay?: boolean;
}

export function formatMoneyCents(
  amountCents: number,
  currency: string,
  locale: ChLocale,
  options: FormatMoneyOptions = {}
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    signDisplay: options.signDisplay ? "exceptZero" : "auto",
  });
  return formatter.format(amountCents / 100);
}
