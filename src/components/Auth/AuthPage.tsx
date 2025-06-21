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

  // Enhanced animated background particles
  const particles = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    speed: Math.random() * 5 + 2,
    opacity: Math.random() * 0.8 + 0.2,
    delay: Math.random() * 8,
    hue: Math.random() * 60 + 180, // Blue to cyan range
  }));

  const features = [
    { icon: <Sparkles className="w-6 h-6" />, text: "Beautiful Invoice Templates", color: "from-blue-400 to-cyan-400" },
    { icon: <Shield className="w-6 h-6" />, text: "Bank-Grade Security", color: "from-emerald-400 to-teal-400" },
    { icon: <Zap className="w-6 h-6" />, text: "Lightning Fast Performance", color: "from-yellow-400 to-orange-400" },
    { icon: <Globe className="w-6 h-6" />, text: "Global Multi-Currency", color: "from-purple-400 to-pink-400" },
    { icon: <TrendingUp className="w-6 h-6" />, text: "Advanced Analytics", color: "from-indigo-400 to-blue-400" },
    { icon: <Award className="w-6 h-6" />, text: "Professional Quality", color: "from-rose-400 to-pink-400" },
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
      }, 400);
    }, 200);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ultra Premium Liquid Aero Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
        {/* Primary Liquid Glass Orbs with Enhanced Glow */}
        <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-gradient-to-r from-blue-500/40 via-cyan-500/35 to-teal-500/30 rounded-full blur-3xl animate-pulse opacity-90 shadow-2xl shadow-blue-500/20"></div>
        <div className="absolute top-1/2 right-0 w-[900px] h-[900px] bg-gradient-to-r from-purple-500/35 via-pink-500/30 to-rose-500/25 rounded-full blur-3xl animate-pulse opacity-80 shadow-2xl shadow-purple-500/20" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-[800px] h-[800px] bg-gradient-to-r from-emerald-500/30 via-teal-500/35 to-cyan-500/40 rounded-full blur-3xl animate-pulse opacity-70 shadow-2xl shadow-emerald-500/20" style={{ animationDelay: '2s' }}></div>
        
        {/* Secondary Ambient Layers with Depth */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-yellow-400/15 to-orange-400/20 rounded-full blur-2xl animate-pulse opacity-60 shadow-xl shadow-yellow-500/10" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-indigo-400/20 to-purple-400/25 rounded-full blur-2xl animate-pulse opacity-50 shadow-xl shadow-indigo-500/10" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Enhanced Floating Liquid Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-float backdrop-blur-sm border border-white/10"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.speed + 6}s`,
              background: `hsla(${particle.hue}, 70%, 60%, 0.3)`,
              boxShadow: `0 0 ${particle.size * 4}px hsla(${particle.hue}, 70%, 60%, 0.4), inset 0 0 ${particle.size}px hsla(${particle.hue}, 70%, 80%, 0.2)`,
            }}
          />
        ))}

        {/* Premium Glass Mesh Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.04%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-90"></div>
        
        {/* Dynamic Interactive Light Reflections */}
        <div 
          className="absolute w-[500px] h-[500px] bg-gradient-to-r from-white/15 via-cyan-300/10 to-transparent rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none"
          style={{
            left: `${mousePosition.x / window.innerWidth * 100}%`,
            top: `${mousePosition.y / window.innerHeight * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        
        {/* Ambient Light Streaks */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform rotate-12 animate-pulse opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-cyan-300/5 to-transparent transform -rotate-12 animate-pulse opacity-40" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Ultra Premium Liquid Glass Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-16 relative">
          {/* Floating Premium Glass Logo Section */}
          <div className="mb-24 relative">
            <div className="flex items-center mb-12">
              <div className="relative group">
                {/* Multi-layer Premium Glass Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/50 via-blue-400/40 to-indigo-400/30 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/40 via-blue-500/35 to-indigo-500/30 rounded-[36px] blur-2xl opacity-70 group-hover:opacity-90 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-blue-600/15 to-indigo-600/10 rounded-[32px] blur-xl opacity-50 group-hover:opacity-70 transition-all duration-500"></div>
                
                {/* Main Premium Glass Container */}
                <div className="relative bg-white/15 backdrop-blur-3xl border border-white/40 rounded-[28px] p-8 shadow-2xl group-hover:scale-110 transition-all duration-700 group-hover:shadow-cyan-500/30">
                  {/* Inner Glass Reflection Layers */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-white/10 rounded-[28px]"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/10 via-transparent to-blue-300/10 rounded-[28px]"></div>
                  
                  {/* Premium Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1200 rounded-[28px]"></div>
                  
                  <Layers className="w-14 h-14 text-white relative z-10 drop-shadow-2xl" />
                </div>
              </div>
              
              <div className="ml-10">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent drop-shadow-2xl">
                  Invoice Beautifier
                </h1>
                <p className="text-cyan-200 text-2xl font-medium mt-3 drop-shadow-xl">Professional Invoice Solutions</p>
              </div>
            </div>
            
            <div className={`transition-all duration-700 ${isTransitioning ? 'transform translate-x-8 opacity-50' : ''}`}>
              <h2 className="text-8xl font-bold text-white mb-12 leading-tight drop-shadow-2xl">
                {isLogin ? (
                  <>
                    Welcome
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-xl"> Back </span>
                    Professional
                  </>
                ) : (
                  <>
                    Start Your
                    <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-xl"> Journey </span>
                    Today
                  </>
                )}
              </h2>
              <p className="text-2xl text-gray-200 leading-relaxed max-w-lg drop-shadow-xl">
                {isLogin 
                  ? "Sign in to access your beautiful invoices and continue creating professional billing experiences."
                  : "Join thousands of professionals who trust us with their invoicing needs. Create stunning invoices in minutes."
                }
              </p>
            </div>
          </div>

          {/* Ultra Premium Liquid Glass Features Grid */}
          <div className={`grid grid-cols-2 gap-10 transition-all duration-700 ${isTransitioning ? 'transform translate-y-8 opacity-50' : ''}`}>
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group cursor-pointer relative"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Multi-layer Premium Glass Background */}
                <div className="absolute inset-0 bg-white/8 backdrop-blur-2xl rounded-[32px] border border-white/25 group-hover:bg-white/15 group-hover:border-white/40 transition-all duration-700 shadow-2xl group-hover:shadow-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/8 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Premium Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1200 rounded-[32px]"></div>
                
                <div className="relative flex items-center p-8 z-10">
                  <div className={`bg-gradient-to-r ${feature.color} p-5 rounded-[20px] group-hover:scale-110 transition-all duration-700 shadow-2xl backdrop-blur-sm border border-white/40`}>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-[20px]"></div>
                    <div className="text-white drop-shadow-xl relative z-10">
                      {feature.icon}
                    </div>
                  </div>
                  <span className="ml-8 text-gray-200 group-hover:text-white transition-colors text-xl font-semibold drop-shadow-xl">
                    {feature.text}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Premium Floating Decorative Glass Elements */}
          <div className="absolute top-32 right-20 animate-float">
            <div className="bg-white/15 backdrop-blur-2xl rounded-full p-5 border border-white/30 shadow-2xl">
              <Star className="w-10 h-10 text-yellow-400 drop-shadow-xl" />
            </div>
          </div>
          <div className="absolute bottom-40 right-32 animate-float" style={{ animationDelay: '1s' }}>
            <div className="bg-white/15 backdrop-blur-2xl rounded-full p-4 border border-white/30 shadow-2xl">
              <Heart className="w-8 h-8 text-pink-400 drop-shadow-xl" />
            </div>
          </div>
          <div className="absolute top-1/2 right-10 animate-float" style={{ animationDelay: '2s' }}>
            <div className="bg-white/15 backdrop-blur-2xl rounded-full p-5 border border-white/30 shadow-2xl">
              <Gem className="w-9 h-9 text-purple-400 drop-shadow-xl" />
            </div>
          </div>
          <div className="absolute bottom-20 left-20 animate-float" style={{ animationDelay: '0.5s' }}>
            <div className="bg-white/15 backdrop-blur-2xl rounded-full p-4 border border-white/30 shadow-2xl">
              <Crown className="w-8 h-8 text-amber-400 drop-shadow-xl" />
            </div>
          </div>
        </div>

        {/* Right Side - Ultra Premium Liquid Glass Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-10">
          <div className="w-full max-w-lg">
            {/* Ultra Premium Liquid Glass Form Container */}
            <div className="relative group">
              {/* Multi-layer Premium Glow Effects */}
              <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500/40 via-blue-500/35 to-indigo-500/30 rounded-[48px] blur-3xl opacity-70 group-hover:opacity-90 transition-all duration-1000 animate-pulse"></div>
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/30 via-blue-400/25 to-indigo-400/20 rounded-[44px] blur-2xl opacity-50 group-hover:opacity-70 transition-all duration-700"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-300/20 via-blue-300/15 to-indigo-300/10 rounded-[40px] blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
              
              {/* Main Ultra Premium Glass Form */}
              <div className={`relative bg-white/12 backdrop-blur-3xl rounded-[36px] p-14 border border-white/40 shadow-2xl transition-all duration-700 ${
                isTransitioning ? 'transform scale-95 opacity-80' : 'transform scale-100 opacity-100'
              }`}>
                {/* Inner Premium Glass Layers */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/8 rounded-[36px]"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 rounded-[36px]"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-indigo-500/5 rounded-[36px]"></div>
                
                {/* Ultra Premium Liquid Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1500 rounded-[36px]"></div>
                
                <div className="relative z-10">
                  {/* Ultra Premium Header */}
                  <div className="text-center mb-14">
                    <div className={`inline-flex items-center justify-center w-28 h-28 rounded-[28px] mb-10 shadow-2xl transition-all duration-700 relative ${
                      isLogin 
                        ? 'bg-gradient-to-r from-cyan-500/90 to-blue-500/90' 
                        : 'bg-gradient-to-r from-emerald-500/90 to-teal-500/90'
                    }`}>
                      {/* Premium Glass Reflection */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/15 rounded-[28px]"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] hover:translate-x-[200%] transition-transform duration-1200 rounded-[28px]"></div>
                      
                      {isLogin ? (
                        <User className="w-14 h-14 text-white relative z-10 drop-shadow-2xl" />
                      ) : (
                        <Rocket className="w-14 h-14 text-white relative z-10 drop-shadow-2xl" />
                      )}
                    </div>
                    <h3 className="text-5xl font-bold text-white mb-6 drop-shadow-2xl">
                      {isLogin ? 'Welcome Back' : 'Join Us Today'}
                    </h3>
                    <p className="text-gray-200 text-2xl drop-shadow-xl">
                      {isLogin 
                        ? 'Sign in to access your professional dashboard' 
                        : 'Create an account to start building amazing invoices'
                      }
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-10 relative">
                      <div className="absolute inset-0 bg-red-500/25 backdrop-blur-2xl rounded-[24px] border border-red-500/40"></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/8 rounded-[24px]"></div>
                      <div className="relative p-8 animate-shake">
                        <div className="flex items-center">
                          <AlertCircle className="w-7 h-7 text-red-300 mr-5 flex-shrink-0 drop-shadow-xl" />
                          <p className="text-red-200 font-medium text-lg drop-shadow-lg">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="mb-10 relative">
                      <div className="absolute inset-0 bg-emerald-500/25 backdrop-blur-2xl rounded-[24px] border border-emerald-500/40"></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/8 rounded-[24px]"></div>
                      <div className="relative p-8">
                        <div className="flex items-center">
                          <CheckCircle className="w-7 h-7 text-emerald-300 mr-5 flex-shrink-0 drop-shadow-xl" />
                          <p className="text-emerald-200 font-medium text-lg drop-shadow-lg">{success}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ultra Premium Form */}
                  <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Email Field */}
                    <div className="relative group">
                      <label className="block text-sm font-bold text-gray-200 mb-5 uppercase tracking-wider drop-shadow-lg">
                        Email Address
                      </label>
                      <div className="relative">
                        {/* Premium Input Glass Background */}
                        <div className="absolute inset-0 bg-white/12 backdrop-blur-2xl rounded-[24px] border border-white/40 group-focus-within:border-cyan-400/60 group-focus-within:bg-white/15 transition-all duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/8 rounded-[24px]"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 rounded-[24px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                        
                        <Mail className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-400 transition-colors duration-500 z-10 drop-shadow-lg" size={26} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="relative z-10 w-full pl-18 pr-7 py-6 bg-transparent text-white placeholder-gray-300 focus:outline-none text-xl font-medium"
                          placeholder="Enter your email"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="relative group">
                      <label className="block text-sm font-bold text-gray-200 mb-5 uppercase tracking-wider drop-shadow-lg">
                        Password
                      </label>
                      <div className="relative">
                        {/* Premium Input Glass Background */}
                        <div className="absolute inset-0 bg-white/12 backdrop-blur-2xl rounded-[24px] border border-white/40 group-focus-within:border-cyan-400/60 group-focus-within:bg-white/15 transition-all duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/8 rounded-[24px]"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 rounded-[24px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                        
                        <Lock className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-cyan-400 transition-colors duration-500 z-10 drop-shadow-lg" size={26} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="relative z-10 w-full pl-18 pr-18 py-6 bg-transparent text-white placeholder-gray-300 focus:outline-none text-xl font-medium"
                          placeholder="Enter your password"
                          required
                          minLength={6}
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-7 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors duration-500 z-10"
                          disabled={loading}
                        >
                          {showPassword ? <EyeOff size={26} /> : <Eye size={26} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password (Sign Up only) */}
                    <div className={`transition-all duration-700 overflow-hidden ${
                      !isLogin ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="relative group">
                        <label className="block text-sm font-bold text-gray-200 mb-5 uppercase tracking-wider drop-shadow-lg">
                          Confirm Password
                        </label>
                        <div className="relative">
                          {/* Premium Input Glass Background */}
                          <div className="absolute inset-0 bg-white/12 backdrop-blur-2xl rounded-[24px] border border-white/40 group-focus-within:border-emerald-400/60 group-focus-within:bg-white/15 transition-all duration-500"></div>
                          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/8 rounded-[24px]"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-500/5 rounded-[24px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                          
                          <Lock className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-400 transition-colors duration-500 z-10 drop-shadow-lg" size={26} />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="relative z-10 w-full pl-18 pr-7 py-6 bg-transparent text-white placeholder-gray-300 focus:outline-none text-xl font-medium"
                            placeholder="Confirm your password"
                            required={!isLogin}
                            minLength={6}
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Ultra Premium Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative w-full group overflow-hidden mt-12 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {/* Multi-layer Premium Glass Button */}
                      <div className={`absolute inset-0 rounded-[24px] transition-all duration-700 ${
                        isLogin 
                          ? 'bg-gradient-to-r from-cyan-600/90 via-blue-600/90 to-indigo-600/90' 
                          : 'bg-gradient-to-r from-emerald-600/90 via-teal-600/90 to-cyan-600/90'
                      }`}></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-white/15 rounded-[24px]"></div>
                      <div className={`absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                        isLogin 
                          ? 'bg-gradient-to-r from-cyan-500/95 via-blue-500/95 to-indigo-500/95' 
                          : 'bg-gradient-to-r from-emerald-500/95 via-teal-500/95 to-cyan-500/95'
                      }`}></div>
                      
                      {/* Ultra Premium Liquid Shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1200 rounded-[24px]"></div>
                      
                      <div className="relative px-12 py-7 flex items-center justify-center text-white font-bold text-2xl z-10">
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-5"></div>
                            {isLogin ? 'Signing In...' : 'Creating Account...'}
                          </div>
                        ) : (
                          <div className="flex items-center">
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight className="ml-5 group-hover:translate-x-2 transition-transform duration-500" size={28} />
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Toggle Mode */}
                    <div className="text-center pt-10">
                      <button
                        type="button"
                        onClick={handleModeSwitch}
                        className="text-gray-200 hover:text-white transition-colors font-medium group text-2xl"
                        disabled={loading}
                      >
                        {isLogin 
                          ? "Don't have an account? " 
                          : "Already have an account? "
                        }
                        <span className={`transition-colors duration-500 drop-shadow-lg ${
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
                    <div className={`mt-12 space-y-5 transition-all duration-700 ${
                      isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                    }`}>
                      <div className="flex items-center text-lg text-gray-300">
                        <CheckCircle className="w-6 h-6 mr-5 text-emerald-400 drop-shadow-lg" />
                        Secure cloud storage with bank-grade encryption
                      </div>
                      <div className="flex items-center text-lg text-gray-300">
                        <CheckCircle className="w-6 h-6 mr-5 text-emerald-400 drop-shadow-lg" />
                        Real-time synchronization across all devices
                      </div>
                      <div className="flex items-center text-lg text-gray-300">
                        <CheckCircle className="w-6 h-6 mr-5 text-emerald-400 drop-shadow-lg" />
                        Professional templates and customization
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Text */}
            <div className="text-center mt-12">
              <p className="text-gray-300 text-lg drop-shadow-lg">
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

      {/* Ultra Premium Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33% { transform: translateY(-40px) rotate(120deg) scale(1.1); }
          66% { transform: translateY(-20px) rotate(240deg) scale(0.9); }
        }
        
        .animate-float {
          animation: float 12s ease-in-out infinite;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-12px); }
          20%, 40%, 60%, 80% { transform: translateX(12px); }
        }
        
        .animate-shake {
          animation: shake 1s ease-in-out;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        .animate-shimmer {
          animation: shimmer 5s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default AuthPage;