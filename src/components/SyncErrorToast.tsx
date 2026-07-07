import { Toast, useTranslation } from "canopui";
import { useBudgyNotifications } from "../context/budgy-notifications";

export default function SyncErrorToast() {
  const { t } = useTranslation();
  const { syncError, dismissSyncError } = useBudgyNotifications();

  return (
    <Toast
      open={syncError !== null}
      severity="error"
      message={t("budgy.notifications.syncFailed")}
      onClose={dismissSyncError}
    />
  );
}
