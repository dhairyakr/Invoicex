import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-lg font-semibold">
          <FileText size={24} />
          <span>Invoice Beautifier</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link 
            to="/" 
            className={`px-3 py-2 rounded-md transition duration-200 ${
              location.pathname === '/' ? 'bg-gray-800' : 'hover:bg-gray-800'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            to="/templates" 
            className={`px-3 py-2 rounded-md transition duration-200 ${
              location.pathname === '/templates' ? 'bg-gray-800' : 'hover:bg-gray-800'
            }`}
          >
            Templates
          </Link>
          <Link 
            to="/create" 
            className="ml-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition duration-200 flex items-center"
          >
            <span className="mr-1">+</span> New Invoice
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;