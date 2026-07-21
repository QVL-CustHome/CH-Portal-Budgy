import { useCallback, useState } from "react";
import { apiErrorMessage, useTranslation } from "canopui";
import { ApiError } from "../api/client";
import {
  creerCategorie,
  modifierCategorie,
  supprimerCategorie,
  type Category,
  type CategoryInput,
} from "../api/budgy";
import { useCategories } from "./useCategories";

export type CategoryEditor =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; category: Category };

interface UseCategoriesManagerResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  editor: CategoryEditor;
  saving: boolean;
  saveError: string | null;
  deleteError: string | null;
  openCreate: () => void;
  openEdit: (category: Category) => void;
  closeEditor: () => void;
  submitCategory: (input: CategoryInput) => Promise<void>;
  deleteCategory: (category: Category) => Promise<void>;
  dismissDeleteError: () => void;
}

export function useCategoriesManager(): UseCategoriesManagerResult {
  const { t } = useTranslation();
  const { categories, loading, error, reload } = useCategories();
  const [editor, setEditor] = useState<CategoryEditor>({ mode: "closed" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openCreate = useCallback(() => {
    setSaveError(null);
    setEditor({ mode: "create" });
  }, []);

  const openEdit = useCallback((category: Category) => {
    setSaveError(null);
    setEditor({ mode: "edit", category });
  }, []);

  const closeEditor = useCallback(() => {
    setEditor({ mode: "closed" });
  }, []);

  const submitCategory = useCallback(
    async (input: CategoryInput) => {
      setSaving(true);
      setSaveError(null);
      try {
        if (editor.mode === "edit") {
          await modifierCategorie(editor.category.id, input);
        } else {
          await creerCategorie(input);
        }
        reload();
        setEditor({ mode: "closed" });
      } catch (caught) {
        const code = caught instanceof ApiError ? caught.code : undefined;
        setSaveError(apiErrorMessage(t, code, t("budgy.categories.form.error")));
      } finally {
        setSaving(false);
      }
    },
    [editor, reload, t]
  );

  const deleteCategory = useCallback(
    async (category: Category) => {
      setDeleteError(null);
      try {
        await supprimerCategorie(category.id);
        reload();
      } catch (caught) {
        const code = caught instanceof ApiError ? caught.code : undefined;
        setDeleteError(
          apiErrorMessage(t, code, t("budgy.categories.delete.error"))
        );
      }
    },
    [reload, t]
  );

  const dismissDeleteError = useCallback(() => setDeleteError(null), []);

  return {
    categories,
    loading,
    error,
    reload,
    editor,
    saving,
    saveError,
    deleteError,
    openCreate,
    openEdit,
    closeEditor,
    submitCategory,
    deleteCategory,
    dismissDeleteError,
  };
}
