import { Link as RouterLink, useParams } from "react-router-dom";
import {
  Button,
  Feedback,
  Link,
  PageContent,
  Stack,
  useTranslation,
} from "@custhome/ui";
import TransactionsTable from "../components/TransactionsTable";
import Pagination from "../components/Pagination";
import { useTransactionsCompte } from "../hooks/useTransactionsCompte";

export default function TransactionsCompte() {
  const { t } = useTranslation();
  const { accountId = "" } = useParams<{ accountId: string }>();
  const {
    transactions,
    pageCount,
    page,
    loading,
    error,
    goToPage,
    reload,
  } = useTransactionsCompte(accountId);

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
            <TransactionsTable transactions={transactions} loading={loading} />
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
