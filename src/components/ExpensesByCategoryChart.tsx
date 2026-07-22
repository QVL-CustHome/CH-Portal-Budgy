export interface ExpenseSegmentView {
  key: string;
  label: string;
  color: string;
  amount: string;
  percent: string;
  fraction: number;
  startFraction: number;
  title: string;
}

export interface ExpensesByCategoryChartProps {
  segments: ExpenseSegmentView[];
  centerAmount: string;
  centerCaption: string;
  ariaLabel: string;
}

const RADIUS = 52;
const CENTER = 60;
const STROKE_WIDTH = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ExpensesByCategoryChart({
  segments,
  centerAmount,
  centerCaption,
  ariaLabel,
}: ExpensesByCategoryChartProps) {
  return (
    <div className="expenses-donut">
      <svg viewBox="0 0 120 120" role="img" aria-label={ariaLabel}>
        <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
          {segments.map((segment) => (
            <circle
              key={segment.key}
              className="expenses-donut-segment"
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={`${segment.fraction * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={-segment.startFraction * CIRCUMFERENCE}
              style={{ stroke: segment.color }}
            >
              <title>{segment.title}</title>
            </circle>
          ))}
        </g>
      </svg>
      <div className="expenses-donut-center">
        <span className="expenses-donut-total">{centerAmount}</span>
        <span className="expenses-donut-caption">{centerCaption}</span>
      </div>
    </div>
  );
}
