import { Ellipsis } from "lucide-react";
import type { Customer, Plan, Subscription } from "../types";
import EmptyState from "./EmptyState";
import StatusBadge from "./StatusBadge";
import { dateLabel, money } from "../data/format";

export interface SubscriptionRow extends Subscription {
  customer?: Customer;
  plan?: Plan;
}

export default function SubscriptionsTable({ rows, onSelect }: { rows: SubscriptionRow[]; onSelect?: (subscription: Subscription) => void }) {
  return (
    <div className="table-scroll">
      <table className="subscriptions-table">
        <thead><tr><th>CUSTOMER</th><th>PLAN</th><th>AMOUNT</th><th>STATUS</th><th>STARTED</th><th><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>
          {rows.map((subscription) => <tr key={subscription.id} onClick={() => onSelect?.(subscription)} className={onSelect ? "clickable-row" : ""}>
            <td><div className="customer-cell"><div className={`customer-avatar avatar-${subscription.customer?.color ?? "lavender"}`}>{subscription.customer?.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase() ?? "?"}</div><div className="customer-details"><strong>{subscription.customer?.name ?? "Customer"}</strong><span>{subscription.customer?.email ?? "Customer record unavailable"}</span></div></div></td>
            <td><span className={`plan-pill plan-${subscription.plan?.name.toLowerCase() ?? "starter"}`}>{subscription.plan?.name ?? "Removed plan"}</span></td>
            <td className="amount-cell">{money(subscription.amount)}<span>/{subscription.interval === "Yearly" ? "yr" : "mo"}</span></td>
            <td><StatusBadge status={subscription.status} /></td><td className="date-cell">{dateLabel(subscription.startedAt)}</td>
            <td><button type="button" className="row-more" aria-label={`View ${subscription.id}`} onClick={(event) => { event.stopPropagation(); onSelect?.(subscription); }}><Ellipsis size={19} /></button></td>
          </tr>)}
          {rows.length === 0 && <tr><td colSpan={6}><EmptyState title="No subscriptions found" description="Try changing your search or filters." /></td></tr>}
        </tbody>
      </table>
    </div>
  );
}
