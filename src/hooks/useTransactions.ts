import { useCallback, useEffect, useState } from "react";
import { apiErrorMessage, useTranslation } from "canopui";
import { ApiError } from "../api/client";
import {
  listAllTransactions,
  type Transaction,
  type TransactionSortField,
  type TransactionSortOrder,
  type TransactionType,
} from "../api/budgy";
import { periodRange, type TransactionPeriod } from "../lib/transactions";

const PAGE_SIZE = 20;

interface UseTransactionsResult {
  transactions: Transaction[];
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  accountId: string | null;
  categoryId: string | null;
  period: TransactionPeriod;
  type: TransactionType | null;
  sortField: TransactionSortField;
  sortOrder: TransactionSortOrder;
  setAccountId: (value: string | null) => void;
  setCategoryId: (value: string | null) => void;
  setPeriod: (value: TransactionPeriod) => void;
  setType: (value: TransactionType | null) => void;
  setSortField: (value: TransactionSortField) => void;
  setSortOrder: (value: TransactionSortOrder) => void;
  goToPage: (page: number) => void;
  reload: () => void;
}

export function useTransactions(): UseTransactionsResult {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [accountId, setAccountIdState] = useState<string | null>(null);
  const [categoryId, setCategoryIdState] = useState<string | null>(null);
  const [period, setPeriodState] = useState<TransactionPeriod>("all");
  const [type, setTypeState] = useState<TransactionType | null>(null);
  const [sortField, setSortFieldState] = useState<TransactionSortField>("date");
  const [sortOrder, setSortOrderState] = useState<TransactionSortOrder>("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (targetPage: number) => {
      setLoading(true);
      setError(null);
      const { from, to } = periodRange(period);
      try {
        const response = await listAllTransactions({
          limit: PAGE_SIZE,
          offset: targetPage * PAGE_SIZE,
          accountId: accountId ?? undefined,
          categoryId: categoryId ?? undefined,
          type: type ?? undefined,
          from,
          to,
          sort: sortField,
          order: sortOrder,
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
    [accountId, categoryId, period, type, sortField, sortOrder, t]
  );

  useEffect(() => {
    void load(page);
  }, [load, page]);

  const setAccountId = useCallback((value: string | null) => {
    setAccountIdState(value);
    setPage(0);
  }, []);

  const setCategoryId = useCallback((value: string | null) => {
    setCategoryIdState(value);
    setPage(0);
  }, []);

  const setPeriod = useCallback((value: TransactionPeriod) => {
    setPeriodState(value);
    setPage(0);
  }, []);

  const setType = useCallback((value: TransactionType | null) => {
    setTypeState(value);
    setPage(0);
  }, []);

  const setSortField = useCallback((value: TransactionSortField) => {
    setSortFieldState(value);
    setPage(0);
  }, []);

  const setSortOrder = useCallback((value: TransactionSortOrder) => {
    setSortOrderState(value);
    setPage(0);
  }, []);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return {
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
    goToPage: setPage,
    reload: () => void load(page),
  };
}
