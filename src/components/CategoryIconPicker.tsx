import { Icon, Stack, useTranslation, type ChIconName } from "canopui";
import { CATEGORY_ICON_OPTIONS } from "../lib/categories";

export interface CategoryIconPickerProps {
  value: ChIconName;
  onChange: (icon: ChIconName) => void;
}

export default function CategoryIconPicker({
  value,
  onChange,
}: CategoryIconPickerProps) {
  const { t } = useTranslation();

  return (
    <Stack gap="sm">
      <span className="category-field-label">
        {t("budgy.categories.form.iconLabel")}
      </span>
      <div className="category-icon-grid" role="radiogroup">
        {CATEGORY_ICON_OPTIONS.map((icon) => {
          const selected = icon === value;
          return (
            <button
              key={icon}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={t("budgy.categories.form.iconOptionAria", { icon })}
              className="category-icon-tile"
              data-selected={selected}
              onClick={() => onChange(icon)}
            >
              <Icon
                name={icon}
                variant={selected ? "solid" : "outline"}
                size="md"
                color={selected ? "primary" : "inherit"}
              />
            </button>
          );
        })}
      </div>
    </Stack>
  );
}
