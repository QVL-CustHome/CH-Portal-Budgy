import { useMemo } from "react";
import { MultiSelect, useTranslation, type ChMultiSelectOption } from "canopui";
import type { Bank } from "../api/budgy";

export interface BankSelectorProps {
  banks: Bank[];
  selectedBankId: string | null;
  onSelect: (bankId: string | null) => void;
}

export default function BankSelector({
  banks,
  selectedBankId,
  onSelect,
}: BankSelectorProps) {
  const { t } = useTranslation();

  const options = useMemo<ChMultiSelectOption[]>(
    () =>
      banks.map((bank) => ({
        value: bank.id,
        label: `${bank.nom} (${bank.pays})`,
      })),
    [banks]
  );

  const value = selectedBankId ? [selectedBankId] : [];

  function handleChange(next: string[]) {
    onSelect(next.length > 0 ? next[next.length - 1] : null);
  }

  return (
    <MultiSelect
      label={t("budgy.bank.selectLabel")}
      placeholder={t("budgy.bank.selectPlaceholder")}
      options={options}
      value={value}
      onChange={handleChange}
    />
  );
}
