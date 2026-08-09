import { useCallback, useEffect, useState } from "react";
import { apiErrorMessage, useTranslation } from "canopui";
import { ApiError } from "../api/client";
import {
  creerEnveloppe,
  listEnveloppes,
  modifierEnveloppe,
  supprimerEnveloppe,
  type Enveloppe,
  type EnveloppeInput,
} from "../api/budgy";

export type EnveloppeEditor =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; enveloppe: Enveloppe };

export interface UseEnveloppesResult {
  enveloppes: Enveloppe[];
  loading: boolean;
  error: string | null;
  reload: () => void;
  editor: EnveloppeEditor;
  saving: boolean;
  saveError: string | null;
  deleteError: string | null;
  openCreate: () => void;
  openEdit: (enveloppe: Enveloppe) => void;
  closeEditor: () => void;
  submit: (input: EnveloppeInput) => Promise<void>;
  remove: (enveloppe: Enveloppe) => Promise<void>;
  dismissDeleteError: () => void;
}

export function useEnveloppes(): UseEnveloppesResult {
  const { t } = useTranslation();
  const [enveloppes, setEnveloppes] = useState<Enveloppe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editor, setEditor] = useState<EnveloppeEditor>({ mode: "closed" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const charger = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const reponse = await listEnveloppes();
      setEnveloppes(reponse.data);
    } catch (e: unknown) {
      const code = e instanceof ApiError ? e.code : undefined;
      setError(apiErrorMessage(t, code, t("budgy.enveloppes.loadError")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void charger();
  }, [charger]);

  const openCreate = useCallback(() => {
    setSaveError(null);
    setEditor({ mode: "create" });
  }, []);

  const openEdit = useCallback((enveloppe: Enveloppe) => {
    setSaveError(null);
    setEditor({ mode: "edit", enveloppe });
  }, []);

  const closeEditor = useCallback(() => setEditor({ mode: "closed" }), []);

  const submit = useCallback(
    async (input: EnveloppeInput) => {
      setSaving(true);
      setSaveError(null);
      try {
        if (editor.mode === "edit") {
          await modifierEnveloppe(editor.enveloppe.id, input);
        } else {
          await creerEnveloppe(input);
        }
        setEditor({ mode: "closed" });
        await charger();
      } catch (e: unknown) {
        const code = e instanceof ApiError ? e.code : undefined;
        setSaveError(apiErrorMessage(t, code, t("budgy.enveloppes.saveError")));
      } finally {
        setSaving(false);
      }
    },
    [charger, editor, t]
  );

  const remove = useCallback(
    async (enveloppe: Enveloppe) => {
      setDeleteError(null);
      try {
        await supprimerEnveloppe(enveloppe.id);
        await charger();
      } catch (e: unknown) {
        const code = e instanceof ApiError ? e.code : undefined;
        setDeleteError(
          apiErrorMessage(t, code, t("budgy.enveloppes.deleteError"))
        );
      }
    },
    [charger, t]
  );

  return {
    enveloppes,
    loading,
    error,
    reload: () => void charger(),
    editor,
    saving,
    saveError,
    deleteError,
    openCreate,
    openEdit,
    closeEditor,
    submit,
    remove,
    dismissDeleteError: () => setDeleteError(null),
  };
}
