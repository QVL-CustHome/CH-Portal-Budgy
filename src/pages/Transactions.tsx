import { useMemo } from "react";
import {
  Button,
  Feedback,
  PageContent,
  Stack,
  useTranslation,
} from "canopui";
import TransactionsFilters from "../components/TransactionsFilters";
import TransactionsSort from "../components/TransactionsSort";
import TransactionsListTable from "../components/TransactionsListTable";
import Pagination from "../components/Pagination";
import { useTransactions } from "../hooks/useTransactions";
import { useComptes } from "../hooks/useComptes";
import { useCategories } from "../hooks/useCategories";
import { indexCategoriesById } from "../lib/categories";

export default function Transactions() {
  const { t } = useTranslation();
  const { comptes } = useComptes();
  const { categories } = useCategories();
  const categoriesById = useMemo(
    () => indexCategoriesById(categories),
    [categories]
  );
  const {
    transactions,
    page,
    pageCount,
    loading,
    error,
    accountId,
    categoryId,
    period,
    type,
    sortField,
    sortOrder,
    setAccountId,
    setCategoryId,
    setPeriod,
    setType,
    setSortField,
    setSortOrder,
    goToPage,
    reload,
  } = useTransactions();

  return (
    <PageContent title={t("budgy.transactions.allTitle")}>
      <Stack gap="lg">
        {error ? (
          <Stack gap="md" alignItems="start">
            <Feedback severity="error">{error}</Feedback>
            <Button variant="secondary" onClick={reload}>
              {t("budgy.transactions.retry")}
            </Button>
          </Stack>
        ) : (
          <Stack gap="lg">
            <TransactionsFilters
              accounts={comptes}
              categories={categories}
              accountId={accountId}
              categoryId={categoryId}
              period={period}
              type={type}
              disabled={loading}
              onAccountChange={setAccountId}
              onCategoryChange={setCategoryId}
              onPeriodChange={setPeriod}
              onTypeChange={setType}
            />
            <TransactionsSort
              field={sortField}
              order={sortOrder}
              disabled={loading}
              onFieldChange={setSortField}
              onOrderChange={setSortOrder}
            />
            <TransactionsListTable
              transactions={transactions}
              categoriesById={categoriesById}
              loading={loading}
            />
            {pageCount > 1 ? (
              <Pagination
                page={page}
                pageCount={pageCount}
                disabled={loading}
                onChange={goToPage}
              />
            ) : null}
          </Stack>
        )}
      </Stack>
    </PageContent>
  );
}
