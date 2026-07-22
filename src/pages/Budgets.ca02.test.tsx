import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ChI18nProvider, ChThemeProvider } from "canopui";
import { defaultLocale, messages } from "../i18n/messages";
import {
  definirBudget,
  listBudgets,
  listCategories,
  type Category,
} from "../api/budgy";
import Budgets from "./Budgets";

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
const SUBMIT_LABEL = fr["budgy.budgets.form.submit"];

const categorie: Category = {
  id: "cat-loyer",
  name: "Loyer",
  kind: "depense",
  color: "#123456",
  icon: "home",
};

function renderPage() {
  return render(
    <ChI18nProvider locale={defaultLocale} messages={messages}>
      <ChThemeProvider defaultMode="light">
        <MemoryRouter>
          <Budgets />
        </MemoryRouter>
      </ChThemeProvider>
    </ChI18nProvider>
  );
}

beforeEach(() => {
  listCategoriesMock.mockReset();
  listBudgetsMock.mockReset();
  definirBudgetMock.mockReset();
  listCategoriesMock.mockResolvedValue({ data: [categorie], total: 1 });
  listBudgetsMock.mockResolvedValue({ data: [], total: 0 });
});

describe("CA-02 - ecran budget avec un montant invalide", () => {
  it("affiche « Veuillez saisir un montant valide » quand le montant est negatif", async () => {
    renderPage();
    const montant = await screen.findByRole("spinbutton");

    fireEvent.change(montant, { target: { value: "-10" } });

    expect(await screen.findByText(INVALID_MESSAGE)).toBeInTheDocument();
  });

  it("n'envoie aucun budget tant que le montant reste invalide", async () => {
    renderPage();
    const montant = await screen.findByRole("spinbutton");

    fireEvent.change(montant, { target: { value: "-10" } });
    const submit = screen.getByRole("button", { name: SUBMIT_LABEL });
    fireEvent.click(submit);

    expect(definirBudgetMock).not.toHaveBeenCalled();
  });
});

describe("CA-02 ajuste - ecran budget avec un montant a zero", () => {
  it("n'affiche pas « Veuillez saisir un montant valide » quand le montant est zero", async () => {
    renderPage();
    const montant = await screen.findByRole("spinbutton");

    fireEvent.change(montant, { target: { value: "0" } });

    expect(screen.queryByText(INVALID_MESSAGE)).not.toBeInTheDocument();
  });
});
