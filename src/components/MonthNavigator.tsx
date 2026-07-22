import Typography from "@mui/material/Typography";
import { IconActionButton, Stack } from "canopui";

export interface MonthNavigatorProps {
  label: string;
  previousLabel: string;
  nextLabel: string;
  canGoNext: boolean;
  disabled?: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export default function MonthNavigator({
  label,
  previousLabel,
  nextLabel,
  canGoNext,
  disabled,
  onPrevious,
  onNext,
}: MonthNavigatorProps) {
  return (
    <Stack direction="row" gap="xs" alignItems="center">
      <IconActionButton
        icon="caretLeft"
        variant="secondary"
        size={36}
        aria-label={previousLabel}
        disabled={disabled}
        onClick={onPrevious}
      />
      <Typography
        component="span"
        color="text.primary"
        textAlign="center"
        sx={{
          minWidth: "8rem",
          fontWeight: 600,
          textTransform: "capitalize",
        }}
      >
        {label}
      </Typography>
      <IconActionButton
        icon="caretRight"
        variant="secondary"
        size={36}
        aria-label={nextLabel}
        disabled={disabled || !canGoNext}
        onClick={onNext}
      />
    </Stack>
  );
}
