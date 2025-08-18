import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Vendors from './pages/Vendors';
import Invoices from './pages/Invoices';
import Inventory from './pages/Inventory';
import Banking from './pages/Banking';
import Projects from './pages/Projects';
import Accounting from './pages/Accounting';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Payroll from './pages/Payroll';
import FixedAssets from './pages/FixedAssets';
import Manufacturing from './pages/Manufacturing';
import SalesOrders from './pages/SalesOrders';
import PurchaseOrders from './pages/PurchaseOrders';
import DocumentManagement from './pages/DocumentManagement';
import WorkflowAutomation from './pages/WorkflowAutomation';
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/UI/LoadingSpinner';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/customers" element={
        <ProtectedRoute>
          <Layout>
            <Customers />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/vendors" element={
        <ProtectedRoute>
          <Layout>
            <Vendors />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/invoices" element={
        <ProtectedRoute>
          <Layout>
            <Invoices />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/inventory" element={
        <ProtectedRoute>
          <Layout>
            <Inventory />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/banking" element={
        <ProtectedRoute>
          <Layout>
            <Banking />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/projects" element={
        <ProtectedRoute>
          <Layout>
            <Projects />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/sales-orders" element={
        <ProtectedRoute>
          <Layout>
            <SalesOrders />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/purchase-orders" element={
        <ProtectedRoute>
          <Layout>
            <PurchaseOrders />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/manufacturing" element={
        <ProtectedRoute>
          <Layout>
            <Manufacturing />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/payroll" element={
        <ProtectedRoute>
          <Layout>
            <Payroll />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/fixed-assets" element={
        <ProtectedRoute>
          <Layout>
            <FixedAssets />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/accounting" element={
        <ProtectedRoute>
          <Layout>
            <Accounting />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <Layout>
            <Reports />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout>
            <Settings />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/documents" element={
        <ProtectedRoute>
          <Layout>
            <DocumentManagement />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/workflows" element={
        <ProtectedRoute>
          <Layout>
            <WorkflowAutomation />
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <TenantProvider>
          <div className="min-h-screen bg-gray-50">
            <AppRoutes />
          </div>
        </TenantProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;