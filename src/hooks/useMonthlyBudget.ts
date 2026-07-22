import { useCallback, useMemo, useState } from "react";
import { apiErrorMessage, useTranslation } from "canopui";
import { ApiError } from "../api/client";
import { definirBudget, type Budget, type Category } from "../api/budgy";
import {
  centsToInput,
  currentMonth,
  parseBudgetAmountCents,
} from "../lib/budget";
import { useCategories } from "./useCategories";
import { useBudgets } from "./useBudgets";

interface UseMonthlyBudgetResult {
  month: string;
  categories: Category[];
  budgets: Budget[];
  loading: boolean;
  loadError: string | null;
  reload: () => void;
  categoryId: string | null;
  amount: string;
  amountError: string | null;
  canSubmit: boolean;
  saving: boolean;
  saveError: string | null;
  success: string | null;
  selectCategory: (categoryId: string | null) => void;
  changeAmount: (value: string) => void;
  submit: () => Promise<void>;
  dismissSuccess: () => void;
}

export function useMonthlyBudget(): UseMonthlyBudgetResult {
  const { t } = useTranslation();
  const month = useMemo(() => currentMonth(), []);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    reload: reloadCategories,
  } = useCategories();
  const {
    budgets,
    loading: budgetsLoading,
    error: budgetsError,
    reload: reloadBudgets,
  } = useBudgets(month);

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const budgetsByCategory = useMemo(
    () => new Map(budgets.map((budget) => [budget.category_id, budget])),
    [budgets]
  );

  const parsedAmount = parseBudgetAmountCents(amount);
  const amountError =
    touched && parsedAmount === null
      ? t("budgy.budgets.form.amountInvalid")
      : null;
  const canSubmit = categoryId !== null && parsedAmount !== null && !saving;

  const selectCategory = useCallback(
    (nextCategoryId: string | null) => {
      setCategoryId(nextCategoryId);
      setTouched(false);
      setSaveError(null);
      setSuccess(null);
      const existing = nextCategoryId
        ? budgetsByCategory.get(nextCategoryId)
        : undefined;
      setAmount(existing ? centsToInput(existing.montant_cents) : "");
    },
    [budgetsByCategory]
  );

  const changeAmount = useCallback((value: string) => {
    setAmount(value);
    setTouched(true);
    setSuccess(null);
  }, []);

  const submit = useCallback(async () => {
    setTouched(true);
    const montantCents = parseBudgetAmountCents(amount);
    if (categoryId === null || montantCents === null) {
      return;
    }
    setSaving(true);
    setSaveError(null);
    setSuccess(null);
    try {
      await definirBudget({
        category_id: categoryId,
        montant_cents: montantCents,
        mois: month,
      });
      reloadBudgets();
      setSuccess(t("budgy.budgets.form.success"));
    } catch (caught) {
      const code = caught instanceof ApiError ? caught.code : undefined;
      setSaveError(apiErrorMessage(t, code, t("budgy.budgets.form.error")));
    } finally {
      setSaving(false);
    }
  }, [amount, categoryId, month, reloadBudgets, t]);

  const reload = useCallback(() => {
    reloadCategories();
    reloadBudgets();
  }, [reloadCategories, reloadBudgets]);

  const dismissSuccess = useCallback(() => setSuccess(null), []);

  return {
    month,
    categories,
    budgets,
    loading: categoriesLoading || budgetsLoading,
    loadError: categoriesError ?? budgetsError,
    reload,
    categoryId,
    amount,
    amountError,
    canSubmit,
    saving,
    saveError,
    success,
    selectCategory,
    changeAmount,
    submit,
    dismissSuccess,
  };
}
