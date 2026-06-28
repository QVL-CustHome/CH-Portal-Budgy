import {
  Button,
  Card,
  DescriptionList,
  Stack,
  StatusChip,
  useTranslation,
  type ChStatusTone,
} from "@custhome/ui";
import type { Consent, ConsentStatus } from "../api/budgy";
import { formatDate } from "../lib/date";

const STATUS_TONES: Record<ConsentStatus, ChStatusTone> = {
  pending: "info",
  active: "success",
  expired: "error",
  revoked: "neutral",
  failed: "error",
};

export interface ConsentementCardProps {
  consent: Consent;
  renewing: boolean;
  renewDisabled: boolean;
  onRenew: (consentId: string) => void;
}

export default function ConsentementCard({
  consent,
  renewing,
  renewDisabled,
  onRenew,
}: ConsentementCardProps) {
  const { t, locale } = useTranslation();
  const needsRenewal = consent.renewal !== "up-to-date";

  return (
    <Card
      title={t("budgy.consents.bankFallback")}
      elevation="sm"
      fill
      actions={
        consent.renewable ? (
          <Button
            size="small"
            loading={renewing}
            disabled={renewDisabled}
            onClick={() => onRenew(consent.consent_id)}
          >
            {t("budgy.consents.renew")}
          </Button>
        ) : undefined
      }
    >
      <Stack gap="md">
        <Stack direction="row" gap="sm" wrap>
          <StatusChip
            tone={STATUS_TONES[consent.status]}
            label={t(`budgy.consents.status.${consent.status}`)}
          />
          {needsRenewal ? (
            <StatusChip
              tone={consent.renewal === "expired" ? "error" : "warning"}
              label={t(`budgy.consents.renewal.${consent.renewal}`)}
            />
          ) : null}
        </Stack>
        <DescriptionList
          items={[
            {
              label: t("budgy.consents.expiresAt"),
              value: consent.expires_at
                ? formatDate(consent.expires_at, locale)
                : t("budgy.consents.noExpiry"),
            },
          ]}
        />
      </Stack>
    </Card>
  );
}
