import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Sparkles, LogOut, User, Settings, Package, ChevronDown, BarChart3, Home, Zap } from 'lucide-react';
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
    <header className="sticky top-0 z-50 overflow-hidden bg-gradient-to-r from-slate-950/98 via-slate-900/98 to-slate-950/98 backdrop-blur-2xl border-b border-slate-700/30 shadow-2xl">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs - Reduced for cleaner look */}
        <div className="absolute -top-24 right-0 w-96 h-96 bg-gradient-radial from-teal-500/15 via-emerald-500/8 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-24 left-0 w-80 h-80 bg-gradient-radial from-cyan-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Subtle Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-black/5"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-8">
          {/* Sleek Minimalist Logo Section */}
          <Link to="/" className="flex items-center gap-3 group relative">
            <div className="relative">
              {/* Animated Glow Ring */}
              <div className="absolute -inset-2 bg-gradient-to-r from-teal-400/40 via-emerald-400/40 to-cyan-400/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse-glow"></div>

              {/* Sleek Icon Container */}
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-600/40 rounded-2xl p-2.5 shadow-2xl group-hover:shadow-teal-500/25 transition-all duration-500 group-hover:scale-110 group-hover:border-teal-400/50">
                {/* Inner Glass Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-2xl"></div>

                {/* Gradient Icon Background */}
                <div className="relative bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 p-2 rounded-xl shadow-lg group-hover:shadow-teal-400/50 transition-all duration-500">
                  <FileText size={22} className="text-white relative z-10" />
                  {/* Icon Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>

            <div className="group-hover:translate-x-1 transition-all duration-500">
              <h1 className="text-xl font-bold text-white group-hover:text-teal-200 transition-all duration-500 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)] group-hover:drop-shadow-[0_2px_12px_rgba(94,234,212,0.9)]">
                Invoice Beautifier
              </h1>
              <p className="text-xs text-white font-bold tracking-wide group-hover:text-teal-300 transition-colors duration-500 drop-shadow-[0_1px_6px_rgba(255,255,255,0.7)] group-hover:drop-shadow-[0_1px_8px_rgba(94,234,212,0.8)]">Professional Invoice Solutions</p>
            </div>
          </Link>
          
          {/* Sleek Modern Navigation */}
          <div className="flex items-center gap-4">
            {/* Modern Pill Navigation */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-1.5 shadow-xl">
              <Link
                to="/"
                className={`relative px-5 py-2 rounded-xl font-medium text-sm transition-all duration-300 overflow-hidden group ${
                  location.pathname === '/'
                    ? 'text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {location.pathname === '/' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl shadow-lg shadow-teal-500/30"></div>
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Home size={16} className={location.pathname === '/' ? 'text-white' : 'text-slate-400 group-hover:text-teal-400'} />
                  Dashboard
                </span>
              </Link>

              <Link
                to="/templates"
                className={`relative px-5 py-2 rounded-xl font-medium text-sm transition-all duration-300 overflow-hidden group ${
                  location.pathname === '/templates'
                    ? 'text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {location.pathname === '/templates' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl shadow-lg shadow-teal-500/30"></div>
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles size={16} className={location.pathname === '/templates' ? 'text-white' : 'text-slate-400 group-hover:text-teal-400'} />
                  Templates
                </span>
              </Link>

              <Link
                to="/products"
                className={`relative px-5 py-2 rounded-xl font-medium text-sm transition-all duration-300 overflow-hidden group ${
                  location.pathname === '/products'
                    ? 'text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {location.pathname === '/products' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl shadow-lg shadow-teal-500/30"></div>
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Package size={16} className={location.pathname === '/products' ? 'text-white' : 'text-slate-400 group-hover:text-teal-400'} />
                  Products
                </span>
              </Link>

              <Link
                to="/reports"
                className={`relative px-5 py-2 rounded-xl font-medium text-sm transition-all duration-300 overflow-hidden group ${
                  location.pathname === '/reports'
                    ? 'text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {location.pathname === '/reports' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl shadow-lg shadow-teal-500/30"></div>
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <BarChart3 size={16} className={location.pathname === '/reports' ? 'text-white' : 'text-slate-400 group-hover:text-teal-400'} />
                  Reports
                </span>
              </Link>
            </nav>

            {/* Sleek User Action Section */}
            {user && (
              <div className="flex items-center gap-2">
                {/* Premium User Profile Dropdown */}
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2.5 bg-slate-800/60 hover:bg-slate-800/80 backdrop-blur-xl px-3 py-2 rounded-xl transition-all duration-300 border border-slate-700/50 hover:border-teal-500/50 shadow-lg group"
                  >
                    <div className="relative w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-slate-700/50 group-hover:ring-teal-400/50 transition-all duration-300">
                      <User size={16} className="text-white" />
                    </div>

                    <span className="text-sm font-medium text-slate-200 max-w-[100px] truncate">
                      {user.email?.split('@')[0]}
                    </span>

                    <ChevronDown size={14} className={`text-slate-400 transition-all duration-300 ${showUserMenu ? 'rotate-180 text-teal-400' : ''}`} />
                  </button>

                  {/* Sleek Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden z-50 animate-fade-in">
                      {/* User Info Header */}
                      <div className="relative px-4 py-4 border-b border-slate-700/50 bg-gradient-to-r from-teal-500/10 to-emerald-500/10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center shadow-xl ring-4 ring-teal-500/20">
                            <User size={20} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                            <p className="text-xs text-teal-300/80">Active Account</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-1.5">
                        <button
                          onClick={() => setShowUserMenu(false)}
                          className="w-full text-left px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl flex items-center gap-3 transition-all duration-200 group"
                        >
                          <Settings size={16} className="text-slate-400 group-hover:text-teal-400 transition-colors" />
                          <span>Account Settings</span>
                        </button>

                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-red-500/10 rounded-xl flex items-center gap-3 transition-all duration-200 group mt-1"
                        >
                          <LogOut size={16} className="text-slate-400 group-hover:text-red-400 transition-colors" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stunning New Invoice CTA Button */}
                <Link
                  to="/create"
                  className="relative group"
                >
                  {/* Animated Outer Glow */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-all duration-500 animate-pulse-glow"></div>

                  {/* Button Container */}
                  <div className="relative bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-xl group-hover:shadow-2xl group-hover:shadow-teal-500/50 overflow-hidden">
                    {/* Glass Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 rounded-xl"></div>

                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-xl"></div>

                    {/* Button Content */}
                    <span className="relative z-10 text-white flex items-center gap-2 text-sm">
                      <Zap size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                      New Invoice
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sleek Mobile Navigation */}
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-700/50">
          <div className="flex justify-center gap-2">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
                location.pathname === '/'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Home size={14} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/templates"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
                location.pathname === '/templates'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles size={14} />
              <span>Templates</span>
            </Link>
            <Link
              to="/products"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
                location.pathname === '/products'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Package size={14} />
              <span>Products</span>
            </Link>
            <Link
              to="/reports"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
                location.pathname === '/reports'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 size={14} />
              <span>Reports</span>
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

      <style>{`
        @keyframes shimmer-slow {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.25;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-shimmer-slow {
          animation: shimmer-slow 8s infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </header>
  );
};

export default Header;