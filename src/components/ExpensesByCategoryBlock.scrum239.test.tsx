import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ChI18nProvider, ChThemeProvider } from "canopui";
import ExpensesByCategoryBlock from "./ExpensesByCategoryBlock";
import { defaultLocale, messages } from "../i18n/messages";
import { getExpensesByCategory } from "../api/budgy";

vi.mock("../api/budgy", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/budgy")>();
  return {
    ...actual,
    getExpensesByCategory: vi.fn(),
  };
});

const getExpensesByCategoryMock = vi.mocked(getExpensesByCategory);

const fr = messages[defaultLocale]!;
const TITLE = fr["budgy.dashboard.expenses.title"];
const TOTAL_CAPTION = fr["budgy.dashboard.expenses.totalCaption"];
const CHART_ARIA = fr["budgy.dashboard.expenses.chartAria"];
const EMPTY_MESSAGE = fr["budgy.dashboard.expenses.empty"];
const UNCATEGORIZED_LABEL = fr["budgy.dashboard.expenses.uncategorized"];

function ym(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

const now = new Date();
const CURRENT_MONTH = ym(now);

function digitsAndCurrency(text: string): string {
  return text.replace(/\s/g, "");
}

function renderBlock() {
  return render(
    <ChI18nProvider locale={defaultLocale} messages={messages}>
      <ChThemeProvider defaultMode="light">
        <MemoryRouter>
          <ExpensesByCategoryBlock />
        </MemoryRouter>
      </ChThemeProvider>
    </ChI18nProvider>
  );
}

function donutSegments(container: HTMLElement): NodeListOf<Element> {
  return container.querySelectorAll("svg g circle");
}

function segmentFillRatio(segment: Element): number {
  const [dashLength] = (segment.getAttribute("stroke-dasharray") ?? "")
    .split(" ")
    .map(Number);
  return dashLength / 100;
}

beforeEach(() => {
  getExpensesByCategoryMock.mockReset();
});

describe("CA-01 - Graphique de répartition des dépenses par catégorie + total du mois", () => {
  it("rend un graphique de répartition et affiche le montant total du mois formaté en euros", async () => {
    getExpensesByCategoryMock.mockResolvedValue({
      total_cents: 10_000,
      lignes: [
        { category: "Courses", montant_cents: 6_000 },
        { category: "Transport", montant_cents: 4_000 },
      ],
    });

    const { container } = renderBlock();

    expect(await screen.findByRole("img", { name: CHART_ARIA })).toBeInTheDocument();
    expect(screen.getByText(TOTAL_CAPTION)).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        digitsAndCurrency(content).includes("100,00€")
      )
    ).toBeInTheDocument();
    expect(container.textContent).not.toContain("NaN");
  });

  it("représente chaque catégorie par un segment dont la proportion reflète son montant", async () => {
    getExpensesByCategoryMock.mockResolvedValue({
      total_cents: 10_000,
      lignes: [
        { category: "Courses", montant_cents: 6_000 },
        { category: "Transport", montant_cents: 4_000 },
      ],
    });

    const { container } = renderBlock();

    await screen.findByRole("img", { name: CHART_ARIA });
    const segments = donutSegments(container);
    expect(segments).toHaveLength(2);
    expect(segmentFillRatio(segments[0])).toBeCloseTo(0.6, 2);
    expect(segmentFillRatio(segments[1])).toBeCloseTo(0.4, 2);
  });

  it("détaille chaque catégorie avec son montant en euros et sa part en pourcentage", async () => {
    getExpensesByCategoryMock.mockResolvedValue({
      total_cents: 10_000,
      lignes: [
        { category: "Courses", montant_cents: 6_000 },
        { category: "Transport", montant_cents: 4_000 },
      ],
    });

    renderBlock();

    expect(await screen.findByText("Courses")).toBeInTheDocument();
    expect(screen.getByText("Transport")).toBeInTheDocument();
    expect(
      screen.getAllByText((content) => digitsAndCurrency(content).includes("60,00€"))
    ).not.toHaveLength(0);
    expect(
      screen.getAllByText((content) => digitsAndCurrency(content).includes("40,00€"))
    ).not.toHaveLength(0);
    expect(
      screen.getAllByText((content) => digitsAndCurrency(content).includes("60%"))
    ).not.toHaveLength(0);
    expect(
      screen.getAllByText((content) => digitsAndCurrency(content).includes("40%"))
    ).not.toHaveLength(0);
  });

  it("représente une ligne sans catégorie (category null) par le libellé « Sans catégorie »", async () => {
    getExpensesByCategoryMock.mockResolvedValue({
      total_cents: 10_000,
      lignes: [
        { category: "Courses", montant_cents: 6_000 },
        { category: null, montant_cents: 4_000 },
      ],
    });

    renderBlock();

    expect(await screen.findByText("Courses")).toBeInTheDocument();
    expect(screen.getByText(UNCATEGORIZED_LABEL)).toBeInTheDocument();
  });
});

describe("CA-01 - Cas limite : aucune dépense sur le mois → état vide propre", () => {
  it("affiche un état vide explicite, sans graphique, sans NaN, sans montant total", async () => {
    getExpensesByCategoryMock.mockResolvedValue({
      total_cents: 0,
      lignes: [],
    });

    const { container } = renderBlock();

    expect(await screen.findByText(EMPTY_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: CHART_ARIA })).not.toBeInTheDocument();
    expect(screen.queryByText(TOTAL_CAPTION)).not.toBeInTheDocument();
    expect(donutSegments(container)).toHaveLength(0);
    expect(container.textContent).not.toContain("NaN");
  });
});

describe("Chargement du mois courant", () => {
  it("charge les dépenses du mois courant à l'ouverture", async () => {
    getExpensesByCategoryMock.mockResolvedValue({
      total_cents: 10_000,
      lignes: [{ category: "Courses", montant_cents: 10_000 }],
    });

    renderBlock();

    expect(await screen.findByText("Courses")).toBeInTheDocument();
    expect(getExpensesByCategoryMock).toHaveBeenCalledWith(CURRENT_MONTH);
  });
});

describe("CA-01 / CA-02 - En-tête du bloc", () => {
  it("affiche le titre « Dépenses par catégorie »", async () => {
    getExpensesByCategoryMock.mockResolvedValue({
      total_cents: 10_000,
      lignes: [{ category: "Courses", montant_cents: 10_000 }],
    });

    renderBlock();

    expect(await screen.findByText(TITLE)).toBeInTheDocument();
  });
});
