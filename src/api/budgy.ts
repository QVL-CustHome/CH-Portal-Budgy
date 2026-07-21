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

export type TransactionStatus = "booked" | "pending";

export interface Transaction {
  id: string;
  label: string;
  amount_cents: number;
  currency: string;
  status: TransactionStatus;
  booking_date: string | null;
  value_date: string | null;
}

export interface TransactionsResponse {
  data: Transaction[];
  total: number;
}

export interface TransactionsQuery {
  limit: number;
  offset: number;
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

export function listTransactions(
  accountId: string,
  { limit, offset }: TransactionsQuery
) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  return request<TransactionsResponse>(
    `/budgy/v1/accounts/${encodeURIComponent(accountId)}/transactions?${params.toString()}`
  );
}
