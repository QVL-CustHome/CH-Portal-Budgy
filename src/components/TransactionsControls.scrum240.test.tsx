import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";

vi.mock("canopui", async (importOriginal) => {
  const actual = await importOriginal<typeof import("canopui")>();
  return {
    ...actual,
    useTranslation: () => ({ t: (key: string) => key, locale: "fr" }),
  };
});

import TransactionTypeFilter from "./TransactionTypeFilter";
import TransactionsSort from "./TransactionsSort";

describe("CA-02 contrôle de filtre par type", () => {
  it("sélectionne une entrée en émettant credit", () => {
    const onChange = vi.fn();
    render(<TransactionTypeFilter value={null} onChange={onChange} />);

    const options = screen.getAllByRole("radio");
    fireEvent.click(options[1]);

    expect(onChange).toHaveBeenCalledWith("credit");
  });

  it("sélectionne une sortie en émettant debit", () => {
    const onChange = vi.fn();
    render(<TransactionTypeFilter value={null} onChange={onChange} />);

    const options = screen.getAllByRole("radio");
    fireEvent.click(options[2]);

    expect(onChange).toHaveBeenCalledWith("debit");
  });

  it("revient à tous les types en émettant null", () => {
    const onChange = vi.fn();
    render(<TransactionTypeFilter value="credit" onChange={onChange} />);

    const options = screen.getAllByRole("radio");
    fireEvent.click(options[0]);

    expect(onChange).toHaveBeenCalledWith(null);
  });
});

describe("CA-03 contrôle de tri", () => {
  it("change le champ de tri pour le montant", () => {
    const onFieldChange = vi.fn();
    render(
      <TransactionsSort
        field="date"
        order="desc"
        onFieldChange={onFieldChange}
        onOrderChange={vi.fn()}
      />
    );

    const groups = screen.getAllByRole("radiogroup");
    const fieldOptions = within(groups[0]).getAllByRole("radio");
    fireEvent.click(fieldOptions[1]);

    expect(onFieldChange).toHaveBeenCalledWith("amount");
  });

  it("change le champ de tri pour la date", () => {
    const onFieldChange = vi.fn();
    render(
      <TransactionsSort
        field="amount"
        order="desc"
        onFieldChange={onFieldChange}
        onOrderChange={vi.fn()}
      />
    );

    const groups = screen.getAllByRole("radiogroup");
    const fieldOptions = within(groups[0]).getAllByRole("radio");
    fireEvent.click(fieldOptions[0]);

    expect(onFieldChange).toHaveBeenCalledWith("date");
  });

  it("émet asc quand on choisit l'ordre ascendant depuis l'ordre descendant", () => {
    const onOrderChange = vi.fn();
    render(
      <TransactionsSort
        field="date"
        order="desc"
        onFieldChange={vi.fn()}
        onOrderChange={onOrderChange}
      />
    );

    const groups = screen.getAllByRole("radiogroup");
    const orderOptions = within(groups[1]).getAllByRole("radio");
    fireEvent.click(orderOptions[1]);

    expect(onOrderChange).toHaveBeenCalledWith("asc");
  });

  it("émet desc quand on choisit l'ordre descendant depuis l'ordre ascendant", () => {
    const onOrderChange = vi.fn();
    render(
      <TransactionsSort
        field="date"
        order="asc"
        onFieldChange={vi.fn()}
        onOrderChange={onOrderChange}
      />
    );

    const groups = screen.getAllByRole("radiogroup");
    const orderOptions = within(groups[1]).getAllByRole("radio");
    fireEvent.click(orderOptions[0]);

    expect(onOrderChange).toHaveBeenCalledWith("desc");
  });
});
