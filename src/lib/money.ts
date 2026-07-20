import type { ChLocale } from "canopui";

interface FormatMoneyOptions {
  signDisplay?: boolean;
}

export function formatMoneyCents(
  amountCents: number,
  currency: string,
  locale: ChLocale,
  options: FormatMoneyOptions = {}
): string {
  // Une devise vide/invalide (ex. compte sans devise en Restricted Production)
  // ferait planter Intl.NumberFormat (RangeError) et blanchirait la page.
  // On retombe sur EUR, avec un dernier filet try/catch.
  const code = /^[A-Za-z]{3}$/.test(currency ?? "") ? currency : "EUR";
  const signDisplay = options.signDisplay ? "exceptZero" : "auto";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
      signDisplay,
    }).format(amountCents / 100);
  } catch {
    return new Intl.NumberFormat(locale, { signDisplay }).format(
      amountCents / 100
    );
  }
}
