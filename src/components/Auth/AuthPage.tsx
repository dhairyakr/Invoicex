import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Star, Zap, Shield, CheckCircle, User, Globe, Layers, Cpu, Heart, Briefcase, TrendingUp, Award, Rocket, Crown, Gem, Coffee, Palette, Wand2, Flame, CloudLightning as Lightning, Orbit, Atom, Hexagon } from 'lucide-react';
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [typingAnimation, setTypingAnimation] = useState<string | null>(null);
  const [formProgress, setFormProgress] = useState(0);
  
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const { signIn, signUp } = useAuth();

  // Calculate form completion progress
  useEffect(() => {
    let progress = 0;
    if (email) progress += 33;
    if (password) progress += 33;
    if (!isLogin && confirmPassword) progress += 34;
    else if (isLogin) progress += 34;
    setFormProgress(progress);
  }, [email, password, confirmPassword, isLogin]);

  // Animated background particles with different types
  const particles = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    speed: Math.random() * 4 + 1,
    opacity: Math.random() * 0.6 + 0.2,
    type: ['circle', 'star', 'diamond', 'hexagon'][Math.floor(Math.random() * 4)],
    color: ['cyan', 'blue', 'purple', 'pink', 'emerald', 'yellow'][Math.floor(Math.random() * 6)],
  }));

  const features = [
    { icon: <Sparkles className="w-6 h-6" />, text: "AI-Powered Templates", color: "from-blue-400 to-cyan-400", delay: "0s" },
    { icon: <Shield className="w-6 h-6" />, text: "Military-Grade Security", color: "from-emerald-400 to-teal-400", delay: "0.1s" },
    { icon: <Lightning className="w-6 h-6" />, text: "Instant Generation", color: "from-yellow-400 to-orange-400", delay: "0.2s" },
    { icon: <Globe className="w-6 h-6" />, text: "200+ Currencies", color: "from-purple-400 to-pink-400", delay: "0.3s" },
    { icon: <TrendingUp className="w-6 h-6" />, text: "Real-time Analytics", color: "from-indigo-400 to-blue-400", delay: "0.4s" },
    { icon: <Award className="w-6 h-6" />, text: "Industry Leading", color: "from-rose-400 to-pink-400", delay: "0.5s" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        setError(error.message);
      } else {
        onSuccess?.();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setIsTransitioning(true);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFocusedField(null);
    setFormProgress(0);
    
    // Heavy animation sequence
    setTimeout(() => {
      setIsLogin(!isLogin);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }, 400);
  };

  const handleFieldFocus = (field: string) => {
    setFocusedField(field);
    setTypingAnimation(field);
    setTimeout(() => setTypingAnimation(null), 300);
  };

  const handleFieldBlur = () => {
    setFocusedField(null);
  };

  const getParticleClass = (particle: any) => {
    const baseClass = "absolute animate-float";
    const colorClass = {
      cyan: "bg-cyan-400",
      blue: "bg-blue-400", 
      purple: "bg-purple-400",
      pink: "bg-pink-400",
      emerald: "bg-emerald-400",
      yellow: "bg-yellow-400"
    }[particle.color];
    
    const shapeClass = {
      circle: "rounded-full",
      star: "rounded-sm rotate-45",
      diamond: "rounded-sm rotate-45 transform",
      hexagon: "rounded-lg"
    }[particle.type];

    return `${baseClass} ${colorClass} ${shapeClass}`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
      {/* Ultra Dynamic Animated Background */}
      <div className="absolute inset-0">
        {/* Primary Massive Gradient Orbs */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/25 via-cyan-500/25 to-teal-500/25 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 right-0 w-[700px] h-[700px] bg-gradient-to-r from-purple-500/25 via-pink-500/25 to-rose-500/25 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/25 via-teal-500/25 to-cyan-500/25 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        {/* Secondary Rotating Orbs */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl animate-spin-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl animate-spin-slow" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Floating Particles with Different Shapes */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={getParticleClass(particle)}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDelay: `${particle.id * 0.05}s`,
              animationDuration: `${particle.speed + 4}s`,
            }}
          />
        ))}

        {/* Animated Mesh Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60 animate-pulse"></div>
        
        {/* Scanning Lines */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-scan"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent animate-scan-vertical"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative">
          {/* Logo Section with Heavy Animation */}
          <div className="mb-20">
            <div className="flex items-center mb-10">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-glow"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 rounded-3xl blur-xl opacity-50 animate-spin-slow"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 p-6 rounded-3xl shadow-2xl group-hover:scale-110 transition-transform duration-700">
                  <Layers className="w-12 h-12 text-white animate-bounce-subtle" />
                </div>
              </div>
              <div className="ml-8">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent animate-text-shimmer">
                  Invoice Beautifier
                </h1>
                <p className="text-cyan-200 text-xl font-medium animate-fade-in-up">Professional Invoice Solutions</p>
              </div>
            </div>
            
            <div className={`transition-all duration-1000 transform ${
              isTransitioning 
                ? 'translate-x-16 opacity-0 scale-95 rotate-2' 
                : 'translate-x-0 opacity-100 scale-100 rotate-0'
            }`}>
              <h2 className="text-7xl font-bold text-white mb-10 leading-tight">
                {isLogin ? (
                  <>
                    <span className="animate-text-wave">Welcome</span>
                    <br />
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent animate-gradient-x">
                      Back
                    </span>
                    <br />
                    <span className="animate-text-wave" style={{ animationDelay: '0.2s' }}>Professional</span>
                  </>
                ) : (
                  <>
                    <span className="animate-text-wave">Start Your</span>
                    <br />
                    <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                      Journey
                    </span>
                    <br />
                    <span className="animate-text-wave" style={{ animationDelay: '0.2s' }}>Today</span>
                  </>
                )}
              </h2>
              <p className="text-2xl text-gray-300 leading-relaxed max-w-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                {isLogin 
                  ? "Sign in to access your beautiful invoices and continue creating professional billing experiences that wow your clients."
                  : "Join thousands of professionals who trust us with their invoicing needs. Create stunning, professional invoices in minutes."
                }
              </p>
            </div>
          </div>

          {/* Enhanced Features Grid with Staggered Animations */}
          <div className={`grid grid-cols-2 gap-8 transition-all duration-1000 transform ${
            isTransitioning 
              ? 'translate-y-16 opacity-0 scale-90' 
              : 'translate-y-0 opacity-100 scale-100'
          }`}>
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                  <div className="relative flex items-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500 group-hover:transform group-hover:scale-105">
                    <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-xl group-hover:scale-125 transition-all duration-500 shadow-lg group-hover:shadow-2xl animate-pulse-glow`} style={{ animationDelay: feature.delay }}>
                      <div className="text-white group-hover:animate-bounce">
                        {feature.icon}
                      </div>
                    </div>
                    <span className="ml-5 text-gray-300 group-hover:text-white transition-colors duration-300 text-lg font-medium">
                      {feature.text}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Decorative Elements with Heavy Animation */}
          <div className="absolute top-32 right-20 animate-orbit">
            <Star className="w-10 h-10 text-yellow-400 opacity-70 animate-spin-slow" />
          </div>
          <div className="absolute bottom-40 right-32 animate-orbit" style={{ animationDelay: '1s', animationDirection: 'reverse' }}>
            <Heart className="w-8 h-8 text-pink-400 opacity-70 animate-pulse-glow" />
          </div>
          <div className="absolute top-1/2 right-10 animate-orbit" style={{ animationDelay: '2s' }}>
            <Gem className="w-9 h-9 text-purple-400 opacity-70 animate-spin-slow" />
          </div>
          <div className="absolute bottom-20 left-20 animate-orbit" style={{ animationDelay: '0.5s', animationDirection: 'reverse' }}>
            <Crown className="w-8 h-8 text-amber-400 opacity-70 animate-bounce-subtle" />
          </div>
          <div className="absolute top-20 left-32 animate-orbit" style={{ animationDelay: '1.5s' }}>
            <Atom className="w-7 h-7 text-cyan-400 opacity-70 animate-spin" />
          </div>
          <div className="absolute bottom-32 right-16 animate-orbit" style={{ animationDelay: '2.5s', animationDirection: 'reverse' }}>
            <Hexagon className="w-6 h-6 text-emerald-400 opacity-70 animate-pulse" />
          </div>
        </div>

        {/* Right Side - Auth Form with Heavy Animations */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Form Container with Spectacular Effects */}
            <div className="relative group">
              {/* Multi-layered Glow Effects */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse-glow"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 rounded-3xl blur-xl opacity-30 animate-spin-slow"></div>
              
              {/* Progress Ring */}
              <div className="absolute -inset-1 rounded-3xl">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="0.5"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    strokeDasharray={`${formProgress * 3.01} 301`}
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              {/* Main Form with Heavy Transition Effects */}
              <div className={`relative bg-white/10 backdrop-blur-2xl rounded-3xl p-12 border border-white/20 shadow-2xl transition-all duration-1000 transform ${
                isTransitioning 
                  ? 'scale-90 opacity-60 rotate-1 translate-y-8' 
                  : 'scale-100 opacity-100 rotate-0 translate-y-0'
              }`}>
                {/* Animated Header */}
                <div className="text-center mb-12">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-8 shadow-2xl transition-all duration-1000 transform ${
                    isLogin 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 rotate-0' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 rotate-180'
                  } ${isTransitioning ? 'scale-75 rotate-360' : 'scale-100'}`}>
                    <div className={`transition-all duration-700 ${isTransitioning ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}`}>
                      {isLogin ? (
                        <User className="w-12 h-12 text-white animate-bounce-subtle" />
                      ) : (
                        <Rocket className="w-12 h-12 text-white animate-bounce-subtle" />
                      )}
                    </div>
                  </div>
                  <h3 className={`text-5xl font-bold text-white mb-4 transition-all duration-700 ${
                    isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                  }`}>
                    {isLogin ? 'Welcome Back' : 'Join Us Today'}
                  </h3>
                  <p className={`text-gray-300 text-xl transition-all duration-700 ${
                    isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                  }`} style={{ transitionDelay: '0.1s' }}>
                    {isLogin 
                      ? 'Sign in to access your professional dashboard' 
                      : 'Create an account to start building amazing invoices'
                    }
                  </p>
                </div>

                {/* Error Message with Animation */}
                {error && (
                  <div className="mb-10 p-5 bg-red-500/20 border border-red-500/30 rounded-2xl backdrop-blur-sm animate-shake-heavy">
                    <p className="text-red-200 text-sm text-center font-medium">{error}</p>
                  </div>
                )}

                {/* Form with Heavy Field Animations */}
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Email Field with Spectacular Effects */}
                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-300 mb-4">
                      Email Address
                    </label>
                    <div className="relative">
                      {/* Field Glow Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-lg transition-all duration-500 ${
                        focusedField === 'email' ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                      }`}></div>
                      
                      {/* Typing Animation Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-2xl transition-all duration-300 ${
                        typingAnimation === 'email' ? 'animate-pulse-fast' : ''
                      }`}></div>
                      
                      <Mail className={`absolute left-6 top-1/2 transform -translate-y-1/2 transition-all duration-500 ${
                        focusedField === 'email' 
                          ? 'text-cyan-400 scale-125 animate-bounce-subtle' 
                          : 'text-gray-400 scale-100'
                      }`} size={24} />
                      
                      <input
                        ref={emailRef}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => handleFieldFocus('email')}
                        onBlur={handleFieldBlur}
                        className={`w-full pl-16 pr-6 py-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-400 backdrop-blur-sm transition-all duration-500 text-lg ${
                          focusedField === 'email' ? 'transform scale-105 shadow-2xl' : 'transform scale-100'
                        }`}
                        placeholder="Enter your email"
                        required
                      />
                      
                      {/* Field Success Indicator */}
                      {email && (
                        <CheckCircle className="absolute right-6 top-1/2 transform -translate-y-1/2 text-emerald-400 animate-scale-in" size={20} />
                      )}
                    </div>
                  </div>

                  {/* Password Field with Spectacular Effects */}
                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-300 mb-4">
                      Password
                    </label>
                    <div className="relative">
                      {/* Field Glow Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-lg transition-all duration-500 ${
                        focusedField === 'password' ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                      }`}></div>
                      
                      {/* Typing Animation Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-2xl transition-all duration-300 ${
                        typingAnimation === 'password' ? 'animate-pulse-fast' : ''
                      }`}></div>
                      
                      <Lock className={`absolute left-6 top-1/2 transform -translate-y-1/2 transition-all duration-500 ${
                        focusedField === 'password' 
                          ? 'text-blue-400 scale-125 animate-bounce-subtle' 
                          : 'text-gray-400 scale-100'
                      }`} size={24} />
                      
                      <input
                        ref={passwordRef}
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => handleFieldFocus('password')}
                        onBlur={handleFieldBlur}
                        className={`w-full pl-16 pr-16 py-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400 backdrop-blur-sm transition-all duration-500 text-lg ${
                          focusedField === 'password' ? 'transform scale-105 shadow-2xl' : 'transform scale-100'
                        }`}
                        placeholder="Enter your password"
                        required
                        minLength={6}
                      />
                      
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-300 hover:scale-125"
                      >
                        {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                      </button>
                      
                      {/* Password Strength Indicator */}
                      {password && (
                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-500 ${
                            password.length >= 8 ? 'bg-emerald-400 w-full' :
                            password.length >= 6 ? 'bg-yellow-400 w-2/3' :
                            'bg-red-400 w-1/3'
                          }`}></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Confirm Password with Smooth Reveal Animation */}
                  <div className={`transition-all duration-700 overflow-hidden ${
                    !isLogin ? 'max-h-40 opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform -translate-y-4'
                  }`}>
                    <div className="relative group">
                      <label className="block text-sm font-semibold text-gray-300 mb-4">
                        Confirm Password
                      </label>
                      <div className="relative">
                        {/* Field Glow Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-lg transition-all duration-500 ${
                          focusedField === 'confirmPassword' ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                        }`}></div>
                        
                        {/* Typing Animation Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-2xl transition-all duration-300 ${
                          typingAnimation === 'confirmPassword' ? 'animate-pulse-fast' : ''
                        }`}></div>
                        
                        <Lock className={`absolute left-6 top-1/2 transform -translate-y-1/2 transition-all duration-500 ${
                          focusedField === 'confirmPassword' 
                            ? 'text-emerald-400 scale-125 animate-bounce-subtle' 
                            : 'text-gray-400 scale-100'
                        }`} size={24} />
                        
                        <input
                          ref={confirmPasswordRef}
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onFocus={() => handleFieldFocus('confirmPassword')}
                          onBlur={handleFieldBlur}
                          className={`w-full pl-16 pr-6 py-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-400 backdrop-blur-sm transition-all duration-500 text-lg ${
                            focusedField === 'confirmPassword' ? 'transform scale-105 shadow-2xl' : 'transform scale-100'
                          }`}
                          placeholder="Confirm your password"
                          required={!isLogin}
                          minLength={6}
                        />
                        
                        {/* Password Match Indicator */}
                        {confirmPassword && (
                          <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                            {password === confirmPassword ? (
                              <CheckCircle className="text-emerald-400 animate-scale-in" size={20} />
                            ) : (
                              <X className="text-red-400 animate-shake" size={20} />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button with Spectacular Animation */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full group overflow-hidden mt-10"
                  >
                    {/* Button Background Layers */}
                    <div className={`absolute inset-0 rounded-2xl transition-all duration-700 ${
                      isLogin 
                        ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600' 
                        : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600'
                    }`}></div>
                    
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 ${
                      isLogin 
                        ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500' 
                        : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500'
                    }`}></div>
                    
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    
                    {/* Button Content */}
                    <div className="relative px-8 py-5 flex items-center justify-center text-white font-bold text-xl">
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white mr-4"></div>
                          <span className="animate-pulse">{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center group-hover:scale-105 transition-transform duration-300">
                          <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                          <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform duration-300 animate-bounce-subtle" size={24} />
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Toggle Mode with Heavy Animation */}
                  <div className="text-center pt-8">
                    <button
                      type="button"
                      onClick={handleModeSwitch}
                      className="text-gray-300 hover:text-white transition-all duration-500 font-medium group text-xl hover:scale-105 transform"
                    >
                      <span className="group-hover:animate-pulse">
                        {isLogin 
                          ? "Don't have an account? " 
                          : "Already have an account? "
                        }
                      </span>
                      <span className={`transition-all duration-500 group-hover:scale-110 inline-block ${
                        isLogin 
                          ? 'text-emerald-400 group-hover:text-emerald-300' 
                          : 'text-cyan-400 group-hover:text-cyan-300'
                      }`}>
                        {isLogin ? 'Sign up' : 'Sign in'}
                      </span>
                    </button>
                  </div>
                </form>

                {/* Success Indicators for Sign Up with Staggered Animation */}
                {!isLogin && (
                  <div className={`mt-10 space-y-4 transition-all duration-1000 ${
                    isTransitioning ? 'opacity-0 transform translate-y-8 scale-95' : 'opacity-100 transform translate-y-0 scale-100'
                  }`}>
                    {[
                      { icon: <Shield className="w-6 h-6" />, text: "Bank-grade encryption & security", delay: "0s" },
                      { icon: <Zap className="w-6 h-6" />, text: "Real-time sync across all devices", delay: "0.1s" },
                      { icon: <Sparkles className="w-6 h-6" />, text: "Professional templates & customization", delay: "0.2s" }
                    ].map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-center text-sm text-gray-400 group hover:text-gray-300 transition-colors duration-300 animate-fade-in-up"
                        style={{ animationDelay: item.delay }}
                      >
                        <div className="text-emerald-400 mr-4 group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </div>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Text with Animation */}
            <div className="text-center mt-10 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <p className="text-gray-400 text-sm">
                By continuing, you agree to our{' '}
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium hover:underline">
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
        
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(30px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(30px) rotate(-360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes pulse-fast {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes text-wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes text-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes shake-heavy {
          0%, 100% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(-10px) translateY(-5px); }
          75% { transform: translateX(10px) translateY(5px); }
        }
        
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes scan-vertical {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-orbit {
          animation: orbit 20s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-pulse-fast {
          animation: pulse-fast 0.5s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animate-text-wave {
          animation: text-wave 3s ease-in-out infinite;
        }
        
        .animate-text-shimmer {
          background: linear-gradient(90deg, #ffffff, #06b6d4, #3b82f6, #ffffff);
          background-size: 400% 100%;
          animation: text-shimmer 3s ease-in-out infinite;
          -webkit-background-clip: text;
          background-clip: text;
        }
        
        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-shake-heavy {
          animation: shake-heavy 0.6s ease-in-out;
        }
        
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        
        .animate-scan-vertical {
          animation: scan-vertical 4s linear infinite;
        }
        
        .rotate-360 {
          transform: rotate(360deg);
        }
      `}</style>
    </div>
  );
};

export default AuthPage;