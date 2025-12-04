import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Sparkles, LogOut, User, Settings, Package, ChevronDown, BarChart3, Home, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
    setShowUserMenu(false);
  };

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 overflow-hidden bg-gradient-to-r from-slate-950/98 via-slate-900/98 to-slate-950/98 backdrop-blur-2xl border-b transition-all duration-500 ${
        isScrolled ? 'border-slate-700/50 shadow-2xl shadow-teal-500/5' : 'border-slate-700/30 shadow-xl'
      }`}
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dynamic Gradient Mesh */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(20, 184, 166, 0.15), transparent 40%)`,
            transition: 'background 0.3s ease',
          }}
        />

        {/* Animated Gradient Orbs */}
        <div className="absolute -top-24 right-0 w-96 h-96 bg-gradient-radial from-teal-500/15 via-emerald-500/8 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-24 left-0 w-80 h-80 bg-gradient-radial from-cyan-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-teal-400/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Multi-layer Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-black/5"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-8">
          {/* Enhanced Premium Logo Section */}
          <Link to="/" className="flex items-center gap-3 group relative" aria-label="Invoice Beautifier Home">
            <div className="relative">
              {/* Multi-layer Animated Glow */}
              <div className="absolute -inset-3 bg-gradient-to-r from-teal-400/40 via-emerald-400/40 to-cyan-400/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse-glow"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-teal-500/30 via-emerald-500/30 to-cyan-500/30 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              {/* Premium Icon Container with 3D Effect */}
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-600/40 rounded-2xl p-2.5 shadow-2xl group-hover:shadow-teal-500/30 transition-all duration-500 group-hover:scale-110 group-hover:border-teal-400/60 group-hover:-translate-y-0.5">
                {/* Inner Glass Layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-teal-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Gradient Icon Background with Rotation */}
                <div className="relative bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 p-2 rounded-xl shadow-lg group-hover:shadow-teal-400/60 transition-all duration-500 group-hover:rotate-3">
                  <FileText size={22} className="text-white relative z-10 transition-transform duration-500 group-hover:scale-110" />
                  {/* Enhanced Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-bl from-transparent to-teal-600/30 rounded-xl"></div>
                </div>
              </div>
            </div>

            <div className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 overflow-hidden max-w-0 group-hover:max-w-xs">
              <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-teal-200 transition-all duration-500 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)] group-hover:drop-shadow-[0_2px_12px_rgba(94,234,212,0.9)] whitespace-nowrap">
                Invoice Beautifier
              </h1>
              <p className="text-xs text-slate-200 font-semibold tracking-wide group-hover:text-teal-300 transition-colors duration-500 drop-shadow-[0_1px_6px_rgba(255,255,255,0.7)] group-hover:drop-shadow-[0_1px_8px_rgba(94,234,212,0.8)] whitespace-nowrap">Professional Invoice Solutions</p>
            </div>
          </Link>
          
          {/* Enhanced Modern Navigation */}
          <div className="flex items-center gap-4">
            {/* Premium Pill Navigation with Magnetic Effects */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-1.5 shadow-xl relative group/nav" role="navigation" aria-label="Main navigation">
              {/* Animated Border Glow */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-teal-500/0 via-teal-500/50 to-teal-500/0 rounded-2xl opacity-0 group-hover/nav:opacity-100 transition-opacity duration-500 blur-sm"></div>

              <Link
                to="/"
                className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden group/link ${
                  location.pathname === '/'
                    ? 'text-white'
                    : 'text-slate-300 hover:text-white hover:-translate-y-0.5'
                }`}
                aria-current={location.pathname === '/' ? 'page' : undefined}
              >
                {location.pathname === '/' && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl shadow-lg shadow-teal-500/30 animate-gradient-shift"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                  </>
                )}
                {location.pathname !== '/' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-emerald-500/0 rounded-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>
                )}
                <span className="relative z-10 flex items-center gap-2.5">
                  <Home size={16} className={`transition-all duration-300 ${location.pathname === '/' ? 'text-white' : 'text-slate-400 group-hover/link:text-teal-400 group-hover/link:rotate-12'}`} />
                  <span className="tracking-wide">Dashboard</span>
                </span>
                {location.pathname !== '/' && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent group-hover/link:w-3/4 transition-all duration-300"></div>
                )}
              </Link>

              <Link
                to="/templates"
                className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden group/link ${
                  location.pathname === '/templates'
                    ? 'text-white'
                    : 'text-slate-300 hover:text-white hover:-translate-y-0.5'
                }`}
                aria-current={location.pathname === '/templates' ? 'page' : undefined}
              >
                {location.pathname === '/templates' && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl shadow-lg shadow-teal-500/30 animate-gradient-shift"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                  </>
                )}
                {location.pathname !== '/templates' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-emerald-500/0 rounded-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>
                )}
                <span className="relative z-10 flex items-center gap-2.5">
                  <Sparkles size={16} className={`transition-all duration-300 ${location.pathname === '/templates' ? 'text-white' : 'text-slate-400 group-hover/link:text-teal-400 group-hover/link:rotate-12'}`} />
                  <span className="tracking-wide">Templates</span>
                </span>
                {location.pathname !== '/templates' && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent group-hover/link:w-3/4 transition-all duration-300"></div>
                )}
              </Link>

              <Link
                to="/products"
                className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden group/link ${
                  location.pathname === '/products'
                    ? 'text-white'
                    : 'text-slate-300 hover:text-white hover:-translate-y-0.5'
                }`}
                aria-current={location.pathname === '/products' ? 'page' : undefined}
              >
                {location.pathname === '/products' && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl shadow-lg shadow-teal-500/30 animate-gradient-shift"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                  </>
                )}
                {location.pathname !== '/products' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-emerald-500/0 rounded-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>
                )}
                <span className="relative z-10 flex items-center gap-2.5">
                  <Package size={16} className={`transition-all duration-300 ${location.pathname === '/products' ? 'text-white' : 'text-slate-400 group-hover/link:text-teal-400 group-hover/link:rotate-12'}`} />
                  <span className="tracking-wide">Products</span>
                </span>
                {location.pathname !== '/products' && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent group-hover/link:w-3/4 transition-all duration-300"></div>
                )}
              </Link>

              <Link
                to="/reports"
                className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden group/link ${
                  location.pathname === '/reports'
                    ? 'text-white'
                    : 'text-slate-300 hover:text-white hover:-translate-y-0.5'
                }`}
                aria-current={location.pathname === '/reports' ? 'page' : undefined}
              >
                {location.pathname === '/reports' && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl shadow-lg shadow-teal-500/30 animate-gradient-shift"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                  </>
                )}
                {location.pathname !== '/reports' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-emerald-500/0 rounded-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>
                )}
                <span className="relative z-10 flex items-center gap-2.5">
                  <BarChart3 size={16} className={`transition-all duration-300 ${location.pathname === '/reports' ? 'text-white' : 'text-slate-400 group-hover/link:text-teal-400 group-hover/link:rotate-12'}`} />
                  <span className="tracking-wide">Reports</span>
                </span>
                {location.pathname !== '/reports' && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent group-hover/link:w-3/4 transition-all duration-300"></div>
                )}
              </Link>
            </nav>

            {/* Enhanced User Action Section */}
            {user && (
              <div className="flex items-center gap-3">
                {/* Premium User Profile Dropdown */}
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 bg-slate-800/60 hover:bg-slate-800/80 backdrop-blur-xl px-4 py-2.5 rounded-xl transition-all duration-300 border border-slate-700/50 hover:border-teal-500/50 shadow-lg hover:shadow-teal-500/10 group"
                    aria-expanded={showUserMenu}
                    aria-haspopup="true"
                  >
                    <div className="relative">
                      {/* Avatar Glow */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                      <div className="relative w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-slate-700/50 group-hover:ring-teal-400/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                        <User size={17} className="text-white transition-transform duration-300 group-hover:scale-110" />
                      </div>
                    </div>

                    <span className="text-sm font-semibold text-slate-200 max-w-[100px] truncate tracking-wide">
                      {user.email?.split('@')[0]}
                    </span>

                    <ChevronDown size={15} className={`text-slate-400 transition-all duration-300 ${showUserMenu ? 'rotate-180 text-teal-400' : 'group-hover:text-teal-400'}`} />
                  </button>

                  {/* Enhanced Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-72 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden z-50 animate-spring-in">
                      {/* Dropdown Glow Effect */}
                      <div className="absolute -inset-[1px] bg-gradient-to-b from-teal-500/20 to-transparent rounded-2xl pointer-events-none"></div>

                      {/* User Info Header */}
                      <div className="relative px-5 py-5 border-b border-slate-700/50 bg-gradient-to-r from-teal-500/10 to-emerald-500/10">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full blur-md opacity-50"></div>
                            <div className="relative w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center shadow-xl ring-4 ring-teal-500/20">
                              <User size={24} className="text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate tracking-wide">{user.email}</p>
                            <p className="text-xs text-teal-300/90 font-semibold mt-0.5 flex items-center gap-1.5">
                              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                              Active Account
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <button
                          onClick={() => setShowUserMenu(false)}
                          className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl flex items-center gap-3 transition-all duration-200 group/item"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center group-hover/item:bg-teal-500/20 transition-colors">
                            <Settings size={16} className="text-slate-400 group-hover/item:text-teal-400 transition-colors" />
                          </div>
                          <span className="font-medium">Account Settings</span>
                        </button>

                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-red-500/10 rounded-xl flex items-center gap-3 transition-all duration-200 group/item mt-1"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center group-hover/item:bg-red-500/20 transition-colors">
                            <LogOut size={16} className="text-slate-400 group-hover/item:text-red-400 transition-colors" />
                          </div>
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Premium CTA Button with Magnetic Effect */}
                <Link
                  ref={ctaRef}
                  to="/create"
                  className="relative group/cta"
                  aria-label="Create New Invoice"
                >
                  {/* Multi-layer Animated Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 rounded-xl blur-lg opacity-60 group-hover/cta:opacity-100 transition-all duration-500 animate-pulse-glow"></div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 rounded-xl blur-md opacity-0 group-hover/cta:opacity-80 transition-all duration-300"></div>

                  {/* Button Container with 3D Effect */}
                  <div className="relative bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-xl group-hover/cta:shadow-2xl group-hover/cta:shadow-teal-500/50 overflow-hidden group-hover/cta:-translate-y-0.5 group-hover/cta:scale-105">
                    {/* Multiple Glass Layers */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/15 rounded-xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-bl from-transparent to-teal-600/30 rounded-xl"></div>

                    {/* Enhanced Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 transform -translate-x-full group-hover/cta:translate-x-full transition-transform duration-1000 rounded-xl"></div>

                    {/* Ripple Effect on Hover */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 rounded-xl bg-white/10 animate-ripple"></div>
                    </div>

                    {/* Button Content */}
                    <span className="relative z-10 text-white flex items-center gap-2.5 text-sm tracking-wide">
                      <Zap size={17} className="group-hover/cta:rotate-12 group-hover/cta:scale-110 transition-transform duration-300 drop-shadow-lg" />
                      <span className="font-bold">New Invoice</span>
                    </span>

                    {/* Bottom Highlight */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div className="lg:hidden mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex justify-center gap-2 flex-wrap">
            <Link
              to="/"
              className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 overflow-hidden group/mobile ${
                location.pathname === '/'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 active:scale-95'
              }`}
            >
              {location.pathname === '/' && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              )}
              <Home size={15} className={`transition-transform duration-300 ${location.pathname === '/' ? '' : 'group-hover/mobile:scale-110'}`} />
              <span className="relative tracking-wide">Dashboard</span>
            </Link>
            <Link
              to="/templates"
              className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 overflow-hidden group/mobile ${
                location.pathname === '/templates'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 active:scale-95'
              }`}
            >
              {location.pathname === '/templates' && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              )}
              <Sparkles size={15} className={`transition-transform duration-300 ${location.pathname === '/templates' ? '' : 'group-hover/mobile:scale-110'}`} />
              <span className="relative tracking-wide">Templates</span>
            </Link>
            <Link
              to="/products"
              className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 overflow-hidden group/mobile ${
                location.pathname === '/products'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 active:scale-95'
              }`}
            >
              {location.pathname === '/products' && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              )}
              <Package size={15} className={`transition-transform duration-300 ${location.pathname === '/products' ? '' : 'group-hover/mobile:scale-110'}`} />
              <span className="relative tracking-wide">Products</span>
            </Link>
            <Link
              to="/reports"
              className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 overflow-hidden group/mobile ${
                location.pathname === '/reports'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 active:scale-95'
              }`}
            >
              {location.pathname === '/reports' && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              )}
              <BarChart3 size={15} className={`transition-transform duration-300 ${location.pathname === '/reports' ? '' : 'group-hover/mobile:scale-110'}`} />
              <span className="relative tracking-wide">Reports</span>
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

        @keyframes spring-in {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          50% {
            transform: translateY(5px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
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

        .animate-spring-in {
          animation: spring-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-ripple {
          animation: ripple 1s ease-out infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;