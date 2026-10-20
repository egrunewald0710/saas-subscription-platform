import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api, type RevenuePoint } from "../data/api";
import type { RevenuePeriod } from "../types";
import { money } from "../data/format";

export default function RevenueChart({ period, onPeriodChange }: { period: RevenuePeriod; onPeriodChange: (period: RevenuePeriod) => void }) {
  const [data, setData] = useState<RevenuePoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    api.revenue(period).then((result) => {
      if (active) {
        setData(result);
        setError(null);
      }
    }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : "Unable to load revenue data.");
    });
    return () => { active = false; };
  }, [period]);
  const currentRevenue = data[data.length - 1]?.revenue ?? 0;
  return (
    <article className="panel revenue-panel">
      <div className="panel-heading">
        <div><div className="panel-kicker">REVENUE OVERVIEW</div><h2>Revenue that keeps growing<span className="title-period">.</span></h2><p className="panel-description">Track recurring revenue over time.</p></div>
      </div>
      <div className="chart-summary"><div><span className="chart-total">{money(currentRevenue)}</span><span className="chart-period-label">Revenue for selected period</span></div><div className="chart-legend"><span className="legend-dot" /> Revenue</div></div>
      <div className="revenue-chart">
        {error ? <div className="empty-chart" role="status">Revenue data is unavailable.</div> : !data.length ? <div className="empty-chart">No revenue data for this period.</div> : <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
            <defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7557f6" stopOpacity={0.22} /><stop offset="95%" stopColor="#7557f6" stopOpacity={0.01} /></linearGradient></defs>
            <CartesianGrid stroke="#eeedf3" strokeDasharray="3 5" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9996a8", fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9996a8", fontSize: 11 }} tickFormatter={(value: number) => `R${Math.round(value / 1000)}k`} />
            <Tooltip formatter={(value) => [`R${Number(value).toLocaleString("en-ZA")}`, "Revenue"]} />
            <Area type="monotone" dataKey="revenue" stroke="#7557f6" strokeWidth={3} fill="url(#revenueFill)" activeDot={{ r: 5, fill: "#7557f6", stroke: "#fff", strokeWidth: 3 }} />
          </AreaChart>
        </ResponsiveContainer>}
      </div>
      <div className="chart-footer"><span><span className="footer-dot" /> Revenue for selected period</span><div className="period-switcher" aria-label="Chart time period">{(["30 days", "6 months", "12 months"] as RevenuePeriod[]).map((option) => <button type="button" key={option} className={period === option ? "period-active" : ""} aria-pressed={period === option} onClick={() => onPeriodChange(option)}>{option}</button>)}</div></div>
    </article>
  );
}
