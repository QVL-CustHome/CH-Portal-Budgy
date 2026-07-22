import { DescriptionList, useTranslation, type ChDescriptionItem } from "canopui";
import type { ConsolidatedAccount } from "../api/budgy";
import { formatMoneyCents } from "../lib/money";

export interface SoldesParCompteListProps {
  comptes: ConsolidatedAccount[];
}

export default function SoldesParCompteList({
  comptes,
}: SoldesParCompteListProps) {
  const { locale } = useTranslation();

  const items: ChDescriptionItem[] = comptes.map((compte) => ({
    label: compte.iban_masked,
    value: formatMoneyCents(compte.balance, compte.currency, locale),
  }));

  return <DescriptionList items={items} />;
}
