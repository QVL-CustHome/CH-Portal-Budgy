import {
  DataTable,
  StatusChip,
  useTranslation,
  type ChColumn,
  type ChStatusTone,
} from "@custhome/ui";
import type { Transaction, TransactionStatus } from "../api/budgy";
import { formatMoneyCents } from "../lib/money";
import { formatDate } from "../lib/date";

export interface TransactionsTableProps {
  transactions: Transaction[];
  loading: boolean;
}

const STATUS_TONES: Record<TransactionStatus, ChStatusTone> = {
  booked: "success",
  pending: "warning",
};

function transactionDate(transaction: Transaction): string | null {
  return transaction.booking_date ?? transaction.value_date;
}

export default function TransactionsTable({
  transactions,
  loading,
}: TransactionsTableProps) {
  const { t, locale } = useTranslation();

  const columns: ChColumn<Transaction>[] = [
    {
      key: "booking_date",
      header: t("budgy.transactions.date"),
      sortable: true,
      sortValue: (row) => transactionDate(row) ?? "",
      render: (row) => formatDate(transactionDate(row), locale),
    },
    {
      key: "label",
      header: t("budgy.transactions.label"),
      sortable: true,
      sortValue: (row) => row.label,
      render: (row) => row.label,
    },
    {
      key: "status",
      header: t("budgy.transactions.status"),
      hideOnMobile: true,
      render: (row) => (
        <StatusChip
          tone={STATUS_TONES[row.status]}
          label={t(`budgy.transactions.status.${row.status}`)}
          size="small"
        />
      ),
    },
    {
      key: "amount_cents",
      header: t("budgy.transactions.amount"),
      align: "right",
      sortable: true,
      sortValue: (row) => row.amount_cents,
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
      emptyMessage={t("budgy.transactions.empty")}
      animateRows
    />
  );
}
