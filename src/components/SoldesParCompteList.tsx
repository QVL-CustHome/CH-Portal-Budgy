import { DescriptionList, useTranslation, type CanopDescriptionItem } from "canopui";
import type { ConsolidatedAccount } from "../api/budgy";
import { formatMoneyCents } from "../lib/money";

export interface SoldesParCompteListProps {
  comptes: ConsolidatedAccount[];
}

export default function SoldesParCompteList({
  comptes,
}: SoldesParCompteListProps) {
  const { t, locale } = useTranslation();

  const items: CanopDescriptionItem[] = comptes.map((compte) => {
    const solde = formatMoneyCents(compte.balance, compte.currency, locale);
    const value =
      compte.solde_a_venir_cents != null
        ? `${solde} · ${t("budgy.dashboard.balances.upcomingAccountLabel")} ${formatMoneyCents(
            compte.solde_a_venir_cents,
            compte.currency,
            locale
          )}`
        : solde;
    return { label: compte.iban_masked, value };
  });

  return <DescriptionList items={items} />;
}
