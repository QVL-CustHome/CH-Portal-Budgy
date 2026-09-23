import { useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { PageScaffold, useTranslation, type CanopNavbarItem } from "canopui";
import { useCurrentUser } from "../context/current-user";
import { logout } from "../api/auth";
import { recategoriserCredits } from "../api/budgy";
import { navigateTo } from "../lib/navigation";
import { cguUrl, loginUrl } from "../lib/auth-redirect";
import BudgyNotificationsProvider from "./BudgyNotificationsProvider";
import LegalLinks from "./LegalLinks";
import SyncErrorToast from "./SyncErrorToast";

export default function BudgyLayout() {
  const { t } = useTranslation();
  const me = useCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();

  // Catégorisation automatique des crédits (revenus) en « Salaire » à l'entrée
  // dans l'app : rattrape les transactions synchronisées depuis la dernière visite.
  // Idempotent côté API ; erreurs ignorées (best-effort, non bloquant).
  useEffect(() => {
    void recategoriserCredits().catch(() => {});
  }, []);

  const items: CanopNavbarItem[] = [
    { label: t("budgy.nav.dashboard"), href: "/", icon: "barChart" },
    { label: t("budgy.nav.accounts"), href: "/comptes", icon: "wallet" },
    { label: t("budgy.nav.categories"), href: "/categories", icon: "tag" },
    { label: t("budgy.nav.consents"), href: "/consentements", icon: "shield" },
  ];

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigateTo(loginUrl());
    }
  }

  return (
    <BudgyNotificationsProvider>
      <PageScaffold
        navbarTitle="CustHome"
        title={t("budgy.brand")}
        items={items}
        activeHref={location.pathname}
        onNavigate={(href) => navigate(href)}
        userName={me.name}
        onLogout={handleLogout}
        footer={<LegalLinks />}
        infoHref={cguUrl()}
        mobileFooterPlacement="settings"
      >
        <Outlet />
        <SyncErrorToast />
      </PageScaffold>
    </BudgyNotificationsProvider>
  );
}
