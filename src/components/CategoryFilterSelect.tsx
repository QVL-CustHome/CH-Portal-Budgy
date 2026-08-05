import { useRef, useState } from "react";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { Icon, Menu, MenuItem, useTranslation } from "canopui";
import type { RemainingBudgetCategory } from "../api/budgy";
import { toCategoryIcon } from "../lib/categories";
import CategoryBadge from "./CategoryBadge";
import FieldLabel from "./FieldLabel";

/** Valeur sentinelle : aucune catégorie sélectionnée (toutes affichées). */
export const ALL_CATEGORIES = "__all__";

export interface CategoryFilterSelectProps {
  categories: RemainingBudgetCategory[];
  value: string;
  onChange: (value: string) => void;
}

export default function CategoryFilterSelect({
  categories,
  value,
  onChange,
}: CategoryFilterSelectProps) {
  const { t } = useTranslation();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const selected =
    value === ALL_CATEGORIES
      ? null
      : (categories.find((category) => category.category_id === value) ?? null);
  const label =
    selected?.category_name ?? t("budgy.dashboard.remaining.allCategories");

  function pick(next: string) {
    onChange(next);
    setOpen(false);
  }

  return (
    <div>
      <FieldLabel>{t("budgy.dashboard.remaining.category")}</FieldLabel>
      <ButtonBase
        ref={anchorRef}
        onClick={() => setOpen(true)}
        aria-haspopup="menu"
        aria-expanded={open}
        focusRipple
        sx={{
          width: "100%",
          justifyContent: "space-between",
          gap: "0.5rem",
          paddingX: "0.75rem",
          paddingY: "0.5rem",
          borderRadius: "var(--ch-radius-md)",
          border: "0.0625rem solid var(--ch-palette-divider)",
          backgroundColor: "var(--ch-palette-background-paper)",
          "&:hover": { borderColor: "var(--ch-palette-primary-light)" },
          "&:focus-visible": {
            outline: "0.125rem solid var(--ch-palette-primary-main)",
            outlineOffset: "0.125rem",
          },
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            minWidth: 0,
          }}
        >
          {selected ? (
            <CategoryBadge
              color={selected.color}
              icon={toCategoryIcon(selected.icon)}
              size="sm"
            />
          ) : null}
          <Typography component="span" color="text.primary" noWrap>
            {label}
          </Typography>
        </span>
        <Icon name="caretDown" size="sm" color="inherit" />
      </ButtonBase>
      <Menu
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorRef.current}
        label={t("budgy.dashboard.remaining.category")}
      >
        <MenuItem
          label={t("budgy.dashboard.remaining.allCategories")}
          onClick={() => pick(ALL_CATEGORIES)}
        />
        {categories.map((category) => (
          <MenuItem
            key={category.category_id}
            label={category.category_name}
            icon={
              <CategoryBadge
                color={category.color}
                icon={toCategoryIcon(category.icon)}
                size="sm"
              />
            }
            onClick={() => pick(category.category_id)}
          />
        ))}
      </Menu>
    </div>
  );
}
