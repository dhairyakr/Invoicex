import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TemplateSelector from './components/TemplateSelector';
import InvoiceForm from './components/InvoiceForm';
import SupabaseSetup from './components/SupabaseSetup';
import AuthModal from './components/Auth/AuthModal';
import { InvoiceProvider } from './context/InvoiceContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Invoice Beautifier
            </h2>
            <p className="text-gray-600 mb-6">
              Sign in to access your invoices and create beautiful, professional invoices.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 hover:from-blue-700 hover:to-purple-700"
            >
              Sign In / Sign Up
            </button>
          </div>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    );
  }

  return <>{children}</>;
};

// Main App Content
const AppContent: React.FC = () => {
  const { user } = useAuth();
  
  // Check if Supabase is configured
  const isSupabaseConfigured = !!(
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  if (!isSupabaseConfigured) {
    return <SupabaseSetup />;
  }

  return (
    <InvoiceProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/setup" element={<SupabaseSetup />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/templates" element={
              <ProtectedRoute>
                <TemplateSelector />
              </ProtectedRoute>
            } />
            <Route path="/create" element={
              <ProtectedRoute>
                <InvoiceForm />
              </ProtectedRoute>
            } />
            <Route path="/edit/:id" element={
              <ProtectedRoute>
                <InvoiceForm />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </InvoiceProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;