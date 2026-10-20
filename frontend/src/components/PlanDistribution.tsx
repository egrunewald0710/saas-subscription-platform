import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Plan, Subscription } from "../types";

const colors: Record<string, string> = { Pro: "#7557f6", Business: "#b6ef67", Starter: "#ffad8a" };

export default function PlanDistribution({ plans, subscriptions }: { plans: Plan[]; subscriptions: Subscription[] }) {
  const counts = plans.map((plan) => ({
    name: plan.name,
    value: subscriptions.filter((subscription) => subscription.planId === plan.id && subscription.status !== "Cancelled").length,
    color: colors[plan.name] ?? "#b6a8ff",
  }));
  const total = counts.reduce((sum, plan) => sum + plan.value, 0);
  return (
    <article className="panel plans-panel">
      <div className="panel-heading"><div><div className="panel-kicker">PLAN DISTRIBUTION</div><h2>What's popular<span className="title-period">?</span></h2><p className="panel-description">How customers choose to subscribe.</p></div></div>
      {total === 0 ? <div className="empty-chart">No active subscriptions yet.</div> : <>
        <div className="donut-wrap">
          <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={counts} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="68%" outerRadius="91%" paddingAngle={4} stroke="none" cornerRadius={5}>{counts.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
          <div className="donut-center"><strong>{total}</strong><span>Subscriptions</span></div>
        </div>
        <div className="plan-legend">{counts.map((plan) => <div className="plan-legend-row" key={plan.name}><span className="plan-name"><span className="plan-dot" style={{ background: plan.color }} />{plan.name}</span><strong>{total ? Math.round(plan.value / total * 100) : 0}%</strong><span className="plan-customer-count">{plan.value}</span></div>)}</div>
        <Link className="view-plans-link" to="/plans">View all plans <ArrowUpRight size={15} /></Link>
      </>}
    </article>
  );
}
