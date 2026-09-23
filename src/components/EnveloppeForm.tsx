import { useState } from "react";
import { Form, InputText, useTranslation, type CanopIconName } from "canopui";
import type { Enveloppe, EnveloppeInput } from "../api/budgy";
import CategoryColorPicker from "./CategoryColorPicker";
import CategoryIconPicker from "./CategoryIconPicker";

const COULEUR_DEFAUT = "#5E35B1";
const ICONE_DEFAUT: CanopIconName = "wallet";
const NOM_MAX = 30;

export interface EnveloppeFormProps {
  initial: Enveloppe | null;
  saving: boolean;
  error: string | null;
  onSubmit: (input: EnveloppeInput) => void;
}

/** Saisie en euros ; l'API travaille en centimes. */
function versCentimes(saisie: string): number | null {
  const normalise = saisie.replace(",", ".").trim();
  if (normalise === "") return null;
  const valeur = Number(normalise);
  if (!Number.isFinite(valeur) || valeur < 0) return null;
  return Math.round(valeur * 100);
}

export default function EnveloppeForm({
  initial,
  saving,
  error,
  onSubmit,
}: EnveloppeFormProps) {
  const { t } = useTranslation();
  const [nom, setNom] = useState(initial?.nom ?? "");
  const [montant, setMontant] = useState(
    initial ? String(initial.montant_cents / 100) : ""
  );
  const [color, setColor] = useState(initial?.color ?? COULEUR_DEFAUT);
  const [icon, setIcon] = useState<CanopIconName>(
    (initial?.icon as CanopIconName) ?? ICONE_DEFAUT
  );

  const centimes = versCentimes(montant);
  const nomTropLong = nom.trim().length > NOM_MAX;
  const montantInvalide = montant.trim() !== "" && centimes === null;
  const peutValider = nom.trim().length > 0 && !nomTropLong && centimes !== null;

  return (
    <Form
      onSubmit={() => {
        if (!peutValider || centimes === null) return;
        onSubmit({ nom: nom.trim(), icon, color, montant_cents: centimes });
      }}
      submitLabel={t(
        initial
          ? "budgy.enveloppes.form.submitEdit"
          : "budgy.enveloppes.form.submitCreate"
      )}
      loading={saving}
      submitDisabled={!peutValider}
      error={error}
      gap="lg"
    >
      <InputText
        label={t("budgy.enveloppes.form.name")}
        placeholder={t("budgy.enveloppes.form.namePlaceholder")}
        value={nom}
        onChange={setNom}
        error={nomTropLong ? t("budgy.enveloppes.form.nameTooLong") : undefined}
        required
        autoFocus
        fullWidth
        helperText={t("budgy.enveloppes.form.nameHelper", { max: NOM_MAX })}
      />
      <InputText
        label={t("budgy.enveloppes.form.amount")}
        placeholder={t("budgy.enveloppes.form.amountPlaceholder")}
        value={montant}
        onChange={setMontant}
        error={montantInvalide ? t("budgy.enveloppes.form.amountInvalid") : undefined}
        required
        fullWidth
        helperText={t("budgy.enveloppes.form.amountHelper")}
      />
      <CategoryColorPicker value={color} onChange={setColor} />
      <CategoryIconPicker value={icon} onChange={setIcon} />
    </Form>
  );
}
