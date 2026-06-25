import type { Me } from "../api/auth";

export const BUDGY_ROLE = "budgy";

export function isPortalBudgy(me: Me): boolean {
  return me.roles?.includes(BUDGY_ROLE) ?? false;
}
