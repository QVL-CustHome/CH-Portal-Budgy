import { Form, InputText, useTranslation } from "canopui";
import type { Category, CategoryInput } from "../api/budgy";
import { CATEGORY_NAME_MAX } from "../lib/categories";
import { useCategoryForm } from "../hooks/useCategoryForm";
import CategoryPreview from "./CategoryPreview";
import CategoryKindSelector from "./CategoryKindSelector";
import CategoryColorPicker from "./CategoryColorPicker";
import CategoryIconPicker from "./CategoryIconPicker";

export interface CategoryFormProps {
  initial: Category | null;
  saving: boolean;
  error: string | null;
  onSubmit: (input: CategoryInput) => void;
}

export default function CategoryForm({
  initial,
  saving,
  error,
  onSubmit,
}: CategoryFormProps) {
  const { t } = useTranslation();
  const form = useCategoryForm({ initial, onSubmit });

  return (
    <Form
      onSubmit={form.handleSubmit}
      submitLabel={t(
        initial
          ? "budgy.categories.form.submitEdit"
          : "budgy.categories.form.submitCreate"
      )}
      loading={saving}
      submitDisabled={!form.canSubmit}
      error={error}
      gap="lg"
    >
      <CategoryPreview
        name={form.name}
        kind={form.kind}
        color={form.color}
        icon={form.icon}
      />
      <InputText
        label={t("budgy.categories.form.nameLabel")}
        placeholder={t("budgy.categories.form.namePlaceholder")}
        value={form.name}
        onChange={form.setName}
        error={form.nameError}
        required
        autoFocus
        fullWidth
        helperText={t("budgy.categories.form.nameHelper", {
          max: CATEGORY_NAME_MAX,
        })}
      />
      <CategoryKindSelector value={form.kind} onChange={form.setKind} />
      <CategoryColorPicker value={form.color} onChange={form.setColor} />
      <CategoryIconPicker value={form.icon} onChange={form.setIcon} />
    </Form>
  );
}
