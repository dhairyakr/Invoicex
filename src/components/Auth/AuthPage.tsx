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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { signUp } = useAuth();

  // Mouse tracking for subtle interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Refined subtle background particles
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 3 + 2,
    opacity: Math.random() * 0.3 + 0.1,
    delay: Math.random() * 8,
    hue: Math.random() * 30 + 200, // Subtle blue range
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

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const result = await signUp(email.trim(), password);

      if (result.error) {
        setError(result.error.message);
      } else {
        // Check if there's a specific message from the sign up process
        if ((result as any).message) {
          setSuccess((result as any).message);
        } else {
          setSuccess('Account created successfully! You can now sign in.');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Refined Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Primary Subtle Orbs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-r from-blue-200/20 via-cyan-200/15 to-teal-200/10 rounded-full blur-2xl opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-r from-purple-200/15 via-pink-200/10 to-rose-200/10 rounded-full blur-2xl opacity-50"></div>
        
        {/* Subtle Floating Particles */}
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
              animationDuration: `${particle.speed + 8}s`,
              background: `hsla(${particle.hue}, 40%, 70%, 0.2)`,
              boxShadow: `0 0 ${particle.size * 2}px hsla(${particle.hue}, 40%, 70%, 0.1)`,
            }}
          />
        ))}

        {/* Subtle Mesh Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        {/* Subtle Interactive Light */}
        <div 
          className="absolute w-[300px] h-[300px] bg-gradient-to-r from-white/8 via-cyan-100/5 to-transparent rounded-full blur-2xl transition-all duration-1000 ease-out pointer-events-none"
          style={{
            left: `${mousePosition.x / window.innerWidth * 100}%`,
            top: `${mousePosition.y / window.innerHeight * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Refined Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-16 relative">
          {/* Logo Section */}
          <div className="mb-16 relative">
            <div className="flex items-center mb-8">
              <div className="relative group">
                {/* Subtle Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/15 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                
                {/* Glass Container */}
                <div className="relative bg-white/40 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-lg group-hover:scale-105 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/5 rounded-3xl"></div>
                  
                  <Layers className="w-10 h-10 text-blue-600 relative z-10" />
                </div>
              </div>
              
              <div className="ml-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-1">
                  Invoice Beautifier
                </h1>
                <p className="text-blue-600 text-lg font-medium">Professional Invoice Solutions</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-6xl font-bold text-gray-900 mb-8 leading-tight">
                Start Your
                <span className="text-emerald-600"> Journey</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Join thousands of professionals who trust us with their invoicing needs. Create stunning invoices in minutes.
              </p>
            </div>
          </div>

          {/* Refined Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group cursor-pointer relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Subtle Background */}
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20 group-hover:bg-white/30 group-hover:border-white/30 transition-all duration-300 shadow-sm group-hover:shadow-md"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center p-6 z-10">
                  <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-xl group-hover:scale-105 transition-all duration-300 shadow-sm`}>
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

          {/* Subtle Decorative Elements */}
          <div className="absolute top-20 right-16 animate-float opacity-60">
            <div className="bg-white/30 backdrop-blur-sm rounded-full p-3 border border-white/20 shadow-sm">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="absolute bottom-32 right-24 animate-float opacity-50" style={{ animationDelay: '2s' }}>
            <div className="bg-white/30 backdrop-blur-sm rounded-full p-2 border border-white/20 shadow-sm">
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
          </div>
        </div>

        {/* Right Side - Refined Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Refined Form Container */}
            <div className="relative group">
              {/* Subtle Glow */}
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-400/15 via-purple-400/10 to-indigo-400/15 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              
              {/* Main Form */}
              <div className="relative bg-white/60 backdrop-blur-md rounded-3xl p-10 border border-white/40 shadow-xl">
                {/* Subtle Inner Layers */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/5 rounded-3xl"></div>
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-lg transition-all duration-500 bg-gradient-to-r from-emerald-500 to-teal-500">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                      
                      <Rocket className="w-8 h-8 text-white relative z-10" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                      Join Us Today
                    </h3>
                    <p className="text-gray-600 text-lg">
                      Create an account to start building
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 relative">
                      <div className="absolute inset-0 bg-red-50/80 backdrop-blur-sm rounded-2xl border border-red-200/50"></div>
                      <div className="relative p-4 animate-shake">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                          <p className="text-red-700 font-medium">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="mb-6 relative">
                      <div className="absolute inset-0 bg-emerald-50/80 backdrop-blur-sm rounded-2xl border border-emerald-200/50"></div>
                      <div className="relative p-4">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                          <p className="text-emerald-700 font-medium">{success}</p>
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
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-xl border border-white/30 group-focus-within:border-blue-400/50 group-focus-within:bg-white/50 transition-all duration-300"></div>
                        
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
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-xl border border-white/30 group-focus-within:border-emerald-400/50 group-focus-within:bg-white/50 transition-all duration-300"></div>
                        
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-300 z-10" size={20} />
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

                    {/* Confirm Password Field */}
                    <div className="relative group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-xl border border-white/30 group-focus-within:border-emerald-400/50 group-focus-within:bg-white/50 transition-all duration-300"></div>
                        
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-300 z-10" size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="relative z-10 w-full pl-12 pr-4 py-4 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-lg"
                          placeholder="Confirm your password"
                          required
                          minLength={6}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative w-full group overflow-hidden mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 rounded-xl transition-all duration-500 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/5 rounded-xl"></div>
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-emerald-600 to-teal-600"></div>
                      
                      <div className="relative px-8 py-4 flex items-center justify-center text-white font-semibold text-lg z-10">
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Creating Account...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            Create Account
                            <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                          </div>
                        )}
                      </div>
                    </button>
                  </form>

                  {/* Features for Sign Up */}
                  <div className="mt-8 space-y-3">
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
                </div>
              </div>
            </div>

            {/* Bottom Text with Badge */}
            <div className="text-center mt-8">
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

      {/* Refined Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33% { transform: translateY(-15px) rotate(60deg) scale(1.02); }
          66% { transform: translateY(-8px) rotate(120deg) scale(0.98); }
        }
        
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
};

export default AuthPage;