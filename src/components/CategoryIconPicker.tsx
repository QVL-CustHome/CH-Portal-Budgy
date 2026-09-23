import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { Icon, Stack, useTranslation, type CanopIconName } from "canopui";
import { CATEGORY_ICON_OPTIONS } from "../lib/categories";
import FieldLabel from "./FieldLabel";

export interface CategoryIconPickerProps {
  value: CanopIconName;
  onChange: (icon: CanopIconName) => void;
}

export default function CategoryIconPicker({
  value,
  onChange,
}: CategoryIconPickerProps) {
  const { t } = useTranslation();

  return (
    <Stack gap="sm">
      <FieldLabel>{t("budgy.categories.form.iconLabel")}</FieldLabel>
      <Box
        role="radiogroup"
        sx={{
          display: "grid",
          gap: "0.5rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(3rem, 1fr))",
        }}
      >
        {CATEGORY_ICON_OPTIONS.map((icon) => {
          const selected = icon === value;
          return (
            <ButtonBase
              key={icon}
              role="radio"
              aria-checked={selected}
              aria-label={t("budgy.categories.form.iconOptionAria", { icon })}
              onClick={() => onChange(icon)}
              focusRipple
              sx={{
                aspectRatio: "1 / 1",
                borderRadius: "var(--canop-radius-md)",
                border: "0.0625rem solid",
                borderColor: selected
                  ? "var(--canop-palette-primary-main)"
                  : "var(--canop-palette-divider)",
                backgroundColor: selected
                  ? "color-mix(in srgb, var(--canop-palette-primary-main) 12%, var(--canop-palette-background-paper))"
                  : "var(--canop-palette-background-paper)",
                transition:
                  "transform var(--canop-motion-duration-fast) var(--canop-motion-ease-organic), border-color var(--canop-motion-duration-fast) var(--canop-motion-ease-organic), background-color var(--canop-motion-duration-fast) var(--canop-motion-ease-organic)",
                "&:hover": {
                  transform: "translateY(-0.125rem)",
                  borderColor: "var(--canop-palette-primary-light)",
                },
                "&:active": { transform: "translateY(0) scale(0.97)" },
                "&:focus-visible": {
                  outline: "0.125rem solid var(--canop-palette-primary-main)",
                  outlineOffset: "0.125rem",
                },
              }}
            >
              <Icon
                name={icon}
                variant={selected ? "solid" : "outline"}
                size="md"
                color={selected ? "primary" : "inherit"}
              />
            </ButtonBase>
          );
        })}
      </Box>
    </Stack>
  );
}
