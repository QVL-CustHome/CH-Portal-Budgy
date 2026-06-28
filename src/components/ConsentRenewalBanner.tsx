import { Feedback, useTranslation } from "@custhome/ui";
import { useBudgyNotifications } from "../context/budgy-notifications";

export default function ConsentRenewalBanner() {
  const { t } = useTranslation();
  const { consentRenewalState } = useBudgyNotifications();

  if (consentRenewalState === "expired") {
    return (
      <Feedback severity="error">
        {t("budgy.notifications.consentExpired")}
      </Feedback>
    );
  }

  if (consentRenewalState === "renewal-required") {
    return (
      <Feedback severity="warning">
        {t("budgy.notifications.consentRenewalRequired")}
      </Feedback>
    );
  }

  return null;
}
