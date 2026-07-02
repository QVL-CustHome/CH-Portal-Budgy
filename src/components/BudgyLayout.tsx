import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { PageScaffold, useTranslation, type ChNavbarItem } from "@custhome/ui";
import { useCurrentUser } from "../context/current-user";
import { logout } from "../api/auth";
import { navigateTo } from "../lib/navigation";
import { loginUrl } from "../lib/auth-redirect";
import BudgyNotificationsProvider from "./BudgyNotificationsProvider";
import SyncErrorToast from "./SyncErrorToast";

export default function BudgyLayout() {
  const { t } = useTranslation();
  const me = useCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();

  const items: ChNavbarItem[] = [
    { label: t("budgy.nav.home"), href: "/home", icon: "home" },
    { label: t("budgy.nav.accounts"), href: "/comptes", icon: "apps" },
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
      >
        <Outlet />
        <SyncErrorToast />
      </PageScaffold>
    </BudgyNotificationsProvider>
  );
}
