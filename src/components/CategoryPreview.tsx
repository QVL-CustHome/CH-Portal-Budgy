import Box from "@mui/material/Box";
import {
  Heading,
  Stack,
  StatusChip,
  useTranslation,
  type ChIconName,
} from "canopui";
import type { CategoryKind } from "../api/budgy";
import CategoryBadge from "./CategoryBadge";
import FieldLabel from "./FieldLabel";

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
      <FieldLabel>{t("budgy.categories.form.previewLabel")}</FieldLabel>
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        padding={2}
        sx={{
          borderRadius: "var(--ch-radius-md)",
          border: "0.0625rem solid",
          borderColor: "divider",
          backgroundColor: "background.default",
        }}
      >
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
      </Box>
    </Stack>
  );
}
