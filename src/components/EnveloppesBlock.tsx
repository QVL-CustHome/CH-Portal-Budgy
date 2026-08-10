import Box from "@mui/material/Box";
import { Card, CardGrid, Spinner, Stack, useTranslation } from "canopui";
import { EnveloppeContenu } from "./EnveloppeCard";
import { useEnveloppes } from "../hooks/useEnveloppes";

/**
 * Suivi des budgets sur le tableau de bord.
 *
 * La section reste absente tant qu'aucun budget n'existe : un bloc vide entre
 * les catégories et le prévisionnel n'apprendrait rien et couperait la lecture.
 * Une erreur de chargement l'efface aussi — le tableau de bord doit rester
 * lisible même si une brique manque.
 *
 * Les budgets vivent dans la carte, sous son titre, et non dans des cartes
 * emboîtées : chaque budget est une ligne du bloc, pas un bloc à lui seul.
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
    <Card title={t("budgy.enveloppes.title")} elevation="sm" fill>
      <CardGrid minItemWidth="16rem" gap="md">
        {enveloppes.map((enveloppe) => (
          <Box
            key={enveloppe.id}
            sx={{
              padding: "0.75rem",
              borderRadius: "var(--ch-radius-md)",
              backgroundColor: "var(--ch-palette-surface-sunken)",
            }}
          >
            <EnveloppeContenu enveloppe={enveloppe} />
          </Box>
        ))}
      </CardGrid>
    </Card>
  );
}
