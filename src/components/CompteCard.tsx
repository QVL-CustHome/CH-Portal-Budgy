import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  DescriptionList,
  Heading,
  Link,
  Stack,
  StatusChip,
  useTranslation,
} from "canopui";
import type { Account } from "../api/budgy";
import { formatMoneyCents } from "../lib/money";
import { formatDate } from "../lib/date";

export interface CompteCardProps {
  account: Account;
}

export default function CompteCard({ account }: CompteCardProps) {
  const { t, locale } = useTranslation();
  const { balance } = account;

  return (
    <Card
      title={account.iban_masked}
      subtitle={
        balance
          ? t("budgy.accounts.updatedAt", {
              date: formatDate(balance.at, locale),
            })
          : undefined
      }
      elevation="sm"
      fill
      actions={
        <Link component={RouterLink} to={`/comptes/${account.id}`}>
          {t("budgy.accounts.openTransactions")}
        </Link>
      }
    >
      <Stack gap="md">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          wrap
        >
          <StatusChip tone="neutral" label={account.currency} />
          <Heading level={3} size={4}>
            {balance
              ? formatMoneyCents(balance.amount_cents, account.currency, locale)
              : t("budgy.accounts.balanceUnavailable")}
          </Heading>
        </Stack>
        {balance ? (
          <DescriptionList
            items={[
              {
                label: t("budgy.accounts.balanceType"),
                value: balance.type,
              },
            ]}
          />
        ) : null}
      </Stack>
    </Card>
  );
}
