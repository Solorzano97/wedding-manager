import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import DashboardLayout from './components/layout/DashboardLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VendorsPage from './pages/VendorsPage'
import VendorDetailPage from './pages/VendorDetailPage'
import DashboardPage from './pages/DashboardPage'
import GuestsPage from './pages/GuestsPage'
import BudgetPage from './pages/BudgetPage'
import QuotesPage from './pages/QuotesPage'
import AppointmentsPage from './pages/AppointmentsPage'
import VendorProfilePage from './pages/VendorProfilePage'
import MessagesPage from './pages/MessagesPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-3 border-sage-200 border-t-sage-600 rounded-full animate-spin" /></div>
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

export default function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{
        className: 'font-body',
        style: { background: '#1c1917', color: '#fafaf9', borderRadius: '1rem' },
      }} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/vendors/:slug" element={<VendorDetailPage />} />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="guests" element={<GuestsPage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="quotes" element={<QuotesPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="vendor-profile" element={<VendorProfilePage />} />
        </Route>
      </Routes>
    </>
  )
}
