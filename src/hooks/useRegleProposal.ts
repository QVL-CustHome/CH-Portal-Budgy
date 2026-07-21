import { useCallback, useMemo, useState } from "react";
import { apiErrorMessage, useTranslation } from "canopui";
import { ApiError } from "../api/client";
import { creerRegleCategorisation, type Category } from "../api/budgy";
import { resolveCategory } from "../lib/categories";
import { RULE_PATTERN_MAX, validateRulePattern } from "../lib/rules";

export interface CategoryAssignment {
  categoryId: string;
  label: string;
}

interface RegleProposal {
  category: Category;
  label: string;
}

export interface UseRegleProposalResult {
  isOpen: boolean;
  category: Category | null;
  labelPattern: string;
  patternMax: number;
  patternError: string | null;
  canSubmit: boolean;
  submitting: boolean;
  submitError: string | null;
  successOpen: boolean;
  successMessage: string;
  setLabelPattern: (value: string) => void;
  propose: (assignment: CategoryAssignment) => void;
  accept: () => Promise<void>;
  refuse: () => void;
  dismissSuccess: () => void;
}

export function useRegleProposal(
  categoriesById: Map<string, Category>
): UseRegleProposalResult {
  const { t } = useTranslation();
  const [proposal, setProposal] = useState<RegleProposal | null>(null);
  const [labelPattern, setLabelPattern] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const patternErrorKind = validateRulePattern(labelPattern);

  const patternError = useMemo(() => {
    if (!touched || !patternErrorKind) {
      return null;
    }
    return patternErrorKind === "required"
      ? t("budgy.rules.proposal.patternRequired")
      : t("budgy.rules.proposal.patternTooLong");
  }, [touched, patternErrorKind, t]);

  const propose = useCallback(
    ({ categoryId, label }: CategoryAssignment) => {
      const category = resolveCategory(categoriesById, categoryId);
      if (!category) {
        return;
      }
      setSubmitError(null);
      setTouched(false);
      setLabelPattern(label);
      setProposal({ category, label });
    },
    [categoriesById]
  );

  const handleLabelPattern = useCallback((value: string) => {
    setLabelPattern(value);
    setTouched(true);
  }, []);

  const refuse = useCallback(() => {
    setProposal(null);
  }, []);

  const accept = useCallback(async () => {
    if (!proposal) {
      return;
    }
    setTouched(true);
    if (validateRulePattern(labelPattern)) {
      return;
    }
    const pattern = labelPattern.trim();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await creerRegleCategorisation({
        labelPattern: pattern,
        categoryId: proposal.category.id,
      });
      setSuccessMessage(
        t("budgy.rules.proposal.success", {
          pattern,
          category: proposal.category.name,
        })
      );
      setProposal(null);
    } catch (caught) {
      const isApiError = caught instanceof ApiError;
      const fallback =
        isApiError && caught.status === 404
          ? t("budgy.rules.proposal.notFound")
          : t("budgy.rules.proposal.error");
      setSubmitError(
        apiErrorMessage(t, isApiError ? caught.code : undefined, fallback)
      );
    } finally {
      setSubmitting(false);
    }
  }, [proposal, labelPattern, t]);

  const dismissSuccess = useCallback(() => setSuccessMessage(null), []);

  return {
    isOpen: proposal !== null,
    category: proposal?.category ?? null,
    labelPattern,
    patternMax: RULE_PATTERN_MAX,
    patternError,
    canSubmit: patternErrorKind === null,
    submitting,
    submitError,
    successOpen: successMessage !== null,
    successMessage: successMessage ?? "",
    setLabelPattern: handleLabelPattern,
    propose,
    accept,
    refuse,
    dismissSuccess,
  };
}
