import {
  Button,
  Feedback,
  Heading,
  InputText,
  SidePanel,
  Stack,
  StatusChip,
  useTranslation,
} from "canopui";
import type { Category } from "../api/budgy";
import { toCategoryIcon } from "../lib/categories";
import CategoryBadge from "./CategoryBadge";

export interface RegleProposalPanelProps {
  open: boolean;
  category: Category | null;
  labelPattern: string;
  patternMax: number;
  patternError: string | null;
  canSubmit: boolean;
  submitting: boolean;
  submitError: string | null;
  onLabelPatternChange: (value: string) => void;
  onAccept: () => void;
  onRefuse: () => void;
}

export default function RegleProposalPanel({
  open,
  category,
  labelPattern,
  patternMax,
  patternError,
  canSubmit,
  submitting,
  submitError,
  onLabelPatternChange,
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
          <Button
            variant="primary"
            onClick={onAccept}
            loading={submitting}
            disabled={!canSubmit}
          >
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
          <InputText
            label={t("budgy.rules.proposal.patternLabel")}
            value={labelPattern}
            onChange={onLabelPatternChange}
            error={patternError}
            helperText={t("budgy.rules.proposal.patternHelper", {
              max: patternMax,
            })}
            required
            autoFocus
            fullWidth
          />
          <Stack gap="sm">
            <span className="category-field-label">
              {t("budgy.rules.proposal.targetLabel")}
            </span>
            <div className="category-preview">
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
            </div>
          </Stack>
          {submitError ? (
            <Feedback severity="error">{submitError}</Feedback>
          ) : null}
        </Stack>
      ) : null}
    </SidePanel>
  );
}
