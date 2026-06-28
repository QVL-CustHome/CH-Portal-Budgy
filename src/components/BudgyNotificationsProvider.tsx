import type { ReactNode } from "react";
import { BudgyNotificationsContext } from "../context/budgy-notifications";
import { useBudgyNotificationsController } from "../hooks/useBudgyNotificationsController";

export default function BudgyNotificationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const value = useBudgyNotificationsController();

  return (
    <BudgyNotificationsContext.Provider value={value}>
      {children}
    </BudgyNotificationsContext.Provider>
  );
}
