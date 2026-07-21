import { SidePanel, useTranslation } from "canopui";
import type { CategoryInput } from "../api/budgy";
import type { CategoryEditor } from "../hooks/useCategoriesManager";
import CategoryForm from "./CategoryForm";

export interface CategoryEditorPanelProps {
  editor: CategoryEditor;
  saving: boolean;
  error: string | null;
  onSubmit: (input: CategoryInput) => void;
  onClose: () => void;
}

export default function CategoryEditorPanel({
  editor,
  saving,
  error,
  onSubmit,
  onClose,
}: CategoryEditorPanelProps) {
  const { t } = useTranslation();
  const isEdit = editor.mode === "edit";
  const initial = editor.mode === "edit" ? editor.category : null;

  return (
    <SidePanel
      open={editor.mode !== "closed"}
      onClose={onClose}
      title={t(
        isEdit
          ? "budgy.categories.form.editTitle"
          : "budgy.categories.form.createTitle"
      )}
    >
      <CategoryForm
        key={initial?.id ?? "create"}
        initial={initial}
        saving={saving}
        error={error}
        onSubmit={onSubmit}
      />
    </SidePanel>
  );
}
