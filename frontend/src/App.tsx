import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import DashboardLayout from './components/layout/DashboardLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VendorsPage from './pages/VendorsPage'
import DashboardPage from './pages/DashboardPage'

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

        {/* Dashboard nested routes — all share sidebar + header via DashboardLayout */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          {/* Future sub-pages go here:
            <Route path="guests" element={<GuestsPage />} />
            <Route path="budget" element={<BudgetPage />} />
          */}
        </Route>
      </Routes>
    </>
  )
}
