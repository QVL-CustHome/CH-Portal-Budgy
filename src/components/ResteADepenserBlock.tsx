import {
  Button,
  Card,
  Feedback,
  Spinner,
  Stack,
  useTranslation,
} from "canopui";
import { useResteADepenser } from "../hooks/useResteADepenser";
import MonthSelector from "./MonthSelector";
import ResteADepenserList from "./ResteADepenserList";

export default function ResteADepenserBlock() {
  const { t } = useTranslation();
  const {
    month,
    monthOptions,
    categories,
    isEmpty,
    loading,
    error,
    selectMonth,
    reload,
  } = useResteADepenser();

  return (
    <Card title={t("budgy.dashboard.remaining.title")} elevation="sm" fill>
      <Stack gap="md">
        <MonthSelector
          months={monthOptions}
          value={month}
          onChange={selectMonth}
        />

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
          <ResteADepenserList categories={categories} />
        )}
      </Stack>
    </Card>
  );
}
