import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import VendorsPage from './pages/VendorsPage'
import type { ReactNode } from 'react'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function Spinner() {
  return (
    <div className="w-8 h-8 border-3 border-sage-200 border-t-sage-600 rounded-full animate-spin" />
  )
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: { fontFamily: 'DM Sans', borderRadius: '12px', padding: '12px 16px' },
        success: { style: { background: '#f6f7f4', color: '#4d5a3e', border: '1px solid #d2d8c8' } },
        error: { style: { background: '#fdf5f3', color: '#ae4428', border: '1px solid #fad5cd' } },
      }} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      </Routes>
    </>
  )
}
