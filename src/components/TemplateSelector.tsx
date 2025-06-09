import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles, Zap, ArrowRight, Star, Crown, Palette, Code, Briefcase, Heart, Rocket, Cpu, Clock, Brush, Shield, Coffee, Camera, Music, Gamepad2, Plane, Mountain, Waves, Sun, Moon, Flower, Diamond, Flame, Snowflake, TreePine, Compass, Globe, Telescope, Feather, Gem, Lightbulb, Target, Wand2, Eye, Aperture, Focus, Image, Layers, Pen as Lens, Frame, Play, Pause } from 'lucide-react';
import { useInvoice } from '../context/InvoiceContext';
import { TemplateType } from '../types';

const templates: (TemplateType & { 
  icon: React.ReactNode; 
  gradient: string; 
  category: string;
  features: string[];
  popular?: boolean;
  premium?: boolean;
  special?: boolean;
})[] = [
  // Original Templates (keeping as is)
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated design with serif typography',
    icon: <Crown className="w-6 h-6" />,
    gradient: 'from-purple-600 via-pink-600 to-red-500',
    category: 'Premium',
    features: ['Serif Typography', 'Luxury Feel', 'Classic Layout'],
    premium: true,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and clean with focus on content',
    icon: <Sparkles className="w-6 h-6" />,
    gradient: 'from-gray-600 via-gray-700 to-gray-800',
    category: 'Clean',
    features: ['Clean Design', 'Content Focus', 'Minimalist'],
    popular: true,
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional layout with business styling',
    icon: <Briefcase className="w-6 h-6" />,
    gradient: 'from-blue-600 via-blue-700 to-indigo-800',
    category: 'Business',
    features: ['Professional', 'Business Style', 'Formal Layout'],
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with two-column layout',
    icon: <Zap className="w-6 h-6" />,
    gradient: 'from-cyan-500 via-blue-500 to-purple-600',
    category: 'Contemporary',
    features: ['Two-Column', 'Modern Style', 'Clean Lines'],
    popular: true,
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Modern design with unique layout',
    icon: <Palette className="w-6 h-6" />,
    gradient: 'from-pink-500 via-red-500 to-yellow-500',
    category: 'Artistic',
    features: ['Unique Layout', 'Creative Flair', 'Bold Design'],
  },
  {
    id: 'boutique',
    name: 'Boutique',
    description: 'Stylish template with premium feel',
    icon: <Heart className="w-6 h-6" />,
    gradient: 'from-rose-400 via-pink-500 to-purple-600',
    category: 'Luxury',
    features: ['Premium Feel', 'Stylish Design', 'Boutique Style'],
    premium: true,
  },
  {
    id: 'dynamic',
    name: 'Dynamic',
    description: 'Bold design with striking typography',
    icon: <Rocket className="w-6 h-6" />,
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    category: 'Bold',
    features: ['Bold Typography', 'Dynamic Layout', 'Eye-catching'],
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Futuristic design for technology companies',
    icon: <Cpu className="w-6 h-6" />,
    gradient: 'from-green-400 via-blue-500 to-purple-600',
    category: 'Technology',
    features: ['Futuristic', 'Tech Style', 'Modern Grid'],
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Classic retro design with timeless appeal',
    icon: <Clock className="w-6 h-6" />,
    gradient: 'from-amber-600 via-orange-600 to-red-600',
    category: 'Classic',
    features: ['Retro Style', 'Timeless', 'Classic Appeal'],
  },
  {
    id: 'artistic',
    name: 'Artistic',
    description: 'Creative template with artistic flair',
    icon: <Brush className="w-6 h-6" />,
    gradient: 'from-purple-500 via-pink-500 to-red-500',
    category: 'Creative',
    features: ['Artistic Flair', 'Creative Layout', 'Unique Style'],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Executive-level design for formal business',
    icon: <Shield className="w-6 h-6" />,
    gradient: 'from-slate-600 via-gray-700 to-zinc-800',
    category: 'Executive',
    features: ['Executive Level', 'Formal Business', 'Professional'],
    premium: true,
  },
  {
    id: 'startup',
    name: 'Startup',
    description: 'Modern casual design for new businesses',
    icon: <Coffee className="w-6 h-6" />,
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    category: 'Modern',
    features: ['Modern Casual', 'Startup Friendly', 'Fresh Design'],
    popular: true,
  },

  // SPECIAL UNIQUE TEMPLATES - Completely different designs
  {
    id: 'photography',
    name: 'Photography',
    description: 'Visual-focused design for creative professionals',
    icon: <Camera className="w-6 h-6" />,
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    category: 'Creative',
    features: ['Visual Focus', 'Portfolio Style', 'Image-Centric'],
    popular: true,
    special: true,
  },
  {
    id: 'innovation',
    name: 'Innovation',
    description: 'Forward-thinking design for innovative companies',
    icon: <Lightbulb className="w-6 h-6" />,
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    category: 'Innovation',
    features: ['Forward Thinking', 'Innovative', 'Bright Ideas'],
    popular: true,
    special: true,
  },

  // OTHER CREATIVE TEMPLATES
  {
    id: 'lunar',
    name: 'Lunar',
    description: 'Mysterious design with cool moonlight tones',
    icon: <Moon className="w-6 h-6" />,
    gradient: 'from-slate-400 via-blue-500 to-indigo-600',
    category: 'Mysterious',
    features: ['Cool Tones', 'Mysterious', 'Night Theme'],
    premium: true,
  },
  {
    id: 'crystal',
    name: 'Crystal',
    description: 'Luxurious design with crystalline elements',
    icon: <Diamond className="w-6 h-6" />,
    gradient: 'from-purple-400 via-pink-500 to-rose-500',
    category: 'Luxury',
    features: ['Crystalline', 'Luxury Feel', 'Prismatic Colors'],
    premium: true,
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    description: 'Space-inspired design with stellar elements',
    icon: <Telescope className="w-6 h-6" />,
    gradient: 'from-indigo-600 via-purple-600 to-pink-600',
    category: 'Space',
    features: ['Space Theme', 'Stellar Design', 'Cosmic Elements'],
    premium: true,
  },
  {
    id: 'gem',
    name: 'Gem',
    description: 'Precious design with gemstone brilliance',
    icon: <Gem className="w-6 h-6" />,
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    category: 'Precious',
    features: ['Gemstone Theme', 'Brilliant Colors', 'Precious Feel'],
    premium: true,
  },
  {
    id: 'magic',
    name: 'Magic',
    description: 'Enchanting design with mystical elements',
    icon: <Wand2 className="w-6 h-6" />,
    gradient: 'from-purple-500 via-violet-500 to-fuchsia-500',
    category: 'Mystical',
    features: ['Enchanting', 'Mystical Elements', 'Magic Touch'],
    premium: true,
  },
  {
    id: 'music',
    name: 'Music',
    description: 'Rhythmic design for entertainment industry',
    icon: <Music className="w-6 h-6" />,
    gradient: 'from-violet-500 via-fuchsia-500 to-pink-500',
    category: 'Entertainment',
    features: ['Rhythmic Layout', 'Creative Flow', 'Entertainment Style'],
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'High-energy design for gaming companies',
    icon: <Gamepad2 className="w-6 h-6" />,
    gradient: 'from-green-500 via-cyan-500 to-blue-500',
    category: 'Gaming',
    features: ['High Energy', 'Gaming Aesthetic', 'Bold Colors'],
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Adventure-inspired design for travel businesses',
    icon: <Plane className="w-6 h-6" />,
    gradient: 'from-sky-400 via-blue-500 to-indigo-600',
    category: 'Travel',
    features: ['Adventure Theme', 'Global Appeal', 'Journey Style'],
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Organic design inspired by natural elements',
    icon: <TreePine className="w-6 h-6" />,
    gradient: 'from-green-600 via-emerald-500 to-teal-500',
    category: 'Organic',
    features: ['Natural Elements', 'Eco-Friendly', 'Organic Flow'],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Fluid design with oceanic color palette',
    icon: <Waves className="w-6 h-6" />,
    gradient: 'from-blue-400 via-cyan-500 to-teal-600',
    category: 'Fluid',
    features: ['Oceanic Colors', 'Fluid Motion', 'Calming Design'],
  },
  {
    id: 'solar',
    name: 'Solar',
    description: 'Bright and energetic design with warm tones',
    icon: <Sun className="w-6 h-6" />,
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    category: 'Energy',
    features: ['Warm Tones', 'Energetic', 'Bright Design'],
  },
  {
    id: 'botanical',
    name: 'Botanical',
    description: 'Fresh design inspired by botanical gardens',
    icon: <Flower className="w-6 h-6" />,
    gradient: 'from-pink-400 via-rose-500 to-red-500',
    category: 'Fresh',
    features: ['Botanical Theme', 'Fresh Colors', 'Garden Style'],
  },
  {
    id: 'fire',
    name: 'Fire',
    description: 'Passionate design with fiery energy',
    icon: <Flame className="w-6 h-6" />,
    gradient: 'from-red-500 via-orange-500 to-yellow-500',
    category: 'Passionate',
    features: ['Fiery Energy', 'Passionate', 'Dynamic Heat'],
  },
  {
    id: 'frost',
    name: 'Frost',
    description: 'Cool and crisp design with icy elegance',
    icon: <Snowflake className="w-6 h-6" />,
    gradient: 'from-blue-200 via-cyan-300 to-teal-400',
    category: 'Cool',
    features: ['Icy Elegance', 'Cool Crisp', 'Winter Theme'],
  },
  {
    id: 'mountain',
    name: 'Mountain',
    description: 'Strong and stable design inspired by peaks',
    icon: <Mountain className="w-6 h-6" />,
    gradient: 'from-gray-500 via-slate-600 to-zinc-700',
    category: 'Strong',
    features: ['Mountain Theme', 'Strong Stable', 'Peak Design'],
  },
  {
    id: 'compass',
    name: 'Compass',
    description: 'Navigation-inspired design for guidance',
    icon: <Compass className="w-6 h-6" />,
    gradient: 'from-amber-500 via-yellow-500 to-orange-500',
    category: 'Navigation',
    features: ['Navigation Theme', 'Guidance Style', 'Direction Focus'],
  },
  {
    id: 'global',
    name: 'Global',
    description: 'International design for worldwide businesses',
    icon: <Globe className="w-6 h-6" />,
    gradient: 'from-blue-500 via-green-500 to-teal-500',
    category: 'International',
    features: ['Global Appeal', 'International', 'Worldwide Style'],
  },
  {
    id: 'feather',
    name: 'Feather',
    description: 'Light and airy design with delicate touches',
    icon: <Feather className="w-6 h-6" />,
    gradient: 'from-gray-300 via-slate-400 to-gray-500',
    category: 'Delicate',
    features: ['Light Airy', 'Delicate Touch', 'Soft Design'],
  },
  {
    id: 'target',
    name: 'Target',
    description: 'Goal-oriented design for focused businesses',
    icon: <Target className="w-6 h-6" />,
    gradient: 'from-red-500 via-pink-500 to-rose-500',
    category: 'Focused',
    features: ['Goal Oriented', 'Focused Design', 'Target Driven'],
  },
];

const TemplateSelector: React.FC = () => {
  const navigate = useNavigate();
  const { createInvoice, updateInvoiceField, currentInvoice } = useInvoice();
  
  const handleTemplateSelect = (templateId: string) => {
    if (!currentInvoice) {
      createInvoice();
      setTimeout(() => {
        updateInvoiceField('template', templateId);
        navigate('/create');
      }, 0);
    } else {
      updateInvoiceField('template', templateId);
      navigate('/create');
    }
  };

  const popularTemplates = templates.filter(t => t.popular);
  const premiumTemplates = templates.filter(t => t.premium);
  const specialTemplates = templates.filter(t => t.special);
  const creativeTemplates = templates.filter(t => 
    ['Creative', 'Entertainment', 'Gaming', 'Travel', 'Organic', 'Fluid', 'Energy', 'Fresh', 'Passionate', 'Cool', 'Strong', 'Navigation', 'International', 'Delicate', 'Focused'].includes(t.category) && !t.special
  );
  const businessTemplates = templates.filter(t => 
    ['Business', 'Executive', 'Contemporary', 'Clean', 'Artistic', 'Bold', 'Technology', 'Classic', 'Modern', 'Luxury'].includes(t.category) && !t.popular && !t.premium
  );

  // Special Photography Template Card
  const PhotographyCard = ({ template }: { template: typeof templates[0] }) => (
    <div 
      onClick={() => handleTemplateSelect(template.id)}
      className="group relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-4xl transition-all duration-700 cursor-pointer transform hover:-translate-y-4 hover:scale-105 border border-purple-500/30"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-4 left-4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-8 right-8 w-2 h-2 bg-pink-400/50 rounded-full animate-bounce"></div>
      <div className="absolute bottom-8 left-8 w-4 h-4 bg-purple-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Popular Badge */}
      <div className="absolute top-6 right-6 z-10">
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-xl animate-pulse">
          <Star size={14} className="mr-2" />
          Popular
        </span>
      </div>

      {/* Content */}
      <div className="relative p-10 text-white">
        {/* Icon Section */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
          <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <Camera className="w-10 h-10 text-white" />
          </div>
          
          {/* Camera Elements */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:animate-spin">
            <Aperture className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-pink-400/30 rounded-full flex items-center justify-center">
            <Focus className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Template Info */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent">
              Photography
            </h3>
            <div className="flex space-x-2">
              <Eye className="w-6 h-6 text-white/60 group-hover:text-white transition-colors duration-300" />
              <Image className="w-6 h-6 text-white/60 group-hover:text-white transition-colors duration-300" />
              <Layers className="w-6 h-6 text-white/60 group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
          <p className="text-purple-100 text-lg leading-relaxed mb-6">
            Visual-focused design for creative professionals who want to showcase their work with stunning visual appeal
          </p>
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm text-purple-100 border border-white/20">
            <Lens className="w-4 h-4 mr-2" />
            Creative Portfolio
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          {['Visual Focus', 'Portfolio Style', 'Image-Centric'].map((feature, index) => (
            <div key={index} className="flex items-center text-lg text-purple-100">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 mr-4 group-hover:animate-pulse"></div>
              <span className="group-hover:text-white transition-colors duration-300">{feature}</span>
            </div>
          ))}
        </div>

        {/* Visual Elements */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-pink-500/20 to-transparent rounded-tl-full"></div>
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-br-full"></div>
      </div>

      {/* Bottom Gradient Line */}
      <div className="h-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"></div>
    </div>
  );

  // Special Innovation Template Card
  const InnovationCard = ({ template }: { template: typeof templates[0] }) => (
    <div 
      onClick={() => handleTemplateSelect(template.id)}
      className="group relative bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 rounded-3xl overflow-hidden shadow-2xl hover:shadow-4xl transition-all duration-700 cursor-pointer transform hover:-translate-y-4 hover:scale-105 border border-yellow-400/50"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/30 via-amber-300/30 to-orange-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Floating Light Bulbs */}
      <div className="absolute top-6 left-6 w-4 h-4 bg-white/40 rounded-full animate-ping"></div>
      <div className="absolute top-12 right-12 w-3 h-3 bg-yellow-200/60 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-12 left-12 w-5 h-5 bg-orange-200/50 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      {/* Popular Badge */}
      <div className="absolute top-6 right-6 z-10">
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl animate-pulse">
          <Star size={14} className="mr-2" />
          Popular
        </span>
      </div>

      {/* Content */}
      <div className="relative p-10 text-white">
        {/* Icon Section */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>
          <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
            <Lightbulb className="w-10 h-10 text-white animate-pulse" />
          </div>
          
          {/* Innovation Elements */}
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-white/30 rounded-full flex items-center justify-center group-hover:animate-bounce">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-orange-300/40 rounded-full flex items-center justify-center group-hover:animate-spin">
            <Rocket className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Template Info */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent">
              Innovation
            </h3>
            <div className="flex space-x-2">
              <Target className="w-6 h-6 text-white/70 group-hover:text-white transition-colors duration-300" />
              <Cpu className="w-6 h-6 text-white/70 group-hover:text-white transition-colors duration-300" />
              <Rocket className="w-6 h-6 text-white/70 group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
          <p className="text-orange-100 text-lg leading-relaxed mb-6">
            Forward-thinking design for innovative companies that want to showcase their bright ideas and cutting-edge solutions
          </p>
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-orange-100 border border-white/30">
            <Lightbulb className="w-4 h-4 mr-2 animate-pulse" />
            Innovation Hub
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          {['Forward Thinking', 'Innovative', 'Bright Ideas'].map((feature, index) => (
            <div key={index} className="flex items-center text-lg text-orange-100">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 mr-4 group-hover:animate-ping"></div>
              <span className="group-hover:text-white transition-colors duration-300">{feature}</span>
            </div>
          ))}
        </div>

        {/* Visual Elements */}
        <div className="absolute bottom-0 right-0 w-36 h-36 bg-gradient-to-tl from-orange-400/20 to-transparent rounded-tl-full"></div>
        <div className="absolute top-0 left-0 w-28 h-28 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-br-full"></div>
        
        {/* Animated Rays */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform rotate-45 animate-spin" style={{ animationDuration: '8s' }}></div>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div className="h-2 bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"></div>
    </div>
  );

  // Regular Template Card
  const TemplateCard = ({ template }: { template: typeof templates[0] }) => (
    <div 
      onClick={() => handleTemplateSelect(template.id)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-105 border border-gray-100"
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      {/* Premium/Popular Badge */}
      {(template.premium || template.popular) && (
        <div className="absolute top-4 right-4 z-10">
          {template.premium && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
              <Crown size={12} className="mr-1" />
              Premium
            </span>
          )}
          {template.popular && !template.premium && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg">
              <Star size={12} className="mr-1" />
              Popular
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative p-8">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${template.gradient} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {template.icon}
        </div>

        {/* Template Info */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-900 group-hover:to-gray-600 transition-all duration-300">
              {template.name}
            </h3>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {template.description}
          </p>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 group-hover:bg-gray-200 transition-colors duration-300">
            {template.category}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          {template.features.map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-gray-500">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${template.gradient} mr-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>

      {/* Bottom Gradient Line */}
      <div className={`h-1 bg-gradient-to-r ${template.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
            <h1 className="relative text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
              Choose Your Perfect Template
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Select from our expanded collection of professionally designed invoice templates. 
            Each template is uniquely crafted to make your business stand out with stunning visual appeal.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{templates.length}</div>
              <div className="text-sm text-gray-500">Templates</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{premiumTemplates.length}</div>
              <div className="text-sm text-gray-500">Premium</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{popularTemplates.length}</div>
              <div className="text-sm text-gray-500">Popular</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">{creativeTemplates.length}</div>
              <div className="text-sm text-gray-500">Creative</div>
            </div>
          </div>
        </div>

        {/* Special Featured Templates */}
        {specialTemplates.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center mb-12">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-gray-900">Featured Showcase</h2>
                  <p className="text-gray-600">Completely unique designs with stunning visual appeal</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {specialTemplates.map((template) => (
                template.id === 'photography' ? (
                  <PhotographyCard key={template.id} template={template} />
                ) : template.id === 'innovation' ? (
                  <InnovationCard key={template.id} template={template} />
                ) : (
                  <TemplateCard key={template.id} template={template} />
                )
              ))}
            </div>
          </div>
        )}

        {/* Popular Templates */}
        {popularTemplates.filter(t => !t.special).length > 0 && (
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Popular Templates</h2>
                  <p className="text-gray-600">Most loved by our users</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {popularTemplates.filter(t => !t.special).map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        )}

        {/* Premium Templates */}
        {premiumTemplates.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center mr-4">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Premium Collection</h2>
                  <p className="text-gray-600">Exclusive designs for professional businesses</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {premiumTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        )}

        {/* Creative Templates */}
        {creativeTemplates.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mr-4">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Creative Collection</h2>
                  <p className="text-gray-600">Unique and artistic designs for creative businesses</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {creativeTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        )}

        {/* Business Templates */}
        {businessTemplates.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mr-4">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Business Templates</h2>
                  <p className="text-gray-600">Professional designs for corporate environments</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {businessTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Can't decide? Start with our most popular template!
              </h3>
              <p className="text-gray-600 mb-6">
                The Minimal template is loved by thousands of businesses worldwide.
              </p>
              <button
                onClick={() => handleTemplateSelect('minimal')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transform shadow-lg hover:shadow-xl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start with Minimal Template
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;