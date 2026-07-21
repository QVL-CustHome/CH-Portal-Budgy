import { Icon, Menu, MenuItem, useTranslation } from "canopui";
import type { Category } from "../api/budgy";
import { toCategoryIcon } from "../lib/categories";
import { useTransactionCategoryMenu } from "../hooks/useTransactionCategoryMenu";
import CategoryBadge from "./CategoryBadge";

export interface TransactionCategoryPickerProps {
  category: Category | null;
  categories: Category[];
  disabled?: boolean;
  onSelect: (categoryId: string) => void;
}

export default function TransactionCategoryPicker({
  category,
  categories,
  disabled,
  onSelect,
}: TransactionCategoryPickerProps) {
  const { t } = useTranslation();
  const { open, anchorRef, openMenu, closeMenu, selectCategory } =
    useTransactionCategoryMenu(onSelect);

  const label = category ? category.name : t("budgy.transactions.uncategorized");

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        className="transaction-category-trigger"
        data-empty={category === null}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("budgy.transactions.changeCategoryAria", { label })}
        onClick={openMenu}
      >
        {category ? (
          <CategoryBadge
            color={category.color}
            icon={toCategoryIcon(category.icon)}
            size="sm"
          />
        ) : (
          <span className="transaction-category-placeholder">
            <Icon name="plus" size="sm" color="inherit" />
          </span>
        )}
        <span className="transaction-category-name">{label}</span>
      </button>
      <Menu
        open={open}
        onClose={closeMenu}
        anchorEl={anchorRef.current}
        label={t("budgy.transactions.categoryMenuAria")}
      >
        {categories.map((option) => (
          <MenuItem
            key={option.id}
            label={option.name}
            icon={
              <CategoryBadge
                color={option.color}
                icon={toCategoryIcon(option.icon)}
                size="sm"
              />
            }
            onClick={() => selectCategory(option.id)}
          />
        ))}
      </Menu>
    </>
  );
}
