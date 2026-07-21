import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import App from "../App";

const budgyUser = {
  user_id: "u-1",
  name: "Alice",
  email: "alice@test",
  roles: ["budgy"],
  whitelist_only: false,
  created_at: "2026-01-01T00:00:00Z",
};

vi.mock("canopui", async (importOriginal) => {
  const actual = await importOriginal<typeof import("canopui")>();
  return {
    palette: actual.palette,
    useTranslation: () => ({ t: (key: string) => key }),
  useCurrentUser: () => budgyUser,
  navigateTo: () => {},
  buildCguUrl: ({
    authPortalUrl,
    legalNoticeAnchor,
  }: {
    authPortalUrl: string;
    legalNoticeAnchor?: string;
  }) => `${authPortalUrl}/cgu${legalNoticeAnchor ? `#${legalNoticeAnchor}` : ""}`,
  buildLoginUrl: ({ authPortalUrl }: { authPortalUrl: string }) => `${authPortalUrl}/login`,
  createApiClient: () => ({ request: async () => ({}) }),
  ApiError: class ApiError extends Error {
    status = 0;
  },
  RouteGuard: ({
    renderAuthorized,
  }: {
    renderAuthorized: () => ReactNode;
  }) => renderAuthorized(),
  PageScaffold: ({
    items,
    children,
  }: {
    items: Array<{ label: string; href: string }>;
    children: ReactNode;
  }) => (
    <div>
      <nav>
        {items.map((item) => (
          <a key={item.href} data-testid="nav-link" href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      {children}
    </div>
  ),
  };
});

vi.mock("./BudgyNotificationsProvider", () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("./SyncErrorToast", () => ({ default: () => null }));

vi.mock("../pages/Home", () => ({ default: () => <div>page-home</div> }));
vi.mock("../pages/RattacherBanque", () => ({ default: () => <div>page-banque</div> }));
vi.mock("../pages/RattacherBanqueCallback", () => ({
  default: () => <div>page-banque-callback</div>,
}));
vi.mock("../pages/MesComptes", () => ({ default: () => <div>page-comptes</div> }));
vi.mock("../pages/TransactionsCompte", () => ({
  default: () => <div>page-transactions</div>,
}));
vi.mock("../pages/Consentements", () => ({
  default: () => <div>page-consentements</div>,
}));
vi.mock("../pages/Categories", () => ({
  default: () => <div>page-categories</div>,
}));
vi.mock("../pages/Forbidden", () => ({ default: () => <div>page-forbidden</div> }));

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="pathname">{location.pathname}</div>;
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
      <LocationProbe />
    </MemoryRouter>
  );
}

function navHrefs(): string[] {
  return screen
    .getAllByTestId("nav-link")
    .map((link) => link.getAttribute("href") ?? "");
}

describe("navigation du layout Budgy", () => {
  it("n'expose aucune entrée Notifications dans la nav", () => {
    renderAt("/home");

    const links = screen.getAllByTestId("nav-link");
    const hrefs = links.map((link) => link.getAttribute("href") ?? "");
    const labels = links.map((link) => link.textContent ?? "");

    expect(hrefs).not.toContain("/notifications");
    expect(labels.some((label) => /notification/i.test(label))).toBe(false);
  });

  it("pointe chaque entrée de nav vers une route déclarée dans App", () => {
    const initial = renderAt("/home");
    const hrefs = navHrefs();
    initial.unmount();

    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of hrefs) {
      const view = renderAt(href);
      expect(screen.getByTestId("pathname").textContent).toBe(href);
      view.unmount();
    }
  });

  it("redirige une route inexistante vers /home (contrôle négatif)", () => {
    renderAt("/notifications");

    expect(screen.getByTestId("pathname").textContent).toBe("/home");
  });
});
