import { describe, expect, it, vi } from "vitest";

const capturedPaths: string[] = [];

vi.mock("./client", () => ({
  request: (path: string) => {
    capturedPaths.push(path);
    return Promise.resolve({ data: [], total: 0 });
  },
}));

import { listAllTransactions } from "./budgy";

function lastQuery(): URLSearchParams {
  const path = capturedPaths[capturedPaths.length - 1];
  return new URLSearchParams(path.slice(path.indexOf("?") + 1));
}

describe("CA-02 paramètres de requête de la liste des transactions", () => {
  it("cible l'endpoint /budgy/v1/transactions", async () => {
    await listAllTransactions({ limit: 20, offset: 0 });

    const path = capturedPaths[capturedPaths.length - 1];
    expect(path.startsWith("/budgy/v1/transactions?")).toBe(true);
  });

  it("sans filtre n'envoie que limit et offset", async () => {
    await listAllTransactions({ limit: 20, offset: 40 });

    const params = lastQuery();
    expect(params.get("limit")).toBe("20");
    expect(params.get("offset")).toBe("40");
    expect(params.get("account_id")).toBeNull();
    expect(params.get("category_id")).toBeNull();
    expect(params.get("type")).toBeNull();
    expect(params.get("from")).toBeNull();
    expect(params.get("to")).toBeNull();
  });

  it("filtre par compte, catégorie et période via les bons paramètres", async () => {
    await listAllTransactions({
      limit: 20,
      offset: 0,
      accountId: "acc-1",
      categoryId: "cat-1",
      from: "2026-06-01",
      to: "2026-06-30",
    });

    const params = lastQuery();
    expect(params.get("account_id")).toBe("acc-1");
    expect(params.get("category_id")).toBe("cat-1");
    expect(params.get("from")).toBe("2026-06-01");
    expect(params.get("to")).toBe("2026-06-30");
  });

  it("traduit le type entrée en type=credit", async () => {
    await listAllTransactions({ limit: 20, offset: 0, type: "credit" });

    expect(lastQuery().get("type")).toBe("credit");
  });

  it("traduit le type sortie en type=debit", async () => {
    await listAllTransactions({ limit: 20, offset: 0, type: "debit" });

    expect(lastQuery().get("type")).toBe("debit");
  });

  it("transmet le tri et l'ordre demandés", async () => {
    await listAllTransactions({
      limit: 20,
      offset: 0,
      sort: "amount",
      order: "asc",
    });

    const params = lastQuery();
    expect(params.get("sort")).toBe("amount");
    expect(params.get("order")).toBe("asc");
  });
});
