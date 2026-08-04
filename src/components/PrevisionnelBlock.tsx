import {
  Button,
  Card,
  Feedback,
  Spinner,
  Stack,
  useTranslation,
} from "canopui";
import { usePrevisionnel } from "../hooks/usePrevisionnel";
import PrevisionnelHero from "./PrevisionnelHero";
import PrevisionnelChart from "./PrevisionnelChart";

export default function PrevisionnelBlock() {
  const { t } = useTranslation();
  // Prévisionnel du mois en cours uniquement (pas de navigation mensuelle).
  const { summary, categories, hasEnoughData, loading, error, reload } =
    usePrevisionnel();

  return (
    <Card title={t("budgy.dashboard.forecast.title")} elevation="sm" fill>
      <Stack gap="md">
        {loading ? (
          <Stack alignItems="center" padding="lg">
            <Spinner label={t("budgy.dashboard.forecast.loading")} />
          </Stack>
        ) : error ? (
          <Stack gap="md" alignItems="start">
            <Feedback severity="error">{error}</Feedback>
            <Button variant="secondary" onClick={reload}>
              {t("budgy.dashboard.forecast.retry")}
            </Button>
          </Stack>
        ) : !hasEnoughData || !summary ? (
          <Feedback severity="info">
            {t("budgy.dashboard.forecast.insufficient")}
          </Feedback>
        ) : (
          <Stack gap="lg">
            <PrevisionnelHero summary={summary} />
            {categories.length > 0 ? (
              <PrevisionnelChart categories={categories} />
            ) : null}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
