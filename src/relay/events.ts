export type BudgyEventType =
  | "sync.started"
  | "sync.succeeded"
  | "sync.failed"
  | "account.transactions"
  | "account.balance"
  | "consent.renewal_required"
  | "consent.expired";

export interface BudgyEvent {
  sub: string;
  eventType: BudgyEventType;
  account: string | null;
  count: number | null;
  at: string;
  issuer: string;
}

interface RawEnvelope {
  iss?: unknown;
  sub?: unknown;
  event_type?: unknown;
  account?: unknown;
  count?: unknown;
  at?: unknown;
}

const KNOWN_EVENT_TYPES: readonly BudgyEventType[] = [
  "sync.started",
  "sync.succeeded",
  "sync.failed",
  "account.transactions",
  "account.balance",
  "consent.renewal_required",
  "consent.expired",
];

function isBudgyEventType(value: unknown): value is BudgyEventType {
  return (
    typeof value === "string" &&
    (KNOWN_EVENT_TYPES as readonly string[]).includes(value)
  );
}

function decodeJwsClaims(jws: string): RawEnvelope | null {
  const segments = jws.split(".");
  const claimsSegment = segments.length === 3 ? segments[1] : segments[0];
  if (!claimsSegment) {
    return null;
  }
  try {
    const normalized = claimsSegment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "="
    );
    const json = decodeURIComponent(
      atob(padded)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );
    const parsed: unknown = JSON.parse(json);
    return typeof parsed === "object" && parsed !== null
      ? (parsed as RawEnvelope)
      : null;
  } catch {
    return null;
  }
}

export function parseBudgyEvent(payload: string): BudgyEvent | null {
  const envelope = decodeJwsClaims(payload.trim());
  if (!envelope) {
    return null;
  }
  if (typeof envelope.sub !== "string" || envelope.sub.length === 0) {
    return null;
  }
  if (!isBudgyEventType(envelope.event_type)) {
    return null;
  }
  return {
    sub: envelope.sub,
    eventType: envelope.event_type,
    account: typeof envelope.account === "string" ? envelope.account : null,
    count: typeof envelope.count === "number" ? envelope.count : null,
    at: typeof envelope.at === "string" ? envelope.at : "",
    issuer: typeof envelope.iss === "string" ? envelope.iss : "",
  };
}
