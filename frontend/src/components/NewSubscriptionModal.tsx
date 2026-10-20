import { useState, type FormEvent } from "react";
import { Check, Plus, X } from "lucide-react";
import type { Customer, Plan, Subscription, SubscriptionDraft, SubscriptionStatus } from "../types";

export default function NewSubscriptionModal({ customers, plans, onSave, onClose, subscription }: { customers: Customer[]; plans: Plan[]; onSave: (draft: SubscriptionDraft) => void; onClose: () => void; subscription?: Subscription }) {
  const [customerId, setCustomerId] = useState(subscription?.customerId ?? customers[0]?.id ?? "new");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [planId, setPlanId] = useState(subscription?.planId ?? plans[0]?.id ?? "");
  const [interval, setInterval] = useState(subscription?.interval ?? "Monthly");
  const [status, setStatus] = useState<SubscriptionStatus>(subscription?.status ?? "Active");
  const isNewCustomer = customerId === "new" && !subscription;
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({
      ...(isNewCustomer ? { customer: { name: customerName.trim(), email: customerEmail.trim() } } : { customerId }),
      planId, interval, status,
    });
  };
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="subscription-modal" role="dialog" aria-modal="true" aria-labelledby="subscription-modal-title">
      <div className="modal-heading"><div className="modal-icon"><Plus size={20} /></div><button type="button" className="icon-button" aria-label="Close modal" onClick={onClose}><X size={20} /></button></div>
      <h2 id="subscription-modal-title">{subscription ? "Edit subscription" : "New subscription"}<span className="title-period">.</span></h2>
      <p className="modal-description">Choose a customer, plan and billing schedule.</p>
      <form onSubmit={submit} className="form-stack">
        {!subscription && <label className="form-field"><span>Customer</span><select value={customerId} onChange={(event) => setCustomerId(event.target.value)}><option value="new">Add a new customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} · {customer.email}</option>)}</select></label>}
        {isNewCustomer && <>
          <label className="form-field"><span>Customer name</span><input required minLength={2} value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="e.g. Alex Morgan" /></label>
          <label className="form-field"><span>Email address</span><input required type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} placeholder="alex@example.com" /></label>
        </>}
        <label className="form-field"><span>Subscription plan</span><select required value={planId} onChange={(event) => setPlanId(event.target.value)}>{plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} — R{interval === "Monthly" ? plan.monthlyPrice : plan.annualPrice} / {interval === "Monthly" ? "month" : "year"}</option>)}</select></label>
        <label className="form-field"><span>Billing interval</span><select value={interval} onChange={(event) => setInterval(event.target.value as "Monthly" | "Yearly")}><option>Monthly</option><option>Yearly</option></select></label>
        {subscription && <label className="form-field"><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value as SubscriptionStatus)}><option>Active</option><option>Trial</option><option>Past due</option><option>Cancelled</option></select></label>}
        <div className="modal-actions"><button type="button" className="button-secondary" onClick={onClose}>Cancel</button><button type="submit" className="button-primary"><Check size={16} />{subscription ? "Save changes" : "Create subscription"}</button></div>
      </form>
    </section>
  </div>;
}
