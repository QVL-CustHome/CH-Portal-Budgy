import {
  Button,
  Feedback,
  PageContent,
  Spinner,
  Stack,
  useTranslation,
} from "@custhome/ui";
import ConsentementsList from "../components/ConsentementsList";
import ReconsentementAlerte from "../components/ReconsentementAlerte";
import { useReconsentement } from "../hooks/useReconsentement";

export default function Consentements() {
  const { t } = useTranslation();
  const {
    consents,
    renewableConsents,
    loading,
    error,
    renewingConsentId,
    renewError,
    reload,
    renew,
  } = useReconsentement();

  return (
    <PageContent title={t("budgy.consents.title")}>
      <Stack gap="lg">
        {loading ? (
          <Stack alignItems="center" padding="lg">
            <Spinner label={t("budgy.consents.loading")} />
          </Stack>
        ) : error ? (
          <Stack gap="md" alignItems="start">
            <Feedback severity="error">{error}</Feedback>
            <Button variant="secondary" onClick={reload}>
              {t("budgy.consents.retry")}
            </Button>
          </Stack>
        ) : consents.length === 0 ? (
          <Feedback severity="info">{t("budgy.consents.empty")}</Feedback>
        ) : (
          <>
            <ReconsentementAlerte
              consents={renewableConsents}
              renewingConsentId={renewingConsentId}
              renewError={renewError}
              onRenew={renew}
            />
            <ConsentementsList
              consents={consents}
              renewingConsentId={renewingConsentId}
              onRenew={renew}
            />
          </>
        )}
      </Stack>
    </PageContent>
  );
}
