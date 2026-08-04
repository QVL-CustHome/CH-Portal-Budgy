import { useCallback, useState } from "react";
import { apiErrorMessage, useTranslation } from "canopui";
import { ApiError } from "../api/client";
import { creerRegleDepuisTransaction, type Category } from "../api/budgy";
import { resolveCategory } from "../lib/categories";

export interface CategoryAssignment {
  transactionId: string;
  categoryId: string;
  label: string;
}

interface RegleProposal {
  category: Category;
  transactionId: string;
  label: string;
}

export interface UseRegleProposalResult {
  isOpen: boolean;
  category: Category | null;
  transactionLabel: string;
  submitting: boolean;
  submitError: string | null;
  successOpen: boolean;
  successMessage: string;
  propose: (assignment: CategoryAssignment) => void;
  accept: () => Promise<void>;
  refuse: () => void;
  dismissSuccess: () => void;
}

/**
 * Propose de créer une règle de catégorisation à partir d'une transaction qu'on
 * vient de catégoriser. L'utilisateur n'a RIEN à saisir : à l'acceptation, l'API
 * dérive elle-même le motif (le tiers) depuis le libellé et l'applique.
 */
export function useRegleProposal(
  accountId: string,
  categoriesById: Map<string, Category>
): UseRegleProposalResult {
  const { t } = useTranslation();
  const [proposal, setProposal] = useState<RegleProposal | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const propose = useCallback(
    ({ transactionId, categoryId, label }: CategoryAssignment) => {
      const category = resolveCategory(categoriesById, categoryId);
      if (!category) {
        return;
      }
      setSubmitError(null);
      setProposal({ category, transactionId, label });
    },
    [categoriesById]
  );

  const refuse = useCallback(() => {
    setProposal(null);
  }, []);

  const accept = useCallback(async () => {
    if (!proposal) {
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const regle = await creerRegleDepuisTransaction(
        accountId,
        proposal.transactionId,
        proposal.category.id
      );
      setSuccessMessage(
        t("budgy.rules.proposal.success", {
          pattern: regle.label_pattern,
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
  }, [proposal, accountId, t]);

  const dismissSuccess = useCallback(() => setSuccessMessage(null), []);

  return {
    isOpen: proposal !== null,
    category: proposal?.category ?? null,
    transactionLabel: proposal?.label ?? "",
    submitting,
    submitError,
    successOpen: successMessage !== null,
    successMessage: successMessage ?? "",
    propose,
    accept,
    refuse,
    dismissSuccess,
  };
}
