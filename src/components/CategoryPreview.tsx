import {
  Heading,
  Stack,
  StatusChip,
  useTranslation,
  type ChIconName,
} from "canopui";
import type { CategoryKind } from "../api/budgy";
import CategoryBadge from "./CategoryBadge";

export interface CategoryPreviewProps {
  name: string;
  kind: CategoryKind;
  color: string;
  icon: ChIconName;
}

export default function CategoryPreview({
  name,
  kind,
  color,
  icon,
}: CategoryPreviewProps) {
  const { t } = useTranslation();

  return (
    <Stack gap="sm">
      <span className="category-field-label">
        {t("budgy.categories.form.previewLabel")}
      </span>
      <div className="category-preview">
        <CategoryBadge color={color} icon={icon} size="lg" />
        <Stack gap="xs">
          <Heading level={3} size={5}>
            {name.trim() || t("budgy.categories.form.previewPlaceholder")}
          </Heading>
          <StatusChip
            tone={kind === "revenu" ? "success" : "neutral"}
            label={t(`budgy.categories.kind.${kind}`)}
            size="small"
          />
        </Stack>
      </div>
    </Stack>
  );
}
