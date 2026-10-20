import { Bell, ChevronRight, CircleHelp, Menu, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";

const titles: Record<string, string> = {
  "/": "Overview", "/customers": "Customers", "/subscriptions": "Subscriptions",
  "/plans": "Plans & pricing", "/invoices": "Invoices", "/analytics": "Analytics",
  "/settings": "Settings", "/help": "Help & support",
};

export default function Topbar({ onMenu }: { onMenu: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const title = titles[location.pathname] ?? "Workspace";
  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/customers?q=${encodeURIComponent(query)}`);
  };
  return <header className="topbar">
    <div className="topbar-left"><button type="button" className="icon-button mobile-menu-button" aria-label="Open navigation" onClick={onMenu}><Menu size={21} /></button><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{title}</strong></div></div>
    <div className="topbar-actions">
      <form className="search-box" onSubmit={search}><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customers..." aria-label="Search customers" /><kbd>⌘ K</kbd></form>
      <div className="notification-wrap">
        <button type="button" className="icon-button notification-button" aria-label="Notifications" aria-expanded={showNotifications} onClick={() => setShowNotifications((value) => !value)}><Bell size={19} /></button>
        {showNotifications && <div className="notification-popover" role="region" aria-label="Notifications">
          <div className="popover-title"><strong>Notifications</strong></div>
          <p>No notifications available.</p>
        </div>}
      </div>
      <div className="topbar-divider" /><button type="button" className="help-button" onClick={() => navigate("/help")}><CircleHelp size={17} /><span>Help</span></button>
    </div>
  </header>;
}
