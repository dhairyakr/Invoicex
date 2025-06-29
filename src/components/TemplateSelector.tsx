import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles, Zap, ArrowRight, Star, Crown, Palette, Code, Briefcase, Heart, Rocket, Cpu, Clock, Brush, Shield, Coffee, Gem, Layers, Zap as Lightning, Eye, Printer } from 'lucide-react';
import { useInvoice } from '../context/InvoiceContext';
import { TemplateType } from '../types';
import { exportToPDF } from '../utils/pdfExport';

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

  const handlePrintTemplate = async (templateId: string) => {
    // Create a temporary invoice with the selected template for printing
    if (!currentInvoice) {
      createInvoice();
      setTimeout(async () => {
        updateInvoiceField('template', templateId);
        // Wait a bit more for the template to be applied
        setTimeout(async () => {
          try {
            await exportToPDF('invoice-preview', `template-${templateId}-preview.pdf`);
          } catch (error) {
            console.error('Error printing template:', error);
            alert('❌ Error generating template preview. Please try again.');
          }
        }, 500);
      }, 100);
    } else {
      // Update current invoice template and print
      const originalTemplate = currentInvoice.template;
      updateInvoiceField('template', templateId);
      
      setTimeout(async () => {
        try {
          await exportToPDF('invoice-preview', `template-${templateId}-preview.pdf`);
          // Restore original template
          updateInvoiceField('template', originalTemplate);
        } catch (error) {
          console.error('Error printing template:', error);
          alert('❌ Error generating template preview. Please try again.');
          // Restore original template on error
          updateInvoiceField('template', originalTemplate);
        }
      }, 500);
    }
  };

  const popularTemplates = templates.filter(t => t.popular);
  const premiumTemplates = templates.filter(t => t.premium);

  const TemplateCard = ({ template }: { template: typeof templates[0] }) => (
    <div className="group relative bg-white/30 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-105 border border-white/40 hover:border-white/60">
      {/* Aero Glass Background with Gradient Tint */}
      <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
      
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 group-hover:from-white/30 group-hover:to-white/20 transition-all duration-500"></div>
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
      
      {/* Soft Glow Border */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${template.gradient} opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-500`}></div>
      
      {/* Premium/Popular/New Badge */}
      {(template.premium || template.popular || template.new) && (
        <div className="absolute top-4 right-4 z-20">
          {template.new && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/40 backdrop-blur-sm text-emerald-700 shadow-lg border border-white/50">
              <Sparkles size={10} className="mr-1" />
              NEW
            </span>
          )}
          {template.premium && !template.new && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/40 backdrop-blur-sm text-yellow-700 shadow-lg border border-white/50">
              <Crown size={10} className="mr-1" />
              Premium
            </span>
          )}
          {template.popular && !template.premium && !template.new && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/40 backdrop-blur-sm text-green-700 shadow-lg border border-white/50">
              <Star size={10} className="mr-1" />
              Popular
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative p-6 z-10">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${template.gradient} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-500 group-hover:shadow-xl`}>
          {template.icon}
        </div>

        {/* Template Info */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2 gap-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300 line-clamp-2 break-words flex-1 min-w-0">
              {template.name}
            </h3>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrintTemplate(template.id);
                }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white/20 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                title="Print Template Preview"
              >
                <Printer size={16} />
              </button>
              <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-gray-700 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-3 line-clamp-3 break-words">
            {template.description}
          </p>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/40 backdrop-blur-sm text-gray-700 border border-white/50">
            {template.category}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          {template.features.map((feature, index) => (
            <div key={index} className="flex items-start text-sm text-gray-700 gap-3">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${template.gradient} opacity-70 group-hover:opacity-100 transition-opacity duration-300 shadow-sm flex-shrink-0 mt-1.5`}></div>
              <span className="break-words leading-relaxed flex-1 min-w-0">{feature}</span>
            </div>
          ))}
        </div>

        {/* Inner Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>

      {/* Bottom Glossy Accent */}
      <div className={`h-1 bg-gradient-to-r ${template.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left opacity-60`}></div>
      
      {/* Click handler for the entire card */}
      <div 
        className="absolute inset-0 z-30 cursor-pointer"
        onClick={() => handleTemplateSelect(template.id)}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/50 via-white/80 to-purple-100/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section with Aero Glass */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-8">
            {/* Soft Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 rounded-3xl blur-2xl"></div>
            
            {/* Glass Container */}
            <div className="relative bg-white/20 backdrop-blur-lg rounded-3xl p-8 border border-white/40 shadow-2xl">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-800 bg-clip-text text-transparent mb-4">
                Choose Your Perfect Template
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                Select from our collection of professionally designed invoice templates
              </p>
            </div>
          </div>
          
          {/* Stats with Glass Effect */}
          <div className="flex justify-center items-center space-x-8">
            <div className="text-center bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/40 shadow-lg">
              <div className="text-3xl font-bold text-blue-700">{templates.length}</div>
              <div className="text-sm text-gray-600">Templates</div>
            </div>
            <div className="w-px h-12 bg-white/40"></div>
            <div className="text-center bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/40 shadow-lg">
              <div className="text-3xl font-bold text-yellow-700">{premiumTemplates.length}</div>
              <div className="text-sm text-gray-600">Premium</div>
            </div>
            <div className="w-px h-12 bg-white/40"></div>
            <div className="text-center bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/40 shadow-lg">
              <div className="text-3xl font-bold text-green-700">{popularTemplates.length}</div>
              <div className="text-sm text-gray-600">Popular</div>
            </div>
          </div>
        </div>

        {/* Templates Section with Aero Glass Header */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/40 shadow-xl">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4 shadow-lg">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-800">Professional Templates</h2>
                  <p className="text-gray-600">Stunning designs with Aero Glass elegance</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>

        {/* Call to Action with Aero Glass */}
        <div className="text-center">
          <div className="relative inline-block">
            {/* Soft Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-2xl blur-xl"></div>
            
            {/* Glass Container */}
            <div className="relative bg-white/25 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/50">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Ready to create something beautiful?
              </h3>
              <p className="text-gray-700 mb-6">
                Choose any template and start creating professional invoices in minutes.
              </p>
              <button
                onClick={() => handleTemplateSelect('elegant')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500/80 to-purple-500/80 backdrop-blur-sm text-white rounded-xl font-semibold transition-all duration-300 hover:from-blue-600/90 hover:to-purple-600/90 hover:scale-105 transform shadow-lg hover:shadow-xl border border-white/30"
              >
                <Lightning className="w-5 h-5 mr-2" />
                Start Creating
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for line-clamp */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }
      `}</style>
    </div>
  );
};

export default TemplateSelector;