import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Star, Zap, Shield, CheckCircle, User, Globe, Layers, Cpu, Heart, Briefcase, TrendingUp, Award, Rocket, Crown, Gem, Coffee, Palette, Wand2, Flame, CloudLightning as Lightning, Orbit, Atom, Hexagon, Smile, PartyPopper, Gift, Confetti, Music, Gamepad2, Target, Trophy, Lightbulb, Rainbow } from 'lucide-react';
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
  const [easterEggTrigger, setEasterEggTrigger] = useState<string | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [fieldCompletions, setFieldCompletions] = useState<{[key: string]: boolean}>({});
  const [secretSequence, setSecretSequence] = useState<string[]>([]);
  
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const { signIn, signUp } = useAuth();

  // Calculate form completion progress with smooth transitions
  useEffect(() => {
    let progress = 0;
    const emailComplete = email.length > 0;
    const passwordComplete = password.length >= 6;
    const confirmComplete = !isLogin || confirmPassword.length >= 6;
    
    if (emailComplete) progress += 33;
    if (passwordComplete) progress += 33;
    if (confirmComplete) progress += 34;
    
    setFormProgress(progress);
    
    // Update field completions for easter eggs
    setFieldCompletions({
      email: emailComplete,
      password: passwordComplete,
      confirmPassword: confirmComplete
    });
  }, [email, password, confirmPassword, isLogin]);

  // Easter egg triggers
  useEffect(() => {
    // Trigger confetti when form is complete
    if (formProgress === 100 && !confettiActive) {
      setConfettiActive(true);
      setEasterEggTrigger('completion');
      setTimeout(() => {
        setConfettiActive(false);
        setEasterEggTrigger(null);
      }, 3000);
    }
  }, [formProgress, confettiActive]);

  // Secret sequence detection
  useEffect(() => {
    if (secretSequence.length >= 3) {
      const sequence = secretSequence.join('');
      if (sequence.includes('emailpasswordconfirm')) {
        setEasterEggTrigger('secret');
        setTimeout(() => setEasterEggTrigger(null), 2000);
      }
      setSecretSequence([]);
    }
  }, [secretSequence]);

  // Enhanced particles with more variety
  const particles = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    speed: Math.random() * 3 + 1,
    opacity: Math.random() * 0.8 + 0.2,
    type: ['circle', 'star', 'diamond', 'hexagon', 'heart', 'sparkle'][Math.floor(Math.random() * 6)],
    color: ['cyan', 'blue', 'purple', 'pink', 'emerald', 'yellow', 'rose', 'indigo'][Math.floor(Math.random() * 8)],
    rotation: Math.random() * 360,
  }));

  const features = [
    { icon: <Sparkles className="w-6 h-6" />, text: "AI-Powered Smart Templates", color: "from-blue-400 to-cyan-400", delay: "0s" },
    { icon: <Shield className="w-6 h-6" />, text: "Bank-Grade Security Protection", color: "from-emerald-400 to-teal-400", delay: "0.1s" },
    { icon: <Lightning className="w-6 h-6" />, text: "Lightning-Fast Generation", color: "from-yellow-400 to-orange-400", delay: "0.2s" },
    { icon: <Globe className="w-6 h-6" />, text: "Global Currency Support", color: "from-purple-400 to-pink-400", delay: "0.3s" },
    { icon: <TrendingUp className="w-6 h-6" />, text: "Advanced Analytics Dashboard", color: "from-indigo-400 to-blue-400", delay: "0.4s" },
    { icon: <Award className="w-6 h-6" />, text: "Industry-Leading Platform", color: "from-rose-400 to-pink-400", delay: "0.5s" },
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
        // Success easter egg
        setEasterEggTrigger('success');
        setTimeout(() => {
          onSuccess?.();
        }, 1000);
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
    setFieldCompletions({});
    setEasterEggTrigger('modeSwitch');
    
    // Ultra-smooth transition sequence
    setTimeout(() => {
      setIsLogin(!isLogin);
      setTimeout(() => {
        setIsTransitioning(false);
        setEasterEggTrigger(null);
      }, 800);
    }, 400);
  };

  const handleFieldFocus = (field: string) => {
    setFocusedField(field);
    setTypingAnimation(field);
    setSecretSequence(prev => [...prev, field]);
    
    // Easter egg for rapid typing
    const startTime = Date.now();
    const checkTypingSpeed = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 100) {
        setTypingSpeed(prev => prev + 1);
        if (typingSpeed > 10) {
          setEasterEggTrigger('fastTyper');
          setTimeout(() => setEasterEggTrigger(null), 1500);
        }
      }
    };
    
    setTimeout(checkTypingSpeed, 100);
    setTimeout(() => setTypingAnimation(null), 400);
  };

  const handleFieldBlur = () => {
    setFocusedField(null);
  };

  const getParticleClass = (particle: any) => {
    const baseClass = "absolute animate-float-enhanced";
    const colorClass = {
      cyan: "bg-cyan-400",
      blue: "bg-blue-400", 
      purple: "bg-purple-400",
      pink: "bg-pink-400",
      emerald: "bg-emerald-400",
      yellow: "bg-yellow-400",
      rose: "bg-rose-400",
      indigo: "bg-indigo-400"
    }[particle.color];
    
    const shapeClass = {
      circle: "rounded-full",
      star: "rounded-sm rotate-45",
      diamond: "rounded-sm rotate-45 transform",
      hexagon: "rounded-lg",
      heart: "rounded-full",
      sparkle: "rounded-full animate-pulse"
    }[particle.type];

    return `${baseClass} ${colorClass} ${shapeClass}`;
  };

  // Enhanced readability with better contrast
  const getReadableTextClass = (variant: 'primary' | 'secondary' | 'accent' = 'primary') => {
    switch (variant) {
      case 'primary':
        return 'text-white font-semibold drop-shadow-lg';
      case 'secondary':
        return 'text-gray-200 font-medium drop-shadow-md';
      case 'accent':
        return 'text-cyan-200 font-medium drop-shadow-md';
      default:
        return 'text-white font-semibold drop-shadow-lg';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
      {/* Ultra Dynamic Animated Background */}
      <div className="absolute inset-0">
        {/* Primary Massive Gradient Orbs with Enhanced Smoothness */}
        <div className="absolute top-0 left-0 w-[900px] h-[900px] bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse-ultra-smooth"></div>
        <div className="absolute top-1/2 right-0 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20 rounded-full blur-3xl animate-pulse-ultra-smooth" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-[700px] h-[700px] bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse-ultra-smooth" style={{ animationDelay: '2s' }}></div>
        
        {/* Secondary Rotating Orbs with Buttery Smooth Animation */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-yellow-400/15 to-orange-400/15 rounded-full blur-2xl animate-rotate-smooth"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[550px] h-[550px] bg-gradient-to-r from-indigo-400/15 to-purple-400/15 rounded-full blur-2xl animate-rotate-smooth" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Enhanced Floating Particles */}
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
              animationDelay: `${particle.id * 0.03}s`,
              animationDuration: `${particle.speed + 6}s`,
              transform: `rotate(${particle.rotation}deg)`,
            }}
          />
        ))}

        {/* Enhanced Mesh Grid with Better Visibility */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.08%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80 animate-pulse-gentle"></div>
        
        {/* Smooth Scanning Lines */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/8 to-transparent animate-scan-smooth"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/8 to-transparent animate-scan-vertical-smooth"></div>
      </div>

      {/* Confetti Effect for Easter Eggs */}
      {confettiActive && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Easter Egg Notifications */}
      {easterEggTrigger && (
        <div className="fixed top-8 right-8 z-50 animate-bounce-in">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center">
            {easterEggTrigger === 'completion' && (
              <>
                <PartyPopper className="w-6 h-6 mr-3" />
                <span className="font-bold">Form Complete! 🎉</span>
              </>
            )}
            {easterEggTrigger === 'fastTyper' && (
              <>
                <Zap className="w-6 h-6 mr-3" />
                <span className="font-bold">Speed Demon! ⚡</span>
              </>
            )}
            {easterEggTrigger === 'secret' && (
              <>
                <Gift className="w-6 h-6 mr-3" />
                <span className="font-bold">Secret Found! 🎁</span>
              </>
            )}
            {easterEggTrigger === 'success' && (
              <>
                <Trophy className="w-6 h-6 mr-3" />
                <span className="font-bold">Welcome Aboard! 🏆</span>
              </>
            )}
            {easterEggTrigger === 'modeSwitch' && (
              <>
                <Rainbow className="w-6 h-6 mr-3" />
                <span className="font-bold">Smooth Transition! 🌈</span>
              </>
            )}
          </div>
        </div>
      )}

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Enhanced Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative">
          {/* Logo Section with Ultra-Smooth Animation */}
          <div className="mb-20">
            <div className="flex items-center mb-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 rounded-3xl blur-3xl opacity-60 group-hover:opacity-90 transition-all duration-1000 animate-pulse-ultra-smooth"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 rounded-3xl blur-xl opacity-40 animate-rotate-smooth"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 p-8 rounded-3xl shadow-2xl group-hover:scale-110 transition-all duration-1000">
                  <Layers className="w-14 h-14 text-white animate-bounce-ultra-subtle" />
                </div>
              </div>
              <div className="ml-10">
                <h1 className={`text-6xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent animate-text-shimmer-smooth ${getReadableTextClass('primary')}`}>
                  Invoice Beautifier
                </h1>
                <p className={`text-2xl font-medium animate-fade-in-up-smooth ${getReadableTextClass('accent')}`}>
                  Professional Invoice Solutions
                </p>
              </div>
            </div>
            
            <div className={`transition-all duration-1200 ease-out transform ${
              isTransitioning 
                ? 'translate-x-20 opacity-0 scale-95 rotate-1' 
                : 'translate-x-0 opacity-100 scale-100 rotate-0'
            }`}>
              <h2 className={`text-8xl font-bold leading-tight mb-12 ${getReadableTextClass('primary')}`}>
                {isLogin ? (
                  <>
                    <span className="animate-text-wave-smooth">Welcome</span>
                    <br />
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent animate-gradient-x-smooth">
                      Back
                    </span>
                    <br />
                    <span className="animate-text-wave-smooth" style={{ animationDelay: '0.3s' }}>Professional</span>
                  </>
                ) : (
                  <>
                    <span className="animate-text-wave-smooth">Start Your</span>
                    <br />
                    <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x-smooth">
                      Journey
                    </span>
                    <br />
                    <span className="animate-text-wave-smooth" style={{ animationDelay: '0.3s' }}>Today</span>
                  </>
                )}
              </h2>
              <p className={`text-2xl leading-relaxed max-w-2xl animate-fade-in-up-smooth ${getReadableTextClass('secondary')}`} style={{ animationDelay: '0.4s' }}>
                {isLogin 
                  ? "Sign in to access your professional dashboard and continue creating stunning invoices that leave lasting impressions on your clients."
                  : "Join thousands of professionals who trust us with their invoicing needs. Create beautiful, professional invoices that wow your clients in minutes."
                }
              </p>
            </div>
          </div>

          {/* Enhanced Features Grid with Ultra-Smooth Staggered Animations */}
          <div className={`grid grid-cols-2 gap-10 transition-all duration-1200 ease-out transform ${
            isTransitioning 
              ? 'translate-y-20 opacity-0 scale-90' 
              : 'translate-y-0 opacity-100 scale-100'
          }`}>
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group cursor-pointer animate-fade-in-up-smooth"
                style={{ animationDelay: `${0.6 + index * 0.15}s` }}
              >
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/8 to-white/15 rounded-3xl transform scale-0 group-hover:scale-100 transition-all duration-700 ease-out"></div>
                  <div className="relative flex items-center p-8 rounded-3xl bg-white/8 backdrop-blur-xl border border-white/15 group-hover:bg-white/12 group-hover:border-white/25 transition-all duration-700 group-hover:transform group-hover:scale-105 shadow-xl group-hover:shadow-2xl">
                    <div className={`bg-gradient-to-r ${feature.color} p-5 rounded-2xl group-hover:scale-125 transition-all duration-700 shadow-xl group-hover:shadow-2xl animate-pulse-ultra-smooth`} style={{ animationDelay: feature.delay }}>
                      <div className="text-white group-hover:animate-bounce-ultra-subtle">
                        {feature.icon}
                      </div>
                    </div>
                    <span className={`ml-6 text-xl font-semibold group-hover:text-white transition-all duration-500 ${getReadableTextClass('secondary')}`}>
                      {feature.text}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Floating Decorative Elements */}
          <div className="absolute top-40 right-24 animate-orbit-smooth">
            <Star className="w-12 h-12 text-yellow-400 opacity-80 animate-rotate-smooth" />
          </div>
          <div className="absolute bottom-48 right-40 animate-orbit-smooth" style={{ animationDelay: '1s', animationDirection: 'reverse' }}>
            <Heart className="w-10 h-10 text-pink-400 opacity-80 animate-pulse-ultra-smooth" />
          </div>
          <div className="absolute top-1/2 right-12 animate-orbit-smooth" style={{ animationDelay: '2s' }}>
            <Gem className="w-11 h-11 text-purple-400 opacity-80 animate-rotate-smooth" />
          </div>
          <div className="absolute bottom-24 left-24 animate-orbit-smooth" style={{ animationDelay: '0.5s', animationDirection: 'reverse' }}>
            <Crown className="w-10 h-10 text-amber-400 opacity-80 animate-bounce-ultra-subtle" />
          </div>
          <div className="absolute top-24 left-40 animate-orbit-smooth" style={{ animationDelay: '1.5s' }}>
            <Atom className="w-9 h-9 text-cyan-400 opacity-80 animate-spin-ultra-smooth" />
          </div>
          <div className="absolute bottom-40 right-20 animate-orbit-smooth" style={{ animationDelay: '2.5s', animationDirection: 'reverse' }}>
            <Hexagon className="w-8 h-8 text-emerald-400 opacity-80 animate-pulse-gentle" />
          </div>
        </div>

        {/* Right Side - Ultra-Smooth Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-lg">
            {/* Form Container with Spectacular Ultra-Smooth Effects */}
            <div className="relative group">
              {/* Enhanced Multi-layered Glow Effects */}
              <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-3xl blur-3xl opacity-15 group-hover:opacity-30 transition-all duration-1000 animate-pulse-ultra-smooth"></div>
              <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 rounded-3xl blur-2xl opacity-25 animate-rotate-smooth"></div>
              
              {/* Enhanced Progress Ring with Smooth Animation */}
              <div className="absolute -inset-2 rounded-3xl">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="0.8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="url(#progressGradientSmooth)"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeDasharray={`${formProgress * 3.01} 301`}
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-1500 ease-out"
                  />
                  <defs>
                    <linearGradient id="progressGradientSmooth" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              {/* Main Form with Ultra-Smooth Transition Effects */}
              <div className={`relative bg-white/12 backdrop-blur-2xl rounded-3xl p-14 border border-white/25 shadow-2xl transition-all duration-1200 ease-out transform ${
                isTransitioning 
                  ? 'scale-95 opacity-70 rotate-0.5 translate-y-6' 
                  : 'scale-100 opacity-100 rotate-0 translate-y-0'
              }`}>
                {/* Enhanced Animated Header */}
                <div className="text-center mb-14">
                  <div className={`inline-flex items-center justify-center w-28 h-28 rounded-3xl mb-10 shadow-2xl transition-all duration-1200 ease-out transform ${
                    isLogin 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 rotate-0' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 rotate-180'
                  } ${isTransitioning ? 'scale-80 rotate-360' : 'scale-100'}`}>
                    <div className={`transition-all duration-800 ease-out ${isTransitioning ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}`}>
                      {isLogin ? (
                        <User className="w-14 h-14 text-white animate-bounce-ultra-subtle" />
                      ) : (
                        <Rocket className="w-14 h-14 text-white animate-bounce-ultra-subtle" />
                      )}
                    </div>
                  </div>
                  <h3 className={`text-6xl font-bold mb-6 transition-all duration-800 ease-out ${getReadableTextClass('primary')} ${
                    isTransitioning ? 'opacity-0 transform translate-y-6' : 'opacity-100 transform translate-y-0'
                  }`}>
                    {isLogin ? 'Welcome Back' : 'Join Us Today'}
                  </h3>
                  <p className={`text-2xl transition-all duration-800 ease-out ${getReadableTextClass('secondary')} ${
                    isTransitioning ? 'opacity-0 transform translate-y-6' : 'opacity-100 transform translate-y-0'
                  }`} style={{ transitionDelay: '0.1s' }}>
                    {isLogin 
                      ? 'Sign in to access your professional dashboard' 
                      : 'Create an account to start building amazing invoices'
                    }
                  </p>
                </div>

                {/* Enhanced Error Message */}
                {error && (
                  <div className="mb-12 p-6 bg-red-500/20 border border-red-500/40 rounded-2xl backdrop-blur-sm animate-shake-ultra-smooth">
                    <p className="text-red-200 text-lg text-center font-semibold">{error}</p>
                  </div>
                )}

                {/* Form with Ultra-Smooth Field Animations and Easter Eggs */}
                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* Email Field with Spectacular Effects and Easter Eggs */}
                  <div className="relative group">
                    <label className={`block text-lg font-semibold mb-4 ${getReadableTextClass('secondary')}`}>
                      Email Address
                    </label>
                    <div className="relative">
                      {/* Enhanced Field Glow Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500/25 to-blue-500/25 rounded-2xl blur-xl transition-all duration-700 ease-out ${
                        focusedField === 'email' ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
                      }`}></div>
                      
                      {/* Easter Egg Typing Animation */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-2xl transition-all duration-500 ${
                        typingAnimation === 'email' ? 'animate-pulse-ultra-fast' : ''
                      }`}></div>
                      
                      {/* Completion Celebration Effect */}
                      {fieldCompletions.email && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-2xl animate-celebration-glow"></div>
                      )}
                      
                      <Mail className={`absolute left-7 top-1/2 transform -translate-y-1/2 transition-all duration-700 ease-out ${
                        focusedField === 'email' 
                          ? 'text-cyan-400 scale-130 animate-bounce-ultra-subtle' 
                          : fieldCompletions.email
                          ? 'text-emerald-400 scale-110'
                          : 'text-gray-400 scale-100'
                      }`} size={26} />
                      
                      <input
                        ref={emailRef}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => handleFieldFocus('email')}
                        onBlur={handleFieldBlur}
                        className={`w-full pl-18 pr-8 py-6 bg-white/12 border border-white/25 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-400 backdrop-blur-sm transition-all duration-700 ease-out text-xl font-medium ${
                          focusedField === 'email' ? 'transform scale-105 shadow-2xl' : 'transform scale-100'
                        } ${fieldCompletions.email ? 'border-emerald-400/50' : ''}`}
                        placeholder="Enter your email address"
                        required
                      />
                      
                      {/* Enhanced Success Indicator with Animation */}
                      {fieldCompletions.email && (
                        <CheckCircle className="absolute right-7 top-1/2 transform -translate-y-1/2 text-emerald-400 animate-scale-in-bounce" size={24} />
                      )}
                    </div>
                  </div>

                  {/* Password Field with Enhanced Effects and Easter Eggs */}
                  <div className="relative group">
                    <label className={`block text-lg font-semibold mb-4 ${getReadableTextClass('secondary')}`}>
                      Password
                    </label>
                    <div className="relative">
                      {/* Enhanced Field Glow Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/25 to-indigo-500/25 rounded-2xl blur-xl transition-all duration-700 ease-out ${
                        focusedField === 'password' ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
                      }`}></div>
                      
                      {/* Easter Egg Typing Animation */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-blue-400/15 to-indigo-400/15 rounded-2xl transition-all duration-500 ${
                        typingAnimation === 'password' ? 'animate-pulse-ultra-fast' : ''
                      }`}></div>
                      
                      {/* Completion Celebration Effect */}
                      {fieldCompletions.password && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-2xl animate-celebration-glow"></div>
                      )}
                      
                      <Lock className={`absolute left-7 top-1/2 transform -translate-y-1/2 transition-all duration-700 ease-out ${
                        focusedField === 'password' 
                          ? 'text-blue-400 scale-130 animate-bounce-ultra-subtle' 
                          : fieldCompletions.password
                          ? 'text-emerald-400 scale-110'
                          : 'text-gray-400 scale-100'
                      }`} size={26} />
                      
                      <input
                        ref={passwordRef}
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => handleFieldFocus('password')}
                        onBlur={handleFieldBlur}
                        className={`w-full pl-18 pr-18 py-6 bg-white/12 border border-white/25 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400 backdrop-blur-sm transition-all duration-700 ease-out text-xl font-medium ${
                          focusedField === 'password' ? 'transform scale-105 shadow-2xl' : 'transform scale-100'
                        } ${fieldCompletions.password ? 'border-emerald-400/50' : ''}`}
                        placeholder="Enter your password"
                        required
                        minLength={6}
                      />
                      
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-7 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-500 hover:scale-125"
                      >
                        {showPassword ? <EyeOff size={26} /> : <Eye size={26} />}
                      </button>
                      
                      {/* Enhanced Password Strength Indicator */}
                      {password && (
                        <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                          <div className={`h-full transition-all duration-1000 ease-out ${
                            password.length >= 8 ? 'bg-gradient-to-r from-emerald-400 to-teal-400 w-full' :
                            password.length >= 6 ? 'bg-gradient-to-r from-yellow-400 to-orange-400 w-2/3' :
                            'bg-gradient-to-r from-red-400 to-pink-400 w-1/3'
                          }`}></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Confirm Password with Ultra-Smooth Reveal Animation */}
                  <div className={`transition-all duration-1000 ease-out overflow-hidden ${
                    !isLogin ? 'max-h-48 opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform -translate-y-6'
                  }`}>
                    <div className="relative group">
                      <label className={`block text-lg font-semibold mb-4 ${getReadableTextClass('secondary')}`}>
                        Confirm Password
                      </label>
                      <div className="relative">
                        {/* Enhanced Field Glow Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500/25 to-teal-500/25 rounded-2xl blur-xl transition-all duration-700 ease-out ${
                          focusedField === 'confirmPassword' ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
                        }`}></div>
                        
                        {/* Easter Egg Typing Animation */}
                        <div className={`absolute inset-0 bg-gradient-to-r from-emerald-400/15 to-teal-400/15 rounded-2xl transition-all duration-500 ${
                          typingAnimation === 'confirmPassword' ? 'animate-pulse-ultra-fast' : ''
                        }`}></div>
                        
                        {/* Completion Celebration Effect */}
                        {fieldCompletions.confirmPassword && password === confirmPassword && (
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-2xl animate-celebration-glow"></div>
                        )}
                        
                        <Lock className={`absolute left-7 top-1/2 transform -translate-y-1/2 transition-all duration-700 ease-out ${
                          focusedField === 'confirmPassword' 
                            ? 'text-emerald-400 scale-130 animate-bounce-ultra-subtle' 
                            : fieldCompletions.confirmPassword && password === confirmPassword
                            ? 'text-emerald-400 scale-110'
                            : 'text-gray-400 scale-100'
                        }`} size={26} />
                        
                        <input
                          ref={confirmPasswordRef}
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onFocus={() => handleFieldFocus('confirmPassword')}
                          onBlur={handleFieldBlur}
                          className={`w-full pl-18 pr-8 py-6 bg-white/12 border border-white/25 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-400 backdrop-blur-sm transition-all duration-700 ease-out text-xl font-medium ${
                            focusedField === 'confirmPassword' ? 'transform scale-105 shadow-2xl' : 'transform scale-100'
                          } ${fieldCompletions.confirmPassword && password === confirmPassword ? 'border-emerald-400/50' : ''}`}
                          placeholder="Confirm your password"
                          required={!isLogin}
                          minLength={6}
                        />
                        
                        {/* Enhanced Password Match Indicator */}
                        {confirmPassword && (
                          <div className="absolute right-7 top-1/2 transform -translate-y-1/2">
                            {password === confirmPassword ? (
                              <CheckCircle className="text-emerald-400 animate-scale-in-bounce" size={24} />
                            ) : (
                              <X className="text-red-400 animate-shake-gentle" size={24} />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button with Ultra-Spectacular Animation */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full group overflow-hidden mt-12"
                  >
                    {/* Enhanced Button Background Layers */}
                    <div className={`absolute inset-0 rounded-2xl transition-all duration-1000 ease-out ${
                      isLogin 
                        ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600' 
                        : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600'
                    }`}></div>
                    
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out ${
                      isLogin 
                        ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500' 
                        : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500'
                    }`}></div>
                    
                    {/* Enhanced Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1500 ease-out"></div>
                    
                    {/* Button Content with Easter Egg */}
                    <div className="relative px-10 py-6 flex items-center justify-center text-white font-bold text-2xl">
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-5"></div>
                          <span className="animate-pulse">{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center group-hover:scale-105 transition-all duration-500 ease-out">
                          <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                          <ArrowRight className="ml-5 group-hover:translate-x-3 transition-all duration-500 ease-out animate-bounce-ultra-subtle" size={28} />
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Toggle Mode with Ultra-Smooth Animation */}
                  <div className="text-center pt-10">
                    <button
                      type="button"
                      onClick={handleModeSwitch}
                      className={`transition-all duration-700 ease-out font-semibold group text-2xl hover:scale-105 transform ${getReadableTextClass('secondary')}`}
                    >
                      <span className="group-hover:animate-pulse">
                        {isLogin 
                          ? "Don't have an account? " 
                          : "Already have an account? "
                        }
                      </span>
                      <span className={`transition-all duration-700 ease-out group-hover:scale-110 inline-block ${
                        isLogin 
                          ? 'text-emerald-400 group-hover:text-emerald-300' 
                          : 'text-cyan-400 group-hover:text-cyan-300'
                      }`}>
                        {isLogin ? 'Sign up' : 'Sign in'}
                      </span>
                    </button>
                  </div>
                </form>

                {/* Enhanced Success Indicators for Sign Up */}
                {!isLogin && (
                  <div className={`mt-12 space-y-6 transition-all duration-1200 ease-out ${
                    isTransitioning ? 'opacity-0 transform translate-y-10 scale-95' : 'opacity-100 transform translate-y-0 scale-100'
                  }`}>
                    {[
                      { icon: <Shield className="w-7 h-7" />, text: "Military-grade encryption & security", delay: "0s" },
                      { icon: <Zap className="w-7 h-7" />, text: "Real-time sync across all devices", delay: "0.15s" },
                      { icon: <Sparkles className="w-7 h-7" />, text: "Professional templates & customization", delay: "0.3s" }
                    ].map((item, index) => (
                      <div 
                        key={index}
                        className={`flex items-center group hover:text-gray-200 transition-all duration-500 ease-out animate-fade-in-up-smooth ${getReadableTextClass('secondary')}`}
                        style={{ animationDelay: item.delay }}
                      >
                        <div className="text-emerald-400 mr-5 group-hover:scale-125 transition-all duration-500 ease-out">
                          {item.icon}
                        </div>
                        <span className="text-lg">{item.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Bottom Text */}
            <div className="text-center mt-12 animate-fade-in-up-smooth" style={{ animationDelay: '1s' }}>
              <p className={`text-lg ${getReadableTextClass('secondary')}`}>
                By continuing, you agree to our{' '}
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 font-semibold hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 font-semibold hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra-Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes float-enhanced {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33% { transform: translateY(-25px) rotate(120deg) scale(1.1); }
          66% { transform: translateY(-15px) rotate(240deg) scale(0.9); }
        }
        
        @keyframes orbit-smooth {
          0% { transform: rotate(0deg) translateX(40px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
        }
        
        @keyframes pulse-ultra-smooth {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.08); }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        
        @keyframes pulse-ultra-fast {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.9; }
        }
        
        @keyframes rotate-smooth {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-ultra-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes text-wave-smooth {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes text-shimmer-smooth {
          0% { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        
        @keyframes gradient-x-smooth {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-in-up-smooth {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in-bounce {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes shake-gentle {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        
        @keyframes shake-ultra-smooth {
          0%, 100% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(-8px) translateY(-3px); }
          75% { transform: translateX(8px) translateY(3px); }
        }
        
        @keyframes scan-smooth {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes scan-vertical-smooth {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes celebration-glow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        @keyframes bounce-in {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(-90deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes spin-ultra-smooth {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float-enhanced {
          animation: float-enhanced 10s ease-in-out infinite;
        }
        
        .animate-orbit-smooth {
          animation: orbit-smooth 25s linear infinite;
        }
        
        .animate-pulse-ultra-smooth {
          animation: pulse-ultra-smooth 5s ease-in-out infinite;
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }
        
        .animate-pulse-ultra-fast {
          animation: pulse-ultra-fast 0.3s ease-in-out infinite;
        }
        
        .animate-rotate-smooth {
          animation: rotate-smooth 30s linear infinite;
        }
        
        .animate-bounce-ultra-subtle {
          animation: bounce-ultra-subtle 3s ease-in-out infinite;
        }
        
        .animate-text-wave-smooth {
          animation: text-wave-smooth 4s ease-in-out infinite;
        }
        
        .animate-text-shimmer-smooth {
          background: linear-gradient(90deg, #ffffff, #06b6d4, #3b82f6, #6366f1, #ffffff);
          background-size: 500% 100%;
          animation: text-shimmer-smooth 4s ease-in-out infinite;
          -webkit-background-clip: text;
          background-clip: text;
        }
        
        .animate-gradient-x-smooth {
          background-size: 500% 500%;
          animation: gradient-x-smooth 4s ease infinite;
        }
        
        .animate-fade-in-up-smooth {
          animation: fade-in-up-smooth 1s ease-out forwards;
          opacity: 0;
        }
        
        .animate-scale-in-bounce {
          animation: scale-in-bounce 0.5s ease-out;
        }
        
        .animate-shake-gentle {
          animation: shake-gentle 0.4s ease-in-out;
        }
        
        .animate-shake-ultra-smooth {
          animation: shake-ultra-smooth 0.8s ease-in-out;
        }
        
        .animate-scan-smooth {
          animation: scan-smooth 4s linear infinite;
        }
        
        .animate-scan-vertical-smooth {
          animation: scan-vertical-smooth 5s linear infinite;
        }
        
        .animate-celebration-glow {
          animation: celebration-glow 1s ease-in-out infinite;
        }
        
        .animate-confetti {
          animation: confetti linear forwards;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        
        .animate-spin-ultra-smooth {
          animation: spin-ultra-smooth 25s linear infinite;
        }
        
        .rotate-360 {
          transform: rotate(360deg);
        }
        
        .scale-130 {
          transform: scale(1.3);
        }
        
        .scale-80 {
          transform: scale(0.8);
        }
        
        .pl-18 {
          padding-left: 4.5rem;
        }
        
        .pr-18 {
          padding-right: 4.5rem;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;