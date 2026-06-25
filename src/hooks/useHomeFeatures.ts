import { useTranslation } from "@custhome/ui";
import type { FeatureCardProps } from "../components/FeatureCard";

export function useHomeFeatures(): FeatureCardProps[] {
  const { t } = useTranslation();
  const badge = t("budgy.home.comingSoon");

  return [
    {
      icon: "plus",
      title: t("budgy.home.bank.title"),
      description: t("budgy.home.bank.description"),
      to: "/banque",
    },
    {
      icon: "apps",
      title: t("budgy.home.accounts.title"),
      description: t("budgy.home.accounts.description"),
      badge,
    },
    {
      icon: "mail",
      title: t("budgy.home.notifications.title"),
      description: t("budgy.home.notifications.description"),
      badge,
    },
  ];
}
