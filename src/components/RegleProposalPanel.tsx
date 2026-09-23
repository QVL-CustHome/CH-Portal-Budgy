import Box from "@mui/material/Box";
import {
  Button,
  Feedback,
  Heading,
  SidePanel,
  Stack,
  StatusChip,
  useTranslation,
} from "canopui";
import type { Category } from "../api/budgy";
import { toCategoryIcon } from "../lib/categories";
import CategoryBadge from "./CategoryBadge";
import FieldLabel from "./FieldLabel";

export interface RegleProposalPanelProps {
  open: boolean;
  category: Category | null;
  submitting: boolean;
  submitError: string | null;
  onAccept: () => void;
  onRefuse: () => void;
}

export default function RegleProposalPanel({
  open,
  category,
  submitting,
  submitError,
  onAccept,
  onRefuse,
}: RegleProposalPanelProps) {
  const { t } = useTranslation();

  return (
    <SidePanel
      open={open}
      onClose={onRefuse}
      title={t("budgy.rules.proposal.title")}
      footer={
        <Stack direction="row" gap="sm" justifyContent="end">
          <Button variant="secondary" onClick={onRefuse} disabled={submitting}>
            {t("budgy.rules.proposal.refuse")}
          </Button>
          <Button variant="primary" onClick={onAccept} loading={submitting}>
            {t("budgy.rules.proposal.accept")}
          </Button>
        </Stack>
      }
    >
      {category ? (
        <Stack gap="lg">
          <Feedback severity="info">
            {t("budgy.rules.proposal.description", { category: category.name })}
          </Feedback>
          <Stack gap="sm">
            <FieldLabel>{t("budgy.rules.proposal.targetLabel")}</FieldLabel>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                padding: 2,
                borderRadius: "var(--canop-radius-md)",
                border: "0.0625rem solid",
                borderColor: "divider",
                backgroundColor: "background.default",
              }}
            >
              <CategoryBadge
                color={category.color}
                icon={toCategoryIcon(category.icon)}
                size="lg"
              />
              <Stack gap="xs">
                <Heading level={3} size={5} gutterBottom={false}>
                  {category.name}
                </Heading>
                <StatusChip
                  tone={category.kind === "revenu" ? "success" : "neutral"}
                  label={t(`budgy.categories.kind.${category.kind}`)}
                  size="small"
                />
              </Stack>
            </Box>
          </Stack>
          {submitError ? (
            <Feedback severity="error">{submitError}</Feedback>
          ) : null}
        </Stack>
      ) : null}
    </SidePanel>
  );
}
