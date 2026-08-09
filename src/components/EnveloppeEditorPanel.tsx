import { SidePanel, useTranslation } from "canopui";
import type { EnveloppeInput } from "../api/budgy";
import type { EnveloppeEditor } from "../hooks/useEnveloppes";
import EnveloppeForm from "./EnveloppeForm";

export interface EnveloppeEditorPanelProps {
  editor: EnveloppeEditor;
  saving: boolean;
  error: string | null;
  onSubmit: (input: EnveloppeInput) => void;
  onClose: () => void;
}

export default function EnveloppeEditorPanel({
  editor,
  saving,
  error,
  onSubmit,
  onClose,
}: EnveloppeEditorPanelProps) {
  const { t } = useTranslation();
  const initial = editor.mode === "edit" ? editor.enveloppe : null;

  return (
    <SidePanel
      open={editor.mode !== "closed"}
      onClose={onClose}
      title={t(
        editor.mode === "edit"
          ? "budgy.enveloppes.form.editTitle"
          : "budgy.enveloppes.form.createTitle"
      )}
    >
      <EnveloppeForm
        key={initial?.id ?? "create"}
        initial={initial}
        saving={saving}
        error={error}
        onSubmit={onSubmit}
      />
    </SidePanel>
  );
}
