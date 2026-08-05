import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Button,
  Card,
  Feedback,
  Spinner,
  Stack,
  useTranslation,
} from "canopui";
import { useResteADepenser } from "../hooks/useResteADepenser";
import ResteADepenserList from "./ResteADepenserList";
import CategoryFilterSelect, { ALL_CATEGORIES } from "./CategoryFilterSelect";
import { formatMoneyCents } from "../lib/money";

const CURRENCY = "EUR";

export default function ResteADepenserBlock() {
  const { t, locale } = useTranslation();
  // Mois courant uniquement (pas de navigation mensuelle sur le dashboard).
  const { categories, total, isEmpty, loading, error, reload } =
    useResteADepenser();
  const [selected, setSelected] = useState<string>(ALL_CATEGORIES);

  const visibleCategories = useMemo(
    () =>
      selected === ALL_CATEGORIES
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
        ) : (
          <>
            {isEmpty ? (
              <Feedback severity="info">
                {t("budgy.dashboard.remaining.empty")}
              </Feedback>
            ) : (
              <Stack gap="md">
                <CategoryFilterSelect
                  categories={categories}
                  value={selected}
                  onChange={setSelected}
                />
                <ResteADepenserList categories={visibleCategories} />
              </Stack>
            )}
            {total ? (
              <Box
                sx={{
                  borderTop: "0.0625rem solid",
                  borderColor: "divider",
                  paddingTop: "0.75rem",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="baseline"
                  gap="md"
                >
                  <Typography color="text.primary" sx={{ fontWeight: 600 }}>
                    {t("budgy.dashboard.remaining.totalLabel")}
                  </Typography>
                  <Typography
                    component="span"
                    color={total.reste_cents < 0 ? "error.main" : "primary.main"}
                    sx={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatMoneyCents(total.reste_cents, CURRENCY, locale)}
                  </Typography>
                </Stack>
              </Box>
            ) : null}
          </>
        )}
      </Stack>
    </Card>
  );
}
