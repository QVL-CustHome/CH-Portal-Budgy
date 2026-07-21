import { useCallback, useRef, useState, type RefObject } from "react";

interface UseTransactionCategoryMenuResult {
  open: boolean;
  anchorRef: RefObject<HTMLButtonElement | null>;
  openMenu: () => void;
  closeMenu: () => void;
  selectCategory: (categoryId: string) => void;
}

export function useTransactionCategoryMenu(
  onSelect: (categoryId: string) => void
): UseTransactionCategoryMenuResult {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback(() => setOpen(false), []);

  const selectCategory = useCallback(
    (categoryId: string) => {
      setOpen(false);
      onSelect(categoryId);
    },
    [onSelect]
  );

  return { open, anchorRef, openMenu, closeMenu, selectCategory };
}
