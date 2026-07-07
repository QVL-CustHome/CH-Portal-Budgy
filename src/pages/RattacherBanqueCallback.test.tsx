import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ChI18nProvider, ChThemeProvider } from "canopui";
import RattacherBanqueCallback from "./RattacherBanqueCallback";
import { defaultLocale, messages } from "../i18n/messages";
import { completerConsentement } from "../api/budgy";

vi.mock("../api/budgy", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/budgy")>();
  return {
    ...actual,
    completerConsentement: vi.fn(),
  };
});

const completerConsentementMock = vi.mocked(completerConsentement);

const renderCallback = (search: string) =>
  render(
    <ChI18nProvider locale={defaultLocale} messages={messages}>
      <ChThemeProvider defaultMode="light">
        <MemoryRouter initialEntries={[`/banque/callback${search}`]}>
          <RattacherBanqueCallback />
        </MemoryRouter>
      </ChThemeProvider>
    </ChI18nProvider>
  );

const fr = messages[defaultLocale]!;
const REFUSED_MESSAGE = fr["budgy.callback.refused"];
const MISSING_PARAMS_MESSAGE = fr["budgy.callback.missingParams"];
const SUCCESS_MESSAGE = fr["budgy.callback.success"];
const RETRY_LABEL = fr["budgy.callback.retry"];

beforeEach(() => {
  sessionStorage.clear();
  completerConsentementMock.mockReset();
});

describe("AC1 - Refus ou abandon du consentement chez la banque", () => {
  it("affiche un echec explicite de refus quand le callback revient avec un parametre error", () => {
    renderCallback("?error=access_denied");

    expect(screen.getByText(REFUSED_MESSAGE)).toBeInTheDocument();
  });

  it("propose de reessayer via une action de retry", () => {
    renderCallback("?error=access_denied");

    expect(
      screen.getByRole("button", { name: RETRY_LABEL })
    ).toBeInTheDocument();
  });

  it("ne declenche pas le flux de completion du consentement", () => {
    renderCallback("?error=access_denied&error_description=user_cancelled");

    expect(completerConsentementMock).not.toHaveBeenCalled();
  });
});

describe("AC2 - Callback incomplet", () => {
  it("affiche le message d'informations de retour manquantes quand aucun parametre n'est present", () => {
    renderCallback("");

    expect(screen.getByText(MISSING_PARAMS_MESSAGE)).toBeInTheDocument();
  });

  it("affiche le message de parametres manquants quand code est present mais pas state", () => {
    renderCallback("?code=abc123");

    expect(screen.getByText(MISSING_PARAMS_MESSAGE)).toBeInTheDocument();
  });

  it("affiche le message de parametres manquants quand state est present mais pas code", () => {
    renderCallback("?state=xyz789");

    expect(screen.getByText(MISSING_PARAMS_MESSAGE)).toBeInTheDocument();
  });

  it("propose de reessayer et ne declenche pas la completion", () => {
    renderCallback("?code=abc123");

    expect(
      screen.getByRole("button", { name: RETRY_LABEL })
    ).toBeInTheDocument();
    expect(completerConsentementMock).not.toHaveBeenCalled();
  });
});

describe("AC3 - Callback nominal", () => {
  it("declenche le flux de completion avec code et state", async () => {
    completerConsentementMock.mockResolvedValue({
      consent_id: "consent-1",
      status: "active",
      comptes: [{ id: "acc-1", iban_masked: "FR76****1234" }],
    });

    renderCallback("?code=abc123&state=xyz789");

    await waitFor(() => {
      expect(completerConsentementMock).toHaveBeenCalledWith(
        "abc123",
        "xyz789"
      );
    });
  });

  it("affiche le succes du rattachement", async () => {
    completerConsentementMock.mockResolvedValue({
      consent_id: "consent-1",
      status: "active",
      comptes: [{ id: "acc-1", iban_masked: "FR76****1234" }],
    });

    renderCallback("?code=abc123&state=xyz789");

    expect(
      await screen.findByText(SUCCESS_MESSAGE)
    ).toBeInTheDocument();
  });

  it("affiche les comptes rattaches retournes par la completion", async () => {
    completerConsentementMock.mockResolvedValue({
      consent_id: "consent-1",
      status: "active",
      comptes: [{ id: "acc-1", iban_masked: "FR76****1234" }],
    });

    renderCallback("?code=abc123&state=xyz789");

    expect(await screen.findByText("FR76****1234")).toBeInTheDocument();
  });
});
