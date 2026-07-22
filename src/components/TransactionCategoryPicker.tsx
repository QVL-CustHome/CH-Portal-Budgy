import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { Icon, Menu, MenuItem, useTranslation } from "canopui";
import type { Category } from "../api/budgy";
import { toCategoryIcon } from "../lib/categories";
import { useTransactionCategoryMenu } from "../hooks/useTransactionCategoryMenu";
import CategoryBadge from "./CategoryBadge";

export interface TransactionCategoryPickerProps {
  category: Category | null;
  categories: Category[];
  disabled?: boolean;
  onSelect: (categoryId: string) => void;
}

export default function TransactionCategoryPicker({
  category,
  categories,
  disabled,
  onSelect,
}: TransactionCategoryPickerProps) {
  const { t } = useTranslation();
  const { open, anchorRef, openMenu, closeMenu, selectCategory } =
    useTransactionCategoryMenu(onSelect);

  const label = category ? category.name : t("budgy.transactions.uncategorized");

  return (
    <>
      <ButtonBase
        ref={anchorRef}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("budgy.transactions.changeCategoryAria", { label })}
        onClick={openMenu}
        focusRipple
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          maxWidth: "100%",
          paddingX: "0.5rem",
          paddingY: "0.25rem",
          borderRadius: "var(--ch-radius-sm)",
          border: "0.0625rem solid transparent",
          color: category
            ? "var(--ch-palette-text-primary)"
            : "var(--ch-palette-text-secondary)",
          transition:
            "transform var(--ch-motion-duration-fast) var(--ch-motion-ease-organic), border-color var(--ch-motion-duration-fast) var(--ch-motion-ease-organic), background-color var(--ch-motion-duration-fast) var(--ch-motion-ease-organic)",
          "&:hover": {
            backgroundColor: "var(--ch-palette-background-default)",
            borderColor: "var(--ch-palette-divider)",
          },
          "&:active": { transform: "scale(0.98)" },
          "&:focus-visible": {
            outline: "0.125rem solid var(--ch-palette-primary-main)",
            outlineOffset: "0.125rem",
          },
          "&.Mui-disabled": { cursor: "progress", opacity: 0.6 },
        }}
      >
        {category ? (
          <CategoryBadge
            color={category.color}
            icon={toCategoryIcon(category.icon)}
            size="sm"
          />
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flex="none"
            color="text.secondary"
            sx={{
              width: "1.75rem",
              height: "1.75rem",
              borderRadius: "var(--ch-radius-sm)",
              border: "0.0625rem dashed var(--ch-palette-divider)",
            }}
          >
            <Icon name="plus" size="sm" color="inherit" />
          </Box>
        )}
        <Typography component="span" color="inherit" noWrap>
          {label}
        </Typography>
      </ButtonBase>
      <Menu
        open={open}
        onClose={closeMenu}
        anchorEl={anchorRef.current}
        label={t("budgy.transactions.categoryMenuAria")}
      >
        {categories.map((option) => (
          <MenuItem
            key={option.id}
            label={option.name}
            icon={
              <CategoryBadge
                color={option.color}
                icon={toCategoryIcon(option.icon)}
                size="sm"
              />
            }
            onClick={() => selectCategory(option.id)}
          />
        ))}
      </Menu>
    </>
  );
}
