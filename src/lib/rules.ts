export const RULE_PATTERN_MIN = 1;
export const RULE_PATTERN_MAX = 140;

export type RulePatternError = "required" | "too-long";

export function validateRulePattern(value: string): RulePatternError | null {
  const length = value.trim().length;
  if (length < RULE_PATTERN_MIN) {
    return "required";
  }
  if (length > RULE_PATTERN_MAX) {
    return "too-long";
  }
  return null;
}
