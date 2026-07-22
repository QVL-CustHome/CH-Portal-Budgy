import { Form, Input, useTranslation } from "canopui";
import type { Category } from "../api/budgy";
import BudgetCategorySelect from "./BudgetCategorySelect";

export interface BudgetFormProps {
  categories: Category[];
  categoryId: string | null;
  amount: string;
  amountError: string | null;
  canSubmit: boolean;
  saving: boolean;
  saveError: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onAmountChange: (value: string) => void;
  onSubmit: () => void;
}

export default function BudgetForm({
  categories,
  categoryId,
  amount,
  amountError,
  canSubmit,
  saving,
  saveError,
  onSelectCategory,
  onAmountChange,
  onSubmit,
}: BudgetFormProps) {
  const { t } = useTranslation();

  return (
    <Form
      onSubmit={onSubmit}
      submitLabel={t("budgy.budgets.form.submit")}
      loading={saving}
      submitDisabled={!canSubmit}
      error={saveError}
      gap="lg"
    >
      <BudgetCategorySelect
        categories={categories}
        selectedCategoryId={categoryId}
        onSelect={onSelectCategory}
      />
      <Input
        type="number"
        label={t("budgy.budgets.form.amountLabel")}
        placeholder={t("budgy.budgets.form.amountPlaceholder")}
        helperText={t("budgy.budgets.form.amountHelper")}
        value={amount}
        onChange={onAmountChange}
        error={amountError}
        required
        fullWidth
      />
    </Form>
  );
}
