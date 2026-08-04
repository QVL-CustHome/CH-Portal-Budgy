import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Feedback,
  MultiSelect,
  Spinner,
  Stack,
  useTranslation,
  type ChMultiSelectOption,
} from "canopui";
import { useResteADepenser } from "../hooks/useResteADepenser";
import ResteADepenserList from "./ResteADepenserList";

const TOUTES = "__all__";

export default function ResteADepenserBlock() {
  const { t } = useTranslation();
  // Mois courant uniquement (pas de navigation mensuelle sur le dashboard).
  const { categories, isEmpty, loading, error, reload } = useResteADepenser();

  const [selected, setSelected] = useState<string>(TOUTES);

  const categoryOptions = useMemo<ChMultiSelectOption[]>(
    () => [
      { value: TOUTES, label: t("budgy.dashboard.remaining.allCategories") },
      ...categories.map((category) => ({
        value: category.category_id,
        label: category.category_name,
      })),
    ],
    [categories, t]
  );

  const visibleCategories = useMemo(
    () =>
      selected === TOUTES
        ? categories
        : categories.filter((category) => category.category_id === selected),
    [categories, selected]
  );

  return (
    <Card title={t("budgy.dashboard.remaining.title")} elevation="sm" fill>
      <Stack gap="md">
        {loading ? (
          <Stack alignItems="center" padding="lg">
            <Spinner label={t("budgy.dashboard.remaining.loading")} />
          </Stack>
        ) : error ? (
          <Stack gap="md" alignItems="start">
            <Feedback severity="error">{error}</Feedback>
            <Button variant="secondary" onClick={reload}>
              {t("budgy.dashboard.remaining.retry")}
            </Button>
          </Stack>
        ) : isEmpty ? (
          <Feedback severity="info">
            {t("budgy.dashboard.remaining.empty")}
          </Feedback>
        ) : (
          <Stack gap="md">
            <MultiSelect
              label={t("budgy.dashboard.remaining.category")}
              options={categoryOptions}
              value={[selected]}
              onChange={(next) =>
                setSelected(next.length > 0 ? next[next.length - 1] : TOUTES)
              }
            />
            <ResteADepenserList categories={visibleCategories} />
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
