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
  AlertCircle
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

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animated background particles
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 3 + 1,
    opacity: Math.random() * 0.5 + 0.2,
  }));

  const features = [
    { icon: <Sparkles className="w-5 h-5" />, text: "Beautiful Invoice Templates", color: "from-blue-400 to-cyan-400" },
    { icon: <Shield className="w-5 h-5" />, text: "Bank-Grade Security", color: "from-emerald-400 to-teal-400" },
    { icon: <Zap className="w-5 h-5" />, text: "Lightning Fast Performance", color: "from-yellow-400 to-orange-400" },
    { icon: <Globe className="w-5 h-5" />, text: "Global Multi-Currency", color: "from-purple-400 to-pink-400" },
    { icon: <TrendingUp className="w-5 h-5" />, text: "Advanced Analytics", color: "from-indigo-400 to-blue-400" },
    { icon: <Award className="w-5 h-5" />, text: "Professional Quality", color: "from-rose-400 to-pink-400" },
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
      const { error } = isLogin 
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password);

      if (error) {
        setError(error.message);
      } else {
        if (!isLogin) {
          setSuccess('Account created successfully! Please check your email for verification instructions.');
        }
        onSuccess?.();
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setIsTransitioning(true);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    
    setTimeout(() => {
      setIsLogin(!isLogin);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 200);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0">
        {/* Primary Gradient Orbs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Secondary Accent Orbs */}
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-to-r from-yellow-400/15 to-orange-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-gradient-to-r from-indigo-400/15 to-purple-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDelay: `${particle.id * 0.1}s`,
              animationDuration: `${particle.speed + 3}s`,
            }}
          />
        ))}

        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative">
          {/* Logo Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 p-5 rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500">
                  <Layers className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="ml-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
                  Invoice Beautifier
                </h1>
                <p className="text-cyan-200 text-lg font-medium">Professional Invoice Solutions</p>
              </div>
            </div>
            
            <div className={`transition-all duration-700 ${isTransitioning ? 'transform translate-x-8 opacity-50' : ''}`}>
              <h2 className="text-6xl font-bold text-white mb-8 leading-tight">
                {isLogin ? (
                  <>
                    Welcome
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent"> Back </span>
                    Professional
                  </>
                ) : (
                  <>
                    Start Your
                    <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent"> Journey </span>
                    Today
                  </>
                )}
              </h2>
              <p className="text-2xl text-gray-300 leading-relaxed max-w-lg">
                {isLogin 
                  ? "Sign in to access your beautiful invoices and continue creating professional billing experiences."
                  : "Join thousands of professionals who trust us with their invoicing needs. Create stunning invoices in minutes."
                }
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className={`grid grid-cols-2 gap-6 transition-all duration-700 ${isTransitioning ? 'transform translate-y-8 opacity-50' : ''}`}>
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                  <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <span className="ml-4 text-gray-300 group-hover:text-white transition-colors text-lg font-medium">
                    {feature.text}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Decorative Elements */}
          <div className="absolute top-32 right-20 animate-float">
            <Star className="w-8 h-8 text-yellow-400 opacity-60" />
          </div>
          <div className="absolute bottom-40 right-32 animate-float" style={{ animationDelay: '1s' }}>
            <Heart className="w-6 h-6 text-pink-400 opacity-60" />
          </div>
          <div className="absolute top-1/2 right-10 animate-float" style={{ animationDelay: '2s' }}>
            <Gem className="w-7 h-7 text-purple-400 opacity-60" />
          </div>
          <div className="absolute bottom-20 left-20 animate-float" style={{ animationDelay: '0.5s' }}>
            <Crown className="w-6 h-6 text-amber-400 opacity-60" />
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Form Container */}
            <div className="relative group">
              {/* Enhanced Glow Effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 animate-pulse"></div>
              
              {/* Main Form */}
              <div className={`relative bg-white/10 backdrop-blur-2xl rounded-3xl p-10 border border-white/20 shadow-2xl transition-all duration-700 ${
                isTransitioning ? 'transform scale-95 opacity-80' : 'transform scale-100 opacity-100'
              }`}>
                {/* Header */}
                <div className="text-center mb-10">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 shadow-2xl transition-all duration-700 ${
                    isLogin 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  }`}>
                    {isLogin ? (
                      <User className="w-10 h-10 text-white" />
                    ) : (
                      <Rocket className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-3">
                    {isLogin ? 'Welcome Back' : 'Join Us Today'}
                  </h3>
                  <p className="text-gray-300 text-lg">
                    {isLogin 
                      ? 'Sign in to access your professional dashboard' 
                      : 'Create an account to start building amazing invoices'
                    }
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-8 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl backdrop-blur-sm animate-shake">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-300 mr-3 flex-shrink-0" />
                      <p className="text-red-200 text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="mb-8 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-300 mr-3 flex-shrink-0" />
                      <p className="text-emerald-200 text-sm font-medium">{success}</p>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-400 transition-colors duration-300" size={22} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-14 pr-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-lg"
                        placeholder="Enter your email"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-400 transition-colors duration-300" size={22} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-14 pr-14 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-lg"
                        placeholder="Enter your password"
                        required
                        minLength={6}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password (Sign Up only) */}
                  <div className={`transition-all duration-500 overflow-hidden ${
                    !isLogin ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="relative group">
                      <label className="block text-sm font-semibold text-gray-300 mb-3">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-400 transition-colors duration-300" size={22} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-14 pr-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-lg"
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
                    className="relative w-full group overflow-hidden mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                      isLogin 
                        ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600' 
                        : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600'
                    }`}></div>
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      isLogin 
                        ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500' 
                        : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500'
                    }`}></div>
                    <div className="relative px-8 py-4 flex items-center justify-center text-white font-bold text-lg">
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                          {isLogin ? 'Signing In...' : 'Creating Account...'}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {isLogin ? 'Sign In' : 'Create Account'}
                          <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" size={22} />
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Toggle Mode */}
                  <div className="text-center pt-6">
                    <button
                      type="button"
                      onClick={handleModeSwitch}
                      className="text-gray-300 hover:text-white transition-colors font-medium group text-lg"
                      disabled={loading}
                    >
                      {isLogin 
                        ? "Don't have an account? " 
                        : "Already have an account? "
                      }
                      <span className={`transition-colors duration-300 ${
                        isLogin 
                          ? 'text-emerald-400 group-hover:text-emerald-300' 
                          : 'text-cyan-400 group-hover:text-cyan-300'
                      }`}>
                        {isLogin ? 'Sign up' : 'Sign in'}
                      </span>
                    </button>
                  </div>
                </form>

                {/* Success Indicators for Sign Up */}
                {!isLogin && (
                  <div className={`mt-8 space-y-3 transition-all duration-700 ${
                    isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                  }`}>
                    <div className="flex items-center text-sm text-gray-400">
                      <CheckCircle className="w-5 h-5 mr-3 text-emerald-400" />
                      Secure cloud storage with bank-grade encryption
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <CheckCircle className="w-5 h-5 mr-3 text-emerald-400" />
                      Real-time synchronization across all devices
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <CheckCircle className="w-5 h-5 mr-3 text-emerald-400" />
                      Professional templates and customization
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Text */}
            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm">
                By continuing, you agree to our{' '}
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(180deg); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;