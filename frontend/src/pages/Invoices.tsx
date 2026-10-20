import { Download, Printer } from "lucide-react";
import { useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import StatusBadge from "../components/StatusBadge";
import { useDashboardData } from "../hooks/useDashboardData";
import type { Invoice } from "../types";
import { dateLabel, money } from "../data/format";

export default function Invoices() {
  const { invoices, customers, subscriptions, plans, updateInvoice, downloadInvoice } = useDashboardData();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [selected, setSelected] = useState<Invoice | null>(null);
  const filtered = useMemo(() => invoices.filter((invoice) => {
    const customer = customers.find((entry) => entry.id === invoice.customerId);
    const q = search.trim().toLowerCase();
    return (status === "All statuses" || invoice.status === status) && (!q || `${invoice.number} ${customer?.name} ${customer?.email}`.toLowerCase().includes(q));
  }).sort((a, b) => b.issuedAt.localeCompare(a.issuedAt)), [invoices, customers, search, status]);
  const download = async (invoice: Invoice) => {
    try {
      const url = URL.createObjectURL(await downloadInvoice(invoice.id));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${invoice.number}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      return;
    }
  };
  return <>
    <PageHeader eyebrow="BILLING" title="Invoices" description="Review payment activity and share invoice records." />
    <section className="panel data-panel"><div className="data-toolbar"><SearchBar value={search} onChange={setSearch} placeholder="Search invoices..." label="Search invoices" /><select className="filter-select" value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter invoice status"><option>All statuses</option><option>Paid</option><option>Open</option><option>Overdue</option><option>Void</option></select></div>
      <div className="table-scroll"><table className="subscriptions-table"><thead><tr><th>INVOICE</th><th>CUSTOMER</th><th>AMOUNT</th><th>ISSUED</th><th>DUE DATE</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{filtered.map((invoice) => <tr key={invoice.id}><td><button className="table-link" onClick={() => setSelected(invoice)}><strong>{invoice.number}</strong></button></td><td>{customers.find((item) => item.id === invoice.customerId)?.name ?? "Customer"}</td><td className="amount-cell">{money(invoice.amount)}</td><td className="date-cell">{dateLabel(invoice.issuedAt)}</td><td className="date-cell">{dateLabel(invoice.dueAt)}</td><td><StatusBadge status={invoice.status} /></td><td><button className="button-text" onClick={() => download(invoice)}>Download</button></td></tr>)}</tbody></table></div>
      {!filtered.length && <EmptyState title="No invoices found" description="Try another search or status filter." />}
      <div className="table-footer"><span>Showing <strong>{filtered.length}</strong> of <strong>{invoices.length}</strong> invoices</span><span>{invoices.filter((invoice) => invoice.status === "Overdue").length} overdue</span></div>
    </section>
    {selected && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section className="subscription-modal invoice-detail" role="dialog" aria-modal="true" aria-labelledby="invoice-title"><div className="modal-heading"><div className="modal-icon">§</div><button className="icon-button" aria-label="Close invoice" onClick={() => setSelected(null)}>×</button></div><div className="panel-kicker">SUBSCRIPT INVOICE</div><h2 id="invoice-title">{selected.number}<span className="title-period">.</span></h2><div className="invoice-info"><span>Customer</span><strong>{customers.find((entry) => entry.id === selected.customerId)?.name ?? "Customer"}</strong><span>Subscription</span><strong>{plans.find((plan) => plan.id === subscriptions.find((item) => item.id === selected.subscriptionId)?.planId)?.name ?? "Subscription"}</strong><span>Issued</span><strong>{dateLabel(selected.issuedAt)}</strong><span>Due</span><strong>{dateLabel(selected.dueAt)}</strong><span>Status</span><StatusBadge status={selected.status} /></div><div className="invoice-total"><span>Total due</span><strong>{money(selected.amount)}</strong></div><div className="modal-actions"><button className="button-secondary" onClick={() => window.print()}><Printer size={15} />Print</button><button className="button-primary" onClick={() => download(selected)}><Download size={15} />Download invoice</button></div><button className="button-text" onClick={async () => { const next = selected.status === "Paid" ? "Open" : "Paid"; try { setSelected(await updateInvoice(selected.id, next)); } catch { return; } }}>Mark as {selected.status === "Paid" ? "open" : "paid"}</button></section></div>}
  </>;
}
