import {
  Button,
  Feedback,
  Heading,
  PageContent,
  Spinner,
  Stack,
  useTranslation,
} from "canopui";
import { useMemo } from "react";
import { indexCategoriesById } from "../lib/categories";
import { formatMonthLabel } from "../lib/budget";
import { useMonthlyBudget } from "../hooks/useMonthlyBudget";
import BudgetForm from "../components/BudgetForm";
import MonthlyBudgetList from "../components/MonthlyBudgetList";

export default function Budgets() {
  const { t, locale } = useTranslation();
  const {
    month,
    categories,
    budgets,
    loading,
    loadError,
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
  } = useMonthlyBudget();

  const categoriesById = useMemo(
    () => indexCategoriesById(categories),
    [categories]
  );

  return (
    <PageContent title={t("budgy.budgets.title")}>
      <Stack gap="lg">
        <Heading level={2} size={5}>
          {formatMonthLabel(month, locale)}
        </Heading>

        {loading ? (
          <Stack alignItems="center" padding="lg">
            <Spinner label={t("budgy.budgets.loading")} />
          </Stack>
        ) : loadError ? (
          <Stack gap="md" alignItems="start">
            <Feedback severity="error">{loadError}</Feedback>
            <Button variant="secondary" onClick={reload}>
              {t("budgy.budgets.retry")}
            </Button>
          </Stack>
        ) : (
          <>
            <BudgetForm
              categories={categories}
              categoryId={categoryId}
              amount={amount}
              amountError={amountError}
              canSubmit={canSubmit}
              saving={saving}
              saveError={saveError}
              onSelectCategory={selectCategory}
              onAmountChange={changeAmount}
              onSubmit={submit}
            />

            {success ? (
              <Feedback severity="success" onClose={dismissSuccess}>
                {success}
              </Feedback>
            ) : null}

            {budgets.length === 0 ? (
              <Feedback severity="info">{t("budgy.budgets.empty")}</Feedback>
            ) : (
              <MonthlyBudgetList
                budgets={budgets}
                categoriesById={categoriesById}
              />
            )}
          </>
        )}
      </Stack>
    </PageContent>
  );
}
