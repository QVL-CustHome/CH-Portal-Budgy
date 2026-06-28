import { useEffect, useRef } from "react";
import { useBudgyNotifications } from "../context/budgy-notifications";

export function useReloadComptesOnRelay(reload: () => void): void {
  const { registerAccountsListener } = useBudgyNotifications();
  const reloadRef = useRef(reload);
  reloadRef.current = reload;

  useEffect(
    () => registerAccountsListener(() => reloadRef.current()),
    [registerAccountsListener]
  );
}

export function useReloadTransactionsOnRelay(
  accountId: string,
  reload: () => void
): void {
  const { registerAccountListener } = useBudgyNotifications();
  const reloadRef = useRef(reload);
  reloadRef.current = reload;

  useEffect(() => {
    if (!accountId) {
      return;
    }
    return registerAccountListener(accountId, () => reloadRef.current());
  }, [registerAccountListener, accountId]);
}
