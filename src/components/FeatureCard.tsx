import { Card, Icon, Stack, StatusChip, type ChIconName } from "@custhome/ui";

export interface FeatureCardProps {
  icon: ChIconName;
  title: string;
  description: string;
  badge?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  badge,
}: FeatureCardProps) {
  return (
    <Card title={title} subtitle={description} fill>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Icon name={icon} size="lg" color="primary" />
        {badge ? <StatusChip tone="info" label={badge} /> : null}
      </Stack>
    </Card>
  );
}
