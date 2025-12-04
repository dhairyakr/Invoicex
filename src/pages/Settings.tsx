import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, FileText, Bell, Lock, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ensureUserProfilesExist } from '../lib/supabase';
import ProfileSection from '../components/Settings/ProfileSection';
import BusinessInfoSection from '../components/Settings/BusinessInfoSection';
import InvoiceDefaultsSection from '../components/Settings/InvoiceDefaultsSection';
import NotificationSection from '../components/Settings/NotificationSection';
import SecuritySection from '../components/Settings/SecuritySection';
import PrivacySection from '../components/Settings/PrivacySection';

type Tab = 'profile' | 'business' | 'invoice' | 'notifications' | 'security' | 'privacy';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeProfiles = async () => {
      if (user) {
        await ensureUserProfilesExist(user.id, user.email || '');
        setLoading(false);
      }
    };

    initializeProfiles();
  }, [user]);

  const tabs = [
    { id: 'profile' as Tab, name: 'Profile', icon: User, description: 'Personal information and preferences' },
    { id: 'business' as Tab, name: 'Business Info', icon: Building2, description: 'Company details for invoices' },
    { id: 'invoice' as Tab, name: 'Invoice Defaults', icon: FileText, description: 'Default invoice settings' },
    { id: 'notifications' as Tab, name: 'Notifications', icon: Bell, description: 'Email preferences' },
    { id: 'security' as Tab, name: 'Security', icon: Lock, description: 'Password and account security' },
    { id: 'privacy' as Tab, name: 'Data & Privacy', icon: Shield, description: 'Export and delete data' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 sticky top-8">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-start gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <div className="text-left">
                        <div className={`font-medium ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
                          {tab.name}
                        </div>
                        <div className={`text-xs mt-0.5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              {activeTab === 'profile' && <ProfileSection />}
              {activeTab === 'business' && <BusinessInfoSection />}
              {activeTab === 'invoice' && <InvoiceDefaultsSection />}
              {activeTab === 'notifications' && <NotificationSection />}
              {activeTab === 'security' && <SecuritySection />}
              {activeTab === 'privacy' && <PrivacySection />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
