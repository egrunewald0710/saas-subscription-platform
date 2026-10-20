import { Suspense, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useDashboardData } from "../hooks/useDashboardData";

export default function DashboardLayout() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { preferences, loading, apiError } = useDashboardData();
  useEffect(() => {
    document.documentElement.dataset.appearance = preferences.appearance;
  }, [preferences.appearance]);
  return <div className="app-shell"><Sidebar open={mobileMenu} onClose={() => setMobileMenu(false)} /><main className="main-area"><Topbar onMenu={() => setMobileMenu(true)} /><div className="page-content">{apiError && <p className="feedback-message" role="alert">API connection: {apiError}</p>}{loading ? <div className="route-loading" role="status">Loading workspace...</div> : <Suspense fallback={<div className="route-loading" role="status">Loading page...</div>}><Outlet /></Suspense>}</div></main></div>;
}
