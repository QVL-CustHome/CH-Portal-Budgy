import { Icon, Stack, useTranslation } from "canopui";
import type { CategoryKind } from "../api/budgy";

export interface CategoryKindSelectorProps {
  value: CategoryKind;
  onChange: (kind: CategoryKind) => void;
}

const OPTIONS: readonly CategoryKind[] = ["depense", "revenu"];

export default function CategoryKindSelector({
  value,
  onChange,
}: CategoryKindSelectorProps) {
  const { t } = useTranslation();

  return (
    <Stack gap="sm">
      <span className="category-field-label">
        {t("budgy.categories.form.kindLabel")}
      </span>
      <div className="category-kind-selector" role="radiogroup">
        {OPTIONS.map((kind) => {
          const selected = kind === value;
          return (
            <button
              key={kind}
              type="button"
              role="radio"
              aria-checked={selected}
              className="category-kind-option"
              data-selected={selected}
              data-kind={kind}
              onClick={() => onChange(kind)}
            >
              {selected ? (
                <Icon name="check" variant="solid" size="sm" color="inherit" />
              ) : null}
              {t(`budgy.categories.kind.${kind}`)}
            </button>
          );
        })}
      </div>
    </Stack>
  );
}
