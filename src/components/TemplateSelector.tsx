import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useInvoice } from '../context/InvoiceContext';
import { TemplateType } from '../types';

const templates: TemplateType[] = [
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated design with serif typography',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and clean with focus on content',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional layout with business styling',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with two-column layout',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Modern design with unique layout',
  },
  {
    id: 'boutique',
    name: 'Boutique',
    description: 'Stylish template with premium feel',
  },
  {
    id: 'dynamic',
    name: 'Dynamic',
    description: 'Bold design with striking typography',
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Futuristic design for technology companies',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Classic retro design with timeless appeal',
  },
  {
    id: 'artistic',
    name: 'Artistic',
    description: 'Creative template with artistic flair',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Executive-level design for formal business',
  },
  {
    id: 'startup',
    name: 'Startup',
    description: 'Modern casual design for new businesses',
  },
];

const TemplateSelector: React.FC = () => {
  const navigate = useNavigate();
  const { createInvoice, updateInvoiceField, currentInvoice } = useInvoice();
  
  const handleTemplateSelect = (templateId: string) => {
    if (!currentInvoice) {
      createInvoice();
      // Need to wait for the next tick to ensure currentInvoice is set
      setTimeout(() => {
        updateInvoiceField('template', templateId);
        navigate('/create');
      }, 0);
    } else {
      updateInvoiceField('template', templateId);
      navigate('/create');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Choose a Template</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div 
            key={template.id}
            onClick={() => handleTemplateSelect(template.id)}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition duration-200 cursor-pointer hover:border-blue-400"
          >
            <div className="p-6 flex items-start space-x-4">
              <div className="bg-gray-100 rounded-md p-2">
                <FileText size={24} className="text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                <p className="text-gray-600 text-sm">{template.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;