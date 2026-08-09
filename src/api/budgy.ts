import { request } from "./client";

export interface BudgyHealth {
  status: string;
  service: string;
}

export interface Bank {
  id: string;
  nom: string;
  pays: string;
}

export interface BanksResponse {
  data: Bank[];
  total: number;
}

export interface ConsentInitiation {
  consent_id: string;
  authorization_url: string;
}

export interface LinkedAccount {
  id: string;
  iban_masked: string;
}

export interface ConsentCompletion {
  consent_id: string;
  status: string;
  comptes: LinkedAccount[];
}

export type ConsentStatus =
  | "pending"
  | "active"
  | "expired"
  | "revoked"
  | "failed";

export type ConsentRenewal = "up-to-date" | "renewal-required" | "expired";

export interface Consent {
  consent_id: string;
  bank: string | null;
  status: ConsentStatus;
  renewal: ConsentRenewal;
  renewable: boolean;
  expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ConsentsResponse {
  data: Consent[];
  total: number;
}

export function getHealth() {
  return request<BudgyHealth>("/budgy/health");
}

export function listBanks() {
  return request<BanksResponse>("/budgy/v1/banks");
}

export function initierConsentement(bankId: string) {
  return request<ConsentInitiation>("/budgy/v1/consents", {
    method: "POST",
    body: JSON.stringify({ bank_id: bankId }),
  });
}

export function listConsents() {
  return request<ConsentsResponse>("/budgy/v1/consents");
}

export function completerConsentement(code: string, state: string) {
  return request<ConsentCompletion>("/budgy/v1/consents/callback", {
    method: "POST",
    body: JSON.stringify({ code, state }),
  });
}

export function renouvelerConsentement(consentId: string) {
  return request<ConsentInitiation>(
    `/budgy/v1/consents/${encodeURIComponent(consentId)}/renew`,
    { method: "POST" }
  );
}

export type BalanceType = string;

export interface AccountBalance {
  amount_cents: number;
  type: BalanceType;
  at: string;
}

export interface Account {
  id: string;
  iban_masked: string;
  currency: string;
  balance: AccountBalance | null;
}

export interface AccountsResponse {
  data: Account[];
  total: number;
}

export interface ConsolidatedAccount {
  id: string;
  iban_masked: string;
  currency: string;
  balance: number;
  /** Solde à venir (opérations en attente incluses), si la banque le fournit. */
  solde_a_venir_cents?: number | null;
}

export interface ConsolidatedBalance {
  total_cents: number;
  /** Total à venir consolidé, présent seulement si au moins un compte l'expose. */
  total_a_venir_cents?: number | null;
  accounts: ConsolidatedAccount[];
}

export type TransactionStatus = "booked" | "pending";

export interface Transaction {
  id: string;
  label: string;
  /** Libellé nettoyé (tiers/marchand) fourni par l'API ; fallback sur `label`. */
  clean_label?: string;
  amount_cents: number;
  currency: string;
  status: TransactionStatus;
  booking_date: string | null;
  value_date: string | null;
  category_id: string | null;
}

export interface TransactionsResponse {
  data: Transaction[];
  total: number;
}

export type TransactionCategoryFilter = "all" | "uncategorized";

export interface TransactionsQuery {
  limit: number;
  offset: number;
  filter?: TransactionCategoryFilter;
}

export type CategoryKind = "revenu" | "depense";

export interface Category {
  id: string;
  name: string;
  kind: CategoryKind;
  color: string;
  icon: string;
  is_default?: boolean;
  transaction_count?: number;
}

export interface CategoriesResponse {
  data: Category[];
  total: number;
}

export interface CategoryInput {
  name: string;
  kind: CategoryKind;
  color: string;
  icon: string;
}

export function listCategories() {
  return request<CategoriesResponse>("/budgy/v1/categories");
}

export function creerCategorie(input: CategoryInput) {
  return request<Category>("/budgy/v1/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function modifierCategorie(categoryId: string, input: CategoryInput) {
  return request<Category>(
    `/budgy/v1/categories/${encodeURIComponent(categoryId)}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    }
  );
}

export function supprimerCategorie(categoryId: string) {
  return request<void>(
    `/budgy/v1/categories/${encodeURIComponent(categoryId)}`,
    { method: "DELETE" }
  );
}

export function listAccounts() {
  return request<AccountsResponse>("/budgy/v1/accounts");
}

export function getSoldesConsolides() {
  return request<ConsolidatedBalance>("/budgy/v1/balance");
}

export function listTransactions(
  accountId: string,
  { limit, offset, filter }: TransactionsQuery
) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (filter === "uncategorized") {
    params.set("uncategorized", "true");
  }
  return request<TransactionsResponse>(
    `/budgy/v1/accounts/${encodeURIComponent(accountId)}/transactions?${params.toString()}`
  );
}

export type TransactionType = "credit" | "debit";

export type TransactionSortField = "date" | "amount";

export type TransactionSortOrder = "asc" | "desc";

export interface TransactionsListQuery {
  limit: number;
  offset: number;
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  from?: string;
  to?: string;
  sort?: TransactionSortField;
  order?: TransactionSortOrder;
}

export function listAllTransactions({
  limit,
  offset,
  accountId,
  categoryId,
  type,
  from,
  to,
  sort,
  order,
}: TransactionsListQuery) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (accountId) {
    params.set("account_id", accountId);
  }
  if (categoryId) {
    params.set("category_id", categoryId);
  }
  if (type) {
    params.set("type", type);
  }
  if (from) {
    params.set("from", from);
  }
  if (to) {
    params.set("to", to);
  }
  if (sort) {
    params.set("sort", sort);
  }
  if (order) {
    params.set("order", order);
  }
  return request<TransactionsResponse>(
    `/budgy/v1/transactions?${params.toString()}`
  );
}

export function categoriserTransaction(
  accountId: string,
  transactionId: string,
  categoryId: string
) {
  return request<Transaction>(
    `/budgy/v1/accounts/${encodeURIComponent(accountId)}/transactions/${encodeURIComponent(transactionId)}/category`,
    {
      method: "PUT",
      body: JSON.stringify({ category_id: categoryId }),
    }
  );
}

export interface Budget {
  id: string;
  category_id: string;
  montant_cents: number;
  mois: string;
}

export interface BudgetsResponse {
  data: Budget[];
  total: number;
}

export interface BudgetInput {
  category_id: string;
  montant_cents: number;
  mois: string;
}

export function listBudgets(mois: string) {
  const params = new URLSearchParams({ mois });
  return request<BudgetsResponse>(
    `/budgy/v1/budgets?${params.toString()}`
  );
}

export function definirBudget(input: BudgetInput) {
  return request<Budget>("/budgy/v1/budgets", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export interface RemainingBudgetCategory {
  category_id: string;
  category_name: string;
  kind: CategoryKind;
  color: string;
  icon: string;
  montant_prevu_cents: number;
  depense_cents: number;
  reste_cents: number;
  depassement_cents: number;
  depasse: boolean;
}

export interface RemainingBudgetTotal {
  montant_prevu_cents: number;
  depense_cents: number;
  reste_cents: number;
}

export interface RemainingBudgetsResponse {
  month: string;
  categories: RemainingBudgetCategory[];
  // L'API renvoie toujours le total ; optionnel cote type pour rester tolerant
  // (mocks de test, anciennes reponses) — le hook/composant gerent son absence.
  total?: RemainingBudgetTotal;
}

export function getRemainingBudgets(month: string) {
  const params = new URLSearchParams({ month });
  return request<RemainingBudgetsResponse>(
    `/budgy/v1/budgets/remaining?${params.toString()}`
  );
}

export interface CategorizationRule {
  id: string;
  label_pattern: string;
  category_id: string;
  priority: number;
  created_at: string;
}

export interface CategorizationRuleInput {
  labelPattern: string;
  categoryId: string;
  priority?: number;
}

export interface ExpenseCategoryLine {
  category: string | null;
  montant_cents: number;
}

export interface ExpensesByCategory {
  total_cents: number;
  lignes: ExpenseCategoryLine[];
}

export function getExpensesByCategory(month: string) {
  const params = new URLSearchParams({ month });
  return request<ExpensesByCategory>(
    `/budgy/v1/expenses/by-category?${params.toString()}`
  );
}

export interface ForecastCategory {
  category_id: string | null;
  category: string | null;
  revenus_recurrents_cents: number;
  depenses_recurrentes_cents: number;
  budget_cents: number;
}

export interface Forecast {
  month: string;
  solde_previsionnel_cents: number;
  revenus_recurrents_cents: number;
  depenses_recurrentes_cents: number;
  budgets_cents: number;
  donnees_suffisantes: boolean;
  categories: ForecastCategory[];
}

export function getForecast(month: string) {
  const params = new URLSearchParams({ month });
  return request<Forecast>(`/budgy/v1/forecast?${params.toString()}`);
}

export function creerRegleCategorisation({
  labelPattern,
  categoryId,
  priority,
}: CategorizationRuleInput) {
  return request<CategorizationRule>("/budgy/v1/categorization-rules", {
    method: "POST",
    body: JSON.stringify({
      label_pattern: labelPattern,
      category_id: categoryId,
      ...(priority === undefined ? {} : { priority }),
    }),
  });
}

/** Catégorise automatiquement en « Salaire » tous les crédits non catégorisés. */
export function recategoriserCredits() {
  return request<{ categorisees: number }>(
    "/budgy/v1/transactions/recategoriser",
    { method: "POST" }
  );
}

/**
 * Crée une règle à partir d'une transaction : l'API dérive elle-même le motif
 * (le tiers) depuis le libellé, puis l'applique rétroactivement. Aucune saisie.
 */
export function creerRegleDepuisTransaction(
  accountId: string,
  transactionId: string,
  categoryId: string
) {
  return request<CategorizationRule>(
    `/budgy/v1/accounts/${encodeURIComponent(accountId)}/transactions/${encodeURIComponent(transactionId)}/rule`,
    {
      method: "POST",
      body: JSON.stringify({ category_id: categoryId }),
    }
  );
}

// ---------------------------------------------------------------------------
// Préférences : jour de départ du mois budgétaire.
// ---------------------------------------------------------------------------

export interface Preferences {
  jour_debut_mois: number;
}

export function getPreferences() {
  return request<Preferences>("/budgy/v1/preferences");
}

export function definirJourDebutMois(jour: number) {
  return request<Preferences>("/budgy/v1/preferences", {
    method: "PUT",
    body: JSON.stringify({ jour_debut_mois: jour }),
  });
}

// ---------------------------------------------------------------------------
// Enveloppes — les « budgets » de l'interface. À ne pas confondre avec les
// budgets mensuels par catégorie (listBudgets / definirBudget ci-dessus).
// ---------------------------------------------------------------------------

export interface Enveloppe {
  id: string;
  nom: string;
  icon: string;
  color: string;
  montant_cents: number;
  depense_cents: number;
  restant_cents: number;
  pourcentage_consomme: number;
  depasse: boolean;
  nombre_transactions: number;
}

export interface EnveloppesResponse {
  data: Enveloppe[];
  total: number;
}

export interface EnveloppeInput {
  nom: string;
  icon: string;
  color: string;
  montant_cents: number;
}

export function listEnveloppes() {
  return request<EnveloppesResponse>("/budgy/v1/enveloppes");
}

export function creerEnveloppe(input: EnveloppeInput) {
  return request<Enveloppe>("/budgy/v1/enveloppes", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function modifierEnveloppe(enveloppeId: string, input: EnveloppeInput) {
  return request<Enveloppe>(
    `/budgy/v1/enveloppes/${encodeURIComponent(enveloppeId)}`,
    { method: "PUT", body: JSON.stringify(input) }
  );
}

export function supprimerEnveloppe(enveloppeId: string) {
  return request<void>(
    `/budgy/v1/enveloppes/${encodeURIComponent(enveloppeId)}`,
    { method: "DELETE" }
  );
}

/** `null` retire la transaction de son enveloppe. */
export function affecterEnveloppe(
  transactionId: string,
  enveloppeId: string | null
) {
  return request<void>(
    `/budgy/v1/transactions/${encodeURIComponent(transactionId)}/enveloppe`,
    { method: "PUT", body: JSON.stringify({ enveloppe_id: enveloppeId }) }
  );
}
