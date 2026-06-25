import { Card, DescriptionList, Stack, useTranslation } from "@custhome/ui";
import type { LinkedAccount } from "../api/budgy";

export interface LinkedAccountsListProps {
  accounts: LinkedAccount[];
}

export default function LinkedAccountsList({
  accounts,
}: LinkedAccountsListProps) {
  const { t } = useTranslation();

  return (
    <Stack gap="md">
      {accounts.map((account) => (
        <Card key={account.id} elevation="sm">
          <DescriptionList
            items={[
              { label: t("budgy.callback.ibanLabel"), value: account.iban_masked },
              { label: t("budgy.callback.accountIdLabel"), value: account.id },
            ]}
          />
        </Card>
      ))}
    </Stack>
  );
}
