import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserPreferences, updateUserPreferences } from '../../lib/supabase';

interface NotificationPreferences {
  notification_invoice_sent: boolean;
  notification_invoice_viewed: boolean;
  notification_invoice_paid: boolean;
  notification_payment_received: boolean;
  notification_overdue_reminder: boolean;
  notification_weekly_summary: boolean;
  notification_monthly_report: boolean;
  notification_digest_frequency: string;
}

const NotificationSection: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
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
      setPreferences({
        notification_invoice_sent: data.notification_invoice_sent,
        notification_invoice_viewed: data.notification_invoice_viewed,
        notification_invoice_paid: data.notification_invoice_paid,
        notification_payment_received: data.notification_payment_received,
        notification_overdue_reminder: data.notification_overdue_reminder,
        notification_weekly_summary: data.notification_weekly_summary,
        notification_monthly_report: data.notification_monthly_report,
        notification_digest_frequency: data.notification_digest_frequency,
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user || !preferences) return;

    setSaving(true);
    setMessage(null);

    const { error } = await updateUserPreferences(user.id, preferences);

    setSaving(false);

    if (error) {
      setMessage({ type: 'error', text: error });
    } else {
      setMessage({ type: 'success', text: 'Notification preferences updated successfully!' });
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
        <h2 className="text-2xl font-bold text-slate-900">Notification Preferences</h2>
        <p className="text-slate-600 mt-1">Choose which email notifications you'd like to receive</p>
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
          <h3 className="font-semibold text-slate-900 mb-4">Invoice Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <div className="font-medium text-slate-900">Invoice Sent</div>
                <div className="text-sm text-slate-500">Notify when an invoice is successfully sent to a client</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.notification_invoice_sent}
                onChange={(e) => setPreferences({ ...preferences, notification_invoice_sent: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <div className="font-medium text-slate-900">Invoice Viewed</div>
                <div className="text-sm text-slate-500">Notify when a client opens and views your invoice</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.notification_invoice_viewed}
                onChange={(e) => setPreferences({ ...preferences, notification_invoice_viewed: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <div className="font-medium text-slate-900">Invoice Paid</div>
                <div className="text-sm text-slate-500">Notify when an invoice is marked as paid</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.notification_invoice_paid}
                onChange={(e) => setPreferences({ ...preferences, notification_invoice_paid: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <div className="font-medium text-slate-900">Overdue Reminder</div>
                <div className="text-sm text-slate-500">Notify when an invoice becomes overdue</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.notification_overdue_reminder}
                onChange={(e) => setPreferences({ ...preferences, notification_overdue_reminder: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Payment Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <div className="font-medium text-slate-900">Payment Received</div>
                <div className="text-sm text-slate-500">Notify when a payment is received and recorded</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.notification_payment_received}
                onChange={(e) => setPreferences({ ...preferences, notification_payment_received: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Reports & Summaries</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <div className="font-medium text-slate-900">Weekly Summary</div>
                <div className="text-sm text-slate-500">Receive a weekly summary of your invoices and payments</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.notification_weekly_summary}
                onChange={(e) => setPreferences({ ...preferences, notification_weekly_summary: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <div className="font-medium text-slate-900">Monthly Report</div>
                <div className="text-sm text-slate-500">Receive a comprehensive monthly financial report</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.notification_monthly_report}
                onChange={(e) => setPreferences({ ...preferences, notification_monthly_report: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Email Digest Frequency</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="radio"
                name="digest_frequency"
                value="instant"
                checked={preferences.notification_digest_frequency === 'instant'}
                onChange={(e) => setPreferences({ ...preferences, notification_digest_frequency: e.target.value })}
                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-slate-900">Instant</div>
                <div className="text-sm text-slate-500">Receive emails immediately when events occur</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="radio"
                name="digest_frequency"
                value="daily"
                checked={preferences.notification_digest_frequency === 'daily'}
                onChange={(e) => setPreferences({ ...preferences, notification_digest_frequency: e.target.value })}
                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-slate-900">Daily Digest</div>
                <div className="text-sm text-slate-500">Receive a single email each day with all notifications</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="radio"
                name="digest_frequency"
                value="weekly"
                checked={preferences.notification_digest_frequency === 'weekly'}
                onChange={(e) => setPreferences({ ...preferences, notification_digest_frequency: e.target.value })}
                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-slate-900">Weekly Digest</div>
                <div className="text-sm text-slate-500">Receive a single email each week with all notifications</div>
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

export default NotificationSection;
