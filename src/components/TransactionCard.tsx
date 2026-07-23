import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

export const transactionCardSurfaceSx = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  paddingX: "1rem",
  paddingY: "0.875rem",
  borderRadius: "0.875rem",
  backgroundColor: "background.paper",
  boxShadow: "0 0 1rem rgba(28, 30, 33, 0.12)",
} as const;

export interface TransactionCardProps {
  leading?: ReactNode;
  label: string;
  secondary: ReactNode;
  amount: string;
  amountPositive: boolean;
}

export default function TransactionCard({
  leading,
  label,
  secondary,
  amount,
  amountPositive,
}: TransactionCardProps) {
  return (
    <Box sx={transactionCardSurfaceSx}>
      {leading ? <Box flex="none">{leading}</Box> : null}
      <Box flex="1 1 auto" minWidth={0}>
        <Typography
          component="p"
          color="text.primary"
          noWrap
          sx={{ fontWeight: 600 }}
        >
          {label}
        </Typography>
        <Typography
          component="p"
          variant="body2"
          color="text.secondary"
          noWrap
        >
          {secondary}
        </Typography>
      </Box>
      <Typography
        component="span"
        noWrap
        color={amountPositive ? "success.main" : "error.main"}
        sx={{ fontWeight: 700, flex: "none" }}
      >
        {amount}
      </Typography>
    </Box>
  );
}
