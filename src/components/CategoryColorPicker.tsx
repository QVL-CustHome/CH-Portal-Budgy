import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { Icon, Stack, useTranslation } from "canopui";
import { CATEGORY_COLOR_OPTIONS, isLightCategoryColor } from "../lib/categories";
import FieldLabel from "./FieldLabel";

export interface CategoryColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export default function CategoryColorPicker({
  value,
  onChange,
}: CategoryColorPickerProps) {
  const { t } = useTranslation();

  return (
    <Stack gap="sm">
      <FieldLabel>{t("budgy.categories.form.colorLabel")}</FieldLabel>
      <Box
        role="radiogroup"
        display="flex"
        flexWrap="wrap"
        gap="0.625rem"
      >
        {CATEGORY_COLOR_OPTIONS.map((color, index) => {
          const selected = color.toLowerCase() === value.toLowerCase();
          return (
            <ButtonBase
              key={color}
              role="radio"
              aria-checked={selected}
              aria-label={t("budgy.categories.form.colorOptionAria", {
                index: index + 1,
              })}
              onClick={() => onChange(color)}
              focusRipple
              sx={{
                width: "2.25rem",
                height: "2.25rem",
                borderRadius: "var(--ch-radius-pill)",
                backgroundColor: color,
                color: isLightCategoryColor(color)
                  ? "var(--ch-palette-text-primary)"
                  : "var(--ch-palette-background-default)",
                transform: selected ? "scale(1.08)" : "none",
                boxShadow: selected
                  ? "0 0 0 0.125rem var(--ch-palette-background-paper), 0 0 0 0.28125rem var(--ch-palette-primary-main)"
                  : "none",
                transition:
                  "transform var(--ch-motion-duration-fast) var(--ch-motion-ease-organic)",
                "&:hover": { transform: "scale(1.12)" },
                "&:active": { transform: "scale(0.95)" },
                "&:focus-visible": {
                  outline: "0.125rem solid var(--ch-palette-primary-main)",
                  outlineOffset: "0.1875rem",
                },
              }}
            >
              {selected ? (
                <Icon name="check" variant="solid" size="sm" color="inherit" />
              ) : null}
            </ButtonBase>
          );
        })}
      </Box>
    </Stack>
  );
}
