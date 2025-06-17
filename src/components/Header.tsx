import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Sparkles, Zap, LogOut, User, Settings, Package, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
    setShowUserMenu(false);
  };
  
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

              <Link 
                to="/products" 
                className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 group ${
                  location.pathname === '/products' 
                    ? 'bg-white bg-opacity-20 text-white shadow-lg backdrop-blur-sm' 
                    : 'text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <span className="relative z-10 flex items-center">
                  <Package size={16} className="mr-2" />
                  Products
                </span>
                {location.pathname === '/products' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl opacity-20"></div>
                )}
              </Link>
            </div>

            {/* User Section */}
            {user && (
              <div className="flex items-center space-x-3">
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 bg-white bg-opacity-10 hover:bg-opacity-20 px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white border-opacity-20"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium hidden sm:block">
                      {user.email?.split('@')[0]}
                    </span>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 overflow-hidden">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User size={18} className="text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                            <p className="text-xs text-gray-500">Signed in</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          onClick={() => setShowUserMenu(false)}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors duration-200"
                        >
                          <Settings size={16} className="mr-3 text-gray-400" />
                          Account Settings
                        </button>
                        
                        <div className="border-t border-gray-100 my-1"></div>
                        
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors duration-200 group"
                        >
                          <LogOut size={16} className="mr-3 text-red-500 group-hover:text-red-600" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Logout Button */}
                <button
                  onClick={handleSignOut}
                  className="relative group overflow-hidden bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm"
                  title="Sign Out"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-2">
                    <LogOut size={16} className="text-red-300 group-hover:text-red-200 transition-colors" />
                    <span className="text-red-300 group-hover:text-red-200 font-medium text-sm hidden lg:block">
                      Logout
                    </span>
                  </div>
                </button>
              </div>
            )}

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
            <Link 
              to="/products" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                location.pathname === '/products' 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Package size={14} className="mr-1" />
              Products
            </Link>
          </div>
        </div>
      </div>

      {/* Animated Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-60"></div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;