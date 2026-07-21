import {
  Card,
  DeleteButton,
  EditButton,
  Heading,
  Stack,
  StatusChip,
  useTranslation,
} from "canopui";
import type { Category } from "../api/budgy";
import { toCategoryIcon } from "../lib/categories";
import CategoryBadge from "./CategoryBadge";

export interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => Promise<void>;
}

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  const { t } = useTranslation();
  const editable = category.is_default !== true;
  const transactionCount = category.transaction_count ?? 0;

  const deleteMessage =
    transactionCount > 0
      ? t("budgy.categories.delete.messageWithTransactions", {
          name: category.name,
          count: transactionCount,
        })
      : t("budgy.categories.delete.message", { name: category.name });

  return (
    <Card elevation="sm" fill>
      <Stack direction="row" alignItems="center" gap="md">
        <CategoryBadge
          color={category.color}
          icon={toCategoryIcon(category.icon)}
          size="lg"
        />
        <Stack gap="xs" fill>
          <Heading level={3} size={5}>
            {category.name}
          </Heading>
          <Stack direction="row" gap="sm" wrap alignItems="center">
            <StatusChip
              tone={category.kind === "revenu" ? "success" : "neutral"}
              label={t(`budgy.categories.kind.${category.kind}`)}
              size="small"
            />
            {!editable ? (
              <StatusChip
                tone="info"
                label={t("budgy.categories.default")}
                size="small"
              />
            ) : null}
          </Stack>
        </Stack>
        {editable ? (
          <Stack direction="row" gap="xs" alignItems="center">
            <EditButton
              aria-label={t("budgy.categories.editAria", {
                name: category.name,
              })}
              onClick={() => onEdit(category)}
            />
            <DeleteButton
              aria-label={t("budgy.categories.deleteAria", {
                name: category.name,
              })}
              confirmTitle={t("budgy.categories.delete.title")}
              confirmMessage={deleteMessage}
              confirmLabel={t("budgy.categories.delete.confirm")}
              cancelLabel={t("budgy.categories.delete.cancel")}
              onConfirm={() => onDelete(category)}
            />
          </Stack>
        ) : null}
      </Stack>
    </Card>
  );
}
