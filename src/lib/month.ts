export function shiftMonth(month: string, delta: number): string {
  const [year, monthIndex] = month.split("-").map(Number);
  const date = new Date(year, monthIndex - 1 + delta, 1);
  const shiftedYear = date.getFullYear();
  const shiftedMonth = String(date.getMonth() + 1).padStart(2, "0");
  return `${shiftedYear}-${shiftedMonth}`;
}

export function recentMonths(from: string, count: number): string[] {
  return Array.from({ length: count }, (_, index) => shiftMonth(from, -index));
}
