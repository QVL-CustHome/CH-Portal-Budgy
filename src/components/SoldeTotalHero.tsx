import { Heading, Stack } from "canopui";

export interface SoldeTotalHeroProps {
  label: string;
  formattedAmount: string;
}

export default function SoldeTotalHero({
  label,
  formattedAmount,
}: SoldeTotalHeroProps) {
  return (
    <Stack gap="xs">
      <Heading level={3} size={5}>
        {label}
      </Heading>
      <Heading level={2} size={2}>
        {formattedAmount}
      </Heading>
    </Stack>
  );
}
