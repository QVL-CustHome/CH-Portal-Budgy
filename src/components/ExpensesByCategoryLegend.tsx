import type { ExpenseSegmentView } from "./ExpensesByCategoryChart";

export interface ExpensesByCategoryLegendProps {
  segments: ExpenseSegmentView[];
}

export default function ExpensesByCategoryLegend({
  segments,
}: ExpensesByCategoryLegendProps) {
  return (
    <ul className="expenses-legend">
      {segments.map((segment, index) => (
        <li
          key={segment.key}
          className="expenses-legend-item"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <span
            className="expenses-legend-dot"
            style={{ backgroundColor: segment.color }}
          />
          <span className="expenses-legend-label">{segment.label}</span>
          <span className="expenses-legend-value">
            <span className="expenses-legend-amount">{segment.amount}</span>
            <span className="expenses-legend-percent">{segment.percent}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
