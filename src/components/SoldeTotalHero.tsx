import { StatCard } from "canopui";

export interface SoldeTotalHeroProps {
  label: string;
  formattedAmount: string;
}

export default function SoldeTotalHero({
  label,
  formattedAmount,
}: SoldeTotalHeroProps) {
  return <StatCard label={label} value={formattedAmount} />;
}
