import { Icon, Stack, useTranslation } from "canopui";
import { CATEGORY_COLOR_OPTIONS, isLightCategoryColor } from "../lib/categories";

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
      <span className="category-field-label">
        {t("budgy.categories.form.colorLabel")}
      </span>
      <div className="category-swatch-grid" role="radiogroup">
        {CATEGORY_COLOR_OPTIONS.map((color, index) => {
          const selected = color.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={t("budgy.categories.form.colorOptionAria", {
                index: index + 1,
              })}
              className="category-swatch"
              data-selected={selected}
              data-tone={isLightCategoryColor(color) ? "light" : "dark"}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
            >
              {selected ? (
                <Icon name="check" variant="solid" size="sm" color="inherit" />
              ) : null}
            </button>
          );
        })}
      </div>
    </Stack>
  );
}
