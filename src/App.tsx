/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AdminLayout } from "./components/AdminLayout";
import { Home } from "./pages/Home";
import { Page } from "./pages/Page";
import { NewsList } from "./pages/NewsList";
import { NewsDetail } from "./pages/NewsDetail";
import { Dashboard } from "./pages/Admin/Dashboard";
import { ManagePages } from "./pages/Admin/ManagePages";
import { ManageNews } from "./pages/Admin/ManageNews";
import { Settings } from "./pages/Admin/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="noticias" element={<NewsList />} />
          <Route path="noticias/:slug" element={<NewsDetail />} />
          <Route path="p/:slug" element={<Page />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="paginas" element={<ManagePages />} />
          <Route path="noticias" element={<ManageNews />} />
          <Route path="configuracion" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
