import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles, Zap, ArrowRight, Star, Crown, Palette, Code, Briefcase, Heart, Rocket, Cpu, Clock, Brush, Shield, Coffee, Gem, Layers, Zap as Lightning, Eye, Hexagon, Triangle, Circle, Square, Diamond, Flame, Snowflake, Sun, Moon, Atom, Printer as Prism, Waves } from 'lucide-react';
import { useInvoice } from '../context/InvoiceContext';
import { TemplateType } from '../types';

const templates: (TemplateType & { 
  icon: React.ReactNode; 
  gradient: string; 
  category: string;
  features: string[];
  popular?: boolean;
  premium?: boolean;
  new?: boolean;
  exceptional?: boolean;
})[] = [
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
  // TRULY EXCEPTIONAL NEW TEMPLATES
  {
    id: 'quantum',
    name: 'Quantum',
    description: 'Revolutionary multi-dimensional design with particle effects and quantum-inspired layouts that shift and morph',
    icon: <Hexagon className="w-6 h-6" />,
    gradient: 'from-violet-500 via-purple-500 via-fuchsia-500 via-pink-500 to-rose-500',
    category: 'Revolutionary',
    features: ['Particle Effects', 'Morphing Layouts', 'Quantum Physics Inspired', 'Multi-Dimensional Design', 'Reality-Bending Visuals'],
    exceptional: true,
    new: true,
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Breathtaking northern lights inspired design with flowing gradients, ethereal animations, and celestial beauty',
    icon: <Sun className="w-6 h-6" />,
    gradient: 'from-emerald-400 via-cyan-400 via-blue-500 via-purple-500 via-pink-500 to-rose-400',
    category: 'Celestial',
    features: ['Northern Lights Effect', 'Flowing Gradients', 'Ethereal Animations', 'Celestial Beauty', 'Atmospheric Design'],
    exceptional: true,
    new: true,
  },
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Mind-bending 3D holographic design with futuristic grid patterns, holographic particles, and dimensional depth',
    icon: <Prism className="w-6 h-6" />,
    gradient: 'from-cyan-400 via-blue-500 via-purple-500 via-magenta-500 via-yellow-500 to-green-500',
    category: 'Futuristic',
    features: ['3D Holographic Effects', 'Grid Patterns', 'Dimensional Depth', 'Particle Systems', 'Mind-Bending Visuals'],
    exceptional: true,
    new: true,
  },
  {
    id: 'crystalline',
    name: 'Crystalline',
    description: 'Stunning crystal-inspired design with prismatic effects, crystal formations, and refractive light patterns',
    icon: <Diamond className="w-6 h-6" />,
    gradient: 'from-indigo-500 via-purple-500 via-pink-500 via-blue-500 to-indigo-600',
    category: 'Prismatic',
    features: ['Crystal Formations', 'Prismatic Effects', 'Refractive Patterns', 'Crystalline Beauty', 'Light Refraction'],
    exceptional: true,
    new: true,
  },
  {
    id: 'neon',
    name: 'Neon Cyberpunk',
    description: 'Futuristic cyberpunk design with neon glows, grid backgrounds, scanlines, and electric energy effects',
    icon: <Lightning className="w-6 h-6" />,
    gradient: 'from-cyan-400 via-magenta-500 via-yellow-400 via-green-400 to-blue-500',
    category: 'Cyberpunk',
    features: ['Neon Glows', 'Grid Backgrounds', 'Scanline Effects', 'Electric Energy', 'Cyberpunk Aesthetic'],
    exceptional: true,
    new: true,
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
  const newTemplates = templates.filter(t => t.new);
  const exceptionalTemplates = templates.filter(t => t.exceptional);
  const allTemplates = templates.filter(t => !t.popular && !t.premium && !t.new && !t.exceptional);

  const TemplateCard = ({ template }: { template: typeof templates[0] }) => (
    <div 
      onClick={() => handleTemplateSelect(template.id)}
      className={`group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:-translate-y-3 hover:scale-105 border border-gray-100 ${
        template.exceptional ? 'ring-4 ring-purple-200 ring-opacity-50 hover:ring-purple-300 hover:ring-opacity-70' : ''
      }`}
    >
      {/* Exceptional Template Special Effects */}
      {template.exceptional && (
        <>
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500 via-purple-500 via-fuchsia-500 via-pink-500 to-rose-500 opacity-30 animate-pulse"></div>
          <div className="absolute inset-[3px] rounded-3xl bg-white"></div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute top-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-60"></div>
            <div className="absolute top-8 right-8 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-40"></div>
            <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse opacity-50"></div>
            <div className="absolute bottom-4 right-4 w-1 h-1 bg-fuchsia-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          {/* Template-specific Effects */}
          {template.id === 'aurora' && (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-cyan-400/10 via-blue-500/10 via-purple-500/10 via-pink-500/10 to-rose-400/10 animate-pulse rounded-3xl"></div>
          )}
          
          {template.id === 'quantum' && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 via-fuchsia-500/5 via-pink-500/5 to-rose-500/5 animate-pulse rounded-3xl"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-purple-100/20 to-transparent transform rotate-45 animate-pulse"></div>
            </>
          )}

          {template.id === 'holographic' && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-magenta-500/5 via-yellow-400/5 to-green-400/5 animate-pulse rounded-3xl"></div>
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 0, 255, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
                animation: 'holographicGrid 4s ease-in-out infinite'
              }}></div>
            </>
          )}

          {template.id === 'crystalline' && (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/5 via-purple-400/5 via-pink-400/5 to-blue-400/5 animate-pulse rounded-3xl"></div>
              <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-blue-400/20 to-purple-400/20 transform rotate-45 rounded-sm animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-purple-400/20 to-pink-400/20 transform rotate-12 rounded-sm animate-pulse" style={{ animationDelay: '1s' }}></div>
            </>
          )}

          {template.id === 'neon' && (
            <>
              <div className="absolute inset-0 bg-black/5 rounded-3xl"></div>
              <div className="absolute top-2 left-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-60" style={{ boxShadow: '0 0 10px #00ffff' }}></div>
              <div className="absolute bottom-2 right-2 w-1 h-1 bg-magenta-400 rounded-full animate-ping opacity-60" style={{ boxShadow: '0 0 10px #ff00ff', animationDelay: '0.5s' }}></div>
            </>
          )}
          
          {/* Multi-layer Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[300%] transition-transform duration-1500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/40 to-transparent -skew-x-12 transform translate-x-[-250%] group-hover:translate-x-[350%] transition-transform duration-1700"></div>
        </>
      )}

      {/* Regular Template Effects */}
      {!template.exceptional && (
        <>
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
          
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
        </>
      )}
      
      {/* Premium/Popular/New/Exceptional Badge */}
      {(template.premium || template.popular || template.new || template.exceptional) && (
        <div className="absolute top-4 right-4 z-20">
          {template.exceptional && (
            <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-violet-500 via-purple-500 via-fuchsia-500 to-pink-500 text-white shadow-2xl animate-pulse">
              <Lightning size={14} className="mr-1 animate-bounce" />
              EXCEPTIONAL
            </span>
          )}
          {template.new && !template.exceptional && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-white shadow-lg animate-pulse">
              <Sparkles size={12} className="mr-1" />
              NEW
            </span>
          )}
          {template.premium && !template.new && !template.exceptional && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
              <Crown size={12} className="mr-1" />
              Premium
            </span>
          )}
          {template.popular && !template.premium && !template.new && !template.exceptional && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg">
              <Star size={12} className="mr-1" />
              Popular
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative p-8 z-10">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${template.gradient} text-white mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-500 ${
          template.exceptional ? 'animate-pulse shadow-purple-500/50' : ''
        } ${template.new ? 'animate-pulse' : ''}`}>
          {template.icon}
        </div>

        {/* Template Info */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-2xl font-bold transition-all duration-300 ${
              template.exceptional 
                ? 'bg-gradient-to-r bg-clip-text text-transparent from-violet-600 via-purple-600 via-fuchsia-600 to-pink-600 animate-pulse' 
                : template.new 
                  ? 'bg-gradient-to-r bg-clip-text text-transparent from-emerald-600 to-blue-600' 
                  : 'text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-900 group-hover:to-gray-600'
            }`}>
              {template.name}
            </h3>
            <ArrowRight className={`w-6 h-6 transition-all duration-300 ${
              template.exceptional ? 'text-purple-500 animate-bounce' : 'text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1'
            }`} />
          </div>
          <p className={`text-sm leading-relaxed mb-4 ${
            template.exceptional ? 'text-gray-700 font-medium' : 'text-gray-600'
          }`}>
            {template.description}
          </p>
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-medium transition-colors duration-300 ${
            template.exceptional
              ? 'bg-gradient-to-r from-violet-100 via-purple-100 to-fuchsia-100 text-purple-700 group-hover:from-violet-200 group-hover:via-purple-200 group-hover:to-fuchsia-200'
              : template.new 
                ? 'bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 group-hover:from-emerald-200 group-hover:to-blue-200' 
                : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
          }`}>
            {template.category}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          {template.features.map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-gray-600">
              <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${template.gradient} mr-3 opacity-70 group-hover:opacity-100 transition-opacity duration-300 ${
                template.exceptional ? 'animate-pulse' : template.new ? 'animate-pulse' : ''
              }`}></div>
              <span className={template.exceptional ? 'font-medium text-gray-700' : ''}>{feature}</span>
            </div>
          ))}
        </div>

        {/* Exceptional Template Extra Info */}
        {template.exceptional && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 rounded-2xl border border-purple-100">
            <div className="flex items-center text-xs font-semibold text-purple-700 mb-2">
              <Eye className="w-4 h-4 mr-2" />
              REVOLUTIONARY DESIGN
            </div>
            <p className="text-xs text-purple-600 leading-relaxed">
              This template pushes the boundaries of invoice design with cutting-edge visual effects and innovative layouts.
            </p>
          </div>
        )}

        {/* Hover Effect Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl ${
          template.exceptional ? 'from-purple-500/5 to-pink-500/5' : 'from-white/5 to-transparent'
        }`}></div>
      </div>

      {/* Bottom Gradient Line */}
      <div className={`h-2 bg-gradient-to-r ${template.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${
        template.exceptional ? 'animate-pulse h-3' : template.new ? 'animate-pulse' : ''
      }`}></div>
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
            Select from our collection of professionally designed invoice templates. 
            Each template is crafted to make your business look professional and trustworthy.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{templates.length}</div>
              <div className="text-sm text-gray-500">Templates</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{exceptionalTemplates.length}</div>
              <div className="text-sm text-gray-500">Exceptional</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{premiumTemplates.length}</div>
              <div className="text-sm text-gray-500">Premium</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{popularTemplates.length}</div>
              <div className="text-sm text-gray-500">Popular</div>
            </div>
          </div>
        </div>

        {/* EXCEPTIONAL Templates Section */}
        {exceptionalTemplates.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-center mb-12">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 via-fuchsia-500 to-pink-500 flex items-center justify-center mr-4 animate-pulse shadow-2xl shadow-purple-500/50">
                    <Lightning className="w-8 h-8 text-white animate-bounce" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                      ⚡ EXCEPTIONAL TEMPLATES
                    </h2>
                    <p className="text-gray-600 text-lg">Revolutionary designs that redefine invoice aesthetics</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-violet-100 via-purple-100 via-fuchsia-100 to-pink-100 rounded-2xl p-6 border border-purple-200">
                  <p className="text-purple-800 font-medium text-lg">
                    🌟 These templates feature cutting-edge design elements, particle effects, and revolutionary layouts that will make your invoices truly unforgettable.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {exceptionalTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        )}

        {/* NEW Templates Section */}
        {newTemplates.filter(t => !t.exceptional).length > 0 && (
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 flex items-center justify-center mr-4 animate-pulse">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    ✨ Brand New Templates
                  </h2>
                  <p className="text-gray-600">Just launched - cutting-edge designs</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {newTemplates.filter(t => !t.exceptional).map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        )}

        {/* Popular Templates */}
        {popularTemplates.length > 0 && (
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
              {popularTemplates.map((template) => (
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

        {/* All Templates */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">All Templates</h2>
                <p className="text-gray-600">Complete collection of invoice designs</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {allTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to create something extraordinary?
              </h3>
              <p className="text-gray-600 mb-6">
                Try our revolutionary Quantum template for an unforgettable invoice experience.
              </p>
              <button
                onClick={() => handleTemplateSelect('quantum')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white rounded-xl font-semibold transition-all duration-300 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 hover:scale-105 transform shadow-lg hover:shadow-xl"
              >
                <Lightning className="w-5 h-5 mr-2" />
                Try Quantum Template
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes holographicGrid {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }
      `}</style>
    </div>
  );
};

export default TemplateSelector;