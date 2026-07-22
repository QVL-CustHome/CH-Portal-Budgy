import type { CSSProperties } from "react";
import { Heading, Stack, useTranslation } from "canopui";
import type { ForecastCategoryView } from "../lib/forecast";
import { formatMoneyCents } from "../lib/money";

const CURRENCY = "EUR";
const MAX_STAGGER_INDEX = 8;

type BarStyle = CSSProperties & {
  "--forecast-fraction": string;
  "--forecast-color": string;
};

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
      <ul
        className="previsionnel-chart"
        aria-label={t("budgy.dashboard.forecast.chartAria")}
      >
        {categories.map((category, index) => {
          const label =
            category.label ?? t("budgy.dashboard.forecast.uncategorized");
          const sign = category.netCents >= 0 ? "positive" : "negative";
          const formattedNet = formatMoneyCents(
            category.netCents,
            CURRENCY,
            locale,
            { signDisplay: true }
          );
          const barStyle: BarStyle = {
            "--forecast-fraction": String(category.fraction),
            "--forecast-color": category.color,
          };
          return (
            <li
              key={category.key}
              className="previsionnel-chart-row"
              style={{
                animationDelay: `${Math.min(index, MAX_STAGGER_INDEX) * 55}ms`,
              }}
            >
              <div className="previsionnel-chart-head">
                <span className="previsionnel-chart-label">{label}</span>
                <span className="previsionnel-chart-amount" data-sign={sign}>
                  {formattedNet}
                </span>
              </div>
              <div className="previsionnel-chart-track">
                <span className="previsionnel-chart-axis" aria-hidden="true" />
                <span
                  className="previsionnel-chart-fill"
                  data-sign={sign}
                  style={barStyle}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Stack>
  );
}
