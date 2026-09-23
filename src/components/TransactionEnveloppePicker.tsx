import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import {
  Icon,
  Menu,
  MenuItem,
  useTranslation,
  type CanopIconName,
} from "canopui";
import { useRef, useState } from "react";
import type { Enveloppe } from "../api/budgy";
import CategoryBadge from "./CategoryBadge";

export interface TransactionEnveloppePickerProps {
  enveloppe: Enveloppe | null;
  enveloppes: Enveloppe[];
  disabled?: boolean;
  /** `null` retire la transaction de son budget. */
  onSelect: (enveloppeId: string | null) => void;
}

/**
 * Choix du budget d'une transaction, calqué sur le sélecteur de catégorie.
 *
 * Les deux vivent côte à côte : une transaction porte sa catégorie **et** son
 * budget. La liste offre en plus un retrait, absent côté catégorie où chaque
 * opération finit toujours quelque part.
 */
export default function TransactionEnveloppePicker({
  enveloppe,
  enveloppes,
  disabled,
  onSelect,
}: TransactionEnveloppePickerProps) {
  const { t } = useTranslation();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const label = enveloppe ? enveloppe.nom : t("budgy.transactions.noBudget");

  const choisir = (id: string | null) => {
    setOpen(false);
    onSelect(id);
  };

  return (
    <>
      <ButtonBase
        ref={anchorRef}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("budgy.transactions.changeBudgetAria", { label })}
        onClick={() => setOpen(true)}
        focusRipple
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          maxWidth: "100%",
          paddingX: "0.5rem",
          paddingY: "0.25rem",
          borderRadius: "var(--canop-radius-sm)",
          border: "0.0625rem solid transparent",
          color: enveloppe
            ? "var(--canop-palette-text-primary)"
            : "var(--canop-palette-text-secondary)",
          "&:hover": {
            backgroundColor: "var(--canop-palette-background-default)",
            borderColor: "var(--canop-palette-divider)",
          },
          "&:active": { transform: "scale(0.98)" },
          "&:focus-visible": {
            outline: "0.125rem solid var(--canop-palette-primary-main)",
            outlineOffset: "0.125rem",
          },
          "&.Mui-disabled": { cursor: "progress", opacity: 0.6 },
        }}
      >
        {enveloppe ? (
          <CategoryBadge
            color={enveloppe.color}
            icon={enveloppe.icon as CanopIconName}
            size="sm"
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "none",
              color: "text.secondary",
              width: "1.75rem",
              height: "1.75rem",
              borderRadius: "var(--canop-radius-sm)",
              border: "0.0625rem dashed var(--canop-palette-divider)",
            }}
          >
            <Icon name="wallet" size="sm" color="inherit" />
          </Box>
        )}
        <Typography component="span" color="inherit" noWrap>
          {label}
        </Typography>
      </ButtonBase>

      <Menu
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorRef.current}
        ariaLabel={t("budgy.transactions.budgetMenuAria")}
      >
        {enveloppes.map((option) => (
          <MenuItem
            key={option.id}
            label={option.nom}
            icon={
              <CategoryBadge
                color={option.color}
                icon={option.icon as CanopIconName}
                size="sm"
              />
            }
            onClick={() => choisir(option.id)}
          />
        ))}
        {enveloppe ? (
          <MenuItem
            label={t("budgy.transactions.removeBudget")}
            icon={<Icon name="close" size="sm" />}
            onClick={() => choisir(null)}
          />
        ) : null}
      </Menu>
    </>
  );
}
