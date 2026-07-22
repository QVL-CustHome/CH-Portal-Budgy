import { CardGrid } from "canopui";
import type { ReactNode } from "react";

export interface DashboardGridProps {
  children: ReactNode;
}

export default function DashboardGrid({ children }: DashboardGridProps) {
  return (
    <CardGrid minItemWidth="22rem" gap="lg">
      {children}
    </CardGrid>
  );
}
