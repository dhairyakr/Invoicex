import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles, Zap, ArrowRight, Star, Crown, Palette, Code, Briefcase, Heart, Rocket, Cpu, Clock, Brush, Shield, Coffee, Gem, Layers, Zap as Lightning, Eye } from 'lucide-react';
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
    icon: <Crown className="w-8 h-8" />,
    gradient: 'from-purple-600 via-pink-600 to-red-500',
    category: 'Premium',
    features: ['Serif Typography', 'Luxury Feel', 'Classic Layout'],
    premium: true,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and clean with focus on content',
    icon: <Sparkles className="w-8 h-8" />,
    gradient: 'from-gray-600 via-gray-700 to-gray-800',
    category: 'Clean',
    features: ['Clean Design', 'Content Focus', 'Minimalist'],
    popular: true,
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional layout with business styling',
    icon: <Briefcase className="w-8 h-8" />,
    gradient: 'from-blue-600 via-blue-700 to-indigo-800',
    category: 'Business',
    features: ['Professional', 'Business Style', 'Formal Layout'],
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with two-column layout',
    icon: <Zap className="w-8 h-8" />,
    gradient: 'from-cyan-500 via-blue-500 to-purple-600',
    category: 'Contemporary',
    features: ['Two-Column', 'Modern Style', 'Clean Lines'],
    popular: true,
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Modern design with unique layout',
    icon: <Palette className="w-8 h-8" />,
    gradient: 'from-pink-500 via-red-500 to-yellow-500',
    category: 'Artistic',
    features: ['Unique Layout', 'Creative Flair', 'Bold Design'],
  },
  {
    id: 'boutique',
    name: 'Boutique',
    description: 'Stylish template with premium feel',
    icon: <Heart className="w-8 h-8" />,
    gradient: 'from-rose-400 via-pink-500 to-purple-600',
    category: 'Luxury',
    features: ['Premium Feel', 'Stylish Design', 'Boutique Style'],
    premium: true,
  },
  {
    id: 'dynamic',
    name: 'Dynamic',
    description: 'Bold design with striking typography',
    icon: <Rocket className="w-8 h-8" />,
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    category: 'Bold',
    features: ['Bold Typography', 'Dynamic Layout', 'Eye-catching'],
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Futuristic design for technology companies',
    icon: <Cpu className="w-8 h-8" />,
    gradient: 'from-green-400 via-blue-500 to-purple-600',
    category: 'Technology',
    features: ['Futuristic', 'Tech Style', 'Modern Grid'],
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Classic retro design with timeless appeal',
    icon: <Clock className="w-8 h-8" />,
    gradient: 'from-amber-600 via-orange-600 to-red-600',
    category: 'Classic',
    features: ['Retro Style', 'Timeless', 'Classic Appeal'],
  },
  {
    id: 'artistic',
    name: 'Artistic',
    description: 'Creative template with artistic flair',
    icon: <Brush className="w-8 h-8" />,
    gradient: 'from-purple-500 via-pink-500 to-red-500',
    category: 'Creative',
    features: ['Artistic Flair', 'Creative Layout', 'Unique Style'],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Executive-level design for formal business',
    icon: <Shield className="w-8 h-8" />,
    gradient: 'from-slate-600 via-gray-700 to-zinc-800',
    category: 'Executive',
    features: ['Executive Level', 'Formal Business', 'Professional'],
    premium: true,
  },
  {
    id: 'startup',
    name: 'Startup',
    description: 'Modern casual design for new businesses',
    icon: <Coffee className="w-8 h-8" />,
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    category: 'Modern',
    features: ['Modern Casual', 'Startup Friendly', 'Fresh Design'],
    popular: true,
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

  const TemplateCard = ({ template }: { template: typeof templates[0] }) => (
    <div 
      onClick={() => handleTemplateSelect(template.id)}
      className={`group relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 cursor-pointer transform hover:-translate-y-3 hover:scale-105 ring-1 ring-gray-100 hover:ring-blue-300 ${
        template.exceptional ? 'ring-4 ring-purple-200 ring-opacity-50 hover:ring-purple-300 hover:ring-opacity-70' : ''
      }`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
      
      {/* Premium/Popular/New Badge */}
      {(template.premium || template.popular || template.new) && (
        <div className="absolute top-6 right-6 z-20">
          {template.new && (
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-white shadow-lg animate-pulse">
              <Sparkles size={12} className="mr-1" />
              NEW
            </span>
          )}
          {template.premium && !template.new && (
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
              <Crown size={12} className="mr-1" />
              Premium
            </span>
          )}
          {template.popular && !template.premium && !template.new && (
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg">
              <Star size={12} className="mr-1" />
              Popular
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative p-10 z-10">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br ${template.gradient} text-white mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500 ${
          template.new ? 'animate-pulse' : ''
        }`}>
          {template.icon}
        </div>

        {/* Template Info */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-3xl font-bold transition-all duration-300 ${
              template.new 
                ? 'bg-gradient-to-r bg-clip-text text-transparent from-emerald-600 to-blue-600' 
                : 'text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-900 group-hover:to-gray-600'
            }`}>
              {template.name}
            </h3>
            <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-2 transition-all duration-300" />
          </div>
          <p className="text-base text-gray-600 leading-relaxed mb-6">
            {template.description}
          </p>
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
            template.new 
              ? 'bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 group-hover:from-emerald-200 group-hover:to-blue-200' 
              : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
          }`}>
            {template.category}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          {template.features.map((feature, index) => (
            <div key={index} className="flex items-center text-base text-gray-600">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${template.gradient} mr-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300 ${
                template.new ? 'animate-pulse' : ''
              }`}></div>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
      </div>

      {/* Bottom Gradient Line */}
      <div className={`h-2 bg-gradient-to-r ${template.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${
        template.new ? 'animate-pulse' : ''
      }`}></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
            <h1 className="relative text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-900 bg-clip-text text-transparent mb-8">
              Choose Your Perfect <span className="text-blue-600">Invoice Template</span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Select from our collection of professionally designed invoice templates. 
            Each template is crafted to make your business look professional and trustworthy.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{templates.length}</div>
              <div className="text-sm text-gray-500">Templates</div>
            </div>
            <div className="w-px h-16 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600">{premiumTemplates.length}</div>
              <div className="text-sm text-gray-500">Premium Designs</div>
            </div>
            <div className="w-px h-16 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">{popularTemplates.length}</div>
              <div className="text-sm text-gray-500">Popular Choices</div>
            </div>
          </div>
        </div>

        {/* All Templates Section */}
        <div className="mb-20">
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-6 shadow-lg">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-900">Professional Invoice Templates</h2>
                <p className="text-lg text-gray-600">Complete collection of stunning designs for every business</p>
              </div>
            </div>
          </div>
          
          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30"></div>
            <div className="relative bg-white rounded-2xl p-12 shadow-xl border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Ready to create something beautiful?
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Choose any template and start creating professional invoices in minutes.
              </p>
              <button
                onClick={() => handleTemplateSelect('elegant')}
                className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transform shadow-lg hover:shadow-xl"
              >
                <Lightning className="w-6 h-6 mr-3" />
                Start Creating
                <ArrowRight className="w-6 h-6 ml-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;