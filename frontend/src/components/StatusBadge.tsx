import type { InvoiceStatus, SubscriptionStatus } from "../types";

export default function StatusBadge({ status }: { status: SubscriptionStatus | InvoiceStatus | "Inactive" }) {
  const className = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status-pill status-${className}`}><span />{status}</span>;
}
