import {
  Button,
  Feedback,
  PageContent,
  Spinner,
  Stack,
  useTranslation,
} from "@custhome/ui";
import BankSelector from "../components/BankSelector";
import { useRattachementBanque } from "../hooks/useRattachementBanque";

export default function RattacherBanque() {
  const { t } = useTranslation();
  const {
    banks,
    selectedBankId,
    selectBank,
    loadingBanks,
    banksError,
    connecting,
    connectError,
    reloadBanks,
    connect,
  } = useRattachementBanque();

  return (
    <PageContent title={t("budgy.bank.title")}>
      <Stack gap="lg">
        <Feedback severity="info">{t("budgy.bank.intro")}</Feedback>

        {loadingBanks ? (
          <Stack alignItems="center" padding="lg">
            <Spinner label={t("budgy.bank.loadingBanks")} />
          </Stack>
        ) : banksError ? (
          <Stack gap="md" alignItems="start">
            <Feedback severity="error">{banksError}</Feedback>
            <Button variant="secondary" onClick={reloadBanks}>
              {t("budgy.bank.retry")}
            </Button>
          </Stack>
        ) : (
          <Stack gap="md">
            <BankSelector
              banks={banks}
              selectedBankId={selectedBankId}
              onSelect={selectBank}
            />
            {connectError ? (
              <Feedback severity="error">{connectError}</Feedback>
            ) : null}
            <Button
              onClick={connect}
              disabled={!selectedBankId}
              loading={connecting}
            >
              {t("budgy.bank.connect")}
            </Button>
          </Stack>
        )}
      </Stack>
    </PageContent>
  );
}
