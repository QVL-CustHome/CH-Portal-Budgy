import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ChI18nProvider, ChThemeProvider } from "canopui";
import ResteADepenserBlock from "./ResteADepenserBlock";
import { defaultLocale, messages } from "../i18n/messages";
import {
  getRemainingBudgets,
  type RemainingBudgetCategory,
} from "../api/budgy";

vi.mock("../api/budgy", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/budgy")>();
  return {
    ...actual,
    getRemainingBudgets: vi.fn(),
  };
});

const getRemainingBudgetsMock = vi.mocked(getRemainingBudgets);

const fr = messages[defaultLocale]!;
const EMPTY_MESSAGE = fr["budgy.dashboard.remaining.empty"];
const REMAINING_LABEL = fr["budgy.dashboard.remaining.remainingLabel"];

function currentMonthString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function previousMonthString(): string {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(month: string): string {
  const [year, monthIndex] = month.split("-").map(Number);
  return new Intl.DateTimeFormat(defaultLocale, {
    month: "long",
    year: "numeric",
  }).format(new Date(year, monthIndex - 1, 1));
}

function normalize(text: string): string {
  return text.replace(/\s/g, "");
}

function exactText(expected: string) {
  return (content: string) => normalize(content) === normalize(expected);
}

function makeCategory(
  overrides: Partial<RemainingBudgetCategory> = {}
): RemainingBudgetCategory {
  return {
    category_id: "cat-1",
    category_name: "Courses",
    kind: "depense",
    color: "#3366ff",
    icon: "cart",
    montant_prevu_cents: 40_000,
    depense_cents: 14_500,
    reste_cents: 25_500,
    depassement_cents: 0,
    depasse: false,
    ...overrides,
  };
}

function resolveWith(categories: RemainingBudgetCategory[]) {
  getRemainingBudgetsMock.mockResolvedValue({
    month: currentMonthString(),
    categories,
  });
}

function renderBlock() {
  return render(
    <ChI18nProvider locale={defaultLocale} messages={messages}>
      <ChThemeProvider defaultMode="light">
        <MemoryRouter>
          <ResteADepenserBlock />
        </MemoryRouter>
      </ChThemeProvider>
    </ChI18nProvider>
  );
}

beforeEach(() => {
  getRemainingBudgetsMock.mockReset();
});

describe("CA-01 - Reste à dépenser affiché et cohérent avec le montant renvoyé", () => {
  it("affiche le reste formaté en euros pour une catégorie budgétée avec dépenses", async () => {
    resolveWith([
      makeCategory({
        montant_prevu_cents: 40_000,
        depense_cents: 14_500,
        reste_cents: 25_500,
      }),
    ]);

    renderBlock();

    expect(await screen.findByText("Courses")).toBeInTheDocument();
    expect(screen.getByText(exactText("255,00 €"))).toBeInTheDocument();
  });

  it("affiche un reste égal au budget quand aucune dépense n'est rattachée", async () => {
    resolveWith([
      makeCategory({
        category_name: "Loisirs",
        montant_prevu_cents: 50_000,
        depense_cents: 0,
        reste_cents: 50_000,
      }),
    ]);

    renderBlock();

    expect(await screen.findByText("Loisirs")).toBeInTheDocument();
    expect(screen.getByText(exactText("500,00 €"))).toBeInTheDocument();
  });

  it("affiche un reste de 0,00 € quand les dépenses égalent le budget", async () => {
    resolveWith([
      makeCategory({
        category_name: "Transport",
        montant_prevu_cents: 30_000,
        depense_cents: 30_000,
        reste_cents: 0,
      }),
    ]);

    renderBlock();

    expect(await screen.findByText("Transport")).toBeInTheDocument();
    expect(screen.getAllByText(REMAINING_LABEL).length).toBeGreaterThan(0);
    expect(screen.getByText(exactText("0,00 €"))).toBeInTheDocument();
  });

  it("liste chaque catégorie budgétée avec son reste respectif", async () => {
    resolveWith([
      makeCategory({
        category_id: "cat-1",
        category_name: "Courses",
        montant_prevu_cents: 40_000,
        depense_cents: 14_500,
        reste_cents: 25_500,
      }),
      makeCategory({
        category_id: "cat-2",
        category_name: "Abonnements",
        montant_prevu_cents: 20_000,
        depense_cents: 8_000,
        reste_cents: 12_000,
      }),
    ]);

    renderBlock();

    expect(await screen.findByText("Courses")).toBeInTheDocument();
    expect(screen.getByText("Abonnements")).toBeInTheDocument();
    expect(screen.getByText(exactText("255,00 €"))).toBeInTheDocument();
    expect(screen.getByText(exactText("120,00 €"))).toBeInTheDocument();
  });
});

describe("CA-02 - Dépassement mis en évidence et montant dépassé affiché", () => {
  it("met en évidence visuellement la catégorie en dépassement et affiche le montant dépassé", async () => {
    resolveWith([
      makeCategory({
        category_name: "Courses",
        montant_prevu_cents: 30_000,
        depense_cents: 35_000,
        reste_cents: -5_000,
        depassement_cents: 5_000,
        depasse: true,
      }),
    ]);

    const { container } = renderBlock();

    expect(await screen.findByText("Courses")).toBeInTheDocument();
    expect(
      screen.getByText(exactText("Dépassé de 50,00 €"))
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-depasse="true"]')
    ).not.toBeNull();
  });

  it("n'applique pas la mise en évidence de dépassement à une catégorie conforme", async () => {
    resolveWith([
      makeCategory({
        category_name: "Loisirs",
        montant_prevu_cents: 40_000,
        depense_cents: 10_000,
        reste_cents: 30_000,
        depassement_cents: 0,
        depasse: false,
      }),
    ]);

    const { container } = renderBlock();

    expect(await screen.findByText("Loisirs")).toBeInTheDocument();
    expect(screen.queryByText(/Dépassé de/)).not.toBeInTheDocument();
    expect(container.querySelector('[data-depasse="true"]')).toBeNull();
  });

  it("isole la mise en évidence sur la seule catégorie en dépassement quand plusieurs coexistent", async () => {
    resolveWith([
      makeCategory({
        category_id: "cat-ok",
        category_name: "Conforme",
        montant_prevu_cents: 40_000,
        depense_cents: 10_000,
        reste_cents: 30_000,
        depassement_cents: 0,
        depasse: false,
      }),
      makeCategory({
        category_id: "cat-ko",
        category_name: "Depassee",
        montant_prevu_cents: 20_000,
        depense_cents: 27_500,
        reste_cents: -7_500,
        depassement_cents: 7_500,
        depasse: true,
      }),
    ]);

    const { container } = renderBlock();

    expect(await screen.findByText("Depassee")).toBeInTheDocument();
    expect(
      screen.getByText(exactText("Dépassé de 75,00 €"))
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll('[data-depasse="true"]').length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Dépassé de/).length
    ).toBe(1);
  });
});

describe("État vide - aucune catégorie budgétée", () => {
  it("affiche un message clair sans NaN ni plantage quand categories est vide", async () => {
    resolveWith([]);

    const { container } = renderBlock();

    const message = await screen.findByText(EMPTY_MESSAGE);
    expect(message).toBeInTheDocument();
    expect(container.textContent).not.toContain("NaN");
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});

describe("Sélection de mois", () => {
  it("charge le mois courant au premier rendu", async () => {
    resolveWith([makeCategory()]);

    renderBlock();

    await screen.findByText("Courses");
    expect(getRemainingBudgetsMock).toHaveBeenCalledWith(currentMonthString());
  });

  it("relance un appel avec le mois choisi lors du changement de mois", async () => {
    resolveWith([makeCategory()]);

    renderBlock();

    await screen.findByText("Courses");
    getRemainingBudgetsMock.mockClear();

    const user = userEvent.setup();
    await user.click(screen.getByRole("combobox"));
    const listbox = await screen.findByRole("listbox");
    await user.click(
      within(listbox).getByText(monthLabel(previousMonthString()))
    );

    await waitFor(() =>
      expect(getRemainingBudgetsMock).toHaveBeenCalledWith(
        previousMonthString()
      )
    );
  });
});
