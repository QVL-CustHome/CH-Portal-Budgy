import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Card,
  Divider,
  Feedback,
  Heading,
  Link,
  Spinner,
  Stack,
  useTranslation,
} from "canopui";
import { useSoldesConsolides } from "../hooks/useSoldesConsolides";
import { useReloadComptesOnRelay } from "../hooks/useReloadOnRelay";
import { formatMoneyCents } from "../lib/money";
import SoldeTotalHero from "./SoldeTotalHero";
import SoldesParCompteList from "./SoldesParCompteList";

export default function SoldesConsolidesBlock() {
  const { t, locale } = useTranslation();
  const {
    totalCents,
    comptes,
    displayCurrency,
    hasAccounts,
    loading,
    error,
    reload,
  } = useSoldesConsolides();
  useReloadComptesOnRelay(reload);

  return (
    <Card title={t("budgy.dashboard.balances.title")} elevation="sm" fill>
      {loading ? (
        <Stack alignItems="center" padding="lg">
          <Spinner label={t("budgy.dashboard.balances.loading")} />
        </Stack>
      ) : error ? (
        <Stack gap="md" alignItems="start">
          <Feedback severity="error">{error}</Feedback>
          <Button variant="secondary" onClick={reload}>
            {t("budgy.dashboard.balances.retry")}
          </Button>
        </Stack>
      ) : !hasAccounts ? (
        <Stack gap="md" alignItems="start">
          <Feedback severity="info">
            {t("budgy.dashboard.balances.empty")}
          </Feedback>
          <Link component={RouterLink} to="/banque">
            {t("budgy.dashboard.balances.connectBank")}
          </Link>
        </Stack>
      ) : (
        <Stack gap="md">
          <SoldeTotalHero
            label={t("budgy.dashboard.balances.totalLabel")}
            formattedAmount={formatMoneyCents(
              totalCents,
              displayCurrency,
              locale
            )}
          />
          <Divider spacing="sm" />
          <Heading level={3} size={5}>
            {t("budgy.dashboard.balances.perAccountLabel")}
          </Heading>
          <SoldesParCompteList comptes={comptes} />
        </Stack>
      )}
    </Card>
  );
}
