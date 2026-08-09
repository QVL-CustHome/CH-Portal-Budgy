import Typography from "@mui/material/Typography";
import {
  Card,
  Feedback,
  Select,
  Spinner,
  Stack,
  useTranslation,
  type ChSelectOption,
} from "canopui";
import { useJourDebutMois } from "../hooks/useJourDebutMois";

const JOURS = Array.from({ length: 31 }, (_, i) => i + 1);

/**
 * Réglage du jour où démarre le mois budgétaire.
 *
 * Il vit sur la page des consentements, à côté des banques rattachées : c'est
 * là qu'on paramètre son suivi, et le jour de départ se cale en général sur la
 * date de versement du salaire.
 */
export default function JourDebutMoisCard() {
  const { t } = useTranslation();
  const { jour, loading, error, enregistre, definir } = useJourDebutMois();

  const options: ChSelectOption[] = JOURS.map((j) => ({
    value: String(j),
    label: t("budgy.monthStart.day", { day: String(j) }),
  }));

  return (
    <Card>
      <Stack gap="sm">
        <Typography color="text.primary" sx={{ fontWeight: 600 }}>
          {t("budgy.monthStart.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("budgy.monthStart.description")}
        </Typography>

        {loading ? (
          <Spinner label={t("budgy.monthStart.loading")} />
        ) : (
          <Stack gap="sm">
            <Select
              label={t("budgy.monthStart.label")}
              value={String(jour)}
              options={options}
              onChange={(valeur) => void definir(Number(valeur))}
            />
            <Typography variant="caption" color="text.secondary">
              {jour === 1
                ? t("budgy.monthStart.hintFirst")
                : t("budgy.monthStart.hint", {
                    day: String(jour),
                    previous: String(jour - 1),
                  })}
            </Typography>
          </Stack>
        )}

        {error ? <Feedback severity="error">{error}</Feedback> : null}
        {enregistre && !error ? (
          <Feedback severity="success">{t("budgy.monthStart.saved")}</Feedback>
        ) : null}
      </Stack>
    </Card>
  );
}
