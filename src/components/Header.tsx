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
    <header className="relative overflow-hidden">
      {/* Liquid Aero Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-blue-900/80 to-indigo-900/80 backdrop-blur-xl"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-32 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-64 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-16 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/5"></div>
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] hover:translate-x-[200%] transition-transform duration-1000 opacity-0 hover:opacity-100"></div>
      
      {/* Border Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section with Liquid Glass */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              {/* Outer Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Glass Container */}
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                {/* Inner Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                
                {/* Icon with Gradient */}
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl shadow-lg">
                  <FileText size={24} className="text-white" />
                </div>
              </div>
            </div>
            
            <div className="group-hover:scale-105 transition-transform duration-300">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
                Invoice Beautifier
              </h1>
              <p className="text-xs text-blue-200/80 font-medium">Professional Invoice Solutions</p>
            </div>
          </Link>
          
          {/* Navigation with Liquid Glass Pills */}
          <div className="flex items-center space-x-3">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-2 mr-6">
              <Link 
                to="/" 
                className={`relative group overflow-hidden px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  location.pathname === '/' 
                    ? 'bg-white/20 backdrop-blur-md text-white shadow-lg border border-white/30' 
                    : 'text-blue-100/80 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                
                {/* Active State Glow */}
                {location.pathname === '/' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-sm"></div>
                )}
                
                {/* Hover Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 rounded-2xl"></div>
                
                <span className="relative z-10">Dashboard</span>
              </Link>
              
              <Link 
                to="/templates" 
                className={`relative group overflow-hidden px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  location.pathname === '/templates' 
                    ? 'bg-white/20 backdrop-blur-md text-white shadow-lg border border-white/30' 
                    : 'text-blue-100/80 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                
                {/* Active State Glow */}
                {location.pathname === '/templates' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-sm"></div>
                )}
                
                {/* Hover Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 rounded-2xl"></div>
                
                <span className="relative z-10 flex items-center">
                  <Sparkles size={16} className="mr-2" />
                  Templates
                </span>
              </Link>

              <Link 
                to="/products" 
                className={`relative group overflow-hidden px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  location.pathname === '/products' 
                    ? 'bg-white/20 backdrop-blur-md text-white shadow-lg border border-white/30' 
                    : 'text-blue-100/80 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                
                {/* Active State Glow */}
                {location.pathname === '/products' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-2xl blur-sm"></div>
                )}
                
                {/* Hover Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 rounded-2xl"></div>
                
                <span className="relative z-10 flex items-center">
                  <Package size={16} className="mr-2" />
                  Products
                </span>
              </Link>
            </div>

            {/* User Section with Liquid Glass */}
            {user && (
              <div className="flex items-center space-x-3">
                {/* User Menu with Aero Glass */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="relative group overflow-hidden flex items-center space-x-3 bg-white/10 backdrop-blur-md hover:bg-white/15 px-5 py-3 rounded-2xl transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl"
                  >
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                    
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* User Avatar with Glass Effect */}
                    <div className="relative w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/10 rounded-full"></div>
                      <User size={16} className="text-white relative z-10" />
                    </div>
                    
                    <span className="text-sm font-semibold text-white/90 hidden sm:block relative z-10">
                      {user.email?.split('@')[0]}
                    </span>
                    
                    <ChevronDown size={16} className={`text-white/70 relative z-10 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu with Liquid Glass */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl shadow-2xl z-50">
                      {/* Glass Background */}
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20">
                        {/* Glossy Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                        
                        {/* User Info Header with Glass */}
                        <div className="relative px-6 py-4 border-b border-white/20 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                              <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/10 rounded-full"></div>
                              <User size={20} className="text-white relative z-10" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">{user.email}</p>
                              <p className="text-xs text-white/70">Signed in</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items with Glass Effects */}
                        <div className="relative py-2">
                          <button
                            onClick={() => setShowUserMenu(false)}
                            className="relative w-full text-left px-6 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 flex items-center transition-all duration-200 group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            <Settings size={16} className="mr-3 text-white/60 group-hover:text-white/80 relative z-10" />
                            <span className="relative z-10">Account Settings</span>
                          </button>
                          
                          <div className="border-t border-white/20 my-2"></div>
                          
                          <button
                            onClick={handleSignOut}
                            className="relative w-full text-left px-6 py-3 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/20 flex items-center transition-all duration-200 group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            <LogOut size={16} className="mr-3 text-red-400 group-hover:text-red-300 relative z-10" />
                            <span className="relative z-10">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* New Invoice Button with Liquid Glass */}
                <Link
                  to="/create"
                  className="relative group overflow-hidden"
                >
                  {/* Outer Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Main Button */}
                  <div className="relative bg-gradient-to-r from-blue-500/80 via-purple-500/80 to-pink-500/80 backdrop-blur-md px-8 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center shadow-xl group-hover:shadow-2xl transform group-hover:scale-105 border border-white/30">
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                    
                    {/* Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/90 via-purple-400/90 to-pink-400/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                    
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 rounded-2xl"></div>
                    
                    <Zap size={18} className="mr-3 relative z-10 text-white" /> 
                    <span className="relative z-10 text-white">New Invoice</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation with Liquid Glass */}
        <div className="md:hidden mt-6 pt-6 border-t border-white/20">
          <div className="flex justify-center space-x-3">
            <Link 
              to="/" 
              className={`relative group overflow-hidden px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                location.pathname === '/' 
                  ? 'bg-white/20 backdrop-blur-md text-white border border-white/30' 
                  : 'text-blue-200/80 hover:text-white hover:bg-white/10 backdrop-blur-sm'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
              <span className="relative z-10">Dashboard</span>
            </Link>
            
            <Link 
              to="/templates" 
              className={`relative group overflow-hidden px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center ${
                location.pathname === '/templates' 
                  ? 'bg-white/20 backdrop-blur-md text-white border border-white/30' 
                  : 'text-blue-200/80 hover:text-white hover:bg-white/10 backdrop-blur-sm'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
              <Sparkles size={14} className="mr-2 relative z-10" />
              <span className="relative z-10">Templates</span>
            </Link>
            
            <Link 
              to="/products" 
              className={`relative group overflow-hidden px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center ${
                location.pathname === '/products' 
                  ? 'bg-white/20 backdrop-blur-md text-white border border-white/30' 
                  : 'text-blue-200/80 hover:text-white hover:bg-white/10 backdrop-blur-sm'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
              <Package size={14} className="mr-2 relative z-10" />
              <span className="relative z-10">Products</span>
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
    </header>
  );
};

export default Header;