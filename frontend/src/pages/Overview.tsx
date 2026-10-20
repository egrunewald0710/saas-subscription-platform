import { Activity, CreditCard, Download, Plus, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import NewSubscriptionModal from "../components/NewSubscriptionModal";
import PageHeader from "../components/PageHeader";
import PlanDistribution from "../components/PlanDistribution";
import RevenueChart from "../components/RevenueChart";
import SearchBar from "../components/SearchBar";
import StatCard from "../components/StatCard";
import SubscriptionsTable from "../components/SubscriptionsTable";
import { useDashboardData } from "../hooks/useDashboardData";
import type { RevenuePeriod, SubscriptionDraft } from "../types";

export default function Overview() {
  const { customers, createCustomer, plans, subscriptions, createSubscription, apiError } = useDashboardData();
  const [period, setPeriod] = useState<RevenuePeriod>("6 months");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const active = subscriptions.filter((item) => item.status === "Active");
  const mrr = active.reduce((sum, item) => sum + (item.interval === "Yearly" ? item.amount / 12 : item.amount), 0);
  const average = active.length ? mrr / active.length : 0;
  const canceled = subscriptions.filter((item) => item.status === "Cancelled").length;
  const churn = subscriptions.length ? canceled / subscriptions.length * 100 : 0;
  const rows = useMemo(() => subscriptions.filter((item) => {
    const customer = customers.find((entry) => entry.id === item.customerId);
    const plan = plans.find((entry) => entry.id === item.planId);
    const q = search.trim().toLowerCase();
    return (status === "All" || item.status === status) && (!q || `${customer?.name} ${customer?.email} ${item.id} ${plan?.name}`.toLowerCase().includes(q));
  }).slice(0, 5).map((item) => ({ ...item, customer: customers.find((entry) => entry.id === item.customerId), plan: plans.find((entry) => entry.id === item.planId) })), [subscriptions, customers, plans, search, status]);
  const saveSubscription = async (draft: SubscriptionDraft) => {
    let customerId = draft.customerId;
    if (draft.customer) {
      const existing = customers.find((customer) => customer.email.toLowerCase() === draft.customer?.email.toLowerCase());
      if (existing) customerId = existing.id;
      else {
        try {
          const customer = await createCustomer({ ...draft.customer, company: "" });
          customerId = customer.id;
        } catch {
          return;
        }
      }
    }
    if (!customerId) return;
    const plan = plans.find((entry) => entry.id === draft.planId);
    if (!plan) return;
    try {
      await createSubscription({ customerId: customerId!, planId: plan.id, interval: draft.interval, status: draft.status });
    } catch {
      return;
    }
    setShowModal(false);
    navigate("/subscriptions");
  };
  return <>
    <PageHeader eyebrow="YOUR BUSINESS AT A GLANCE" title="Overview" description="Here's what's happening with your subscriptions today." action={<><button className="button-secondary" type="button" onClick={() => window.print()}><Download size={16} />Export report</button><button className="button-primary" type="button" onClick={() => setShowModal(true)}><Plus size={17} />New subscription</button></>} />
    <section className="metrics-grid">
      <StatCard label="Monthly recurring revenue" value={money(mrr)} icon={CreditCard} />
      <StatCard label="Active subscriptions" value={active.length.toLocaleString()} icon={Users} tone="lime" />
      <StatCard label="Average revenue per user" value={money(average)} icon={Activity} tone="peach" />
      <StatCard label="Churn rate" value={`${churn.toFixed(1)}%`} icon={Activity} tone="rose" />
    </section>
    <section className="analytics-grid"><RevenueChart period={period} onPeriodChange={setPeriod} /><PlanDistribution plans={plans} subscriptions={subscriptions} /></section>
    <section className="panel subscriptions-panel">
      <div className="subscriptions-heading"><div><div className="panel-kicker">CUSTOMER ACTIVITY</div><h2>Recent subscriptions<span className="title-period">.</span></h2><p className="panel-description">Keep an eye on who's joining your business.</p></div>
        <div className="table-actions"><SearchBar value={search} onChange={setSearch} placeholder="Search customers..." label="Search subscriptions" /><select className="filter-select" value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by subscription status"><option>All</option><option>Active</option><option>Trial</option><option>Past due</option><option>Cancelled</option></select></div>
      </div>
      {rows.length ? <SubscriptionsTable rows={rows} onSelect={() => navigate("/subscriptions")} /> : <EmptyState title="No subscriptions found" description="Try another search or change the status filter." />}
      <div className="table-footer"><span>Showing <strong>{rows.length}</strong> recent subscriptions</span><Link to="/subscriptions">View all subscriptions ↗</Link></div>
    </section>
    <footer className="page-footer"><span>Subscript.</span><span>● {apiError ? "API unavailable" : "API connected"}</span></footer>
    {showModal && <NewSubscriptionModal customers={customers} plans={plans} onSave={saveSubscription} onClose={() => setShowModal(false)} />}
  </>;
}

function money(value: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(value);
}
