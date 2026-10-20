import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import { useDashboardData } from "../hooks/useDashboardData";
import type { Plan } from "../types";

type PlanInput = Omit<Plan, "id">;
const blank: PlanInput = { name: "", monthlyPrice: 0, annualPrice: 0, description: "", features: ["", "", ""], highlighted: false };

export default function Plans() {
  const { plans, createPlan, updatePlan, deletePlan, subscriptions } = useDashboardData();
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState<PlanInput>(blank);
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState("");
  const startCreate = () => { setEditing(null); setForm(blank); setShowForm(true); };
  const startEdit = (plan: Plan) => { setEditing(plan); setForm({ name: plan.name, monthlyPrice: plan.monthlyPrice, annualPrice: plan.annualPrice, description: plan.description, features: [...plan.features, "", "", ""].slice(0, 3), highlighted: plan.highlighted }); setShowForm(true); };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = { ...form, name: form.name.trim(), description: form.description.trim(), features: form.features.map((feature) => feature.trim()).filter(Boolean) };
    try {
      if (editing) await updatePlan(editing.id, value);
      else await createPlan(value);
    } catch {
      return;
    }
    setShowForm(false);
    setFeedback(editing ? "Plan updated." : "Plan created.");
    window.setTimeout(() => setFeedback(""), 3000);
  };
  const remove = async (plan: Plan) => {
    const subscriberCount = subscriptions.filter((item) => item.planId === plan.id).length;
    if (subscriberCount) {
      setFeedback(`This plan is used by ${subscriberCount} subscription${subscriberCount === 1 ? "" : "s"} and cannot be deleted.`);
      return;
    }
    if (window.confirm(`Delete the ${plan.name} plan? This action cannot be undone.`)) {
      try {
        await deletePlan(plan.id);
      } catch {
        return;
      }
      setFeedback(`${plan.name} plan deleted.`);
    }
  };
  return <>
    <PageHeader eyebrow="PRICING & PACKAGING" title="Plans & pricing" description="Create clear subscription plans that make it easy to grow." action={<button className="button-primary" onClick={startCreate}><Plus size={17} />Create plan</button>} />
    {feedback && <p className="feedback-message" role="status">{feedback}</p>}
    {plans.length === 0 ? <EmptyState title="No plans yet" description="Create a plan to begin offering subscriptions." action={<button className="button-primary" onClick={startCreate}>Create a plan</button>} /> : <section className="plan-cards">{plans.map((plan) => {
      const subscriberCount = subscriptions.filter((item) => item.planId === plan.id && item.status !== "Cancelled").length;
      return <article className={`plan-card ${plan.highlighted ? "plan-card-featured" : ""}`} key={plan.id}>
        {plan.highlighted && <span className="plan-featured-label">MOST POPULAR</span>}
        <div className="plan-card-top"><span className={`plan-pill plan-${plan.name.toLowerCase()}`}>{plan.name}</span><div className="plan-card-actions"><button className="icon-button" aria-label={`Edit ${plan.name}`} onClick={() => startEdit(plan)}><Pencil size={16} /></button><button className="icon-button" aria-label={`Delete ${plan.name}`} onClick={() => remove(plan)}><Trash2 size={16} /></button></div></div>
        <h2>{plan.name}</h2><p className="plan-description">{plan.description}</p>
        <div className="plan-price">R{plan.monthlyPrice}<span>/ month</span></div><p className="annual-price">R{plan.annualPrice} billed yearly</p>
        <div className="plan-subscriber-count"><strong>{subscriberCount}</strong> current subscribers</div>
        <ul>{plan.features.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}</ul>
        <button className="button-secondary full-width" onClick={() => startEdit(plan)}>Edit plan</button>
      </article>;
    })}</section>}
    {showForm && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false); }}><section className="subscription-modal plan-editor" role="dialog" aria-modal="true" aria-labelledby="plan-form-title"><div className="modal-heading"><div className="modal-icon"><Plus size={20} /></div><button className="icon-button" aria-label="Close" onClick={() => setShowForm(false)}>×</button></div><h2 id="plan-form-title">{editing ? "Edit plan" : "Create a plan"}<span className="title-period">.</span></h2><form onSubmit={submit} className="form-stack">
      <label className="form-field"><span>Plan name</span><input required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
      <div className="form-grid"><label className="form-field"><span>Monthly price (ZAR)</span><input required type="number" min="0" step="1" value={form.monthlyPrice} onChange={(event) => setForm({ ...form, monthlyPrice: Number(event.target.value) })} /></label><label className="form-field"><span>Annual price (ZAR)</span><input required type="number" min="0" step="1" value={form.annualPrice} onChange={(event) => setForm({ ...form, annualPrice: Number(event.target.value) })} /></label></div>
      <label className="form-field"><span>Description</span><input required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
      {form.features.map((feature, index) => <label className="form-field" key={index}><span>Feature {index + 1}</span><input value={feature} onChange={(event) => setForm({ ...form, features: form.features.map((item, current) => current === index ? event.target.value : item) })} /></label>)}
      <label className="checkbox-field"><input type="checkbox" checked={form.highlighted} onChange={(event) => setForm({ ...form, highlighted: event.target.checked })} />Mark as most popular</label>
      <div className="modal-actions"><button type="button" className="button-secondary" onClick={() => setShowForm(false)}>Cancel</button><button className="button-primary" type="submit">{editing ? "Save changes" : "Create plan"}</button></div>
    </form></section></div>}
  </>;
}
