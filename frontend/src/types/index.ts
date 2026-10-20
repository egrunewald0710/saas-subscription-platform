export type SubscriptionStatus = "Active" | "Trial" | "Past due" | "Cancelled";
export type InvoiceStatus = "Paid" | "Open" | "Overdue" | "Void";
export type BillingInterval = "Monthly" | "Yearly";

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  createdAt: string;
  color: "lavender" | "peach" | "mint" | "blue" | "rose";
}

export interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  highlighted: boolean;
}

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  amount: number;
  interval: BillingInterval;
  status: SubscriptionStatus;
  startedAt: string;
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  subscriptionId: string;
  amount: number;
  issuedAt: string;
  dueAt: string;
  status: InvoiceStatus;
}

export interface WorkspacePreferences {
  workspace: string;
  email: string;
  timezone: string;
  billingUpdates: boolean;
  productNews: boolean;
  appearance: "light" | "comfortable";
}

export interface SubscriptionDraft {
  customerId?: string;
  customer?: Pick<Customer, "name" | "email">;
  planId: string;
  interval: BillingInterval;
  status: SubscriptionStatus;
}

export type RevenuePeriod = "30 days" | "6 months" | "12 months";
