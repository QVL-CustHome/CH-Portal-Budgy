import { describe, expect, it } from "vitest";
import { buildExpenseSegments } from "./expenses";
import { buildForecastCategoryViews } from "./forecast";
import type { ExpenseCategoryLine } from "../api/budgy";
import type { ForecastCategory } from "../api/budgy";

const undefinedLines = undefined as unknown as ExpenseCategoryLine[];
const undefinedCategories = undefined as unknown as ForecastCategory[];
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

describe("buildForecastCategoryViews — robustesse aux réponses partielles", () => {
  it("retourne une liste vide quand les catégories sont absentes", () => {
    expect(buildForecastCategoryViews(undefinedCategories)).toEqual([]);
  });
});
