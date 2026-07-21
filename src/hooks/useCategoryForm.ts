import { useMemo, useState } from "react";
import { useTranslation, type ChIconName } from "canopui";
import type { Category, CategoryInput, CategoryKind } from "../api/budgy";
import {
  DEFAULT_CATEGORY_COLOR,
  DEFAULT_CATEGORY_ICON,
  DEFAULT_CATEGORY_KIND,
  toCategoryIcon,
  validateCategoryName,
} from "../lib/categories";

interface UseCategoryFormParams {
  initial: Category | null;
  onSubmit: (input: CategoryInput) => void;
}

interface UseCategoryFormResult {
  name: string;
  kind: CategoryKind;
  color: string;
  icon: ChIconName;
  nameError: string | null;
  canSubmit: boolean;
  setName: (value: string) => void;
  setKind: (value: CategoryKind) => void;
  setColor: (value: string) => void;
  setIcon: (value: ChIconName) => void;
  handleSubmit: () => void;
}

export function useCategoryForm({
  initial,
  onSubmit,
}: UseCategoryFormParams): UseCategoryFormResult {
  const { t } = useTranslation();
  const [name, setName] = useState(initial?.name ?? "");
  const [kind, setKind] = useState<CategoryKind>(
    initial?.kind ?? DEFAULT_CATEGORY_KIND
  );
  const [color, setColor] = useState(initial?.color ?? DEFAULT_CATEGORY_COLOR);
  const [icon, setIcon] = useState<ChIconName>(
    initial ? toCategoryIcon(initial.icon) : DEFAULT_CATEGORY_ICON
  );
  const [touched, setTouched] = useState(false);

  const nameErrorKind = validateCategoryName(name);

  const nameError = useMemo(() => {
    if (!touched || !nameErrorKind) {
      return null;
    }
    return nameErrorKind === "required"
      ? t("budgy.categories.form.nameRequired")
      : t("budgy.categories.form.nameTooLong");
  }, [touched, nameErrorKind, t]);

  function handleName(value: string) {
    setName(value);
    setTouched(true);
  }

  function handleSubmit() {
    setTouched(true);
    if (nameErrorKind) {
      return;
    }
    onSubmit({ name: name.trim(), kind, color, icon });
  }

  return {
    name,
    kind,
    color,
    icon,
    nameError,
    canSubmit: !nameErrorKind,
    setName: handleName,
    setKind,
    setColor,
    setIcon,
    handleSubmit,
  };
}
