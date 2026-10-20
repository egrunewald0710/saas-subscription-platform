import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  change?: ReactNode;
  icon: LucideIcon;
  tone?: "violet" | "lime" | "peach" | "rose";
}

export default function StatCard({ label, value, change, icon: Icon, tone = "violet" }: StatCardProps) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span className="metric-label">{label}</span>
        <span className={`metric-icon ${tone}-tint`}><Icon size={18} /></span>
      </div>
      <div className="metric-value">{value}</div>
      {change && <div className="metric-footer"><span className="metric-change positive">{change}</span><span className="metric-comparison">vs. last month</span></div>}
    </article>
  );
}
