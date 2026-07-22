import type { ReactNode } from "react";

const MAX_STAGGER_INDEX = 8;
const STAGGER_STEP_MS = 55;

export interface AnimatedListItemProps {
  index: number;
  children: ReactNode;
}

export default function AnimatedListItem({
  index,
  children,
}: AnimatedListItemProps) {
  const delay = Math.min(index, MAX_STAGGER_INDEX) * STAGGER_STEP_MS;
  return (
    <div className="budgy-enter" style={{ animationDelay: `${delay}ms`, width: "100%" }}>
      {children}
    </div>
  );
}
