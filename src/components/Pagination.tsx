import { Button, Heading, Stack, useTranslation } from "@custhome/ui";

export interface PaginationProps {
  page: number;
  pageCount: number;
  disabled?: boolean;
  onChange: (page: number) => void;
}

export default function Pagination({
  page,
  pageCount,
  disabled,
  onChange,
}: PaginationProps) {
  const { t } = useTranslation();
  const isFirst = page <= 0;
  const isLast = page >= pageCount - 1;

  return (
    <Stack direction="row" gap="md" alignItems="center" justifyContent="center">
      <Button
        variant="secondary"
        size="small"
        disabled={disabled || isFirst}
        onClick={() => onChange(page - 1)}
      >
        {t("budgy.pagination.previous")}
      </Button>
      <Heading level={2} size={5}>
        {t("budgy.pagination.status", {
          page: page + 1,
          pageCount,
        })}
      </Heading>
      <Button
        variant="secondary"
        size="small"
        disabled={disabled || isLast}
        onClick={() => onChange(page + 1)}
      >
        {t("budgy.pagination.next")}
      </Button>
    </Stack>
  );
}
