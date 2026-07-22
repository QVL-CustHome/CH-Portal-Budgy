import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Heading, Stack, useTranslation } from "canopui";
import type { ForecastCategoryView } from "../lib/forecast";
import { formatMoneyCents } from "../lib/money";

const CURRENCY = "EUR";
const MAX_STAGGER_INDEX = 8;

export interface PrevisionnelChartProps {
  categories: ForecastCategoryView[];
}

export default function PrevisionnelChart({
  categories,
}: PrevisionnelChartProps) {
  const { t, locale } = useTranslation();

  return (
    <Stack gap="sm">
      <Heading level={3} size={5}>
        {t("budgy.dashboard.forecast.categoriesTitle")}
      </Heading>
      <Box
        component="ul"
        display="flex"
        flexDirection="column"
        gap="0.75rem"
        margin={0}
        padding={0}
        aria-label={t("budgy.dashboard.forecast.chartAria")}
        sx={{ listStyle: "none" }}
      >
        {categories.map((category, index) => {
          const label =
            category.label ?? t("budgy.dashboard.forecast.uncategorized");
          const isPositive = category.netCents >= 0;
          const toneColor = isPositive
            ? "var(--ch-palette-success-main)"
            : "var(--ch-palette-error-main)";
          const formattedNet = formatMoneyCents(
            category.netCents,
            CURRENCY,
            locale,
            { signDisplay: true }
          );
          return (
            <Box
              key={category.key}
              component="li"
              className="previsionnel-chart-row budgy-enter"
              display="flex"
              flexDirection="column"
              gap="0.375rem"
              style={{
                animationDelay: `${Math.min(index, MAX_STAGGER_INDEX) * 55}ms`,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="baseline"
                gap="sm"
              >
                <Typography component="span" color="text.primary" noWrap>
                  {label}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    color: toneColor,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  {formattedNet}
                </Typography>
              </Stack>
              <Box
                position="relative"
                width="100%"
                height="0.5rem"
                sx={{
                  borderRadius: "var(--ch-radius-pill)",
                  backgroundColor: "var(--ch-palette-surface-sunken)",
                }}
              >
                <Box
                  aria-hidden="true"
                  position="absolute"
                  width="0.0625rem"
                  sx={{
                    top: "-0.125rem",
                    bottom: "-0.125rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor:
                      "color-mix(in srgb, var(--ch-palette-text-secondary) 40%, transparent)",
                  }}
                />
                <Box
                  position="absolute"
                  height="100%"
                  width="50%"
                  sx={{
                    top: 0,
                    borderRadius: "inherit",
                    backgroundColor: category.color,
                    transform: `scaleX(${category.fraction})`,
                    transformOrigin: isPositive ? "left center" : "right center",
                    left: isPositive ? "50%" : undefined,
                    right: isPositive ? undefined : "50%",
                    transition:
                      "transform var(--ch-motion-duration-slow) var(--ch-motion-ease-organic)",
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Stack>
  );
}
