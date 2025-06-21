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
  const particles = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    speed: Math.random() * 4 + 1,
    opacity: Math.random() * 0.6 + 0.2,
    delay: Math.random() * 5,
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Liquid Aero Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
        {/* Primary Liquid Glass Orbs */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/30 via-cyan-500/25 to-teal-500/20 rounded-full blur-3xl animate-pulse opacity-80"></div>
        <div className="absolute top-1/2 right-0 w-[700px] h-[700px] bg-gradient-to-r from-purple-500/25 via-pink-500/20 to-rose-500/15 rounded-full blur-3xl animate-pulse opacity-70" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/20 via-teal-500/25 to-cyan-500/30 rounded-full blur-3xl animate-pulse opacity-60" style={{ animationDelay: '2s' }}></div>
        
        {/* Secondary Ambient Layers */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-yellow-400/10 to-orange-400/15 rounded-full blur-2xl animate-pulse opacity-50" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-indigo-400/15 to-purple-400/20 rounded-full blur-2xl animate-pulse opacity-40" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Floating Liquid Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white/20 animate-float backdrop-blur-sm"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.speed + 4}s`,
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
            }}
          />
        ))}

        {/* Liquid Glass Mesh Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80"></div>
        
        {/* Dynamic Light Reflections */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: `${mousePosition.x / window.innerWidth * 100}%`,
            top: `${mousePosition.y / window.innerHeight * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Enhanced Liquid Glass Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative">
          {/* Floating Glass Logo Section */}
          <div className="mb-20 relative">
            <div className="flex items-center mb-10">
              <div className="relative group">
                {/* Multi-layer Glass Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 via-blue-400/30 to-indigo-400/20 rounded-[32px] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-blue-500/25 to-indigo-500/20 rounded-[28px] blur-xl opacity-60 group-hover:opacity-80 transition-all duration-500"></div>
                
                {/* Main Glass Container */}
                <div className="relative bg-white/10 backdrop-blur-2xl border border-white/30 rounded-[24px] p-6 shadow-2xl group-hover:scale-110 transition-all duration-700 group-hover:shadow-cyan-500/25">
                  {/* Inner Glass Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/5 rounded-[24px]"></div>
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-[24px]"></div>
                  
                  <Layers className="w-12 h-12 text-white relative z-10 drop-shadow-lg" />
                </div>
              </div>
              
              <div className="ml-8">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent drop-shadow-2xl">
                  Invoice Beautifier
                </h1>
                <p className="text-cyan-200 text-xl font-medium mt-2 drop-shadow-lg">Professional Invoice Solutions</p>
              </div>
            </div>
            
            <div className={`transition-all duration-700 ${isTransitioning ? 'transform translate-x-8 opacity-50' : ''}`}>
              <h2 className="text-7xl font-bold text-white mb-10 leading-tight drop-shadow-2xl">
                {isLogin ? (
                  <>
                    Welcome
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg"> Back </span>
                    Professional
                  </>
                ) : (
                  <>
                    Start Your
                    <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg"> Journey </span>
                    Today
                  </>
                )}
              </h2>
              <p className="text-2xl text-gray-200 leading-relaxed max-w-lg drop-shadow-lg">
                {isLogin 
                  ? "Sign in to access your beautiful invoices and continue creating professional billing experiences."
                  : "Join thousands of professionals who trust us with their invoicing needs. Create stunning invoices in minutes."
                }
              </p>
            </div>
          </div>

          {/* Enhanced Liquid Glass Features Grid */}
          <div className={`grid grid-cols-2 gap-8 transition-all duration-700 ${isTransitioning ? 'transform translate-y-8 opacity-50' : ''}`}>
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group cursor-pointer relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Multi-layer Glass Background */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl border border-white/20 group-hover:bg-white/10 group-hover:border-white/30 transition-all duration-500 shadow-xl group-hover:shadow-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-3xl"></div>
                
                <div className="relative flex items-center p-6 z-10">
                  <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-2xl group-hover:scale-110 transition-all duration-500 shadow-2xl backdrop-blur-sm border border-white/30`}>
                    <div className="text-white drop-shadow-lg">
                      {feature.icon}
                    </div>
                  </div>
                  <span className="ml-6 text-gray-200 group-hover:text-white transition-colors text-xl font-semibold drop-shadow-lg">
                    {feature.text}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Decorative Glass Elements */}
          <div className="absolute top-32 right-20 animate-float">
            <div className="bg-white/10 backdrop-blur-md rounded-full p-4 border border-white/20 shadow-xl">
              <Star className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
            </div>
          </div>
          <div className="absolute bottom-40 right-32 animate-float" style={{ animationDelay: '1s' }}>
            <div className="bg-white/10 backdrop-blur-md rounded-full p-3 border border-white/20 shadow-xl">
              <Heart className="w-6 h-6 text-pink-400 drop-shadow-lg" />
            </div>
          </div>
          <div className="absolute top-1/2 right-10 animate-float" style={{ animationDelay: '2s' }}>
            <div className="bg-white/10 backdrop-blur-md rounded-full p-4 border border-white/20 shadow-xl">
              <Gem className="w-7 h-7 text-purple-400 drop-shadow-lg" />
            </div>
          </div>
          <div className="absolute bottom-20 left-20 animate-float" style={{ animationDelay: '0.5s' }}>
            <div className="bg-white/10 backdrop-blur-md rounded-full p-3 border border-white/20 shadow-xl">
              <Crown className="w-6 h-6 text-amber-400 drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* Right Side - Enhanced Liquid Glass Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Enhanced Liquid Glass Form Container */}
            <div className="relative group">
              {/* Multi-layer Glow Effects */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 via-blue-500/25 to-indigo-500/20 rounded-[40px] blur-2xl opacity-60 group-hover:opacity-80 transition-all duration-700 animate-pulse"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/20 via-blue-400/15 to-indigo-400/10 rounded-[36px] blur-xl opacity-40 group-hover:opacity-60 transition-all duration-500"></div>
              
              {/* Main Glass Form */}
              <div className={`relative bg-white/10 backdrop-blur-3xl rounded-[32px] p-12 border border-white/30 shadow-2xl transition-all duration-700 ${
                isTransitioning ? 'transform scale-95 opacity-80' : 'transform scale-100 opacity-100'
              }`}>
                {/* Inner Glass Layers */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/5 rounded-[32px]"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-[32px]"></div>
                
                {/* Liquid Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1200 rounded-[32px]"></div>
                
                <div className="relative z-10">
                  {/* Enhanced Header */}
                  <div className="text-center mb-12">
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-[24px] mb-8 shadow-2xl transition-all duration-700 relative ${
                      isLogin 
                        ? 'bg-gradient-to-r from-cyan-500/80 to-blue-500/80' 
                        : 'bg-gradient-to-r from-emerald-500/80 to-teal-500/80'
                    }`}>
                      {/* Glass Reflection */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/10 rounded-[24px]"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] hover:translate-x-[200%] transition-transform duration-1000 rounded-[24px]"></div>
                      
                      {isLogin ? (
                        <User className="w-12 h-12 text-white relative z-10 drop-shadow-lg" />
                      ) : (
                        <Rocket className="w-12 h-12 text-white relative z-10 drop-shadow-lg" />
                      )}
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                      {isLogin ? 'Welcome Back' : 'Join Us Today'}
                    </h3>
                    <p className="text-gray-200 text-xl drop-shadow-lg">
                      {isLogin 
                        ? 'Sign in to access your professional dashboard' 
                        : 'Create an account to start building amazing invoices'
                      }
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-8 relative">
                      <div className="absolute inset-0 bg-red-500/20 backdrop-blur-md rounded-[20px] border border-red-500/30"></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/5 rounded-[20px]"></div>
                      <div className="relative p-6 animate-shake">
                        <div className="flex items-center">
                          <AlertCircle className="w-6 h-6 text-red-300 mr-4 flex-shrink-0 drop-shadow-lg" />
                          <p className="text-red-200 font-medium drop-shadow-lg">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="mb-8 relative">
                      <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-md rounded-[20px] border border-emerald-500/30"></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/5 rounded-[20px]"></div>
                      <div className="relative p-6">
                        <div className="flex items-center">
                          <CheckCircle className="w-6 h-6 text-emerald-300 mr-4 flex-shrink-0 drop-shadow-lg" />
                          <p className="text-emerald-200 font-medium drop-shadow-lg">{success}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Form */}
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Email Field */}
                    <div className="relative group">
                      <label className="block text-sm font-bold text-gray-200 mb-4 uppercase tracking-wider drop-shadow-lg">
                        Email Address
                      </label>
                      <div className="relative">
                        {/* Input Glass Background */}
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-[20px] border border-white/30 group-focus-within:border-cyan-400/50 transition-all duration-300"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/5 rounded-[20px]"></div>
                        
                        <Mail className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-400 transition-colors duration-300 z-10 drop-shadow-lg" size={24} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="relative z-10 w-full pl-16 pr-6 py-5 bg-transparent text-white placeholder-gray-300 focus:outline-none text-xl font-medium"
                          placeholder="Enter your email"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="relative group">
                      <label className="block text-sm font-bold text-gray-200 mb-4 uppercase tracking-wider drop-shadow-lg">
                        Password
                      </label>
                      <div className="relative">
                        {/* Input Glass Background */}
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-[20px] border border-white/30 group-focus-within:border-cyan-400/50 transition-all duration-300"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/5 rounded-[20px]"></div>
                        
                        <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-400 transition-colors duration-300 z-10 drop-shadow-lg" size={24} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="relative z-10 w-full pl-16 pr-16 py-5 bg-transparent text-white placeholder-gray-300 focus:outline-none text-xl font-medium"
                          placeholder="Enter your password"
                          required
                          minLength={6}
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors duration-300 z-10"
                          disabled={loading}
                        >
                          {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password (Sign Up only) */}
                    <div className={`transition-all duration-500 overflow-hidden ${
                      !isLogin ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="relative group">
                        <label className="block text-sm font-bold text-gray-200 mb-4 uppercase tracking-wider drop-shadow-lg">
                          Confirm Password
                        </label>
                        <div className="relative">
                          {/* Input Glass Background */}
                          <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-[20px] border border-white/30 group-focus-within:border-emerald-400/50 transition-all duration-300"></div>
                          <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/5 rounded-[20px]"></div>
                          
                          <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-400 transition-colors duration-300 z-10 drop-shadow-lg" size={24} />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="relative z-10 w-full pl-16 pr-6 py-5 bg-transparent text-white placeholder-gray-300 focus:outline-none text-xl font-medium"
                            placeholder="Confirm your password"
                            required={!isLogin}
                            minLength={6}
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative w-full group overflow-hidden mt-10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {/* Multi-layer Glass Button */}
                      <div className={`absolute inset-0 rounded-[20px] transition-all duration-500 ${
                        isLogin 
                          ? 'bg-gradient-to-r from-cyan-600/80 via-blue-600/80 to-indigo-600/80' 
                          : 'bg-gradient-to-r from-emerald-600/80 via-teal-600/80 to-cyan-600/80'
                      }`}></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-[20px]"></div>
                      <div className={`absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        isLogin 
                          ? 'bg-gradient-to-r from-cyan-500/90 via-blue-500/90 to-indigo-500/90' 
                          : 'bg-gradient-to-r from-emerald-500/90 via-teal-500/90 to-cyan-500/90'
                      }`}></div>
                      
                      {/* Liquid Shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-[20px]"></div>
                      
                      <div className="relative px-10 py-6 flex items-center justify-center text-white font-bold text-xl z-10">
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white mr-4"></div>
                            {isLogin ? 'Signing In...' : 'Creating Account...'}
                          </div>
                        ) : (
                          <div className="flex items-center">
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight className="ml-4 group-hover:translate-x-1 transition-transform duration-300" size={24} />
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Toggle Mode */}
                    <div className="text-center pt-8">
                      <button
                        type="button"
                        onClick={handleModeSwitch}
                        className="text-gray-200 hover:text-white transition-colors font-medium group text-xl"
                        disabled={loading}
                      >
                        {isLogin 
                          ? "Don't have an account? " 
                          : "Already have an account? "
                        }
                        <span className={`transition-colors duration-300 drop-shadow-lg ${
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
                    <div className={`mt-10 space-y-4 transition-all duration-700 ${
                      isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                    }`}>
                      <div className="flex items-center text-sm text-gray-300">
                        <CheckCircle className="w-5 h-5 mr-4 text-emerald-400 drop-shadow-lg" />
                        Secure cloud storage with bank-grade encryption
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <CheckCircle className="w-5 h-5 mr-4 text-emerald-400 drop-shadow-lg" />
                        Real-time synchronization across all devices
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <CheckCircle className="w-5 h-5 mr-4 text-emerald-400 drop-shadow-lg" />
                        Professional templates and customization
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Text */}
            <div className="text-center mt-10">
              <p className="text-gray-300 text-sm drop-shadow-lg">
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

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        .animate-shake {
          animation: shake 0.8s ease-in-out;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        .animate-shimmer {
          animation: shimmer 4s infinite;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;