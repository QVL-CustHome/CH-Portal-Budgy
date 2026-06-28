import type { BudgyEventType } from "./events";

export const DEFAULT_TOPIC_PREFIX = "budgy";

const SEGMENT_BY_EVENT_TYPE: Record<BudgyEventType, string> = {
  "sync.started": "sync/started",
  "sync.succeeded": "sync/succeeded",
  "sync.failed": "sync/failed",
  "account.transactions": "account/transactions",
  "account.balance": "account/balance",
  "consent.renewal_required": "consent/renewal-required",
  "consent.expired": "consent/expired",
};

export function userTopicRoot(prefix: string, sub: string): string {
  return `${prefix}/${sub}`;
}

export function userWildcardTopic(prefix: string, sub: string): string {
  return `${userTopicRoot(prefix, sub)}/#`;
}

export function topicForEvent(
  prefix: string,
  sub: string,
  eventType: BudgyEventType
): string {
  return `${userTopicRoot(prefix, sub)}/${SEGMENT_BY_EVENT_TYPE[eventType]}`;
}

export function topicBelongsToUser(
  prefix: string,
  sub: string,
  topic: string
): boolean {
  return topic.startsWith(`${userTopicRoot(prefix, sub)}/`);
}
