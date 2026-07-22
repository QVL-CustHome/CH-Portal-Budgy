import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Heading,
  ProgressBar,
  Stack,
  StatusChip,
  useTranslation,
  type ChProgressSegment,
} from "canopui";
import type { RemainingBudgetCategory } from "../api/budgy";
import { formatMoneyCents } from "../lib/money";
import { toCategoryIcon } from "../lib/categories";
import CategoryBadge from "./CategoryBadge";

export interface ResteADepenserItemProps {
  category: RemainingBudgetCategory;
}

const CURRENCY = "EUR";

export default function ResteADepenserItem({
  category,
}: ResteADepenserItemProps) {
  const { t, locale } = useTranslation();

  const spent = formatMoneyCents(category.depense_cents, CURRENCY, locale);
  const planned = formatMoneyCents(
    category.montant_prevu_cents,
    CURRENCY,
    locale
  );
  const remaining = formatMoneyCents(category.reste_cents, CURRENCY, locale);
  const overspent = formatMoneyCents(
    category.depassement_cents,
    CURRENCY,
    locale
  );

  const progressSegments: ChProgressSegment[] = [
    {
      value: category.depense_cents,
      color: category.depasse ? "error" : "primary",
    },
  ];
  const progressMax = Math.max(
    category.montant_prevu_cents,
    category.depense_cents
  );

  return (
    <Box
      padding={2}
      sx={{
        borderRadius: "var(--ch-radius-md)",
        border: "0.0625rem solid",
        borderColor: category.depasse ? "error.main" : "divider",
        backgroundColor: category.depasse
          ? "color-mix(in srgb, var(--ch-palette-error-main) 8%, var(--ch-palette-background-paper))"
          : "background.paper",
      }}
    >
      <Stack gap="sm">
        <Stack direction="row" alignItems="center" gap="md">
          <CategoryBadge
            color={category.color}
            icon={toCategoryIcon(category.icon)}
            size="md"
          />
          <Stack gap="xs" fill>
            <Heading level={3} size={5}>
              {category.category_name}
            </Heading>
            <Typography variant="body2" color="text.secondary">
              {t("budgy.dashboard.remaining.spentOfPlanned", {
                spent,
                planned,
              })}
            </Typography>
          </Stack>
          {category.depasse ? (
            <StatusChip
              tone="error"
              size="small"
              label={t("budgy.dashboard.remaining.overspentBy", {
                amount: overspent,
              })}
            />
          ) : null}
        </Stack>

        <ProgressBar
          segments={progressSegments}
          max={progressMax}
          ariaLabel={t("budgy.dashboard.remaining.progressAria", {
            spent,
            planned,
          })}
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="baseline"
        >
          <Typography variant="body2" color="text.secondary">
            {t("budgy.dashboard.remaining.remainingLabel")}
          </Typography>
          <Typography
            component="span"
            color={category.depasse ? "error.main" : "primary.main"}
            sx={{ fontSize: "1.125rem", fontWeight: 700, whiteSpace: "nowrap" }}
          >
            {remaining}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
