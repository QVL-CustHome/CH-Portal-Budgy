import { useCallback, useEffect, useState } from "react";
import { apiErrorMessage, useTranslation } from "canopui";
import { ApiError } from "../api/client";
import { listTransactions, type Transaction } from "../api/budgy";

const PAGE_SIZE = 20;

interface UseTransactionsCompteResult {
  transactions: Transaction[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  goToPage: (page: number) => void;
  reload: () => void;
}

export function useTransactionsCompte(
  accountId: string
): UseTransactionsCompteResult {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (targetPage: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await listTransactions(accountId, {
          limit: PAGE_SIZE,
          offset: targetPage * PAGE_SIZE,
        });
        setTransactions(response.data);
        setTotal(response.total);
      } catch (caught) {
        const code = caught instanceof ApiError ? caught.code : undefined;
        setError(apiErrorMessage(t, code, t("budgy.transactions.error")));
      } finally {
        setLoading(false);
      }
    },
    [accountId, t]
  );

  useEffect(() => {
    void load(page);
  }, [load, page]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return {
    transactions,
    total,
    page,
    pageCount,
    pageSize: PAGE_SIZE,
    loading,
    error,
    goToPage: setPage,
    reload: () => void load(page),
  };
}
