import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ChI18nProvider, ChThemeProvider } from "canopui";
import PrevisionnelBlock from "./PrevisionnelBlock";
import { defaultLocale, messages } from "../i18n/messages";
import { getForecast, type Forecast } from "../api/budgy";

vi.mock("../api/budgy", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/budgy")>();
  return {
    ...actual,
    getForecast: vi.fn(),
  };
});

const getForecastMock = vi.mocked(getForecast);

const fr = messages[defaultLocale]!;
const INSUFFICIENT_MESSAGE = "Pas encore assez de données pour établir un prévisionnel fiable";
const SOLDE_LABEL = fr["budgy.dashboard.forecast.soldeLabel"];
const REVENUS_LABEL = fr["budgy.dashboard.forecast.revenusLabel"];
const DEPENSES_LABEL = fr["budgy.dashboard.forecast.depensesLabel"];
const BUDGETS_LABEL = fr["budgy.dashboard.forecast.budgetsLabel"];
const CATEGORIES_TITLE = fr["budgy.dashboard.forecast.categoriesTitle"];

function normalize(text: string): string {
  return text.replace(/\s/g, "");
}

function exactText(expected: string) {
  return (content: string) => normalize(content) === normalize(expected);
}

function currentMonthString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function makeForecast(overrides: Partial<Forecast> = {}): Forecast {
  return {
    month: currentMonthString(),
    solde_previsionnel_cents: 90_000,
    revenus_recurrents_cents: 200_000,
    depenses_recurrentes_cents: 80_000,
    budgets_cents: 30_000,
    donnees_suffisantes: true,
    categories: [
      {
        category_id: "cat-salaire",
        category: "Salaire",
        revenus_recurrents_cents: 200_000,
        depenses_recurrentes_cents: 0,
        budget_cents: 0,
      },
      {
        category_id: "cat-loyer",
        category: "Loyer",
        revenus_recurrents_cents: 0,
        depenses_recurrentes_cents: 80_000,
        budget_cents: 0,
      },
      {
        category_id: "cat-courses",
        category: "Courses",
        revenus_recurrents_cents: 0,
        depenses_recurrentes_cents: 0,
        budget_cents: 30_000,
      },
    ],
    ...overrides,
  };
}

function renderBlock() {
  return render(
    <ChI18nProvider locale={defaultLocale} messages={messages}>
      <ChThemeProvider defaultMode="light">
        <MemoryRouter>
          <PrevisionnelBlock />
        </MemoryRouter>
      </ChThemeProvider>
    </ChI18nProvider>
  );
}

beforeEach(() => {
  getForecastMock.mockReset();
});

describe("CA-01 - Solde prévisionnel et ses composantes affichés", () => {
  it("affiche le solde prévisionnel renvoyé par l'API", async () => {
    getForecastMock.mockResolvedValue(
      makeForecast({ solde_previsionnel_cents: 90_000 })
    );

    renderBlock();

    expect(await screen.findByText(SOLDE_LABEL)).toBeInTheDocument();
    expect(screen.getByText(exactText("+900,00 €"))).toBeInTheDocument();
  });

  it("affiche les trois composantes revenus, dépenses et budgets", async () => {
    getForecastMock.mockResolvedValue(makeForecast());

    const { container } = renderBlock();

    await screen.findByText(REVENUS_LABEL);
    const breakdown = container.querySelector(
      ".previsionnel-breakdown"
    ) as HTMLElement;
    expect(breakdown).not.toBeNull();
    const zone = within(breakdown);

    expect(zone.getByText(DEPENSES_LABEL)).toBeInTheDocument();
    expect(zone.getByText(BUDGETS_LABEL)).toBeInTheDocument();
    expect(zone.getByText(exactText("+2 000,00 €"))).toBeInTheDocument();
    expect(zone.getByText(exactText("-800,00 €"))).toBeInTheDocument();
    expect(zone.getByText(exactText("-300,00 €"))).toBeInTheDocument();
  });
});

describe("CA-02 - Détail des montants prévus par catégorie affiché", () => {
  it("affiche la section de détail par catégorie", async () => {
    getForecastMock.mockResolvedValue(makeForecast());

    renderBlock();

    expect(await screen.findByText(CATEGORIES_TITLE)).toBeInTheDocument();
  });

  it("affiche chaque catégorie ayant des récurrents ou un budget", async () => {
    getForecastMock.mockResolvedValue(makeForecast());

    renderBlock();

    expect(await screen.findByText("Salaire")).toBeInTheDocument();
    expect(screen.getByText("Loyer")).toBeInTheDocument();
    expect(screen.getByText("Courses")).toBeInTheDocument();
  });

  it("liste une ligne par catégorie prévisionnelle", async () => {
    getForecastMock.mockResolvedValue(makeForecast());

    const { container } = renderBlock();

    await screen.findByText("Salaire");
    expect(
      container.querySelectorAll(".previsionnel-chart-row").length
    ).toBe(3);
  });
});

describe("CA-03 - Données insuffisantes", () => {
  it("affiche le message exact quand donnees_suffisantes est false", async () => {
    getForecastMock.mockResolvedValue(
      makeForecast({ donnees_suffisantes: false })
    );

    renderBlock();

    expect(await screen.findByText(INSUFFICIENT_MESSAGE)).toBeInTheDocument();
  });

  it("le libellé i18n correspond exactement au message imposé par l'AC", () => {
    expect(fr["budgy.dashboard.forecast.insufficient"]).toBe(
      INSUFFICIENT_MESSAGE
    );
  });

  it("n'affiche ni solde ni détail par catégorie en cas de données insuffisantes", async () => {
    getForecastMock.mockResolvedValue(
      makeForecast({ donnees_suffisantes: false })
    );

    renderBlock();

    await screen.findByText(INSUFFICIENT_MESSAGE);
    expect(screen.queryByText(SOLDE_LABEL)).not.toBeInTheDocument();
    expect(screen.queryByText(CATEGORIES_TITLE)).not.toBeInTheDocument();
  });
});
