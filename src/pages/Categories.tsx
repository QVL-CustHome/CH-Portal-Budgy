import {
  Button,
  Feedback,
  Icon,
  PageContent,
  Spinner,
  Stack,
  useTranslation,
} from "canopui";
import CategoriesList from "../components/CategoriesList";
import CategoryEditorPanel from "../components/CategoryEditorPanel";
import { useCategoriesManager } from "../hooks/useCategoriesManager";

export default function Categories() {
  const { t } = useTranslation();
  const {
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
  } = useCategoriesManager();

  return (
    <PageContent title={t("budgy.categories.title")}>
      <Stack gap="lg">
        <Stack direction="row" justifyContent="end">
          <Button
            onClick={openCreate}
            startIcon={<Icon name="plus" size="sm" color="inherit" />}
          >
            {t("budgy.categories.add")}
          </Button>
        </Stack>

        {deleteError ? (
          <Feedback severity="error" onClose={dismissDeleteError}>
            {deleteError}
          </Feedback>
        ) : null}

        {loading ? (
          <Stack alignItems="center" padding="lg">
            <Spinner label={t("budgy.categories.loading")} />
          </Stack>
        ) : error ? (
          <Stack gap="md" alignItems="start">
            <Feedback severity="error">{error}</Feedback>
            <Button variant="secondary" onClick={reload}>
              {t("budgy.categories.retry")}
            </Button>
          </Stack>
        ) : categories.length === 0 ? (
          <Feedback severity="info">{t("budgy.categories.empty")}</Feedback>
        ) : (
          <CategoriesList
            categories={categories}
            onEdit={openEdit}
            onDelete={deleteCategory}
          />
        )}
      </Stack>

      <CategoryEditorPanel
        editor={editor}
        saving={saving}
        error={saveError}
        onSubmit={submitCategory}
        onClose={closeEditor}
      />
    </PageContent>
  );
}
