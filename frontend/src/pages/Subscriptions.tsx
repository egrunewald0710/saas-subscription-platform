import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import NewSubscriptionModal from "../components/NewSubscriptionModal";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import SubscriptionsTable from "../components/SubscriptionsTable";
import { useDashboardData } from "../hooks/useDashboardData";
import type { Subscription, SubscriptionDraft } from "../types";

const SIZE = 6;
export default function Subscriptions() {
  const { customers, createCustomer, plans, subscriptions, createSubscription, updateSubscription } = useDashboardData();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Subscription | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Subscription | null>(null);
  const [feedback, setFeedback] = useState("");
  const rows = useMemo(() => subscriptions.filter((subscription) => {
    const customer = customers.find((entry) => entry.id === subscription.customerId);
    const plan = plans.find((entry) => entry.id === subscription.planId);
    const query = search.trim().toLowerCase();
    return (status === "All statuses" || subscription.status === status) && (!query || `${customer?.name} ${customer?.email} ${subscription.id} ${plan?.name}`.toLowerCase().includes(query));
  }).sort((a, b) => sort === "oldest" ? a.startedAt.localeCompare(b.startedAt) : b.startedAt.localeCompare(a.startedAt)).map((subscription) => ({ ...subscription, customer: customers.find((entry) => entry.id === subscription.customerId), plan: plans.find((entry) => entry.id === subscription.planId) })), [subscriptions, customers, plans, search, status, sort]);
  const totalPages = Math.max(1, Math.ceil(rows.length / SIZE));
  const visible = rows.slice((page - 1) * SIZE, page * SIZE);
  const save = async (draft: SubscriptionDraft) => {
    let customerId = draft.customerId;
    if (draft.customer) {
      const existing = customers.find((entry) => entry.email.toLowerCase() === draft.customer?.email.toLowerCase());
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
    const plan = plans.find((entry) => entry.id === draft.planId);
    if (!plan || !customerId) return;
    try {
      const input = { customerId: customerId!, planId: plan.id, interval: draft.interval, status: draft.status };
      if (editing) await updateSubscription(editing.id, input);
      else await createSubscription(input);
    } catch {
      return;
    }
    setShowForm(false);
    setEditing(undefined);
    setFeedback(editing ? "Subscription updated." : "Subscription created.");
    window.setTimeout(() => setFeedback(""), 3000);
  };
  return <>
    <PageHeader eyebrow="RECURRING REVENUE" title="Subscriptions" description="Track plans, billing cycles and subscription health." action={<button className="button-primary" onClick={() => { setEditing(undefined); setShowForm(true); }}><Plus size={17} />New subscription</button>} />
    {feedback && <p className="feedback-message" role="status">{feedback}</p>}
    <section className="panel data-panel"><div className="data-toolbar"><SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search subscriptions..." label="Search subscriptions" /><select className="filter-select" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} aria-label="Filter subscriptions"><option>All statuses</option><option>Active</option><option>Trial</option><option>Past due</option><option>Cancelled</option></select><label className="sort-label">Sort by<select className="filter-select" value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option></select></label></div>
      {visible.length ? <SubscriptionsTable rows={visible} onSelect={(subscription) => setSelected(subscription)} /> : <EmptyState title="No subscriptions found" description="Try adjusting your search or filters." />}
      <div className="table-footer"><span>Showing <strong>{visible.length}</strong> of <strong>{rows.length}</strong> subscriptions</span><div className="pagination"><button className="pagination-button" disabled={page <= 1} aria-label="Previous page" onClick={() => setPage(page - 1)}>‹</button><span className="pagination-current">{page}</span><span>of {totalPages}</span><button className="pagination-button" disabled={page >= totalPages} aria-label="Next page" onClick={() => setPage(page + 1)}>›</button></div></div>
    </section>
    {showForm && <NewSubscriptionModal customers={customers} plans={plans} subscription={editing} onSave={save} onClose={() => { setShowForm(false); setEditing(undefined); }} />}
    {selected && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section className="subscription-modal" role="dialog" aria-modal="true" aria-labelledby="subscription-detail-title"><div className="modal-heading"><div className="modal-icon">↗</div><button className="icon-button" aria-label="Close details" onClick={() => setSelected(null)}>×</button></div><h2 id="subscription-detail-title">{selected.id}<span className="title-period">.</span></h2><p className="modal-description">{customers.find((entry) => entry.id === selected.customerId)?.name} · {plans.find((entry) => entry.id === selected.planId)?.name}<br />R{selected.amount} / {selected.interval.toLowerCase()} · {selected.status}<br />Started {selected.startedAt}</p><div className="modal-actions"><button className="button-secondary" onClick={() => setSelected(null)}>Close</button><button className="button-primary" onClick={() => { setEditing(selected); setShowForm(true); setSelected(null); }}>Edit subscription</button></div></section></div>}
  </>;
}
