import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Sparkles, LogOut, Package, BarChart3, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

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
    const { error } = await signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
    navigate('/auth');
  };

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 overflow-hidden bg-white/30 backdrop-blur-xl border-b transition-all duration-500 ${
        isScrolled ? 'border-white/40 shadow-xl shadow-blue-500/10' : 'border-white/30 shadow-lg'
      }`}
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10"></div>

        {/* Dynamic Gradient Mesh */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
            transition: 'background 0.3s ease',
          }}
        />

        {/* Animated Gradient Orbs */}
        <div className="absolute -top-24 right-0 w-96 h-96 bg-gradient-radial from-blue-500/15 via-indigo-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-24 left-0 w-80 h-80 bg-gradient-radial from-indigo-500/12 via-blue-500/8 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-float"
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
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU5LCAxMzAsIDI0NiwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2">
          {/* Enhanced Premium Logo Section - Far Left */}
          <Link to="/" className="relative group flex-shrink-0" aria-label="Invoice Beautifier Home">
            <div className="relative">
              {/* Multi-layer Animated Glow */}
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-400/30 via-indigo-400/30 to-blue-400/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse-glow"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              {/* Premium Icon Container with 3D Effect */}
              <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-2.5 shadow-xl group-hover:shadow-blue-500/30 transition-all duration-500 group-hover:scale-110 group-hover:border-blue-400/60 group-hover:-translate-y-0.5">
                {/* Inner Glass Layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Gradient Icon Background with Rotation */}
                <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 p-2 rounded-xl shadow-lg group-hover:shadow-blue-400/60 transition-all duration-500 group-hover:rotate-3">
                  <FileText size={22} className="text-white relative z-10 transition-transform duration-500 group-hover:scale-110" />
                  {/* Enhanced Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-bl from-transparent to-blue-700/30 rounded-xl"></div>
                </div>
              </div>
            </div>

            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-500 whitespace-nowrap">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-all duration-500 drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)] group-hover:drop-shadow-[0_2px_12px_rgba(59,130,246,0.5)]">
                Invoice Beautifier
              </h1>
              <p className="text-xs text-gray-700 font-semibold tracking-wide group-hover:text-blue-600 transition-colors duration-500 drop-shadow-[0_1px_6px_rgba(59,130,246,0.2)] group-hover:drop-shadow-[0_1px_8px_rgba(59,130,246,0.4)]">Professional Invoice Solutions</p>
            </div>
          </Link>

          {/* Enhanced Modern Navigation - Centered */}
          <div className="flex items-center justify-center flex-1 gap-4">
            {/* Premium Pill Navigation with Magnetic Effects */}
            <nav className="hidden lg:flex items-center gap-1 bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl p-1.5 shadow-lg relative group/nav" role="navigation" aria-label="Main navigation">
              {/* Animated Border Glow */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 rounded-2xl opacity-0 group-hover/nav:opacity-100 transition-opacity duration-500 blur-sm"></div>

              <Link
                to="/"
                className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden group/link ${
                  location.pathname === '/'
                    ? 'text-white'
                    : 'text-gray-700 hover:text-gray-900 hover:-translate-y-0.5'
                }`}
                aria-current={location.pathname === '/' ? 'page' : undefined}
              >
                {location.pathname === '/' && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/30 animate-gradient-shift"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-xl"></div>
                  </>
                )}
                {location.pathname !== '/' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-indigo-500/0 rounded-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>
                )}
                <span className="relative z-10 flex items-center gap-2.5">
                  <Home size={16} className={`transition-all duration-300 ${location.pathname === '/' ? 'text-white' : 'text-gray-500 group-hover/link:text-blue-500 group-hover/link:rotate-12'}`} />
                  <span className="tracking-wide">Dashboard</span>
                </span>
                {location.pathname !== '/' && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent group-hover/link:w-3/4 transition-all duration-300"></div>
                )}
              </Link>

              <Link
                to="/templates"
                className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden group/link ${
                  location.pathname === '/templates'
                    ? 'text-white'
                    : 'text-gray-700 hover:text-gray-900 hover:-translate-y-0.5'
                }`}
                aria-current={location.pathname === '/templates' ? 'page' : undefined}
              >
                {location.pathname === '/templates' && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/30 animate-gradient-shift"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-xl"></div>
                  </>
                )}
                {location.pathname !== '/templates' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-indigo-500/0 rounded-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>
                )}
                <span className="relative z-10 flex items-center gap-2.5">
                  <Sparkles size={16} className={`transition-all duration-300 ${location.pathname === '/templates' ? 'text-white' : 'text-gray-500 group-hover/link:text-blue-500 group-hover/link:rotate-12'}`} />
                  <span className="tracking-wide">Templates</span>
                </span>
                {location.pathname !== '/templates' && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent group-hover/link:w-3/4 transition-all duration-300"></div>
                )}
              </Link>

              <Link
                to="/products"
                className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden group/link ${
                  location.pathname === '/products'
                    ? 'text-white'
                    : 'text-gray-700 hover:text-gray-900 hover:-translate-y-0.5'
                }`}
                aria-current={location.pathname === '/products' ? 'page' : undefined}
              >
                {location.pathname === '/products' && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/30 animate-gradient-shift"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-xl"></div>
                  </>
                )}
                {location.pathname !== '/products' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-indigo-500/0 rounded-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>
                )}
                <span className="relative z-10 flex items-center gap-2.5">
                  <Package size={16} className={`transition-all duration-300 ${location.pathname === '/products' ? 'text-white' : 'text-gray-500 group-hover/link:text-blue-500 group-hover/link:rotate-12'}`} />
                  <span className="tracking-wide">Products</span>
                </span>
                {location.pathname !== '/products' && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent group-hover/link:w-3/4 transition-all duration-300"></div>
                )}
              </Link>

              <Link
                to="/reports"
                className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden group/link ${
                  location.pathname === '/reports'
                    ? 'text-white'
                    : 'text-gray-700 hover:text-gray-900 hover:-translate-y-0.5'
                }`}
                aria-current={location.pathname === '/reports' ? 'page' : undefined}
              >
                {location.pathname === '/reports' && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/30 animate-gradient-shift"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-xl"></div>
                  </>
                )}
                {location.pathname !== '/reports' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-indigo-500/0 rounded-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>
                )}
                <span className="relative z-10 flex items-center gap-2.5">
                  <BarChart3 size={16} className={`transition-all duration-300 ${location.pathname === '/reports' ? 'text-white' : 'text-gray-500 group-hover/link:text-blue-500 group-hover/link:rotate-12'}`} />
                  <span className="tracking-wide">Reports</span>
                </span>
                {location.pathname !== '/reports' && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent group-hover/link:w-3/4 transition-all duration-300"></div>
                )}
              </Link>
            </nav>
          </div>

          {/* Enhanced User Action Section - Far Right */}
          <div className="flex items-center flex-shrink-0 relative w-auto">
            {user && (
              <div className="hidden sm:flex items-center">
                {/* Logout Button - Styled to Match Nav Bar */}
                <button
                  onClick={handleSignOut}
                  className="relative px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-300 overflow-hidden group bg-white/40 backdrop-blur-xl border border-white/50 hover:bg-white/80 hover:border-blue-400/50 shadow-lg hover:shadow-blue-500/20 flex items-center gap-2.5 whitespace-nowrap"
                  aria-label="Sign out"
                >
                  {/* Animated Border Glow on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-orange-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <LogOut size={16} className="text-gray-700 group-hover:text-red-600 transition-all duration-300 group-hover:scale-110 relative z-10" />
                  <span className="text-gray-700 group-hover:text-red-600 transition-all duration-300 tracking-wide relative z-10">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div className="lg:hidden mt-4 pt-4 border-t border-white/30">
          <div className="flex justify-center gap-2 flex-wrap">
            <Link
              to="/"
              className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 overflow-hidden group/mobile ${
                location.pathname === '/'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/60 active:scale-95'
              }`}
            >
              {location.pathname === '/' && (
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
              )}
              <Home size={15} className={`transition-transform duration-300 ${location.pathname === '/' ? '' : 'group-hover/mobile:scale-110'}`} />
              <span className="relative tracking-wide">Dashboard</span>
            </Link>
            <Link
              to="/templates"
              className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 overflow-hidden group/mobile ${
                location.pathname === '/templates'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/60 active:scale-95'
              }`}
            >
              {location.pathname === '/templates' && (
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
              )}
              <Sparkles size={15} className={`transition-transform duration-300 ${location.pathname === '/templates' ? '' : 'group-hover/mobile:scale-110'}`} />
              <span className="relative tracking-wide">Templates</span>
            </Link>
            <Link
              to="/products"
              className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 overflow-hidden group/mobile ${
                location.pathname === '/products'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/60 active:scale-95'
              }`}
            >
              {location.pathname === '/products' && (
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
              )}
              <Package size={15} className={`transition-transform duration-300 ${location.pathname === '/products' ? '' : 'group-hover/mobile:scale-110'}`} />
              <span className="relative tracking-wide">Products</span>
            </Link>
            <Link
              to="/reports"
              className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 overflow-hidden group/mobile ${
                location.pathname === '/reports'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/60 active:scale-95'
              }`}
            >
              {location.pathname === '/reports' && (
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
              )}
              <BarChart3 size={15} className={`transition-transform duration-300 ${location.pathname === '/reports' ? '' : 'group-hover/mobile:scale-110'}`} />
              <span className="relative tracking-wide">Reports</span>
            </Link>
          </div>
        </div>
      </div>

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