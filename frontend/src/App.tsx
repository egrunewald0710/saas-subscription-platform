import { lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardDataProvider } from "./hooks/DashboardDataProvider";
import DashboardLayout from "./layouts/DashboardLayout";

const Analytics = lazy(() => import("./pages/Analytics"));
const Customers = lazy(() => import("./pages/Customers"));
const HelpSupport = lazy(() => import("./pages/HelpSupport"));
const Invoices = lazy(() => import("./pages/Invoices"));
const Overview = lazy(() => import("./pages/Overview"));
const Plans = lazy(() => import("./pages/Plans"));
const Settings = lazy(() => import("./pages/Settings"));
const Subscriptions = lazy(() => import("./pages/Subscriptions"));

export default function App() {
  return <BrowserRouter><DashboardDataProvider><Routes><Route element={<DashboardLayout />}>
    <Route index element={<Overview />} />
    <Route path="customers" element={<Customers />} />
    <Route path="subscriptions" element={<Subscriptions />} />
    <Route path="plans" element={<Plans />} />
    <Route path="invoices" element={<Invoices />} />
    <Route path="analytics" element={<Analytics />} />
    <Route path="settings" element={<Settings />} />
    <Route path="help" element={<HelpSupport />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route></Routes></DashboardDataProvider></BrowserRouter>;
}
