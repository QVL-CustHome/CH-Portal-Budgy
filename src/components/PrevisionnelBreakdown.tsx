import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "canopui";
import type { PrevisionnelSummary } from "../hooks/usePrevisionnel";
import { formatMoneyCents } from "../lib/money";

const CURRENCY = "EUR";

type BreakdownTone = "positive" | "negative";

interface BreakdownItem {
  key: string;
  label: string;
  amountCents: number;
  tone: BreakdownTone;
}

const toneColor: Record<BreakdownTone, string> = {
  positive: "var(--ch-palette-success-main)",
  negative: "var(--ch-palette-error-main)",
};

export interface PrevisionnelBreakdownProps {
  summary: PrevisionnelSummary;
}

export default function PrevisionnelBreakdown({
  summary,
}: PrevisionnelBreakdownProps) {
  const { t, locale } = useTranslation();

  const items: BreakdownItem[] = [
    {
      key: "revenus",
      label: t("budgy.dashboard.forecast.revenusLabel"),
      amountCents: summary.revenusRecurrentsCents,
      tone: "positive",
    },
    {
      key: "depenses",
      label: t("budgy.dashboard.forecast.depensesLabel"),
      amountCents: summary.depensesRecurrentesCents,
      tone: "negative",
    },
    {
      key: "budgets",
      label: t("budgy.dashboard.forecast.budgetsLabel"),
      amountCents: summary.budgetsCents,
      tone: "negative",
    },
  ];

  return (
    <Box
      className="previsionnel-breakdown"
      component="ul"
      display="flex"
      flexDirection="column"
      gap="0.5rem"
      margin={0}
      padding={0}
      sx={{ listStyle: "none" }}
    >
      {items.map((item) => {
        const signedCents =
          item.tone === "negative" ? -item.amountCents : item.amountCents;
        return (
          <Box
            key={item.key}
            component="li"
            display="grid"
            alignItems="center"
            gap="0.625rem"
            sx={{ gridTemplateColumns: "auto 1fr auto" }}
          >
            <Box
              width="0.75rem"
              height="0.75rem"
              flex="none"
              borderRadius="50%"
              sx={{ backgroundColor: toneColor[item.tone] }}
            />
            <Typography component="span" color="text.primary" noWrap>
              {item.label}
            </Typography>
            <Typography
              component="span"
              sx={{
                color: toneColor[item.tone],
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {formatMoneyCents(signedCents, CURRENCY, locale, {
                signDisplay: true,
              })}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
