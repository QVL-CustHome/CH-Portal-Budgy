import { DataTable, useTranslation, type ChColumn } from "canopui";
import type { Category, Transaction } from "../api/budgy";
import { formatMoneyCents } from "../lib/money";
import { formatDate } from "../lib/date";
import { resolveCategory } from "../lib/categories";
import TransactionCategoryTag from "./TransactionCategoryTag";

export interface TransactionsListTableProps {
  transactions: Transaction[];
  categoriesById: Map<string, Category>;
  loading: boolean;
}

function transactionDate(transaction: Transaction): string | null {
  return transaction.booking_date ?? transaction.value_date;
}

export default function TransactionsListTable({
  transactions,
  categoriesById,
  loading,
}: TransactionsListTableProps) {
  const { t, locale } = useTranslation();

  const columns: ChColumn<Transaction>[] = [
    {
      key: "date",
      header: t("budgy.transactions.date"),
      render: (row) => formatDate(transactionDate(row), locale),
    },
    {
      key: "label",
      header: t("budgy.transactions.label"),
      render: (row) => row.label,
    },
    {
      key: "category",
      header: t("budgy.transactions.category"),
      render: (row) => (
        <TransactionCategoryTag
          category={resolveCategory(categoriesById, row.category_id)}
        />
      ),
    },
    {
      key: "amount",
      header: t("budgy.transactions.amount"),
      align: "right",
      render: (row) =>
        formatMoneyCents(row.amount_cents, row.currency, locale, {
          signDisplay: true,
        }),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={transactions}
      getRowKey={(row) => row.id}
      loading={loading}
      emptyMessage={t("budgy.transactions.noResults")}
      animateRows
    />
  );
}
