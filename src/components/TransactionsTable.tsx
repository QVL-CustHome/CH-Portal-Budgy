import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  DataTable,
  Spinner,
  Stack,
  StatusChip,
  useTranslation,
  type ChColumn,
  type ChStatusTone,
} from "canopui";
import type { Category, Transaction, TransactionStatus } from "../api/budgy";
import { formatMoneyCents } from "../lib/money";
import { formatDate } from "../lib/date";
import { resolveCategory } from "../lib/categories";
import TransactionCategoryPicker from "./TransactionCategoryPicker";
import TransactionCardEditable from "./TransactionCardEditable";

export interface TransactionsTableProps {
  transactions: Transaction[];
  categories: Category[];
  categoriesById: Map<string, Category>;
  loading: boolean;
  assigningId: string | null;
  onAssignCategory: (transactionId: string, categoryId: string) => void;
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
  categories,
  categoriesById,
  loading,
  assigningId,
  onAssignCategory,
}: TransactionsTableProps) {
  const { t, locale } = useTranslation();
  const isMobile = useMediaQuery("(max-width:899.95px)");

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
      key: "category_id",
      header: t("budgy.transactions.category"),
      render: (row) => (
        <TransactionCategoryPicker
          category={resolveCategory(categoriesById, row.category_id)}
          categories={categories}
          disabled={assigningId === row.id}
          onSelect={(categoryId) => onAssignCategory(row.id, categoryId)}
        />
      ),
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

  if (isMobile) {
    if (loading) {
      return (
        <Stack alignItems="center" padding="lg">
          <Spinner />
        </Stack>
      );
    }
    if (transactions.length === 0) {
      return (
        <Box paddingY="lg" textAlign="center" color="text.secondary">
          {t("budgy.transactions.empty")}
        </Box>
      );
    }
    return (
      <Stack gap="sm">
        {transactions.map((row) => (
          <TransactionCardEditable
            key={row.id}
            transaction={row}
            categories={categories}
            categoriesById={categoriesById}
            assigning={assigningId === row.id}
            onAssignCategory={onAssignCategory}
          />
        ))}
      </Stack>
    );
  }

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
