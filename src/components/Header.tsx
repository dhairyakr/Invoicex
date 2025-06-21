import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Sparkles, LogOut, User, Settings, Package, ChevronDown } from 'lucide-react';
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
    <header className="relative overflow-hidden bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-xl border-b border-white/10">
      {/* Subtle Professional Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Refined Background Orbs */}
        <div className="absolute top-0 right-0 w-96 h-32 bg-gradient-to-l from-blue-500/15 to-indigo-500/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-32 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Professional Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/3"></div>
      
      {/* Subtle Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -skew-x-12 transform translate-x-[-100%] animate-shimmer opacity-50"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Professional Logo Section */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              {/* Subtle Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Professional Glass Container */}
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/5 rounded-2xl"></div>
                
                <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg">
                  <FileText size={24} className="text-white" />
                </div>
              </div>
            </div>
            
            <div className="group-hover:scale-105 transition-transform duration-300">
              <h1 className="text-2xl font-bold text-white">
                Invoice Beautifier
              </h1>
              <p className="text-xs text-blue-200 font-medium">Professional Invoice Solutions</p>
            </div>
          </Link>
          
          {/* Professional Navigation */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-2 mr-6">
              <Link 
                to="/" 
                className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  location.pathname === '/' 
                    ? 'bg-white/15 backdrop-blur-sm text-white shadow-lg border border-white/20' 
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/5 rounded-xl"></div>
                <span className="relative z-10">Dashboard</span>
              </Link>
              
              <Link 
                to="/templates" 
                className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  location.pathname === '/templates' 
                    ? 'bg-white/15 backdrop-blur-sm text-white shadow-lg border border-white/20' 
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/5 rounded-xl"></div>
                <span className="relative z-10 flex items-center">
                  <Sparkles size={16} className="mr-2" />
                  Templates
                </span>
              </Link>

              <Link 
                to="/products" 
                className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  location.pathname === '/products' 
                    ? 'bg-white/15 backdrop-blur-sm text-white shadow-lg border border-white/20' 
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/5 rounded-xl"></div>
                <span className="relative z-10 flex items-center">
                  <Package size={16} className="mr-2" />
                  Products
                </span>
              </Link>
            </div>

            {/* Professional User Section */}
            {user && (
              <div className="flex items-center space-x-3">
                {/* Liquid Glass Logout Button */}
                <button
                  onClick={handleSignOut}
                  className="relative group overflow-hidden"
                >
                  {/* Multi-layer Glass Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-400/40 to-purple-400/40 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative bg-gradient-to-r from-red-500 to-purple-600 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center shadow-lg group-hover:shadow-xl transform group-hover:scale-105 border border-white/20">
                    {/* Inner Glass Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    
                    {/* Liquid Shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 rounded-xl"></div>
                    
                    <span className="relative z-10 text-white flex items-center">
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </span>
                  </div>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 bg-white/10 hover:bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/5 rounded-xl"></div>
                    
                    <div className="relative w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <User size={16} className="text-white" />
                    </div>
                    
                    <span className="text-sm font-medium text-white hidden sm:block relative z-10">
                      {user.email?.split('@')[0]}
                    </span>
                    
                    <ChevronDown size={16} className={`text-white/80 relative z-10 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Professional Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 py-2 z-50 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/5 rounded-xl"></div>
                      
                      {/* User Info Header */}
                      <div className="relative px-4 py-3 border-b border-white/20 bg-gradient-to-r from-blue-500/20 to-indigo-500/20">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                            <User size={18} className="text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{user.email}</p>
                            <p className="text-xs text-blue-200">Signed in</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="relative py-1">
                        <button
                          onClick={() => setShowUserMenu(false)}
                          className="w-full text-left px-4 py-3 text-sm text-white/90 hover:text-white hover:bg-white/10 flex items-center transition-colors duration-200"
                        >
                          <Settings size={16} className="mr-3 text-white/70" />
                          Account Settings
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Professional New Invoice Button */}
                <Link
                  to="/create"
                  className="relative group overflow-hidden"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/40 to-indigo-400/40 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center shadow-lg group-hover:shadow-xl transform group-hover:scale-105 border border-white/20">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 rounded-xl"></div>
                    
                    <span className="relative z-10 text-white">New Invoice</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Professional Mobile Navigation */}
        <div className="md:hidden mt-4 pt-4 border-t border-white/20">
          <div className="flex justify-center space-x-4">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === '/' 
                  ? 'bg-white/15 text-white border border-white/20' 
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/templates" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                location.pathname === '/templates' 
                  ? 'bg-white/15 text-white border border-white/20' 
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles size={14} className="mr-1" />
              Templates
            </Link>
            <Link 
              to="/products" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                location.pathname === '/products' 
                  ? 'bg-white/15 text-white border border-white/20' 
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Package size={14} className="mr-1" />
              Products
            </Link>
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Professional Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        .animate-shimmer {
          animation: shimmer 4s infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;