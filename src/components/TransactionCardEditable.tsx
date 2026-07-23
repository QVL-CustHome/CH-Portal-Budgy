import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { StatusChip, useTranslation, type ChStatusTone } from "canopui";
import type { Category, Transaction, TransactionStatus } from "../api/budgy";
import { formatMoneyCents } from "../lib/money";
import { formatDate } from "../lib/date";
import { resolveCategory } from "../lib/categories";
import TransactionCategoryPicker from "./TransactionCategoryPicker";
import { transactionCardSurfaceSx } from "./TransactionCard";

const STATUS_TONES: Record<TransactionStatus, ChStatusTone> = {
  booked: "success",
  pending: "warning",
};

function transactionDate(transaction: Transaction): string | null {
  return transaction.booking_date ?? transaction.value_date;
}

export interface TransactionCardEditableProps {
  transaction: Transaction;
  categories: Category[];
  categoriesById: Map<string, Category>;
  assigning: boolean;
  onAssignCategory: (transactionId: string, categoryId: string) => void;
}

export default function TransactionCardEditable({
  transaction,
  categories,
  categoriesById,
  assigning,
  onAssignCategory,
}: TransactionCardEditableProps) {
  const { t, locale } = useTranslation();
  const category = resolveCategory(categoriesById, transaction.category_id);

  return (
    <Box
      sx={{
        ...transactionCardSurfaceSx,
        flexDirection: "column",
        alignItems: "stretch",
        gap: "0.625rem",
      }}
    >
      <Box display="flex" alignItems="baseline" justifyContent="space-between" gap="0.75rem">
        <Typography component="p" color="text.primary" noWrap sx={{ fontWeight: 600, minWidth: 0 }}>
          {transaction.label}
        </Typography>
        <Typography
          component="span"
          noWrap
          color={transaction.amount_cents >= 0 ? "success.main" : "error.main"}
          sx={{ fontWeight: 700, flex: "none" }}
        >
          {formatMoneyCents(transaction.amount_cents, transaction.currency, locale, {
            signDisplay: true,
          })}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" gap="0.5rem">
        <Box minWidth={0}>
          <TransactionCategoryPicker
            category={category}
            categories={categories}
            disabled={assigning}
            onSelect={(categoryId) => onAssignCategory(transaction.id, categoryId)}
          />
        </Box>
        <Box display="flex" alignItems="center" gap="0.5rem" flex="none">
          {transaction.status === "pending" ? (
            <StatusChip
              tone={STATUS_TONES[transaction.status]}
              label={t(`budgy.transactions.status.${transaction.status}`)}
              size="small"
            />
          ) : null}
          <Typography component="span" variant="body2" color="text.secondary" noWrap>
            {formatDate(transactionDate(transaction), locale)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
