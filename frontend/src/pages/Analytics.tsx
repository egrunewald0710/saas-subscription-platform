import { Activity, CreditCard, Users } from "lucide-react";
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import PlanDistribution from "../components/PlanDistribution";
import RevenueChart from "../components/RevenueChart";
import StatCard from "../components/StatCard";
import { useDashboardData } from "../hooks/useDashboardData";
import type { RevenuePeriod } from "../types";
import { money } from "../data/format";

export default function Analytics() {
  const { customers, plans, subscriptions, invoices } = useDashboardData();
  const [period, setPeriod] = useState<RevenuePeriod>("6 months");
  const active = subscriptions.filter((item) => item.status === "Active");
  const revenue = active.reduce((sum, item) => sum + (item.interval === "Yearly" ? item.amount / 12 : item.amount), 0);
  const paid = invoices.filter((item) => item.status === "Paid").reduce((sum, item) => sum + item.amount, 0);
  const churn = subscriptions.length ? subscriptions.filter((item) => item.status === "Cancelled").length / subscriptions.length * 100 : 0;
  return <>
    <PageHeader eyebrow="BUSINESS PERFORMANCE" title="Analytics" description="Understand recurring revenue, growth and customer health." action={<select className="filter-select date-range" aria-label="Analytics date range" value={period} onChange={(event) => setPeriod(event.target.value as RevenuePeriod)}><option>30 days</option><option>6 months</option><option>12 months</option></select>} />
    <section className="metrics-grid"><StatCard label="Monthly recurring revenue" value={money(revenue)} icon={CreditCard} /><StatCard label="Active customers" value={String(active.length)} icon={Users} tone="lime" /><StatCard label="Customer churn" value={`${churn.toFixed(1)}%`} icon={Activity} tone="peach" /><StatCard label="Paid invoice revenue" value={money(paid)} icon={CreditCard} tone="rose" /></section>
    <section className="analytics-grid analytics-page-charts"><RevenueChart period={period} onPeriodChange={setPeriod} /><PlanDistribution plans={plans} subscriptions={subscriptions} /></section>
    <section className="panel data-panel"><div className="subscriptions-heading"><div><div className="panel-kicker">SUBSCRIPTION GROWTH</div><h2>Customer base overview<span className="title-period">.</span></h2><p className="panel-description">Current account and subscription status breakdown.</p></div></div><div className="growth-breakdown">{(["Active", "Trial", "Past due", "Cancelled"] as const).map((status) => <div className="growth-row" key={status}><span>{status}</span><div className="growth-track"><span style={{ width: `${subscriptions.length ? subscriptions.filter((item) => item.status === status).length / subscriptions.length * 100 : 0}%` }} /></div><strong>{subscriptions.filter((item) => item.status === status).length}</strong></div>)}</div><div className="table-footer"><span>{customers.length} customer records</span><span>{plans.length} available plans</span></div></section>
  </>;
}
