import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Card,
  DeleteButton,
  EditButton,
  Icon,
  ProgressBar,
  Stack,
  useTranslation,
  type ChIconName,
} from "canopui";
import type { Enveloppe } from "../api/budgy";
import { formatMoneyCents } from "../lib/money";

export interface EnveloppeCardProps {
  enveloppe: Enveloppe;
  /** Actions d'édition : absentes sur le tableau de bord, où l'on consulte. */
  onEdit?: (enveloppe: Enveloppe) => void;
  onDelete?: (enveloppe: Enveloppe) => void;
}

export default function EnveloppeCard({
  enveloppe,
  onEdit,
  onDelete,
}: EnveloppeCardProps) {
  const { t, locale } = useTranslation();
  const restant = formatMoneyCents(
    Math.abs(enveloppe.restant_cents),
    "EUR",
    locale
  );

  return (
    <Card>
      <Stack gap="sm">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap="sm"
        >
          <Box minWidth={0} display="flex" alignItems="center" gap="0.75rem">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="var(--ch-radius-md)"
              sx={{
                width: "2.5rem",
                height: "2.5rem",
                flexShrink: 0,
                backgroundColor: `color-mix(in srgb, ${enveloppe.color} 18%, transparent)`,
                color: enveloppe.color,
              }}
            >
              <Icon
                name={enveloppe.icon as ChIconName}
                size="sm"
                color="inherit"
              />
            </Box>
            <Box minWidth={0}>
              <Typography color="text.primary" sx={{ fontWeight: 600 }} noWrap>
                {enveloppe.nom}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatMoneyCents(enveloppe.depense_cents, "EUR", locale)}
                {" / "}
                {formatMoneyCents(enveloppe.montant_cents, "EUR", locale)}
              </Typography>
            </Box>
          </Box>

          {onEdit && onDelete ? (
            <Box display="flex" gap="0.25rem" flexShrink={0}>
              <EditButton
                aria-label={t("budgy.enveloppes.edit")}
                onClick={() => onEdit(enveloppe)}
              />
              <DeleteButton
                aria-label={t("budgy.enveloppes.delete")}
                confirmTitle={t("budgy.enveloppes.delete.title")}
                confirmMessage={t("budgy.enveloppes.delete.message", {
                  name: enveloppe.nom,
                })}
                confirmLabel={t("budgy.enveloppes.delete")}
                cancelLabel={t("budgy.cancel")}
                onConfirm={() => onDelete(enveloppe)}
              />
            </Box>
          ) : null}
        </Stack>

        <ProgressBar
          value={enveloppe.pourcentage_consomme}
          color={enveloppe.depasse ? "warning" : "primary"}
        />

        <Typography
          variant="body2"
          color={enveloppe.depasse ? "error.main" : "text.secondary"}
        >
          {enveloppe.depasse
            ? t("budgy.enveloppes.over", { amount: restant })
            : t("budgy.enveloppes.remaining", { amount: restant })}
        </Typography>
      </Stack>
    </Card>
  );
}
