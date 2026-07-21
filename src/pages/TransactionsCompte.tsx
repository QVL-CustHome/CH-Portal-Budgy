import { useMemo } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
  Button,
  Feedback,
  Link,
  PageContent,
  Stack,
  Toast,
  useTranslation,
} from "canopui";
import TransactionsTable from "../components/TransactionsTable";
import TransactionCategoryFilter from "../components/TransactionCategoryFilter";
import Pagination from "../components/Pagination";
import { useTransactionsCompte } from "../hooks/useTransactionsCompte";
import { useCategories } from "../hooks/useCategories";
import { useReloadTransactionsOnRelay } from "../hooks/useReloadOnRelay";
import { indexCategoriesById } from "../lib/categories";

export default function TransactionsCompte() {
  const { t } = useTranslation();
  const { accountId = "" } = useParams<{ accountId: string }>();
  const {
    transactions,
    pageCount,
    page,
    loading,
    error,
    filter,
    assigningId,
    assignError,
    setFilter,
    assignCategory,
    dismissAssignError,
    goToPage,
    reload,
  } = useTransactionsCompte(accountId);
  const { categories } = useCategories();
  const categoriesById = useMemo(
    () => indexCategoriesById(categories),
    [categories]
  );
  useReloadTransactionsOnRelay(accountId, reload);

  return (
    <PageContent title={t("budgy.transactions.title")}>
      <Stack gap="lg">
        <Link component={RouterLink} to="/comptes">
          {t("budgy.transactions.backToAccounts")}
        </Link>
        {error ? (
          <Stack gap="md" alignItems="start">
            <Feedback severity="error">{error}</Feedback>
            <Button variant="secondary" onClick={reload}>
              {t("budgy.transactions.retry")}
            </Button>
          </Stack>
        ) : (
          <Stack gap="md">
            <TransactionCategoryFilter
              value={filter}
              disabled={loading}
              onChange={setFilter}
            />
            <TransactionsTable
              transactions={transactions}
              categories={categories}
              categoriesById={categoriesById}
              loading={loading}
              assigningId={assigningId}
              onAssignCategory={assignCategory}
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
      <Toast
        open={assignError !== null}
        message={assignError ?? ""}
        severity="error"
        onClose={dismissAssignError}
      />
    </PageContent>
  );
}
