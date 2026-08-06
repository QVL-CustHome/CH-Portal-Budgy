import { describe, expect, it } from "vitest";
import { buildExpenseSegments } from "./expenses";
import type { ExpenseCategoryLine } from "../api/budgy";

const undefinedLines = undefined as unknown as ExpenseCategoryLine[];
const undefinedTotal = undefined as unknown as number;

describe("buildExpenseSegments — robustesse aux réponses partielles", () => {
  it("retourne une liste vide quand les lignes sont absentes", () => {
    expect(buildExpenseSegments(undefinedLines, 10_000)).toEqual([]);
  });

  it("retourne une liste vide quand le total est absent", () => {
    expect(
      buildExpenseSegments(
        [{ category: "Courses", montant_cents: 5_000 }],
        undefinedTotal
      )
    ).toEqual([]);
  });

  it("retourne une liste vide quand tout est absent", () => {
    expect(buildExpenseSegments(undefinedLines, undefinedTotal)).toEqual([]);
  });
});
