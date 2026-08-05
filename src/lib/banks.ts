import type { Bank } from "../api/budgy";

/** Libellé générique unique regroupant les Crédit Agricole régionaux français. */
export const CREDIT_AGRICOLE_LABEL = "Crédit Agricole";

function estCreditAgricoleFr(bank: Bank): boolean {
  return bank.pays === "FR" && /cr[ée]dit\s+agricole/i.test(bank.nom);
}

/**
 * Généralise la liste des banques : les Crédit Agricole régionaux français (une
 * quarantaine de caisses distinctes qui redirigent toutes vers la même page CA
 * de sélection d'agence) sont fusionnés en une seule entrée « Crédit Agricole ».
 * On conserve l'id d'une caisse représentative — n'importe laquelle atteint le
 * sélecteur d'agence côté Crédit Agricole. Les autres banques (y compris un
 * éventuel Crédit Agricole hors FR) restent inchangées, dans leur ordre d'origine.
 */
export function generaliserBanques(banks: Bank[]): Bank[] {
  const result: Bank[] = [];
  let caAjoute = false;
  for (const bank of banks) {
    if (estCreditAgricoleFr(bank)) {
      if (!caAjoute) {
        result.push({ id: bank.id, nom: CREDIT_AGRICOLE_LABEL, pays: "FR" });
        caAjoute = true;
      }
      continue;
    }
    result.push(bank);
  }
  return result;
}
