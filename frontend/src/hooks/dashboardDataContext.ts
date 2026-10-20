import { createContext } from "react";
import type { Customer, Invoice, Plan, Subscription, WorkspacePreferences } from "../types";
import type { CustomerInput, PlanInput, SubscriptionInput } from "../data/api";

export interface DashboardData {
  customers: Customer[];
  subscriptions: Subscription[];
  plans: Plan[];
  invoices: Invoice[];
  preferences: WorkspacePreferences;
  loading: boolean;
  apiError: string | null;
  createCustomer: (input: CustomerInput) => Promise<Customer>;
  updateCustomer: (id: string, input: CustomerInput) => Promise<Customer>;
  createPlan: (input: PlanInput) => Promise<Plan>;
  updatePlan: (id: string, input: PlanInput) => Promise<Plan>;
  deletePlan: (id: string) => Promise<void>;
  createSubscription: (input: SubscriptionInput) => Promise<Subscription>;
  updateSubscription: (id: string, input: SubscriptionInput) => Promise<Subscription>;
  updateInvoice: (id: string, status: Invoice["status"]) => Promise<Invoice>;
  downloadInvoice: (id: string) => Promise<Blob>;
  updatePreferences: (input: WorkspacePreferences) => Promise<WorkspacePreferences>;
}

export const DashboardDataContext = createContext<DashboardData | null>(null);
