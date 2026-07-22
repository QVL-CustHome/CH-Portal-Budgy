import { describe, expect, it } from "vitest";
import { centsToInput, parseBudgetAmountCents } from "./budget";

describe("parseBudgetAmountCents - conversion euros vers centimes", () => {
  it("convertit un montant a virgule en centimes entiers", () => {
    expect(parseBudgetAmountCents("42,50")).toBe(4250);
  });

  it("convertit un montant a point en centimes entiers", () => {
    expect(parseBudgetAmountCents("42.50")).toBe(4250);
  });

  it("convertit un entier d'euros en centimes", () => {
    expect(parseBudgetAmountCents("300")).toBe(30000);
  });

  it("convertit le plus petit montant significatif", () => {
    expect(parseBudgetAmountCents("0,01")).toBe(1);
  });

  it("ignore les espaces autour du montant", () => {
    expect(parseBudgetAmountCents("  12  ")).toBe(1200);
  });

  it("arrondit correctement une seule decimale", () => {
    expect(parseBudgetAmountCents("10,1")).toBe(1010);
  });
});

describe("parseBudgetAmountCents - montant zero autorise (CA-02 ajuste)", () => {
  it("accepte un zero entier et renvoie 0 centime", () => {
    expect(parseBudgetAmountCents("0")).toBe(0);
  });

  it("accepte un zero decimal a point et renvoie 0 centime", () => {
    expect(parseBudgetAmountCents("0.00")).toBe(0);
  });

  it("accepte un zero decimal a virgule et renvoie 0 centime", () => {
    expect(parseBudgetAmountCents("0,00")).toBe(0);
  });

  it("ne renvoie jamais null pour un montant nul", () => {
    expect(parseBudgetAmountCents("0")).not.toBeNull();
  });
});

describe("parseBudgetAmountCents - montant invalide (CA-02)", () => {
  it("rejette un montant negatif", () => {
    expect(parseBudgetAmountCents("-10")).toBeNull();
  });

  it("rejette un montant non numerique", () => {
    expect(parseBudgetAmountCents("abc")).toBeNull();
  });

  it("rejette une chaine vide", () => {
    expect(parseBudgetAmountCents("")).toBeNull();
  });

  it("rejette un montant a plus de deux decimales", () => {
    expect(parseBudgetAmountCents("12,345")).toBeNull();
  });

  it("rejette un montant partiellement numerique", () => {
    expect(parseBudgetAmountCents("12abc")).toBeNull();
  });
});

describe("centsToInput - conversion centimes vers champ euros", () => {
  it("affiche un entier d'euros sans decimale superflue", () => {
    expect(centsToInput(30000)).toBe("300");
  });

  it("affiche deux decimales pour un montant fractionnaire", () => {
    expect(centsToInput(4250)).toBe("42.50");
  });

  it("preserve le plus petit centime", () => {
    expect(centsToInput(1)).toBe("0.01");
  });

  it("boucle avec parseBudgetAmountCents sur un montant a virgule", () => {
    const cents = parseBudgetAmountCents("42,50");
    expect(cents).not.toBeNull();
    expect(parseBudgetAmountCents(centsToInput(cents as number))).toBe(4250);
  });
});
