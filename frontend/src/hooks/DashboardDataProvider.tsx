import { useEffect, useState, type ReactNode } from "react";
import type { Customer, Invoice, Plan, Subscription, WorkspacePreferences } from "../types";
import { api, type CustomerInput, type PlanInput, type SubscriptionInput } from "../data/api";
import { DashboardDataContext } from "./dashboardDataContext";

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [preferences, setPreferences] = useState<WorkspacePreferences>({ workspace: "", email: "", timezone: "UTC", billingUpdates: false, productNews: false, appearance: "light" });
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([api.customers.list(), api.subscriptions.list(), api.plans.list(), api.invoices.list(), api.preferences.get()])
      .then(([nextCustomers, nextSubscriptions, nextPlans, nextInvoices, nextPreferences]) => {
        if (!active) return;
        setCustomers(nextCustomers);
        setSubscriptions(nextSubscriptions);
        setPlans(nextPlans);
        setInvoices(nextInvoices);
        setPreferences(nextPreferences);
      })
      .catch((error: unknown) => {
        if (active) setApiError(error instanceof Error ? error.message : "Unable to load workspace data.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const perform = async <T,>(action: () => Promise<T>, apply: (result: T) => void) => {
    setApiError(null);
    try {
      const result = await action();
      apply(result);
      return result;
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "The API request failed.");
      throw error;
    }
  };

  const createCustomer = (input: CustomerInput) => perform(() => api.customers.create(input), (customer) => setCustomers((current) => [customer, ...current]));
  const updateCustomer = (id: string, input: CustomerInput) => perform(() => api.customers.update(id, input), (customer) => setCustomers((current) => current.map((item) => item.id === id ? customer : item)));
  const createPlan = (input: PlanInput) => perform(() => api.plans.create(input), (plan) => setPlans((current) => [...current, plan]));
  const updatePlan = (id: string, input: PlanInput) => perform(() => api.plans.update(id, input), (plan) => setPlans((current) => current.map((item) => item.id === id ? plan : item)));
  const deletePlan = (id: string) => perform(() => api.plans.remove(id), () => setPlans((current) => current.filter((item) => item.id !== id)));
  const createSubscription = (input: SubscriptionInput) => perform(() => api.subscriptions.create(input), (subscription) => setSubscriptions((current) => [subscription, ...current]));
  const updateSubscription = (id: string, input: SubscriptionInput) => perform(() => api.subscriptions.update(id, input), (subscription) => setSubscriptions((current) => current.map((item) => item.id === id ? subscription : item)));
  const updateInvoice = (id: string, status: Invoice["status"]) => perform(() => api.invoices.update(id, { status }), (invoice) => setInvoices((current) => current.map((item) => item.id === id ? invoice : item)));
  const downloadInvoice = (id: string) => perform(() => api.invoices.download(id), () => undefined);
  const updatePreferences = (input: WorkspacePreferences) => perform(() => api.preferences.update(input), setPreferences);

  return (
    <DashboardDataContext.Provider value={{ customers, subscriptions, plans, invoices, preferences, loading, apiError, createCustomer, updateCustomer, createPlan, updatePlan, deletePlan, createSubscription, updateSubscription, updateInvoice, downloadInvoice, updatePreferences }}>
      {children}
    </DashboardDataContext.Provider>
  );
}
