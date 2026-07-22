import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Stack, useTranslation } from "canopui";
import type { PrevisionnelSummary } from "../hooks/usePrevisionnel";
import { formatMoneyCents } from "../lib/money";
import PrevisionnelBreakdown from "./PrevisionnelBreakdown";

const CURRENCY = "EUR";

export interface PrevisionnelHeroProps {
  summary: PrevisionnelSummary;
}

export default function PrevisionnelHero({ summary }: PrevisionnelHeroProps) {
  const { t, locale } = useTranslation();
  const isPositive = summary.soldePrevisionnelCents >= 0;
  const toneVar = isPositive
    ? "var(--ch-palette-success-main)"
    : "var(--ch-palette-error-main)";
  const formattedSolde = formatMoneyCents(
    summary.soldePrevisionnelCents,
    CURRENCY,
    locale,
    { signDisplay: true }
  );

  return (
    <Stack gap="md">
      <Box
        display="flex"
        flexDirection="column"
        gap="0.25rem"
        paddingX={2.5}
        paddingY={2}
        sx={{
          borderRadius: "var(--ch-radius-md)",
          border: `0.0625rem solid color-mix(in srgb, ${toneVar} 24%, transparent)`,
          backgroundColor: `color-mix(in srgb, ${toneVar} 8%, var(--ch-palette-background-default))`,
        }}
      >
        <Typography
          component="span"
          color="text.secondary"
          sx={{
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
          }}
        >
          {t("budgy.dashboard.forecast.soldeLabel")}
        </Typography>
        <Typography
          component="span"
          sx={{
            color: toneVar,
            fontSize: "2rem",
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          {formattedSolde}
        </Typography>
      </Box>
      <PrevisionnelBreakdown summary={summary} />
    </Stack>
  );
}
