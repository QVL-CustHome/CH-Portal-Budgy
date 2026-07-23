import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  DataTable,
  Spinner,
  Stack,
  useTranslation,
  type ChColumn,
} from "canopui";
import type { Category, Transaction } from "../api/budgy";
import { formatMoneyCents } from "../lib/money";
import { formatDate } from "../lib/date";
import { resolveCategory, toCategoryIcon } from "../lib/categories";
import TransactionCategoryTag from "./TransactionCategoryTag";
import CategoryBadge from "./CategoryBadge";
import TransactionCard from "./TransactionCard";

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
  const isMobile = useMediaQuery("(max-width:899.95px)");

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
          {t("budgy.transactions.noResults")}
        </Box>
      );
    }
    return (
      <Stack gap="sm">
        {transactions.map((row) => {
          const category = resolveCategory(categoriesById, row.category_id);
          const categoryName = category?.name ?? t("budgy.transactions.uncategorized");
          return (
            <TransactionCard
              key={row.id}
              leading={
                category ? (
                  <CategoryBadge
                    color={category.color}
                    icon={toCategoryIcon(category.icon)}
                    size="md"
                    title={category.name}
                  />
                ) : undefined
              }
              label={row.label}
              secondary={`${formatDate(transactionDate(row), locale)} · ${categoryName}`}
              amount={formatMoneyCents(row.amount_cents, row.currency, locale, {
                signDisplay: true,
              })}
              amountPositive={row.amount_cents >= 0}
            />
          );
        })}
      </Stack>
    );
  }

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
