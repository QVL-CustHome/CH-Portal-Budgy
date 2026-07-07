import { CardGrid } from "canopui";
import type { Account } from "../api/budgy";
import CompteCard from "./CompteCard";

export interface ComptesListProps {
  comptes: Account[];
}

export default function ComptesList({ comptes }: ComptesListProps) {
  return (
    <CardGrid minItemWidth="20rem" gap="md">
      {comptes.map((account) => (
        <CompteCard key={account.id} account={account} />
      ))}
    </CardGrid>
  );
}
