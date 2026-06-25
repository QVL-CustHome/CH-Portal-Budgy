import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  Icon,
  Link,
  Stack,
  StatusChip,
  useTranslation,
  type ChIconName,
} from "@custhome/ui";

export interface FeatureCardProps {
  icon: ChIconName;
  title: string;
  description: string;
  badge?: string;
  to?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  badge,
  to,
}: FeatureCardProps) {
  const { t } = useTranslation();

  return (
    <Card
      title={title}
      subtitle={description}
      fill
      actions={
        to ? (
          <Link component={RouterLink} to={to}>
            {t("budgy.home.open")}
          </Link>
        ) : undefined
      }
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Icon name={icon} size="lg" color="primary" />
        {badge ? <StatusChip tone="info" label={badge} /> : null}
      </Stack>
    </Card>
  );
}
