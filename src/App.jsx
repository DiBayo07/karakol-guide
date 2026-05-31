import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppDataProvider } from './context/AppDataContext'
import Layout from './components/Layout'
import AdminLayout from './pages/admin/AdminLayout'
import HomePage from './pages/HomePage'
import FoodPage from './pages/FoodPage'
import SightsPage from './pages/SightsPage'
import RoutesPage from './pages/RoutesPage'
import RouteDetailPage from './pages/RouteDetailPage'
import PlannerPage from './pages/PlannerPage'
import ContactPage from './pages/ContactPage'
import InfoPage from './pages/InfoPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminRoutesPage from './pages/admin/AdminRoutesPage'
import AdminMessagesPage from './pages/admin/AdminMessagesPage'
import AdminContent from './pages/admin/AdminContent'

export default function App() {
  return (
    <AppDataProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="routes/:id" element={<RouteDetailPage />} />
            <Route path="planner" element={<PlannerPage />} />
            <Route path="sights" element={<SightsPage />} />
            <Route path="food" element={<FoodPage />} />
            <Route path="info" element={<InfoPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="routes" element={<AdminRoutesPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
            <Route path="content" element={<AdminContent />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppDataProvider>
  )
}
