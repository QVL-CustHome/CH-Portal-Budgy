import { Button, Feedback, Heading, Stack, useTranslation } from "canopui";
import { navigateTo } from "../lib/navigation";
import { loginUrl } from "../lib/auth-redirect";

export default function Forbidden() {
  const { t } = useTranslation();

  return (
    <div className="budgy-centered">
      <Stack gap="lg">
        <Heading level={1} size={3}>
          {t("budgy.forbidden.title")}
        </Heading>
        <Feedback severity="error">{t("budgy.forbidden.message")}</Feedback>
        <Button variant="secondary" onClick={() => navigateTo(loginUrl())}>
          {t("budgy.forbidden.switch")}
        </Button>
      </Stack>
    </div>
  );
}
