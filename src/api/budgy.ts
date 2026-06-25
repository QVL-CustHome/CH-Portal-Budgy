import { request } from "./client";

export interface BudgyHealth {
  status: string;
  service: string;
}

export function getHealth() {
  return request<BudgyHealth>("/budgy/health");
}
