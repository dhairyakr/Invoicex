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
      {/* Ultra Vibrant Liquid Aero Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-900/95 via-fuchsia-900/95 to-cyan-900/95 backdrop-blur-2xl"></div>
      
      {/* Enhanced Multi-Layer Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary Vibrant Orbs */}
        <div className="absolute top-0 left-1/6 w-[500px] h-40 bg-gradient-to-r from-cyan-400/60 via-blue-500/60 to-indigo-600/60 rounded-full blur-3xl animate-pulse shadow-2xl shadow-cyan-500/30"></div>
        <div className="absolute top-0 right-1/6 w-[400px] h-40 bg-gradient-to-r from-fuchsia-500/60 via-pink-500/60 to-rose-500/60 rounded-full blur-3xl animate-pulse shadow-2xl shadow-pink-500/30" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-[600px] h-20 bg-gradient-to-r from-emerald-400/50 via-teal-500/50 to-cyan-500/50 rounded-full blur-2xl animate-pulse shadow-xl shadow-emerald-500/20" style={{ animationDelay: '2s' }}></div>
        
        {/* Secondary Accent Orbs */}
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-gradient-to-br from-yellow-400/40 to-orange-500/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-[250px] h-[250px] bg-gradient-to-br from-purple-400/40 to-indigo-500/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/2 w-4 h-4 bg-white/60 rounded-full blur-sm animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute top-3/4 left-1/3 w-3 h-3 bg-cyan-300/70 rounded-full blur-sm animate-bounce" style={{ animationDelay: '0.8s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-5 h-5 bg-pink-300/60 rounded-full blur-sm animate-bounce" style={{ animationDelay: '1.2s' }}></div>
      </div>

      {/* Enhanced Multi-Layer Glossy Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/5 to-white/15"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/10 via-transparent to-fuchsia-300/10"></div>
      
      {/* Dynamic Shimmer Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] animate-shimmer"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent skew-x-12 transform translate-x-[100%] animate-shimmer" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
      
      {/* Lustrous Border Effects */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-400/60 via-fuchsia-400/60 to-cyan-400/60 shadow-lg shadow-cyan-400/30"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Ultra Lustrous Logo Section */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              {/* Multi-Layer Outer Glow */}
              <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400/50 via-blue-500/50 to-fuchsia-500/50 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/40 to-purple-500/40 rounded-2xl blur-lg opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>
              
              {/* Ultra Glossy Glass Container */}
              <div className="relative bg-white/15 backdrop-blur-xl border-2 border-white/30 rounded-3xl p-5 shadow-2xl group-hover:shadow-3xl transition-all duration-700 group-hover:scale-110 transform">
                {/* Multiple Glossy Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/20 rounded-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/20 via-transparent to-fuchsia-300/20 rounded-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/10 rounded-3xl"></div>
                
                {/* Lustrous Icon with Enhanced Gradient */}
                <div className="relative bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-600 p-3 rounded-2xl shadow-2xl shadow-blue-500/50 group-hover:shadow-cyan-500/60 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/20 rounded-2xl"></div>
                  <FileText size={28} className="text-white relative z-10 drop-shadow-lg" />
                </div>
              </div>
            </div>
            
            <div className="group-hover:scale-105 transition-transform duration-500">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-200 to-fuchsia-200 bg-clip-text text-transparent drop-shadow-lg">
                Invoice Beautifier
              </h1>
              <p className="text-sm text-cyan-200/90 font-semibold tracking-wide">Professional Invoice Solutions</p>
            </div>
          </Link>
          
          {/* Ultra Vibrant Navigation Pills */}
          <div className="flex items-center space-x-4">
            {/* Navigation Links with Enhanced Glass */}
            <div className="hidden md:flex items-center space-x-3 mr-8">
              <Link 
                to="/" 
                className={`relative group overflow-hidden px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-105 ${
                  location.pathname === '/' 
                    ? 'bg-white/25 backdrop-blur-xl text-white shadow-2xl border-2 border-white/40' 
                    : 'text-cyan-100/90 hover:text-white hover:bg-white/15 backdrop-blur-lg'
                }`}
              >
                {/* Multiple Glossy Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/20 rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/20 via-transparent to-blue-300/20 rounded-2xl"></div>
                
                {/* Active State Multi-Layer Glow */}
                {location.pathname === '/' && (
                  <>
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-2xl blur-lg"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-2xl"></div>
                  </>
                )}
                
                {/* Enhanced Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-2xl"></div>
                
                <span className="relative z-10 drop-shadow-sm">Dashboard</span>
              </Link>
              
              <Link 
                to="/templates" 
                className={`relative group overflow-hidden px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-105 ${
                  location.pathname === '/templates' 
                    ? 'bg-white/25 backdrop-blur-xl text-white shadow-2xl border-2 border-white/40' 
                    : 'text-cyan-100/90 hover:text-white hover:bg-white/15 backdrop-blur-lg'
                }`}
              >
                {/* Multiple Glossy Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/20 rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-300/20 via-transparent to-pink-300/20 rounded-2xl"></div>
                
                {/* Active State Multi-Layer Glow */}
                {location.pathname === '/templates' && (
                  <>
                    <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-400/40 to-pink-500/40 rounded-2xl blur-lg"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/30 to-pink-500/30 rounded-2xl"></div>
                  </>
                )}
                
                {/* Enhanced Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-2xl"></div>
                
                <span className="relative z-10 flex items-center drop-shadow-sm">
                  <Sparkles size={18} className="mr-3" />
                  Templates
                </span>
              </Link>

              <Link 
                to="/products" 
                className={`relative group overflow-hidden px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-105 ${
                  location.pathname === '/products' 
                    ? 'bg-white/25 backdrop-blur-xl text-white shadow-2xl border-2 border-white/40' 
                    : 'text-cyan-100/90 hover:text-white hover:bg-white/15 backdrop-blur-lg'
                }`}
              >
                {/* Multiple Glossy Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/20 rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-300/20 via-transparent to-teal-300/20 rounded-2xl"></div>
                
                {/* Active State Multi-Layer Glow */}
                {location.pathname === '/products' && (
                  <>
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/40 to-teal-500/40 rounded-2xl blur-lg"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-2xl"></div>
                  </>
                )}
                
                {/* Enhanced Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-2xl"></div>
                
                <span className="relative z-10 flex items-center drop-shadow-sm">
                  <Package size={18} className="mr-3" />
                  Products
                </span>
              </Link>
            </div>

            {/* Ultra Lustrous User Section */}
            {user && (
              <div className="flex items-center space-x-4">
                {/* Enhanced User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="relative group overflow-hidden flex items-center space-x-4 bg-white/15 backdrop-blur-xl hover:bg-white/20 px-6 py-4 rounded-2xl transition-all duration-500 border-2 border-white/30 shadow-2xl hover:shadow-3xl transform hover:scale-105"
                  >
                    {/* Multiple Glossy Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/20 rounded-2xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/20 via-transparent to-fuchsia-300/20 rounded-2xl"></div>
                    
                    {/* Hover Multi-Layer Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/40 via-blue-500/40 to-fuchsia-500/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-fuchsia-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Ultra Lustrous User Avatar */}
                    <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/30 rounded-full"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/30 via-transparent to-fuchsia-300/30 rounded-full"></div>
                      <User size={18} className="text-white relative z-10 drop-shadow-lg" />
                    </div>
                    
                    <span className="text-sm font-bold text-white/95 hidden sm:block relative z-10 drop-shadow-sm">
                      {user.email?.split('@')[0]}
                    </span>
                    
                    <ChevronDown size={18} className={`text-white/80 relative z-10 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Ultra Lustrous Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-4 w-72 overflow-hidden rounded-3xl shadow-3xl z-50">
                      {/* Enhanced Glass Background */}
                      <div className="bg-white/15 backdrop-blur-2xl border-2 border-white/30">
                        {/* Multiple Glossy Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/25 rounded-3xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/20 via-transparent to-fuchsia-300/20 rounded-3xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 rounded-3xl"></div>
                        
                        {/* Enhanced User Info Header */}
                        <div className="relative px-8 py-6 border-b-2 border-white/30 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-fuchsia-500/30">
                          <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50">
                              <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/30 rounded-full"></div>
                              <User size={24} className="text-white relative z-10 drop-shadow-lg" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white drop-shadow-sm">{user.email}</p>
                              <p className="text-xs text-white/80 font-semibold">Signed in</p>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Menu Items */}
                        <div className="relative py-3">
                          <button
                            onClick={() => setShowUserMenu(false)}
                            className="relative w-full text-left px-8 py-4 text-sm text-white/90 hover:text-white hover:bg-white/15 flex items-center transition-all duration-300 group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Settings size={18} className="mr-4 text-white/70 group-hover:text-white/90 relative z-10" />
                            <span className="relative z-10 font-semibold">Account Settings</span>
                          </button>
                          
                          <div className="border-t-2 border-white/30 my-3"></div>
                          
                          <button
                            onClick={handleSignOut}
                            className="relative w-full text-left px-8 py-4 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/25 flex items-center transition-all duration-300 group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <LogOut size={18} className="mr-4 text-red-400 group-hover:text-red-300 relative z-10" />
                            <span className="relative z-10 font-semibold">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ultra Lustrous New Invoice Button */}
                <Link
                  to="/create"
                  className="relative group overflow-hidden"
                >
                  {/* Multi-Layer Outer Glow */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/60 via-blue-500/60 via-fuchsia-500/60 to-pink-500/60 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/50 via-purple-500/50 to-pink-500/50 rounded-2xl blur-lg opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>
                  
                  {/* Ultra Lustrous Main Button */}
                  <div className="relative bg-gradient-to-r from-cyan-500/90 via-blue-600/90 via-fuchsia-600/90 to-pink-600/90 backdrop-blur-xl px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-500 flex items-center shadow-2xl group-hover:shadow-3xl transform group-hover:scale-110 border-2 border-white/40">
                    {/* Multiple Glossy Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/15 to-white/25 rounded-2xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/30 via-transparent to-fuchsia-300/30 rounded-2xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/20 rounded-2xl"></div>
                    
                    {/* Enhanced Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/95 via-blue-500/95 via-fuchsia-500/95 to-pink-500/95 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                    
                    {/* Multi-Direction Shimmer Effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-2xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-cyan-300/40 to-transparent skew-x-12 transform translate-x-[100%] group-hover:translate-x-[-200%] transition-transform duration-1200 rounded-2xl"></div>
                    
                    <Zap size={20} className="mr-3 relative z-10 text-white drop-shadow-lg" /> 
                    <span className="relative z-10 text-white drop-shadow-sm">New Invoice</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div className="md:hidden mt-8 pt-8 border-t-2 border-white/30">
          <div className="flex justify-center space-x-4">
            <Link 
              to="/" 
              className={`relative group overflow-hidden px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-500 transform hover:scale-105 ${
                location.pathname === '/' 
                  ? 'bg-white/25 backdrop-blur-xl text-white border-2 border-white/40 shadow-xl' 
                  : 'text-cyan-200/90 hover:text-white hover:bg-white/15 backdrop-blur-lg'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/20 rounded-2xl"></div>
              <span className="relative z-10 drop-shadow-sm">Dashboard</span>
            </Link>
            
            <Link 
              to="/templates" 
              className={`relative group overflow-hidden px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-500 flex items-center transform hover:scale-105 ${
                location.pathname === '/templates' 
                  ? 'bg-white/25 backdrop-blur-xl text-white border-2 border-white/40 shadow-xl' 
                  : 'text-cyan-200/90 hover:text-white hover:bg-white/15 backdrop-blur-lg'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/20 rounded-2xl"></div>
              <Sparkles size={16} className="mr-2 relative z-10" />
              <span className="relative z-10 drop-shadow-sm">Templates</span>
            </Link>
            
            <Link 
              to="/products" 
              className={`relative group overflow-hidden px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-500 flex items-center transform hover:scale-105 ${
                location.pathname === '/products' 
                  ? 'bg-white/25 backdrop-blur-xl text-white border-2 border-white/40 shadow-xl' 
                  : 'text-cyan-200/90 hover:text-white hover:bg-white/15 backdrop-blur-lg'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/20 rounded-2xl"></div>
              <Package size={16} className="mr-2 relative z-10" />
              <span className="relative z-10 drop-shadow-sm">Products</span>
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

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;