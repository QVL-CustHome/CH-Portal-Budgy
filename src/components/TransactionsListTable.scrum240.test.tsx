import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Category, Transaction } from "../api/budgy";
import { messages } from "../i18n/messages";

const fr = messages.fr as Record<string, string>;

interface Column {
  key: string;
  header: string;
  align?: string;
  render: (row: Transaction) => ReactNode;
}

vi.mock("canopui", async (importOriginal) => {
  const actual = await importOriginal<typeof import("canopui")>();
  return {
    palette: actual.palette,
    useTranslation: () => ({ t: (key: string) => fr[key] ?? key, locale: "fr" }),
    DataTable: ({
      columns,
      rows,
      emptyMessage,
    }: {
      columns: Column[];
      rows: Transaction[];
      emptyMessage: string;
    }) => (
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td>{emptyMessage}</td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render(row)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    ),
  };
});

vi.mock("./TransactionCategoryTag", () => ({
  default: ({ category }: { category: Category | null }) => (
    <span>{category ? category.name : "—"}</span>
  ),
}));

import TransactionsListTable from "./TransactionsListTable";

const alimentation: Category = {
  id: "cat-1",
  name: "Alimentation",
  kind: "depense",
  color: "#123456",
  icon: "folder",
};

function categoriesById(): Map<string, Category> {
  return new Map([[alimentation.id, alimentation]]);
}

const entree: Transaction = {
  id: "tx-credit",
  label: "VIREMENT SALAIRE",
  amount_cents: 250_000,
  currency: "EUR",
  status: "booked",
  booking_date: "2026-06-01",
  value_date: "2026-06-01",
  category_id: "cat-1",
};

const sortie: Transaction = {
  id: "tx-debit",
  label: "MONOPRIX PARIS",
  amount_cents: -2_599,
  currency: "EUR",
  status: "booked",
  booking_date: "2026-06-02",
  value_date: "2026-06-02",
  category_id: null,
};

describe("CA-01 colonnes de la liste des transactions", () => {
  it("affiche les entêtes date, libellé, catégorie et montant", () => {
    render(
      <TransactionsListTable
        transactions={[entree]}
        categoriesById={categoriesById()}
        loading={false}
      />
    );

    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Libellé")).toBeInTheDocument();
    expect(screen.getByText("Catégorie")).toBeInTheDocument();
    expect(screen.getByText("Montant")).toBeInTheDocument();
  });

  it("n'expose pas de colonne marchand distincte du libellé", () => {
    render(
      <TransactionsListTable
        transactions={[entree]}
        categoriesById={categoriesById()}
        loading={false}
      />
    );

    expect(screen.queryByText("Marchand")).not.toBeInTheDocument();
    expect(screen.queryByText("Merchant")).not.toBeInTheDocument();
    expect(screen.getAllByText("VIREMENT SALAIRE")).toHaveLength(1);
  });

  it("affiche le libellé, la catégorie résolue et un montant signé positif pour une entrée", () => {
    render(
      <TransactionsListTable
        transactions={[entree]}
        categoriesById={categoriesById()}
        loading={false}
      />
    );

    expect(screen.getByText("VIREMENT SALAIRE")).toBeInTheDocument();
    expect(screen.getByText("Alimentation")).toBeInTheDocument();
    const montant = screen.getByText(
      (_, element) =>
        element?.tagName === "TD" && (element.textContent ?? "").includes("€")
    );
    expect(montant.textContent).toContain("+");
    expect(montant.textContent).toContain("500,00");
  });

  it("affiche un montant signé négatif pour une sortie non catégorisée", () => {
    render(
      <TransactionsListTable
        transactions={[sortie]}
        categoriesById={categoriesById()}
        loading={false}
      />
    );

    const montant = screen.getByText(/25,99/);
    expect(montant.textContent).toContain("-");
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});

describe("CA-04 aucun résultat", () => {
  it("affiche le message exact quand aucune transaction ne correspond", () => {
    render(
      <TransactionsListTable
        transactions={[]}
        categoriesById={categoriesById()}
        loading={false}
      />
    );

    expect(
      screen.getByText("Aucune transaction ne correspond à votre recherche")
    ).toBeInTheDocument();
  });
});
