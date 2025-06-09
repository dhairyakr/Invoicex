import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Sparkles, Zap } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white shadow-2xl relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="absolute top-0 right-0 w-96 h-32 bg-white bg-opacity-5 rounded-full transform translate-x-48 -translate-y-16"></div>
      <div className="absolute bottom-0 left-0 w-64 h-32 bg-white bg-opacity-5 rounded-full transform -translate-x-32 translate-y-16"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                <FileText size={28} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Invoice Beautifier
              </h1>
              <p className="text-xs text-blue-200 font-medium">Professional Invoice Solutions</p>
            </div>
          </Link>
          
          {/* Navigation */}
          <div className="flex items-center space-x-2">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-2 mr-6">
              <Link 
                to="/" 
                className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 group ${
                  location.pathname === '/' 
                    ? 'bg-white bg-opacity-20 text-white shadow-lg backdrop-blur-sm' 
                    : 'text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <span className="relative z-10">Dashboard</span>
                {location.pathname === '/' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-20"></div>
                )}
              </Link>
              
              <Link 
                to="/templates" 
                className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 group ${
                  location.pathname === '/templates' 
                    ? 'bg-white bg-opacity-20 text-white shadow-lg backdrop-blur-sm' 
                    : 'text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <span className="relative z-10 flex items-center">
                  <Sparkles size={16} className="mr-2" />
                  Templates
                </span>
                {location.pathname === '/templates' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-20"></div>
                )}
              </Link>
            </div>

            {/* Mobile Navigation Indicator */}
            <div className="md:hidden flex items-center space-x-2 mr-4">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            
            {/* New Invoice Button */}
            <Link
              to="/create"
              className="relative group"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Button */}
              <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center shadow-lg group-hover:scale-105 group-hover:shadow-xl">
                <div className="absolute inset-0 bg-white bg-opacity-20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Zap size={18} className="mr-2 relative z-10" /> 
                <span className="relative z-10">New Invoice</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 pt-4 border-t border-white border-opacity-20">
          <div className="flex justify-center space-x-4">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === '/' 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/templates" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                location.pathname === '/templates' 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Sparkles size={14} className="mr-1" />
              Templates
            </Link>
          </div>
        </div>
      </div>

      {/* Animated Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-60"></div>
    </header>
  );
};

export default Header;