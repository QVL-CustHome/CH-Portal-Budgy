import { useNavigate } from "react-router-dom";
import {
  Button,
  Feedback,
  Heading,
  PageContent,
  Spinner,
  Stack,
  useTranslation,
} from "@custhome/ui";
import LinkedAccountsList from "../components/LinkedAccountsList";
import { useConsentementCallback } from "../hooks/useConsentementCallback";

export default function RattacherBanqueCallback() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { status, result, errorMessage } = useConsentementCallback();

  return (
    <PageContent title={t("budgy.callback.title")}>
      {status === "pending" ? (
        <Stack alignItems="center" padding="lg">
          <Spinner label={t("budgy.callback.pending")} />
        </Stack>
      ) : status === "success" && result ? (
        <Stack gap="lg">
          <Feedback severity="success">
            {t("budgy.callback.success")}
          </Feedback>
          <Heading level={2} size={4}>
            {t("budgy.callback.accountsTitle")}
          </Heading>
          <LinkedAccountsList accounts={result.comptes} />
          <Stack direction="row" gap="md" wrap>
            <Button onClick={() => navigate("/home")}>
              {t("budgy.callback.backHome")}
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Stack gap="lg" alignItems="start">
          <Feedback severity="error">
            {errorMessage ?? t("budgy.callback.error")}
          </Feedback>
          <Button onClick={() => navigate("/banque")}>
            {t("budgy.callback.retry")}
          </Button>
        </Stack>
      )}
    </PageContent>
  );
}
