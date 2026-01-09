import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Activity,
  Clock,
  Brush
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { signIn } = useAuth();

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Refined subtle background particles
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    speed: Math.random() * 4 + 2,
    opacity: Math.random() * 0.4 + 0.1,
    delay: Math.random() * 10,
    hue: Math.random() * 60 + 200, // Blue to purple range
  }));

  const features = [
    { icon: <Sparkles className="w-5 h-5" />, text: "Beautiful Templates", color: "from-blue-400 to-cyan-400" },
    { icon: <Shield className="w-5 h-5" />, text: "Secure Storage", color: "from-emerald-400 to-teal-400" },
    { icon: <Zap className="w-5 h-5" />, text: "Fast Performance", color: "from-purple-400 to-indigo-400" },
    { icon: <Globe className="w-5 h-5" />, text: "Multi-Currency", color: "from-rose-400 to-pink-400" },
    { icon: <Activity className="w-5 h-5" />, text: "Real-time Sync", color: "from-orange-400 to-yellow-400" },
    { icon: <Award className="w-5 h-5" />, text: "Professional", color: "from-violet-400 to-purple-400" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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

    try {
      const result = await signIn(email.trim(), password);

      if (result.error) {
        setError(result.error.message);
      } else {
        // Success - navigation will be handled by auth context
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Advanced Sophisticated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Primary Sophisticated Orbs */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-r from-blue-200/30 via-cyan-200/20 to-teal-200/15 rounded-full blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-r from-purple-200/25 via-pink-200/15 to-rose-200/15 rounded-full blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-gradient-to-r from-emerald-200/20 via-teal-200/15 to-cyan-200/10 rounded-full blur-2xl opacity-50 animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Advanced Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.speed + 10}s`,
              background: `hsla(${particle.hue}, 50%, 70%, 0.3)`,
              boxShadow: `0 0 ${particle.size * 3}px hsla(${particle.hue}, 50%, 70%, 0.2)`,
            }}
          />
        ))}

        {/* Sophisticated Mesh Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        {/* Advanced Interactive Light */}
        <div 
          className="absolute w-[400px] h-[400px] bg-gradient-to-r from-white/12 via-cyan-100/8 to-transparent rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none"
          style={{
            left: `${mousePosition.x / window.innerWidth * 100}%`,
            top: `${mousePosition.y / window.innerHeight * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Enhanced Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative">
          {/* Sophisticated Logo Section */}
          <div className="mb-12 relative">
            <div className="flex items-center mb-10">
              <div className="relative group">
                {/* Advanced Glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/40 to-indigo-400/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                
                {/* Premium Glass Container */}
                <div className="relative bg-white/50 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl group-hover:scale-110 transition-all duration-500 group-hover:shadow-3xl">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/10 rounded-3xl"></div>

                  <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-xl">
                    <Layers className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="ml-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Invoice Beautifier
                </h1>
                <p className="text-blue-600 text-base font-semibold">Professional Invoice Solutions</p>
              </div>
            </div>
            
            <div className={`transition-all duration-500 ${isTransitioning ? 'transform translate-x-4 opacity-50' : ''}`}>
              <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Welcome
                <span className="text-blue-600"> Back</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                Sign in to access your beautiful invoices and continue creating professional billing experiences that impress your clients.
              </p>
            </div>
          </div>

          {/* Enhanced Features Grid */}
          <div className={`grid grid-cols-2 gap-6 transition-all duration-500 ${isTransitioning ? 'transform translate-y-4 opacity-50' : ''}`}>
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group cursor-pointer relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Advanced Background */}
                <div className="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl border border-white/30 group-hover:bg-white/40 group-hover:border-white/40 transition-all duration-300 shadow-xl group-hover:shadow-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center p-6 z-10">
                  <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-xl`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <span className="ml-4 text-gray-700 group-hover:text-gray-900 transition-colors text-base font-semibold">
                    {feature.text}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Advanced Decorative Elements */}
          <div className="absolute top-32 right-24 animate-float opacity-50">
            <div className="bg-white/30 backdrop-blur-md rounded-full p-2 border border-white/20 shadow-lg">
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <div className="absolute bottom-48 right-40 animate-float opacity-40" style={{ animationDelay: '2s' }}>
            <div className="bg-white/30 backdrop-blur-md rounded-full p-2 border border-white/20 shadow-lg">
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
          </div>
          <div className="absolute top-1/2 right-24 animate-float opacity-30" style={{ animationDelay: '4s' }}>
            <div className="bg-white/30 backdrop-blur-md rounded-full p-2 border border-white/20 shadow-lg">
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="mt-12 text-center">
            <p className="text-base text-gray-600 mb-6">Don't have an account yet?</p>
            <Link
              to="/auth"
              className="relative group overflow-hidden inline-block"
            >
              {/* Multi-layer Glass Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/50 to-teal-400/50 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 backdrop-blur-md px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center shadow-2xl group-hover:shadow-3xl transform group-hover:scale-105 border border-white/30">
                {/* Inner Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-white/15 rounded-2xl"></div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                {/* Liquid Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 rounded-2xl"></div>

                <span className="relative z-10 text-white flex items-center">
                  CREATE ACCOUNT
                  <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Right Side - Premium Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-6 overflow-hidden">
          <div className="w-full max-w-sm">
            {/* Premium Form Container */}
            <div className="relative group">
              {/* Advanced Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-indigo-400/15 to-purple-400/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

              {/* Main Form */}
              <div className={`relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-7 lg:p-8 border border-white/50 shadow-3xl transition-all duration-500 ${
                isTransitioning ? 'transform scale-98 opacity-80' : 'transform scale-100 opacity-100'
              }`}>
                {/* Advanced Inner Layers */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
                
                <div className="relative z-10">
                  {/* Premium Header */}
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 shadow-2xl transition-all duration-500 bg-gradient-to-r from-blue-500 to-indigo-500`}>
                      <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-white/15 rounded-3xl"></div>

                      <User className="w-9 h-9 text-white relative z-10" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      Welcome Back
                    </h3>
                    <p className="text-gray-600 text-base">
                      Sign in to access your dashboard
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 relative">
                      <div className="absolute inset-0 bg-red-50/90 backdrop-blur-md rounded-2xl border border-red-200/60"></div>
                      <div className="relative p-4 animate-shake">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                          <p className="text-red-700 font-semibold text-sm">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Premium Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
                    <div className="relative group">
                      <label className="block text-xs font-bold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-md rounded-2xl border border-white/40 group-focus-within:border-blue-400/60 group-focus-within:bg-white/60 transition-all duration-300"></div>
                        
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300 z-10" size={20} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="relative z-10 w-full pl-14 pr-4 py-3 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-base font-medium"
                          placeholder="Enter your email"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="relative group">
                      <label className="block text-xs font-bold text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-md rounded-2xl border border-white/40 group-focus-within:border-blue-400/60 group-focus-within:bg-white/60 transition-all duration-300"></div>

                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300 z-10" size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="relative z-10 w-full pl-14 pr-14 py-3 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-base font-medium"
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

                    {/* Premium Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative w-full group overflow-hidden mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 rounded-2xl transition-all duration-500 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                      <div className="relative px-6 py-2.5 flex items-center justify-center text-white font-bold text-base sm:text-lg z-10">
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Signing In...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            SIGN IN
                            <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Toggle Mode */}
                    <div className="text-center pt-6">
                      <p className="text-gray-600 font-semibold group text-sm">
                        Don't have an account?{' '}
                        <Link
                          to="/auth"
                          className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
                        >
                          Sign up
                        </Link>
                      </p>
                    </div>
                  </form>

                  {/* Premium Security Features */}
                  <div className={`mt-6 space-y-3 transition-all duration-500 ${
                    isTransitioning ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
                  }`}>
                    <div className="flex items-center text-xs text-gray-600">
                      <Shield className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
                      <span className="font-medium">Your data is protected with enterprise-grade security</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-3 text-green-500 flex-shrink-0" />
                      <span className="font-medium">Secure login with encrypted authentication</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <Zap className="w-4 h-4 mr-3 text-purple-500 flex-shrink-0" />
                      <span className="font-medium">Instant access to all your professional tools</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Text with Badge */}
            <div className="text-center mt-6">
              <div className="space-y-3">
                <p className="text-gray-500 text-xs">
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-blue-500 hover:text-blue-600 transition-colors font-semibold">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-500 hover:text-blue-600 transition-colors font-semibold">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33% { transform: translateY(-20px) rotate(60deg) scale(1.05); }
          66% { transform: translateY(-10px) rotate(120deg) scale(0.95); }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        
        .animate-shake {
          animation: shake 0.8s ease-in-out;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default LoginPage;