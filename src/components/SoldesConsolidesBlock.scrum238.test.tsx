import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ChI18nProvider, ChThemeProvider } from "canopui";
import SoldesConsolidesBlock from "./SoldesConsolidesBlock";
import { defaultLocale, messages } from "../i18n/messages";
import { getSoldesConsolides } from "../api/budgy";

vi.mock("../api/budgy", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/budgy")>();
  return {
    ...actual,
    getSoldesConsolides: vi.fn(),
  };
});

vi.mock("../hooks/useReloadOnRelay", () => ({
  useReloadComptesOnRelay: () => {},
}));

const getSoldesConsolidesMock = vi.mocked(getSoldesConsolides);

const fr = messages[defaultLocale]!;
const EMPTY_MESSAGE = fr["budgy.dashboard.balances.empty"];
const TOTAL_LABEL = fr["budgy.dashboard.balances.totalLabel"];
const UNAVAILABLE_MESSAGE =
  messages[defaultLocale]!["budgy.accounts.balanceUnavailable"];

function renderBlock() {
  return render(
    <ChI18nProvider locale={defaultLocale} messages={messages}>
      <ChThemeProvider defaultMode="light">
        <MemoryRouter>
          <SoldesConsolidesBlock />
        </MemoryRouter>
      </ChThemeProvider>
    </ChI18nProvider>
  );
}

function digitsAndCurrency(text: string): string {
  return text.replace(/\s/g, "");
}

beforeEach(() => {
  getSoldesConsolidesMock.mockReset();
});

describe("CA-01 - Solde consolidé affiché avec le solde de chaque compte", () => {
  it("affiche le solde total consolidé formaté en euros", async () => {
    getSoldesConsolidesMock.mockResolvedValue({
      total_cents: 20_000,
      accounts: [
        { id: "acc-1", iban_masked: "***0189", currency: "EUR", balance: 15_327 },
        { id: "acc-2", iban_masked: "***0129", currency: "EUR", balance: 4_673 },
      ],
    });

    renderBlock();

    expect(await screen.findByText(TOTAL_LABEL)).toBeInTheDocument();
    const total = await screen.findByText((content) =>
      digitsAndCurrency(content).includes("200,00€")
    );
    expect(total).toBeInTheDocument();
  });

  it("liste chaque compte avec son iban masqué et son solde formaté en euros", async () => {
    getSoldesConsolidesMock.mockResolvedValue({
      total_cents: 20_000,
      accounts: [
        { id: "acc-1", iban_masked: "***0189", currency: "EUR", balance: 15_327 },
        { id: "acc-2", iban_masked: "***0129", currency: "EUR", balance: 4_673 },
      ],
    });

    renderBlock();

    expect(await screen.findByText("***0189")).toBeInTheDocument();
    expect(await screen.findByText("***0129")).toBeInTheDocument();
    expect(
      await screen.findByText((content) =>
        digitsAndCurrency(content).includes("153,27€")
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText((content) =>
        digitsAndCurrency(content).includes("46,73€")
      )
    ).toBeInTheDocument();
  });

  it("n'affiche pas le message d'état vide quand des comptes existent", async () => {
    getSoldesConsolidesMock.mockResolvedValue({
      total_cents: 20_000,
      accounts: [
        { id: "acc-1", iban_masked: "***0189", currency: "EUR", balance: 20_000 },
      ],
    });

    renderBlock();

    await screen.findByText("***0189");
    expect(screen.queryByText(EMPTY_MESSAGE)).not.toBeInTheDocument();
  });
});

describe("CA-02 - Aucun compte connecté", () => {
  it("affiche le message exact « Connectez votre banque pour voir vos soldes. »", async () => {
    getSoldesConsolidesMock.mockResolvedValue({
      total_cents: 0,
      accounts: [],
    });

    renderBlock();

    const message = await screen.findByText(EMPTY_MESSAGE);
    expect(message).toBeInTheDocument();
    expect(message.textContent).toBe("Connectez votre banque pour voir vos soldes.");
  });

  it("n'affiche ni total ni solde par compte en l'absence de compte", async () => {
    getSoldesConsolidesMock.mockResolvedValue({
      total_cents: 0,
      accounts: [],
    });

    renderBlock();

    await screen.findByText(EMPTY_MESSAGE);
    expect(screen.queryByText(TOTAL_LABEL)).not.toBeInTheDocument();
  });
});

describe("CA-01 - Anti-régression NaN : un solde entier plat s'affiche en euros, jamais « NaN € »", () => {
  it("formate le solde de chaque compte en euros sans jamais rendre « NaN »", async () => {
    getSoldesConsolidesMock.mockResolvedValue({
      total_cents: 20_000,
      accounts: [
        { id: "acc-1", iban_masked: "***0189", currency: "EUR", balance: 15_327 },
        { id: "acc-2", iban_masked: "***0129", currency: "EUR", balance: 4_673 },
      ],
    });

    const { container } = renderBlock();

    expect(await screen.findByText("***0189")).toBeInTheDocument();
    expect(
      await screen.findByText((content) =>
        digitsAndCurrency(content).includes("153,27€")
      )
    ).toBeInTheDocument();
    expect(container.textContent).not.toContain("NaN");
  });
});

describe("CA-01 - Le solde 0 est une valeur valide, jamais « indisponible »", () => {
  it("affiche 0 € pour un compte à solde nul sans message d'indisponibilité", async () => {
    getSoldesConsolidesMock.mockResolvedValue({
      total_cents: 0,
      accounts: [
        { id: "acc-1", iban_masked: "***0189", currency: "EUR", balance: 0 },
      ],
    });

    renderBlock();

    expect(await screen.findByText("***0189")).toBeInTheDocument();
    expect(screen.queryByText(EMPTY_MESSAGE)).not.toBeInTheDocument();
    expect(screen.queryByText(UNAVAILABLE_MESSAGE)).not.toBeInTheDocument();
    expect(
      await screen.findAllByText((content) =>
        digitsAndCurrency(content).includes("0,00€")
      )
    ).not.toHaveLength(0);
  });
});
