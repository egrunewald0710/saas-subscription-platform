import { Activity, CreditCard, FileText, LayoutDashboard, LifeBuoy, Settings2, Sparkles, Users, Zap } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useDashboardData } from "../hooks/useDashboardData";

const groups = [
  { title: "WORKSPACE", links: [
    { label: "Overview", to: "/", icon: LayoutDashboard },
    { label: "Customers", to: "/customers", icon: Users },
    { label: "Subscriptions", to: "/subscriptions", icon: CreditCard },
    { label: "Plans & pricing", to: "/plans", icon: Zap },
    { label: "Invoices", to: "/invoices", icon: FileText },
  ] },
  { title: "MANAGE", links: [
    { label: "Analytics", to: "/analytics", icon: Activity },
    { label: "Settings", to: "/settings", icon: Settings2 },
  ] },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();
  const { preferences } = useDashboardData();
  const workspaceName = preferences.workspace || "Workspace";
  const accountEmail = preferences.email || "No account connected";
  const current = groups.flatMap((group) => group.links).find((link) =>
    link.to === "/" ? location.pathname === "/" : location.pathname.startsWith(link.to)
  );
  return <>
    {open && <button className="mobile-scrim" aria-label="Close navigation" onClick={onClose} />}
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`} aria-label="Main navigation">
      <NavLink to="/" className="brand" onClick={onClose}><span className="brand-mark"><Activity size={22} strokeWidth={2.8} /></span><span className="brand-name">Subscript<span>.</span></span></NavLink>
      <NavLink to="/settings" className="workspace-switcher" onClick={onClose}>
        <span className="workspace-avatar">{workspaceName.charAt(0).toUpperCase()}</span><span className="workspace-copy"><strong>{workspaceName}</strong></span><span aria-hidden="true">⌄</span>
      </NavLink>
      <nav className="sidebar-nav">{groups.map((group) => <div className="nav-group" key={group.title}><p className="nav-heading">{group.title}</p>{group.links.map(({ label, to, icon: Icon }) => <NavLink key={to} to={to} end={to === "/"} onClick={onClose} className={({ isActive }: { isActive: boolean }) => `nav-item ${isActive ? "nav-active" : ""}`} aria-current={current?.to === to ? "page" : undefined}><Icon size={18} strokeWidth={1.8} /><span>{label}</span></NavLink>)}</div>)}</nav>
      <div className="sidebar-bottom">
        <div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={17} /></div><strong>Make more happen.</strong><p>Unlock deeper insights and grow your revenue faster.</p><NavLink to="/plans">Explore plans <span aria-hidden="true">↗</span></NavLink><div className="upgrade-decoration" /></div>
        <NavLink to="/help" onClick={onClose} className={({ isActive }: { isActive: boolean }) => `nav-item support-link ${isActive ? "nav-active" : ""}`}><LifeBuoy size={18} strokeWidth={1.8} /><span>Help &amp; support</span></NavLink>
        <div className="profile-row"><div className="profile-avatar">{accountEmail.charAt(0).toUpperCase()}</div><div className="profile-copy"><strong>{accountEmail}</strong></div></div>
      </div>
    </aside>
  </>;
}
