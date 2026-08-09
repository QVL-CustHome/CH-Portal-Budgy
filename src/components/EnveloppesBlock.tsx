import Typography from "@mui/material/Typography";
import { CardGrid, Spinner, Stack, useTranslation } from "canopui";
import EnveloppeCard from "./EnveloppeCard";
import { useEnveloppes } from "../hooks/useEnveloppes";

/**
 * Suivi des budgets sur le tableau de bord.
 *
 * La section reste absente tant qu'aucun budget n'existe : un bloc vide entre
 * les catégories et le prévisionnel n'apprendrait rien et couperait la lecture.
 * Une erreur de chargement l'efface aussi — le tableau de bord doit rester
 * lisible même si une brique manque.
 */
export default function EnveloppesBlock() {
  const { t } = useTranslation();
  const { enveloppes, loading, error } = useEnveloppes();

  if (loading) {
    return (
      <Stack alignItems="center" padding="md">
        <Spinner label={t("budgy.enveloppes.loading")} />
      </Stack>
    );
  }

  if (error || enveloppes.length === 0) {
    return null;
  }

  return (
    <Stack gap="sm">
      <Typography variant="h6" color="text.primary">
        {t("budgy.enveloppes.title")}
      </Typography>
      <CardGrid minItemWidth="16rem" gap="md">
        {enveloppes.map((enveloppe) => (
          <EnveloppeCard key={enveloppe.id} enveloppe={enveloppe} />
        ))}
      </CardGrid>
    </Stack>
  );
}
