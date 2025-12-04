import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InvoiceProvider } from './context/InvoiceContext';
import { ProductProvider } from './context/ProductContext';
import Header from './components/Header';
import SignUpPage from './components/Auth/SignUpPage';
import LoginPage from './components/Auth/LoginPage';
import Dashboard from './components/Dashboard';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import TemplateSelector from './components/TemplateSelector';
import ProductManager from './components/Products/ProductManager';
import FinancialReports from './components/FinancialReports';
import './index.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Main App Content
const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  // Show auth loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <InvoiceProvider>
      <ProductProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Show header only when user is authenticated */}
          {user && <Header />}
          
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/auth" 
              element={user ? <Navigate to="/" replace /> : <SignUpPage />} 
            />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" replace /> : <LoginPage />} 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create" 
              element={
                <ProtectedRoute>
                  <InvoiceForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit/:id" 
              element={
                <ProtectedRoute>
                  <InvoiceForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/preview/:id" 
              element={
                <ProtectedRoute>
                  <InvoicePreview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/templates" 
              element={
                <ProtectedRoute>
                  <TemplateSelector />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/products" 
              element={
                <ProtectedRoute>
                  <ProductManager />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <FinancialReports />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route 
              path="*" 
              element={<Navigate to={user ? "/" : "/auth"} replace />} 
            />
          </Routes>
        </div>
      </ProductProvider>
    </InvoiceProvider>
  );
};

// Root App Component
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;