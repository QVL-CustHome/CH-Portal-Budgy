import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "canopui";
import type { PrevisionnelSummary } from "../hooks/usePrevisionnel";
import { formatMoneyCents } from "../lib/money";

const CURRENCY = "EUR";

type BreakdownTone = "neutral" | "positive" | "negative";

interface BreakdownItem {
  key: string;
  label: string;
  amountCents: number;
  tone: BreakdownTone;
}

const toneColor: Record<BreakdownTone, string> = {
  neutral: "var(--canop-palette-text-primary)",
  positive: "var(--canop-palette-success-main)",
  negative: "var(--canop-palette-error-main)",
};

export interface PrevisionnelBreakdownProps {
  summary: PrevisionnelSummary;
}

export default function PrevisionnelBreakdown({
  summary,
}: PrevisionnelBreakdownProps) {
  const { t, locale } = useTranslation();

  // Le détail rend le calcul lisible : on part du solde d'aujourd'hui, on
  // ajoute ce qui doit encore rentrer et on retire ce qui doit encore sortir.
  const items: BreakdownItem[] = [
    {
      key: "solde",
      label: t("budgy.dashboard.forecast.soldeActuelLabel"),
      amountCents: summary.soldeActuelCents,
      tone: "neutral",
    },
    {
      key: "revenus",
      label: t("budgy.dashboard.forecast.revenusLabel"),
      amountCents: summary.revenusRestantsCents,
      tone: "positive",
    },
    {
      key: "depenses",
      label: t("budgy.dashboard.forecast.depensesLabel"),
      amountCents: summary.depensesRestantesCents,
      tone: "negative",
    },
  ];

  return (
    <Box
      className="previsionnel-breakdown"
      component="ul"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        margin: 0,
        padding: 0,
        listStyle: "none",
      }}
    >
      {items.map((item) => {
        const signedCents =
          item.tone === "negative" ? -item.amountCents : item.amountCents;
        return (
          <Box
            key={item.key}
            component="li"
            sx={{
              display: "grid",
              alignItems: "center",
              gap: "0.625rem",
              gridTemplateColumns: "auto 1fr auto",
            }}
          >
            <Box
              sx={{
                width: "0.75rem",
                height: "0.75rem",
                flex: "none",
                borderRadius: "50%",
                backgroundColor: toneColor[item.tone],
              }}
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
