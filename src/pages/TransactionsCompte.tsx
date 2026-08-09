import { useCallback, useMemo, useState } from "react";
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
import RegleProposalPanel from "../components/RegleProposalPanel";
import { useTransactionsCompte } from "../hooks/useTransactionsCompte";
import { useCategories } from "../hooks/useCategories";
import { useEnveloppes } from "../hooks/useEnveloppes";
import { affecterEnveloppe } from "../api/budgy";
import { useRegleProposal } from "../hooks/useRegleProposal";
import { useReloadTransactionsOnRelay } from "../hooks/useReloadOnRelay";
import { indexCategoriesById } from "../lib/categories";

export default function TransactionsCompte() {
  const { t } = useTranslation();
  const { accountId = "" } = useParams<{ accountId: string }>();
  const { categories } = useCategories();
  const categoriesById = useMemo(
    () => indexCategoriesById(categories),
    [categories]
  );
  const proposal = useRegleProposal(accountId, categoriesById);
  const { enveloppes, reload: reloadEnveloppes } = useEnveloppes();
  const [assigningEnveloppeId, setAssigningEnveloppeId] = useState<
    string | null
  >(null);
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
  } = useTransactionsCompte(accountId, {
    onCategoryAssigned: proposal.propose,
  });
  useReloadTransactionsOnRelay(accountId, reload);

  // Les deux listes bougent : la transaction change de budget, et le budget
  // voit sa consommation évoluer.
  const assignEnveloppe = useCallback(
    async (transactionId: string, enveloppeId: string | null) => {
      setAssigningEnveloppeId(transactionId);
      try {
        await affecterEnveloppe(transactionId, enveloppeId);
        reload();
        reloadEnveloppes();
      } finally {
        setAssigningEnveloppeId(null);
      }
    },
    [reload, reloadEnveloppes]
  );

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
              enveloppes={enveloppes}
              loading={loading}
              assigningId={assigningId}
              assigningEnveloppeId={assigningEnveloppeId}
              onAssignCategory={assignCategory}
              onAssignEnveloppe={(id, env) => void assignEnveloppe(id, env)}
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
      <RegleProposalPanel
        open={proposal.isOpen}
        category={proposal.category}
        submitting={proposal.submitting}
        submitError={proposal.submitError}
        onAccept={proposal.accept}
        onRefuse={proposal.refuse}
      />
      <Toast
        open={assignError !== null}
        message={assignError ?? ""}
        severity="error"
        onClose={dismissAssignError}
      />
      <Toast
        open={proposal.successOpen}
        message={proposal.successMessage}
        severity="success"
        onClose={proposal.dismissSuccess}
      />
    </PageContent>
  );
}
