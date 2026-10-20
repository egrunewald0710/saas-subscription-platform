import type { Customer, Invoice, Plan, RevenuePeriod, Subscription, WorkspacePreferences } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

type CustomerInput = Omit<Customer, "id" | "createdAt" | "color">;
type PlanInput = Omit<Plan, "id">;
type SubscriptionInput = Pick<Subscription, "customerId" | "planId" | "interval" | "status">;
type RevenuePoint = { month: string; revenue: number };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function json<T>(method: string, body: T): RequestInit {
  return { method, body: JSON.stringify(body) };
}

export const api = {
  customers: {
    list: () => request<Customer[]>("/customers"),
    create: (input: CustomerInput) => request<Customer>("/customers", json("POST", input)),
    update: (id: string, input: CustomerInput) => request<Customer>(`/customers/${encodeURIComponent(id)}`, json("PUT", input)),
  },
  plans: {
    list: () => request<Plan[]>("/plans"),
    create: (input: PlanInput) => request<Plan>("/plans", json("POST", input)),
    update: (id: string, input: PlanInput) => request<Plan>(`/plans/${encodeURIComponent(id)}`, json("PUT", input)),
    remove: (id: string) => request<void>(`/plans/${encodeURIComponent(id)}`, { method: "DELETE" }),
  },
  subscriptions: {
    list: () => request<Subscription[]>("/subscriptions"),
    create: (input: SubscriptionInput) => request<Subscription>("/subscriptions", json("POST", input)),
    update: (id: string, input: SubscriptionInput) => request<Subscription>(`/subscriptions/${encodeURIComponent(id)}`, json("PUT", input)),
  },
  invoices: {
    list: () => request<Invoice[]>("/invoices"),
    update: (id: string, input: Pick<Invoice, "status">) => request<Invoice>(`/invoices/${encodeURIComponent(id)}`, json("PATCH", input)),
    download: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/invoices/${encodeURIComponent(id)}/download`);
      if (!response.ok) throw new Error((await response.text()) || `Request failed (${response.status})`);
      return response.blob();
    },
  },
  preferences: {
    get: () => request<WorkspacePreferences>("/preferences"),
    update: (input: WorkspacePreferences) => request<WorkspacePreferences>("/preferences", json("PUT", input)),
  },
  revenue: (period: RevenuePeriod) => request<RevenuePoint[]>(`/analytics/revenue?period=${encodeURIComponent(period)}`),
};

export type { CustomerInput, PlanInput, RevenuePoint, SubscriptionInput };