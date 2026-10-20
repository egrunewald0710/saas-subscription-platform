import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CustomerForm from "../components/CustomerForm";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import StatusBadge from "../components/StatusBadge";
import { useDashboardData } from "../hooks/useDashboardData";
import type { Customer } from "../types";
import { dateLabel } from "../data/format";

const PAGE_SIZE = 6;

export default function Customers() {
  const { customers, createCustomer, updateCustomer, plans, subscriptions } = useDashboardData();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [status, setStatus] = useState("All statuses");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [feedback, setFeedback] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.filter((customer) => {
      const customerSubscription = subscriptions.find((entry) => entry.customerId === customer.id);
      const customerStatus = customerSubscription?.status ?? "Inactive";
      const matchesStatus = status === "All statuses" || customerStatus === status;
      return matchesStatus && (!q || `${customer.name} ${customer.email} ${customer.company}`.toLowerCase().includes(q));
    }).sort((a, b) => {
      const left = sort === "createdAt" ? a.createdAt : a[sort as "name" | "email"];
      const right = sort === "createdAt" ? b.createdAt : b[sort as "name" | "email"];
      return left.localeCompare(right);
    });
  }, [customers, subscriptions, search, status, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const saveCustomer = async (value: Pick<Customer, "name" | "email" | "company">) => {
    try {
      if (editing) await updateCustomer(editing.id, value);
      else await createCustomer(value);
    } catch {
      return;
    }
    setShowForm(false);
    setEditing(null);
    setFeedback(editing ? "Customer changes saved." : "Customer added successfully.");
    window.setTimeout(() => setFeedback(""), 3000);
  };
  return <>
    <PageHeader eyebrow="RELATIONSHIPS" title="Customers" description="Manage the people and businesses behind your subscriptions." action={<button className="button-primary" onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={17} />Add customer</button>} />
    {feedback && <p className="feedback-message" role="status">{feedback}</p>}
    <section className="panel data-panel">
      <div className="data-toolbar"><SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1); setParams(value ? { q: value } : {}); }} placeholder="Search customers..." label="Search customers" /><select className="filter-select" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} aria-label="Filter customers by status"><option>All statuses</option><option>Active</option><option>Trial</option><option>Past due</option><option>Inactive</option></select><label className="sort-label">Sort by<select className="filter-select" value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">Name</option><option value="email">Email</option><option value="createdAt">Date added</option></select></label></div>
      <div className="table-scroll"><table className="subscriptions-table"><thead><tr><th>CUSTOMER</th><th>COMPANY</th><th>PLAN</th><th>STATUS</th><th>JOINED</th><th>ACTIONS</th></tr></thead><tbody>
        {visible.map((customer) => {
          const subscription = subscriptions.find((entry) => entry.customerId === customer.id);
          const plan = plans.find((entry) => entry.id === subscription?.planId);
          return <tr key={customer.id}><td><button className="customer-cell table-link" onClick={() => setSelected(customer)}><span className={`customer-avatar avatar-${customer.color}`}>{customer.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span><span className="customer-details"><strong>{customer.name}</strong><span>{customer.email}</span></span></button></td><td>{customer.company || "—"}</td><td>{plan ? <span className={`plan-pill plan-${plan.name.toLowerCase()}`}>{plan.name}</span> : "—"}</td><td><StatusBadge status={subscription?.status ?? "Inactive"} /></td><td className="date-cell">{dateLabel(customer.createdAt)}</td><td><button className="button-text" onClick={() => { setEditing(customer); setShowForm(true); }}>Edit</button><button className="button-text" onClick={() => setSelected(customer)}>Details</button></td></tr>;
        })}
      </tbody></table></div>
      {visible.length === 0 && <EmptyState title="No customers found" description="Try adjusting your search or filters." action={<button className="button-secondary" onClick={() => { setSearch(""); setStatus("All statuses"); setParams({}); }}>Clear filters</button>} />}
      <div className="table-footer"><span>Showing <strong>{visible.length}</strong> of <strong>{filtered.length}</strong> customers</span><Pagination page={page} pages={pages} setPage={setPage} /></div>
    </section>
    {showForm && <div className="modal-backdrop"><section className="subscription-modal" role="dialog" aria-modal="true" aria-labelledby="customer-form-title"><div className="modal-heading"><div className="modal-icon"><Plus size={20} /></div><button className="icon-button" aria-label="Close" onClick={() => setShowForm(false)}>×</button></div><h2 id="customer-form-title">{editing ? "Edit customer" : "Add a customer"}<span className="title-period">.</span></h2><p className="modal-description">Keep customer details up to date.</p><CustomerForm customer={editing ?? undefined} onSave={saveCustomer} onCancel={() => setShowForm(false)} /></section></div>}
    {selected && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section className="subscription-modal" role="dialog" aria-modal="true" aria-labelledby="customer-detail-title"><div className="modal-heading"><span className={`customer-avatar avatar-${selected.color}`}>{selected.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span><button className="icon-button" aria-label="Close details" onClick={() => setSelected(null)}>×</button></div><h2 id="customer-detail-title">{selected.name}<span className="title-period">.</span></h2><p className="modal-description">{selected.email}<br />{selected.company || "No company listed"}<br />Customer since {dateLabel(selected.createdAt)}</p><h3>Subscriptions</h3>{subscriptions.filter((entry) => entry.customerId === selected.id).map((entry) => <p key={entry.id}>{plans.find((plan) => plan.id === entry.planId)?.name ?? "Plan"} · {entry.status}</p>)}<button className="button-primary" onClick={() => { setEditing(selected); setShowForm(true); setSelected(null); }}>Edit customer</button></section></div>}
  </>;
}

function Pagination({ page, pages, setPage }: { page: number; pages: number; setPage: (page: number) => void }) {
  return <div className="pagination"><button className="pagination-button" disabled={page <= 1} aria-label="Previous page" onClick={() => setPage(page - 1)}>‹</button><span className="pagination-current">{page}</span><span>of {pages}</span><button className="pagination-button" disabled={page >= pages} aria-label="Next page" onClick={() => setPage(page + 1)}>›</button></div>;
}
