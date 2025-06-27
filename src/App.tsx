import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InvoiceProvider } from './context/InvoiceContext';
import { ProductProvider } from './context/ProductContext';
import Header from './components/Header';
import AuthPage from './components/Auth/AuthPage';
import Dashboard from './components/Dashboard';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import TemplateSelector from './components/TemplateSelector';
import ProductManager from './components/Products/ProductManager';
import ConnectionStatus from './components/ConnectionStatus';
import SupabaseSetup from './components/SupabaseSetup';
import { testConnection } from './lib/supabase';
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
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [connectionError, setConnectionError] = useState<string>('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testConnection();
        if (result.success) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('error');
          setConnectionError(result.error || 'Unknown connection error');
        }
      } catch (err) {
        setConnectionStatus('error');
        setConnectionError('Failed to connect to database');
      }
    };

    checkConnection();
  }, []);

  // Show connection status while checking
  if (connectionStatus === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Connecting to database...</p>
        </div>
      </div>
    );
  }

  // Show setup page if connection failed
  if (connectionStatus === 'error') {
    return <SupabaseSetup error={connectionError} />;
  }

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
          
          {/* Show connection status */}
          <ConnectionStatus 
            status={connectionStatus} 
            error={connectionError}
            onRetry={() => window.location.reload()}
          />
          
          <Routes>
            {/* Public Routes - Using AuthPage for split-screen design */}
            <Route 
              path="/auth" 
              element={user ? <Navigate to="/" replace /> : <AuthPage />} 
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