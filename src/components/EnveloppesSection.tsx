import Typography from "@mui/material/Typography";
import {
  Button,
  CardGrid,
  Feedback,
  Icon,
  Spinner,
  Stack,
  useTranslation,
} from "canopui";
import EnveloppeCard from "./EnveloppeCard";
import EnveloppeEditorPanel from "./EnveloppeEditorPanel";
import { useEnveloppes } from "../hooks/useEnveloppes";

/**
 * Gestion des budgets, deuxième section de la page des catégories.
 *
 * Un budget n'est pas une catégorie : il ne dépend d'aucun mois et rien ne l'y
 * range automatiquement. C'est l'utilisateur qui y affecte ses transactions,
 * en plus de leur catégorie.
 */
export default function EnveloppesSection() {
  const { t } = useTranslation();
  const {
    enveloppes,
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
    submit,
    remove,
    dismissDeleteError,
  } = useEnveloppes();

  return (
    <Stack gap="md">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap="sm"
      >
        <Typography variant="h6" color="text.primary">
          {t("budgy.enveloppes.title")}
        </Typography>
        <Button
          onClick={openCreate}
          startIcon={<Icon name="plus" size="sm" color="inherit" />}
        >
          {t("budgy.enveloppes.add")}
        </Button>
      </Stack>

      <Typography variant="body2" color="text.secondary">
        {t("budgy.enveloppes.description")}
      </Typography>

      {deleteError ? (
        <Feedback severity="error" onClose={dismissDeleteError}>
          {deleteError}
        </Feedback>
      ) : null}

      {loading ? (
        <Stack alignItems="center" padding="lg">
          <Spinner ariaLabel={t("budgy.enveloppes.loading")} />
        </Stack>
      ) : error ? (
        <Stack gap="md" alignItems="start">
          <Feedback severity="error">{error}</Feedback>
          <Button variant="secondary" onClick={reload}>
            {t("budgy.enveloppes.retry")}
          </Button>
        </Stack>
      ) : enveloppes.length === 0 ? (
        <Feedback severity="info">{t("budgy.enveloppes.empty")}</Feedback>
      ) : (
        <CardGrid minItemWidth="16rem" gap="md">
          {enveloppes.map((enveloppe) => (
            <EnveloppeCard
              key={enveloppe.id}
              enveloppe={enveloppe}
              onEdit={openEdit}
              onDelete={(e) => void remove(e)}
            />
          ))}
        </CardGrid>
      )}

      <EnveloppeEditorPanel
        editor={editor}
        saving={saving}
        error={saveError}
        onSubmit={(input) => void submit(input)}
        onClose={closeEditor}
      />
    </Stack>
  );
}
