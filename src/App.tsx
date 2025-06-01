import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TemplateSelector from './components/TemplateSelector';
import InvoiceForm from './components/InvoiceForm';
import { InvoiceProvider } from './context/InvoiceContext';

function App() {
  return (
    <InvoiceProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/templates" element={<TemplateSelector />} />
              <Route path="/create" element={<InvoiceForm />} />
              <Route path="/edit/:id" element={<InvoiceForm />} />
              <Route path="*" element={<Navigate to="/\" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </InvoiceProvider>
  );
}

export default App;