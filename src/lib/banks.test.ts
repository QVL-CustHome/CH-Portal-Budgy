import { describe, expect, it } from "vitest";
import { generaliserBanques, CREDIT_AGRICOLE_LABEL } from "./banks";
import type { Bank } from "../api/budgy";

function bank(nom: string, pays = "FR"): Bank {
  return { id: `${nom}|${pays}`, nom, pays };
}

describe("generaliserBanques", () => {
  it("fusionne les Crédit Agricole régionaux FR en une seule entrée", () => {
    const banks = [
      bank("Crédit Agricole de Normandie"),
      bank("Crédit Agricole de Centre France"),
      bank("Crédit Agricole Alpes Provence"),
      bank("Boursorama Banque"),
    ];

    const result = generaliserBanques(banks);

    const ca = result.filter((b) => b.nom === CREDIT_AGRICOLE_LABEL);
    expect(ca).toHaveLength(1);
    expect(ca[0]!.pays).toBe("FR");
    // id représentatif = première caisse rencontrée
    expect(ca[0]!.id).toBe("Crédit Agricole de Normandie|FR");
    expect(result).toHaveLength(2); // 1 CA généralisé + Boursorama
  });

  it("conserve l'ordre et les autres banques inchangées", () => {
    const banks = [
      bank("Boursorama Banque"),
      bank("Crédit Agricole de Normandie"),
      bank("Crédit Agricole du Morbihan"),
      bank("Fortuneo"),
    ];

    const result = generaliserBanques(banks);

    expect(result.map((b) => b.nom)).toEqual([
      "Boursorama Banque",
      CREDIT_AGRICOLE_LABEL,
      "Fortuneo",
    ]);
  });

  it("ne fusionne pas un Crédit Agricole hors France", () => {
    const banks = [
      bank("Credit Agricole", "PL"),
      bank("Crédit Agricole de Normandie", "FR"),
      bank("Crédit Agricole du Finistère", "FR"),
    ];

    const result = generaliserBanques(banks);

    expect(result).toHaveLength(2); // CA PL séparé + 1 CA FR généralisé
    expect(result.find((b) => b.pays === "PL")?.nom).toBe("Credit Agricole");
    expect(
      result.filter((b) => b.nom === CREDIT_AGRICOLE_LABEL)
    ).toHaveLength(1);
  });

  it("laisse une liste sans Crédit Agricole intacte", () => {
    const banks = [bank("Boursorama Banque"), bank("Fortuneo")];
    expect(generaliserBanques(banks)).toEqual(banks);
  });
});
