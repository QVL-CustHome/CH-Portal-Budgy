export interface MonthSelectorProps {
  label: string;
  previousLabel: string;
  nextLabel: string;
  canGoNext: boolean;
  disabled?: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M15 5 8 12l7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 5l7 7-7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MonthSelector({
  label,
  previousLabel,
  nextLabel,
  canGoNext,
  disabled,
  onPrevious,
  onNext,
}: MonthSelectorProps) {
  return (
    <div className="month-selector">
      <button
        type="button"
        className="month-selector-nav"
        aria-label={previousLabel}
        disabled={disabled}
        onClick={onPrevious}
      >
        <ChevronLeft />
      </button>
      <span className="month-selector-label">{label}</span>
      <button
        type="button"
        className="month-selector-nav"
        aria-label={nextLabel}
        disabled={disabled || !canGoNext}
        onClick={onNext}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
