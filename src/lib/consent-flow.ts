const RENEW_FLOW_KEY = "budgy.consent.renewFlow";

export function markRenewFlow(): void {
  sessionStorage.setItem(RENEW_FLOW_KEY, "1");
}

export function consumeRenewFlow(): boolean {
  const isRenew = sessionStorage.getItem(RENEW_FLOW_KEY) === "1";
  sessionStorage.removeItem(RENEW_FLOW_KEY);
  return isRenew;
}
