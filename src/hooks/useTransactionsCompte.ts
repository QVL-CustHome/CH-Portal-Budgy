import { useCallback, useEffect, useState } from "react";
import { apiErrorMessage, useTranslation } from "canopui";
import { ApiError } from "../api/client";
import {
  categoriserTransaction,
  listTransactions,
  type Transaction,
  type TransactionCategoryFilter,
} from "../api/budgy";

const PAGE_SIZE = 20;

interface UseTransactionsCompteResult {
  transactions: Transaction[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  filter: TransactionCategoryFilter;
  assigningId: string | null;
  assignError: string | null;
  setFilter: (filter: TransactionCategoryFilter) => void;
  assignCategory: (transactionId: string, categoryId: string) => Promise<void>;
  dismissAssignError: () => void;
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
  const [filter, setFilterState] = useState<TransactionCategoryFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [assignError, setAssignError] = useState<string | null>(null);

  const load = useCallback(
    async (targetPage: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await listTransactions(accountId, {
          limit: PAGE_SIZE,
          offset: targetPage * PAGE_SIZE,
          filter,
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
    [accountId, filter, t]
  );

  useEffect(() => {
    void load(page);
  }, [load, page]);

  const setFilter = useCallback((next: TransactionCategoryFilter) => {
    setFilterState(next);
    setPage(0);
  }, []);

  const assignCategory = useCallback(
    async (transactionId: string, categoryId: string) => {
      const removeFromList = filter === "uncategorized";
      const previousTransactions = transactions;
      const previousTotal = total;

      setAssigningId(transactionId);
      setAssignError(null);
      setTransactions((current) =>
        removeFromList
          ? current.filter((transaction) => transaction.id !== transactionId)
          : current.map((transaction) =>
              transaction.id === transactionId
                ? { ...transaction, category_id: categoryId }
                : transaction
            )
      );
      if (removeFromList) {
        setTotal((current) => Math.max(0, current - 1));
      }

      try {
        await categoriserTransaction(accountId, transactionId, categoryId);
      } catch (caught) {
        setTransactions(previousTransactions);
        setTotal(previousTotal);
        const code = caught instanceof ApiError ? caught.code : undefined;
        setAssignError(
          apiErrorMessage(t, code, t("budgy.transactions.assignError"))
        );
      } finally {
        setAssigningId(null);
      }
    },
    [accountId, filter, transactions, total, t]
  );

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return {
    transactions,
    total,
    page,
    pageCount,
    pageSize: PAGE_SIZE,
    loading,
    error,
    filter,
    assigningId,
    assignError,
    setFilter,
    assignCategory,
    dismissAssignError: () => setAssignError(null),
    goToPage: setPage,
    reload: () => void load(page),
  };
}
