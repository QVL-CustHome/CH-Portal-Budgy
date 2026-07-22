import {
  SegmentedControl,
  Stack,
  useTranslation,
  type ChSegmentedControlOption,
} from "canopui";
import type { CategoryKind } from "../api/budgy";
import FieldLabel from "./FieldLabel";

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

  const options: ChSegmentedControlOption<CategoryKind>[] = OPTIONS.map(
    (kind) => ({
      value: kind,
      label: t(`budgy.categories.kind.${kind}`),
    })
  );

  return (
    <Stack gap="sm">
      <FieldLabel>{t("budgy.categories.form.kindLabel")}</FieldLabel>
      <SegmentedControl
        options={options}
        value={value}
        onChange={onChange}
        ariaLabel={t("budgy.categories.form.kindLabel")}
        size="small"
      />
    </Stack>
  );
}
