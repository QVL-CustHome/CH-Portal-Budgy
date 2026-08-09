import { useState } from "react";
import {
  Button,
  Feedback,
  Input,
  Stack,
  useTranslation,
  type ChIconName,
} from "canopui";
import type { Enveloppe, EnveloppeInput } from "../api/budgy";
import CategoryColorPicker from "./CategoryColorPicker";
import CategoryIconPicker from "./CategoryIconPicker";
import FieldLabel from "./FieldLabel";

const COULEUR_DEFAUT = "#5E35B1";
const ICONE_DEFAUT: ChIconName = "wallet";

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
  const [icon, setIcon] = useState<ChIconName>(
    (initial?.icon as ChIconName) ?? ICONE_DEFAUT
  );

  const centimes = versCentimes(montant);
  const valide = nom.trim().length > 0 && centimes !== null;

  return (
    <Stack
      as="form"
      gap="md"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valide || centimes === null) return;
        onSubmit({ nom: nom.trim(), icon, color, montant_cents: centimes });
      }}
    >
      <Input
        label={t("budgy.enveloppes.form.name")}
        value={nom}
        onChange={setNom}
        required
        autoFocus
      />
      <Input
        label={t("budgy.enveloppes.form.amount")}
        value={montant}
        onChange={setMontant}
        required
      />

      <Stack gap="xs">
        <FieldLabel>{t("budgy.enveloppes.form.icon")}</FieldLabel>
        <CategoryIconPicker value={icon} onChange={setIcon} />
      </Stack>

      <Stack gap="xs">
        <FieldLabel>{t("budgy.enveloppes.form.color")}</FieldLabel>
        <CategoryColorPicker value={color} onChange={setColor} />
      </Stack>

      {error ? <Feedback severity="error">{error}</Feedback> : null}

      <Button type="submit" loading={saving} disabled={!valide}>
        {t("budgy.enveloppes.form.submit")}
      </Button>
    </Stack>
  );
}
