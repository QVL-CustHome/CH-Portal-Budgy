import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CanopI18nProvider, CanopThemeProvider } from "canopui";
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
const SOLDE_ACTUEL_LABEL = fr["budgy.dashboard.forecast.soldeActuelLabel"];

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
    // 1 500 en poche, 2 000 encore attendus, 800 encore a sortir.
    solde_previsionnel_cents: 270_000,
    solde_actuel_cents: 150_000,
    revenus_restants_cents: 200_000,
    depenses_restantes_cents: 80_000,
    donnees_suffisantes: true,
    categories: [
      {
        category_id: "cat-salaire",
        category: "Salaire",
        prevu_cents: 200_000,
        realise_cents: 0,
        restant_cents: 200_000,
      },
      {
        category_id: "cat-loyer",
        category: "Loyer",
        prevu_cents: 80_000,
        realise_cents: 0,
        restant_cents: 80_000,
      },
      {
        category_id: "cat-courses",
        category: "Courses",
        prevu_cents: 30_000,
        realise_cents: 30_000,
        restant_cents: 0,
      },
    ],
    ...overrides,
  };
}

function renderBlock() {
  return render(
    <CanopI18nProvider locale={defaultLocale} messages={messages}>
      <CanopThemeProvider defaultMode="light">
        <MemoryRouter>
          <PrevisionnelBlock />
        </MemoryRouter>
      </CanopThemeProvider>
    </CanopI18nProvider>
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

  it("affiche le solde du jour puis ce qui reste à venir", async () => {
    getForecastMock.mockResolvedValue(makeForecast());

    const { container } = renderBlock();

    await screen.findByText(REVENUS_LABEL);
    const breakdown = container.querySelector(
      ".previsionnel-breakdown"
    ) as HTMLElement;
    expect(breakdown).not.toBeNull();
    const zone = within(breakdown);

    expect(zone.getByText(SOLDE_ACTUEL_LABEL)).toBeInTheDocument();
    expect(zone.getByText(DEPENSES_LABEL)).toBeInTheDocument();
    // Le solde de départ, puis ce qui doit encore entrer et sortir.
    expect(zone.getByText(exactText("+1 500,00 €"))).toBeInTheDocument();
    expect(zone.getByText(exactText("+2 000,00 €"))).toBeInTheDocument();
    expect(zone.getByText(exactText("-800,00 €"))).toBeInTheDocument();
  });

  it("n'affiche ni ligne budgets ni détail par catégorie", async () => {
    getForecastMock.mockResolvedValue(makeForecast());

    const { container } = renderBlock();

    await screen.findByText(REVENUS_LABEL);
    expect(screen.queryByText("Budgets")).not.toBeInTheDocument();
    expect(screen.queryByText("Salaire")).not.toBeInTheDocument();
    expect(screen.queryByText("Loyer")).not.toBeInTheDocument();
    expect(
      container.querySelectorAll(".previsionnel-chart-row").length
    ).toBe(0);
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

  it("n'affiche pas le solde en cas de données insuffisantes", async () => {
    getForecastMock.mockResolvedValue(
      makeForecast({ donnees_suffisantes: false })
    );

    renderBlock();

    await screen.findByText(INSUFFICIENT_MESSAGE);
    expect(screen.queryByText(SOLDE_LABEL)).not.toBeInTheDocument();
    expect(screen.queryByText(REVENUS_LABEL)).not.toBeInTheDocument();
  });
});
