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
  type CanopIconName,
} from "canopui";
import type { Enveloppe } from "../api/budgy";
import { formatMoneyCents } from "../lib/money";

export interface EnveloppeCardProps {
  enveloppe: Enveloppe;
  /** Actions d'édition : absentes sur le tableau de bord, où l'on consulte. */
  onEdit?: (enveloppe: Enveloppe) => void;
  onDelete?: (enveloppe: Enveloppe) => void;
}

/** Le budget avec sa propre carte : c'est la forme utilisée sur la page des
 *  catégories, où chaque budget est un objet de la grille. */
export default function EnveloppeCard(props: EnveloppeCardProps) {
  return (
    <Card>
      <EnveloppeContenu {...props} />
    </Card>
  );
}

/** Le même contenu sans carte, pour les contextes déjà encartés — le tableau
 *  de bord range les budgets dans une seule carte « Mes budgets », et emboîter
 *  deux cartes y alourdirait la lecture. */
export function EnveloppeContenu({
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
    <Stack gap="sm">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap="sm"
      >
        <Box
          sx={{
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--canop-radius-md)",
              width: "2.5rem",
              height: "2.5rem",
              flexShrink: 0,
              backgroundColor: `color-mix(in srgb, ${enveloppe.color} 18%, transparent)`,
              color: enveloppe.color,
            }}
          >
            <Icon
              name={enveloppe.icon as CanopIconName}
              size="sm"
              color="inherit"
            />
          </Box>
          <Box sx={{ minWidth: 0 }}>
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
          <Box sx={{ display: "flex", gap: "0.25rem", flexShrink: 0 }}>
            <EditButton
              ariaLabel={t("budgy.enveloppes.edit")}
              onClick={() => onEdit(enveloppe)}
            />
            <DeleteButton
              ariaLabel={t("budgy.enveloppes.delete")}
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
  );
}
