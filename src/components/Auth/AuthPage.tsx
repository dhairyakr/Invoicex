import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  Star, 
  Zap,
  Shield,
  CheckCircle,
  User,
  Globe,
  Layers,
  Cpu,
  Heart,
  Briefcase,
  TrendingUp,
  Award,
  Rocket,
  Crown,
  Gem,
  Coffee,
  Palette,
  AlertCircle,
  TestTube
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthPageProps {
  onSuccess?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { signIn, signUp } = useAuth();

  // Dummy credentials
  const DUMMY_CREDENTIALS = {
    email: 'demo@invoicebeautifier.com',
    password: 'demo123456'
  };

  // Mouse tracking for subtle interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Enhanced background particles with more dramatic movement
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    speed: Math.random() * 4 + 3,
    opacity: Math.random() * 0.4 + 0.1,
    delay: Math.random() * 10,
    hue: Math.random() * 60 + 200, // Blue to purple range
  }));

  const features = [
    { icon: <Sparkles className="w-5 h-5" />, text: "Beautiful Templates", color: "from-blue-400 to-cyan-400" },
    { icon: <Shield className="w-5 h-5" />, text: "Secure Storage", color: "from-emerald-400 to-teal-400" },
    { icon: <Zap className="w-5 h-5" />, text: "Fast Performance", color: "from-purple-400 to-indigo-400" },
    { icon: <Globe className="w-5 h-5" />, text: "Multi-Currency", color: "from-rose-400 to-pink-400" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!isLogin && password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const result = isLogin 
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password);

      if (result.error) {
        setError(result.error.message);
      } else {
        if (!isLogin) {
          // Check if there's a specific message from the sign up process
          if ((result as any).message) {
            setSuccess((result as any).message);
          } else {
            setSuccess('Account created successfully! You can now sign in.');
          }
        } else {
          onSuccess?.();
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle dummy login
  const handleDummyLogin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await signIn(DUMMY_CREDENTIALS.email, DUMMY_CREDENTIALS.password);

      if (result.error) {
        setError(result.error.message);
      } else {
        onSuccess?.();
      }
    } catch (err) {
      console.error('Dummy login error:', err);
      setError('An unexpected error occurred during demo login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Dramatic mode switch with quirky animations
  const handleModeSwitch = () => {
    setIsTransitioning(true);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    
    // First phase: dramatic exit animation (350ms)
    setTimeout(() => {
      setIsLogin(!isLogin);
      // Second phase: dramatic enter animation (350ms)
      setTimeout(() => {
        setIsTransitioning(false);
      }, 350);
    }, 350);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Primary Dynamic Orbs */}
        <div className={`absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-r from-blue-200/30 via-cyan-200/20 to-teal-200/15 rounded-full blur-3xl opacity-70 transition-all duration-1000 ${isTransitioning ? 'scale-150 rotate-180' : 'scale-100 rotate-0'}`}></div>
        <div className={`absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-r from-purple-200/20 via-pink-200/15 to-rose-200/15 rounded-full blur-3xl opacity-60 transition-all duration-1000 ${isTransitioning ? 'scale-150 -rotate-180' : 'scale-100 rotate-0'}`}></div>
        
        {/* Enhanced Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full animate-float transition-all duration-700 ${isTransitioning ? 'animate-bounce scale-150' : ''}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.speed + 8}s`,
              background: `hsla(${particle.hue}, 50%, 70%, 0.3)`,
              boxShadow: `0 0 ${particle.size * 3}px hsla(${particle.hue}, 50%, 70%, 0.2)`,
            }}
          />
        ))}

        {/* Enhanced Mesh Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        {/* Enhanced Interactive Light */}
        <div 
          className={`absolute w-[400px] h-[400px] bg-gradient-to-r from-white/12 via-cyan-100/8 to-transparent rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none ${isTransitioning ? 'scale-200 opacity-50' : 'scale-100 opacity-100'}`}
          style={{
            left: `${mousePosition.x / window.innerWidth * 100}%`,
            top: `${mousePosition.y / window.innerHeight * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Enhanced Branding with Dramatic Transitions */}
        <div className={`hidden lg:flex lg:w-1/2 flex-col justify-center p-16 relative transition-all duration-700 ease-in-out ${
          isTransitioning 
            ? isLogin 
              ? 'panel-exit-signup transform -translate-x-full skew-x-12 opacity-0' 
              : 'panel-exit-login transform translate-x-full skew-x-12 opacity-0'
            : isLogin
              ? 'panel-enter-login transform translate-x-0 skew-x-0 opacity-100'
              : 'panel-enter-signup transform translate-x-0 skew-x-0 opacity-100'
        }`}>
          {/* Logo Section */}
          <div className="mb-16 relative">
            <div className="flex items-center mb-8">
              <div className="relative group">
                {/* Enhanced Glow */}
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-400/30 to-indigo-400/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 ${isTransitioning ? 'animate-pulse scale-150' : ''}`}></div>
                
                {/* Glass Container */}
                <div className={`relative bg-white/30 backdrop-blur-lg border border-white/40 rounded-3xl p-6 shadow-2xl group-hover:scale-105 transition-all duration-500 ${isTransitioning ? 'animate-spin scale-125' : ''}`}>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-white/10 rounded-3xl"></div>
                  
                  <Layers className="w-10 h-10 text-blue-600 relative z-10" />
                </div>
              </div>
              
              <div className="ml-6">
                <h1 className={`text-4xl font-bold text-gray-900 mb-1 transition-all duration-500 ${isTransitioning ? 'blur-sm scale-110' : 'blur-0 scale-100'}`}>
                  Invoice Beautifier
                </h1>
                <p className="text-blue-600 text-lg font-medium">Professional Invoice Solutions</p>
              </div>
            </div>
            
            <div className={`transition-all duration-700 ${isTransitioning ? 'transform translate-x-8 opacity-30 blur-sm' : 'transform translate-x-0 opacity-100 blur-0'}`}>
              <h2 className="text-6xl font-bold text-gray-900 mb-8 leading-tight">
                {isLogin ? (
                  <>
                    Welcome
                    <span className="text-blue-600"> Back</span>
                  </>
                ) : (
                  <>
                    Start Your
                    <span className="text-emerald-600"> Journey</span>
                  </>
                )}
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                {isLogin 
                  ? "Sign in to access your beautiful invoices and continue creating professional billing experiences."
                  : "Join thousands of professionals who trust us with their invoicing needs. Create stunning invoices in minutes."
                }
              </p>
            </div>
          </div>

          {/* Enhanced Features Grid */}
          <div className={`grid grid-cols-2 gap-6 transition-all duration-700 ${isTransitioning ? 'transform translate-y-8 opacity-30 scale-95' : 'transform translate-y-0 opacity-100 scale-100'}`}>
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group cursor-pointer relative transition-all duration-500 ${isTransitioning ? 'animate-pulse' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Enhanced Background */}
                <div className="absolute inset-0 bg-white/25 backdrop-blur-sm rounded-2xl border border-white/25 group-hover:bg-white/35 group-hover:border-white/35 transition-all duration-300 shadow-lg group-hover:shadow-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center p-6 z-10">
                  <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <span className="ml-4 text-gray-700 group-hover:text-gray-900 transition-colors text-lg font-medium">
                    {feature.text}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Decorative Elements */}
          <div className={`absolute top-20 right-16 animate-float opacity-60 transition-all duration-700 ${isTransitioning ? 'scale-150 rotate-180' : 'scale-100 rotate-0'}`}>
            <div className="bg-white/40 backdrop-blur-sm rounded-full p-3 border border-white/30 shadow-lg">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className={`absolute bottom-32 right-24 animate-float opacity-50 transition-all duration-700 ${isTransitioning ? 'scale-150 -rotate-180' : 'scale-100 rotate-0'}`} style={{ animationDelay: '2s' }}>
            <div className="bg-white/40 backdrop-blur-sm rounded-full p-2 border border-white/30 shadow-lg">
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
          </div>
        </div>

        {/* Right Side - Enhanced Auth Form with Dramatic Transitions */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Enhanced Form Container with Dramatic Transitions */}
            <div className="relative group">
              {/* Enhanced Glow */}
              <div className={`absolute -inset-3 bg-gradient-to-r from-blue-400/20 via-purple-400/15 to-indigo-400/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 ${isTransitioning ? 'animate-pulse scale-150' : ''}`}></div>
              
              {/* Main Form with Dramatic Transitions */}
              <div className={`relative bg-white/70 backdrop-blur-xl rounded-3xl p-10 border border-white/50 shadow-2xl transition-all duration-700 ease-in-out ${
                isTransitioning 
                  ? isLogin 
                    ? 'form-exit-login transform scale-75 rotateY-90 opacity-0 blur-sm' 
                    : 'form-exit-signup transform scale-75 rotateY-90 opacity-0 blur-sm'
                  : isLogin
                    ? 'form-enter-login transform scale-100 rotateY-0 opacity-100 blur-0'
                    : 'form-enter-signup transform scale-100 rotateY-0 opacity-100 blur-0'
              }`}>
                {/* Enhanced Inner Layers */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center mb-10">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-xl transition-all duration-700 ${
                      isLogin 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                    } ${isTransitioning ? 'animate-spin scale-125' : ''}`}>
                      <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-white/15 rounded-2xl"></div>
                      
                      {isLogin ? (
                        <User className="w-8 h-8 text-white relative z-10" />
                      ) : (
                        <Rocket className="w-8 h-8 text-white relative z-10" />
                      )}
                    </div>
                    <h3 className={`text-3xl font-bold text-gray-900 mb-3 transition-all duration-500 ${isTransitioning ? 'blur-sm scale-110' : 'blur-0 scale-100'}`}>
                      {isLogin ? 'Welcome Back' : 'Join Us Today'}
                    </h3>
                    <p className="text-gray-600 text-lg">
                      {isLogin 
                        ? 'Sign in to access your dashboard' 
                        : 'Create an account to start building'
                      }
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 relative animate-shake">
                      <div className="absolute inset-0 bg-red-50/90 backdrop-blur-sm rounded-2xl border border-red-200/60"></div>
                      <div className="relative p-4">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                          <p className="text-red-700 font-medium">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="mb-6 relative animate-bounce">
                      <div className="absolute inset-0 bg-emerald-50/90 backdrop-blur-sm rounded-2xl border border-emerald-200/60"></div>
                      <div className="relative p-4">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                          <p className="text-emerald-700 font-medium">{success}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Demo Login Button - Only show on login page */}
                  {isLogin && (
                    <div className="mb-6">
                      <button
                        type="button"
                        onClick={handleDummyLogin}
                        disabled={loading}
                        className="relative w-full group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative px-6 py-3 flex items-center justify-center text-white font-semibold text-lg z-10">
                          {loading ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                              Signing In...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <TestTube className="mr-3" size={20} />
                              Try Demo Login
                              <Sparkles className="ml-3" size={16} />
                            </div>
                          )}
                        </div>
                      </button>
                      
                      {/* Demo credentials info */}
                      <div className="mt-3 p-3 bg-orange-50/80 backdrop-blur-sm rounded-xl border border-orange-200/60">
                        <div className="text-center">
                          <p className="text-sm text-orange-800 font-medium mb-2">Demo Credentials:</p>
                          <div className="text-xs text-orange-700 space-y-1">
                            <p><strong>Email:</strong> {DUMMY_CREDENTIALS.email}</p>
                            <p><strong>Password:</strong> {DUMMY_CREDENTIALS.password}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Divider */}
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-4 bg-white/70 text-gray-500 font-medium">Or continue with your account</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div className="relative group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 group-focus-within:border-blue-400/60 group-focus-within:bg-white/60 transition-all duration-300"></div>
                        
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300 z-10" size={20} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="relative z-10 w-full pl-12 pr-4 py-4 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-lg"
                          placeholder="Enter your email"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="relative group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 group-focus-within:border-blue-400/60 group-focus-within:bg-white/60 transition-all duration-300"></div>
                        
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300 z-10" size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="relative z-10 w-full pl-12 pr-12 py-4 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-lg"
                          placeholder="Enter your password"
                          required
                          minLength={6}
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300 z-10"
                          disabled={loading}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password (Sign Up only) */}
                    <div className={`transition-all duration-700 overflow-hidden ${
                      !isLogin ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="relative group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 group-focus-within:border-emerald-400/60 group-focus-within:bg-white/60 transition-all duration-300"></div>
                          
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-300 z-10" size={20} />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="relative z-10 w-full pl-12 pr-4 py-4 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-lg"
                            placeholder="Confirm your password"
                            required={!isLogin}
                            minLength={6}
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`relative w-full group overflow-hidden mt-8 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 ${isTransitioning ? 'scale-105 animate-pulse' : 'scale-100'}`}
                    >
                      <div className={`absolute inset-0 rounded-xl transition-all duration-500 ${
                        isLogin 
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      }`}></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        isLogin 
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600' 
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600'
                      }`}></div>
                      
                      <div className="relative px-8 py-4 flex items-center justify-center text-white font-semibold text-lg z-10">
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            {isLogin ? 'Signing In...' : 'Creating Account...'}
                          </div>
                        ) : (
                          <div className="flex items-center">
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Toggle Mode */}
                    <div className="text-center pt-6">
                      <button
                        type="button"
                        onClick={handleModeSwitch}
                        className={`text-gray-600 hover:text-gray-900 transition-colors font-medium group text-lg cursor-pointer ${isTransitioning ? 'animate-pulse' : ''}`}
                        disabled={loading}
                      >
                        {isLogin 
                          ? "Don't have an account? " 
                          : "Already have an account? "
                        }
                        <span className={`transition-colors duration-300 ${
                          isLogin 
                            ? 'text-emerald-500 group-hover:text-emerald-600' 
                            : 'text-blue-500 group-hover:text-blue-600'
                        }`}>
                          {isLogin ? 'Sign up' : 'Sign in'}
                        </span>
                      </button>
                    </div>
                  </form>

                  {/* Features for Sign Up */}
                  {!isLogin && (
                    <div className={`mt-8 space-y-3 transition-all duration-700 ${
                      isTransitioning ? 'opacity-0 transform translate-y-4 blur-sm' : 'opacity-100 transform translate-y-0 blur-0'
                    }`}>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 mr-3 text-emerald-500" />
                        Secure cloud storage with encryption
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 mr-3 text-emerald-500" />
                        Real-time sync across devices
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 mr-3 text-emerald-500" />
                        Professional templates
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Text with Badge */}
            <div className={`text-center mt-8 transition-all duration-500 ${isTransitioning ? 'opacity-50 blur-sm' : 'opacity-100 blur-0'}`}>
              {/* Bolt Badge */}
              <div className="mb-6">
                <img 
                  src="/black_circle_360x360.png" 
                  alt="Powered by Bolt" 
                  className="w-16 h-16 mx-auto opacity-60 hover:opacity-80 transition-opacity duration-300"
                />
              </div>
              
              <p className="text-gray-500">
                By continuing, you agree to our{' '}
                <a href="#" className="text-blue-500 hover:text-blue-600 transition-colors font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-500 hover:text-blue-600 transition-colors font-medium">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Custom Styles with Dramatic Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33% { transform: translateY(-20px) rotate(120deg) scale(1.05); }
          66% { transform: translateY(-10px) rotate(240deg) scale(0.95); }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        
        .animate-shake {
          animation: shake 0.8s ease-in-out;
        }
        
        /* Dramatic Form Transitions */
        .form-exit-login {
          transform: scale(0.7) rotateY(90deg) rotateX(15deg);
          opacity: 0;
          filter: blur(8px);
        }
        
        .form-exit-signup {
          transform: scale(0.7) rotateY(-90deg) rotateX(-15deg);
          opacity: 0;
          filter: blur(8px);
        }
        
        .form-enter-login {
          transform: scale(1) rotateY(0deg) rotateX(0deg);
          opacity: 1;
          filter: blur(0px);
        }
        
        .form-enter-signup {
          transform: scale(1) rotateY(0deg) rotateX(0deg);
          opacity: 1;
          filter: blur(0px);
        }
        
        /* Dramatic Panel Transitions */
        .panel-exit-login {
          transform: translateX(100%) skewX(15deg) scale(0.8);
          opacity: 0;
          filter: blur(4px);
        }
        
        .panel-exit-signup {
          transform: translateX(-100%) skewX(-15deg) scale(0.8);
          opacity: 0;
          filter: blur(4px);
        }
        
        .panel-enter-login {
          transform: translateX(0%) skewX(0deg) scale(1);
          opacity: 1;
          filter: blur(0px);
        }
        
        .panel-enter-signup {
          transform: translateX(0%) skewX(0deg) scale(1);
          opacity: 1;
          filter: blur(0px);
        }
        
        /* 3D Rotation Effects */
        .rotateY-90 {
          transform: rotateY(90deg);
        }
        
        .rotateY-0 {
          transform: rotateY(0deg);
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0,-15px,0); }
          70% { transform: translate3d(0,-7px,0); }
          90% { transform: translate3d(0,-2px,0); }
        }
      `}</style>
    </div>
  );
};

export default AuthPage;