import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { ChI18nProvider, ChThemeProvider } from "canopui";
import { defaultLocale, messages } from "../i18n/messages";
import {
  definirBudget,
  listBudgets,
  listCategories,
  type Category,
} from "../api/budgy";
import { useMonthlyBudget } from "./useMonthlyBudget";

vi.mock("../api/budgy", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/budgy")>();
  return {
    ...actual,
    listCategories: vi.fn(),
    listBudgets: vi.fn(),
    definirBudget: vi.fn(),
  };
});

const listCategoriesMock = vi.mocked(listCategories);
const listBudgetsMock = vi.mocked(listBudgets);
const definirBudgetMock = vi.mocked(definirBudget);

const fr = messages[defaultLocale]!;
const INVALID_MESSAGE = fr["budgy.budgets.form.amountInvalid"];

const categorie: Category = {
  id: "cat-loyer",
  name: "Loyer",
  kind: "depense",
  color: "#123456",
  icon: "home",
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <ChI18nProvider locale={defaultLocale} messages={messages}>
    <ChThemeProvider defaultMode="light">{children}</ChThemeProvider>
  </ChI18nProvider>
);

async function renderPret() {
  const rendu = renderHook(() => useMonthlyBudget(), { wrapper });
  await waitFor(() => expect(rendu.result.current.loading).toBe(false));
  return rendu;
}

beforeEach(() => {
  listCategoriesMock.mockReset();
  listBudgetsMock.mockReset();
  definirBudgetMock.mockReset();
  listCategoriesMock.mockResolvedValue({ data: [categorie], total: 1 });
  listBudgetsMock.mockResolvedValue({ data: [], total: 0 });
});

describe("CA-02 - montant invalide", () => {
  it("expose le message « Veuillez saisir un montant valide » pour un montant negatif", async () => {
    const { result } = await renderPret();

    act(() => {
      result.current.selectCategory(categorie.id);
      result.current.changeAmount("-10");
    });

    expect(result.current.amountError).toBe(INVALID_MESSAGE);
    expect(result.current.canSubmit).toBe(false);
  });

  it("expose le message pour un montant non numerique", async () => {
    const { result } = await renderPret();

    act(() => {
      result.current.selectCategory(categorie.id);
      result.current.changeAmount("abc");
    });

    expect(result.current.amountError).toBe(INVALID_MESSAGE);
    expect(result.current.canSubmit).toBe(false);
  });

  it("n'envoie pas le budget quand le montant est negatif malgre une categorie choisie", async () => {
    const { result } = await renderPret();

    act(() => {
      result.current.selectCategory(categorie.id);
      result.current.changeAmount("-10");
    });
    await act(async () => {
      await result.current.submit();
    });

    expect(definirBudgetMock).not.toHaveBeenCalled();
  });

  it("n'envoie pas le budget quand le montant est non numerique", async () => {
    const { result } = await renderPret();

    act(() => {
      result.current.selectCategory(categorie.id);
      result.current.changeAmount("abc");
    });
    await act(async () => {
      await result.current.submit();
    });

    expect(definirBudgetMock).not.toHaveBeenCalled();
  });
});

describe("CA-02 ajuste - montant zero autorise", () => {
  it("n'expose aucun message d'erreur quand le montant saisi est zero", async () => {
    const { result } = await renderPret();

    act(() => {
      result.current.selectCategory(categorie.id);
      result.current.changeAmount("0");
    });

    expect(result.current.amountError).toBeFalsy();
    expect(result.current.canSubmit).toBe(true);
  });

  it("envoie le budget avec un montant_cents a 0 quand le montant est zero", async () => {
    definirBudgetMock.mockResolvedValue({
      id: "b-zero",
      category_id: categorie.id,
      montant_cents: 0,
      mois: "2026-07",
    });
    const { result } = await renderPret();

    act(() => {
      result.current.selectCategory(categorie.id);
      result.current.changeAmount("0");
    });
    await act(async () => {
      await result.current.submit();
    });

    expect(definirBudgetMock).toHaveBeenCalledTimes(1);
    expect(definirBudgetMock).toHaveBeenCalledWith(
      expect.objectContaining({
        category_id: categorie.id,
        montant_cents: 0,
      })
    );
  });
});

describe("CA-01 - montant valide envoye en centimes", () => {
  it("envoie le budget avec le montant converti en centimes entiers", async () => {
    definirBudgetMock.mockResolvedValue({
      id: "b-1",
      category_id: categorie.id,
      montant_cents: 30000,
      mois: "2026-07",
    });
    const { result } = await renderPret();

    act(() => {
      result.current.selectCategory(categorie.id);
      result.current.changeAmount("300");
    });
    expect(result.current.canSubmit).toBe(true);
    await act(async () => {
      await result.current.submit();
    });

    expect(definirBudgetMock).toHaveBeenCalledTimes(1);
    expect(definirBudgetMock).toHaveBeenCalledWith(
      expect.objectContaining({
        category_id: categorie.id,
        montant_cents: 30000,
      })
    );
  });
});
