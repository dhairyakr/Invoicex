import React, { useState, useEffect } from 'react';
import { Save, Upload, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getBusinessProfile, updateBusinessProfile, uploadBusinessLogo } from '../../lib/supabase';

interface BusinessProfile {
  id: string;
  user_id: string;
  business_name: string | null;
  logo_url: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  tax_id: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_routing_number: string | null;
  invoice_footer: string | null;
  email_signature: string | null;
}

const BusinessInfoSection: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data, error } = await getBusinessProfile(user.id);
    if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setSaving(true);
    setMessage(null);

    const { error } = await updateBusinessProfile(user.id, {
      business_name: profile.business_name,
      address_line1: profile.address_line1,
      address_line2: profile.address_line2,
      city: profile.city,
      state: profile.state,
      postal_code: profile.postal_code,
      country: profile.country,
      phone: profile.phone,
      email: profile.email,
      website: profile.website,
      tax_id: profile.tax_id,
      bank_name: profile.bank_name,
      bank_account_number: profile.bank_account_number,
      bank_routing_number: profile.bank_routing_number,
      invoice_footer: profile.invoice_footer,
      email_signature: profile.email_signature,
    });

    setSaving(false);

    if (error) {
      setMessage({ type: 'error', text: error });
    } else {
      setMessage({ type: 'success', text: 'Business information updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 5MB' });
      return;
    }

    setUploading(true);
    setMessage(null);

    const { data: url, error } = await uploadBusinessLogo(user.id, file);

    setUploading(false);

    if (error) {
      setMessage({ type: 'error', text: error });
    } else if (url) {
      setProfile({ ...profile!, logo_url: url });
      setMessage({ type: 'success', text: 'Logo uploaded successfully!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Business Information</h2>
        <p className="text-slate-600 mt-1">Manage your company details that appear on invoices</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Business Logo</label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-lg bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-300">
              {profile.logo_url ? (
                <img src={profile.logo_url} alt="Business Logo" className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-12 h-12 text-slate-400" />
              )}
            </div>
            <label className="cursor-pointer">
              <div className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Upload Logo'}</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
          <p className="text-xs text-slate-500 mt-2">This logo will appear on your invoices. PNG or JPG. Max 5MB.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Business Name</label>
          <input
            type="text"
            value={profile.business_name || ''}
            onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your Company Name"
          />
        </div>

        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Address Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Address Line 1</label>
              <input
                type="text"
                value={profile.address_line1 || ''}
                onChange={(e) => setProfile({ ...profile, address_line1: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Street address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Address Line 2</label>
              <input
                type="text"
                value={profile.address_line2 || ''}
                onChange={(e) => setProfile({ ...profile, address_line2: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Suite, apartment, etc. (optional)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                <input
                  type="text"
                  value={profile.city || ''}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">State/Province</label>
                <input
                  type="text"
                  value={profile.state || ''}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="State"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Postal Code</label>
                <input
                  type="text"
                  value={profile.postal_code || ''}
                  onChange={(e) => setProfile({ ...profile, postal_code: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ZIP/Postal code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                <input
                  type="text"
                  value={profile.country || ''}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Business Email</label>
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contact@business.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
              <input
                type="url"
                value={profile.website || ''}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.business.com"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Tax & Banking Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tax ID / EIN / VAT Number</label>
              <input
                type="text"
                value={profile.tax_id || ''}
                onChange={(e) => setProfile({ ...profile, tax_id: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12-3456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bank Name</label>
              <input
                type="text"
                value={profile.bank_name || ''}
                onChange={(e) => setProfile({ ...profile, bank_name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bank of America"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bank Account Number</label>
              <input
                type="text"
                value={profile.bank_account_number || ''}
                onChange={(e) => setProfile({ ...profile, bank_account_number: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="****1234"
              />
              <p className="text-xs text-slate-500 mt-1">Will be displayed on invoices if enabled</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Routing / SWIFT / IBAN</label>
              <input
                type="text"
                value={profile.bank_routing_number || ''}
                onChange={(e) => setProfile({ ...profile, bank_routing_number: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SWIFT/IBAN code"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Invoice Footer</label>
          <textarea
            value={profile.invoice_footer || ''}
            onChange={(e) => setProfile({ ...profile, invoice_footer: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Thank you for your business! Payment terms and conditions..."
          />
          <p className="text-xs text-slate-500 mt-1">This text will appear at the bottom of your invoices</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Email Signature</label>
          <textarea
            value={profile.email_signature || ''}
            onChange={(e) => setProfile({ ...profile, email_signature: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Best regards,&#10;Your Name&#10;Your Company&#10;email@company.com"
          />
          <p className="text-xs text-slate-500 mt-1">This signature will be used when sending invoice emails</p>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoSection;
