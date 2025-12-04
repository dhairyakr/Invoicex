import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserPreferences, updateUserPreferences } from '../../lib/supabase';

interface UserPreferences {
  id: string;
  user_id: string;
  default_currency: string;
  default_tax_rate: number;
  default_payment_terms: string;
  default_due_date_days: number;
  invoice_prefix: string;
  invoice_next_number: number;
  auto_save_enabled: boolean;
  show_logo_on_invoice: boolean;
  show_tax_id_on_invoice: boolean;
  show_bank_details_on_invoice: boolean;
}

const InvoiceDefaultsSection: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadPreferences();
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    const { data, error } = await getUserPreferences(user.id);
    if (data) {
      setPreferences(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user || !preferences) return;

    setSaving(true);
    setMessage(null);

    const { error } = await updateUserPreferences(user.id, {
      default_currency: preferences.default_currency,
      default_tax_rate: preferences.default_tax_rate,
      default_payment_terms: preferences.default_payment_terms,
      default_due_date_days: preferences.default_due_date_days,
      invoice_prefix: preferences.invoice_prefix,
      invoice_next_number: preferences.invoice_next_number,
      auto_save_enabled: preferences.auto_save_enabled,
      show_logo_on_invoice: preferences.show_logo_on_invoice,
      show_tax_id_on_invoice: preferences.show_tax_id_on_invoice,
      show_bank_details_on_invoice: preferences.show_bank_details_on_invoice,
    });

    setSaving(false);

    if (error) {
      setMessage({ type: 'error', text: error });
    } else {
      setMessage({ type: 'success', text: 'Invoice defaults updated successfully!' });
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

  if (!preferences) return null;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Invoice Defaults</h2>
        <p className="text-slate-600 mt-1">Set default values for new invoices</p>
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
        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">General Defaults</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Default Currency</label>
                <select
                  value={preferences.default_currency}
                  onChange={(e) => setPreferences({ ...preferences, default_currency: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="CNY">CNY - Chinese Yuan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Default Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={preferences.default_tax_rate}
                  onChange={(e) => setPreferences({ ...preferences, default_tax_rate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Default Payment Terms</label>
              <select
                value={preferences.default_payment_terms}
                onChange={(e) => setPreferences({ ...preferences, default_payment_terms: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Due on Receipt">Due on Receipt</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 60">Net 60</option>
                <option value="Net 90">Net 90</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Default Due Date (Days from Issue)</label>
              <input
                type="number"
                min="0"
                value={preferences.default_due_date_days}
                onChange={(e) => setPreferences({ ...preferences, default_due_date_days: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="30"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Invoice Numbering</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Invoice Prefix</label>
                <input
                  type="text"
                  value={preferences.invoice_prefix}
                  onChange={(e) => setPreferences({ ...preferences, invoice_prefix: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="INV-"
                />
                <p className="text-xs text-slate-500 mt-1">Example: INV-1000</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Next Invoice Number</label>
                <input
                  type="number"
                  min="1"
                  value={preferences.invoice_next_number}
                  onChange={(e) => setPreferences({ ...preferences, invoice_next_number: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1000"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-300">
              <p className="text-sm text-slate-600">
                Next invoice will be numbered: <span className="font-mono font-semibold text-slate-900">{preferences.invoice_prefix}{preferences.invoice_next_number}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Display Options</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={preferences.show_logo_on_invoice}
                onChange={(e) => setPreferences({ ...preferences, show_logo_on_invoice: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-slate-900">Show Business Logo on Invoices</div>
                <div className="text-sm text-slate-500">Display your business logo on all invoices</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={preferences.show_tax_id_on_invoice}
                onChange={(e) => setPreferences({ ...preferences, show_tax_id_on_invoice: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-slate-900">Show Tax ID on Invoices</div>
                <div className="text-sm text-slate-500">Display your tax identification number</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={preferences.show_bank_details_on_invoice}
                onChange={(e) => setPreferences({ ...preferences, show_bank_details_on_invoice: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-slate-900">Show Bank Details on Invoices</div>
                <div className="text-sm text-slate-500">Display your bank account information</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={preferences.auto_save_enabled}
                onChange={(e) => setPreferences({ ...preferences, auto_save_enabled: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-slate-900">Enable Auto-Save</div>
                <div className="text-sm text-slate-500">Automatically save changes while editing invoices</div>
              </div>
            </label>
          </div>
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

export default InvoiceDefaultsSection;
