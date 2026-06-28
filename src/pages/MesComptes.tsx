import {
  Button,
  Feedback,
  PageContent,
  Spinner,
  Stack,
  useTranslation,
} from "@custhome/ui";
import ComptesList from "../components/ComptesList";
import ReconsentementAlerte from "../components/ReconsentementAlerte";
import ConsentRenewalBanner from "../components/ConsentRenewalBanner";
import { useComptes } from "../hooks/useComptes";
import { useReconsentement } from "../hooks/useReconsentement";
import { useReloadComptesOnRelay } from "../hooks/useReloadOnRelay";

export default function MesComptes() {
  const { t } = useTranslation();
  const { comptes, loading, error, reload } = useComptes();
  const {
    renewableConsents,
    renewingConsentId,
    renewError,
    renew,
  } = useReconsentement();
  useReloadComptesOnRelay(reload);

  return (
    <PageContent title={t("budgy.accounts.title")}>
      <Stack gap="lg">
        <ReconsentementAlerte
          consents={renewableConsents}
          renewingConsentId={renewingConsentId}
          renewError={renewError}
          onRenew={renew}
        />
        <ConsentRenewalBanner />
        {loading ? (
          <Stack alignItems="center" padding="lg">
            <Spinner label={t("budgy.accounts.loading")} />
          </Stack>
        ) : error ? (
          <Stack gap="md" alignItems="start">
            <Feedback severity="error">{error}</Feedback>
            <Button variant="secondary" onClick={reload}>
              {t("budgy.accounts.retry")}
            </Button>
          </Stack>
        ) : comptes.length === 0 ? (
          <Feedback severity="info">{t("budgy.accounts.empty")}</Feedback>
        ) : (
          <ComptesList comptes={comptes} />
        )}
      </Stack>
    </PageContent>
  );
}
