import React, { useState } from 'react';
import { Download, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { exportUserData, deleteUserAccount } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const PrivacySection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exporting, setExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExportData = async () => {
    if (!user) return;

    setExporting(true);
    setMessage(null);

    const { data, error } = await exportUserData(user.id);

    setExporting(false);

    if (error) {
      setMessage({ type: 'error', text: error });
    } else if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Data exported successfully!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || deleteConfirmation !== 'DELETE') return;

    setDeleting(true);
    setMessage(null);

    const { error } = await deleteUserAccount(user.id);

    setDeleting(false);

    if (error) {
      setMessage({ type: 'error', text: error });
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Data & Privacy</h2>
        <p className="text-slate-600 mt-1">Manage your data and account</p>
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
          <h3 className="font-semibold text-slate-900 mb-4">Export Your Data</h3>
          <p className="text-slate-600 text-sm mb-4">
            Download a copy of all your data including your profile, business information, invoices, and products. The data will be exported in JSON format.
          </p>
          <button
            onClick={handleExportData}
            disabled={exporting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'Exporting...' : 'Export Data'}</span>
          </button>
        </div>

        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Data Retention</h3>
          <div className="space-y-3 text-sm text-slate-600">
            <p>
              We retain your data for as long as your account is active. When you delete your account, all your data will be permanently removed from our servers within 30 days.
            </p>
            <p>
              We may retain certain information for legitimate business purposes or as required by law, such as:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Transaction records for tax and accounting purposes</li>
              <li>Legal compliance and dispute resolution</li>
              <li>Fraud prevention and security</li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Privacy Policy</h3>
          <p className="text-slate-600 text-sm mb-4">
            Learn more about how we collect, use, and protect your personal information.
          </p>
          <a
            href="/privacy"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
          >
            Read Privacy Policy
            <span>→</span>
          </a>
        </div>

        <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">Delete Account</h3>
              <p className="text-red-800 text-sm mb-4">
                Once you delete your account, there is no going back. All your data including invoices, products, and business information will be permanently deleted. This action cannot be undone.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Delete Account</h3>
                <p className="text-sm text-slate-600">This action is permanent</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-slate-700 mb-4">
                Are you absolutely sure you want to delete your account? All your data will be permanently removed and cannot be recovered.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800 font-medium mb-2">
                  The following data will be deleted:
                </p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Your profile and business information</li>
                  <li>• All invoices and invoice data</li>
                  <li>• All products and services</li>
                  <li>• All financial reports and records</li>
                  <li>• Account settings and preferences</li>
                </ul>
              </div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type <span className="font-mono font-bold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="DELETE"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'DELETE' || deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleting ? 'Deleting...' : 'Delete Forever'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacySection;
