import { Button, Feedback, Stack, useTranslation } from "@custhome/ui";
import type { Consent } from "../api/budgy";

export interface ReconsentementAlerteProps {
  consents: Consent[];
  renewingConsentId: string | null;
  renewError: string | null;
  onRenew: (consentId: string) => void;
}

export default function ReconsentementAlerte({
  consents,
  renewingConsentId,
  renewError,
  onRenew,
}: ReconsentementAlerteProps) {
  const { t } = useTranslation();

  if (consents.length === 0) {
    return null;
  }

  return (
    <Stack gap="md">
      {renewError ? (
        <Feedback severity="error">{renewError}</Feedback>
      ) : null}
      {consents.map((consent) => {
        const expired = consent.renewal === "expired";
        return (
          <Feedback
            key={consent.consent_id}
            severity={expired ? "error" : "warning"}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap="md"
              wrap
            >
              <span>
                {expired
                  ? t("budgy.consents.alert.expired", {
                      bank: t("budgy.consents.bankFallback"),
                    })
                  : t("budgy.consents.alert.renewalRequired", {
                      bank: t("budgy.consents.bankFallback"),
                    })}
              </span>
              {consent.renewable ? (
                <Button
                  size="small"
                  loading={renewingConsentId === consent.consent_id}
                  disabled={
                    renewingConsentId !== null &&
                    renewingConsentId !== consent.consent_id
                  }
                  onClick={() => onRenew(consent.consent_id)}
                >
                  {t("budgy.consents.renew")}
                </Button>
              ) : null}
            </Stack>
          </Feedback>
        );
      })}
    </Stack>
  );
}
