import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, MapPin, CreditCard, Calendar, AlertCircle, Clock, FileText, MessageSquare, TrendingUp, Activity } from 'lucide-react';
import { AgingData, RiskAssessment, formatCurrency, formatPercentage, getRiskColor, getRiskBorderColor } from '../../utils/agingAnalytics';

interface CustomerVendorProfileProps {
  isOpen: boolean;
  onClose: () => void;
  data: AgingData;
  type: 'customer' | 'vendor';
  riskAssessment: RiskAssessment;
  onAddNote?: () => void;
  onRecordPayment?: () => void;
  onSendReminder?: () => void;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  date: string;
  user: string;
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  status: string;
  daysOverdue: number;
}

const CustomerVendorProfile: React.FC<CustomerVendorProfileProps> = ({
  isOpen,
  onClose,
  data,
  type,
  riskAssessment,
  onAddNote,
  onRecordPayment,
  onSendReminder
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'activity' | 'notes'>('overview');
  const [activities] = useState<Activity[]>([
    {
      id: '1',
      type: 'email',
      description: 'Payment reminder sent',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      user: 'System'
    },
    {
      id: '2',
      type: 'call',
      description: 'Follow-up call made',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      user: 'John Doe'
    },
    {
      id: '3',
      type: 'note',
      description: 'Customer promised payment by end of week',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      user: 'Jane Smith'
    }
  ]);

  const [invoices] = useState<Invoice[]>([
    {
      id: '1',
      number: 'INV-001',
      date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: data.days90 || 0,
      status: 'overdue',
      daysOverdue: 60
    },
    {
      id: '2',
      number: 'INV-002',
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: data.days60 || 0,
      status: 'overdue',
      daysOverdue: 45
    }
  ].filter(inv => inv.amount > 0));

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const creditLimit = 500000;
  const creditUtilization = (data.total / creditLimit) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>

        <div className="relative z-10 flex flex-col h-full max-h-[90vh]">
          <div className={`p-6 border-b border-gray-200 ${getRiskBorderColor(riskAssessment.rating)} border-l-4`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-gray-900">{data.customer}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(riskAssessment.rating)}`}>
                    {riskAssessment.rating.toUpperCase()} RISK
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  {data.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span>{data.email}</span>
                    </div>
                  )}
                  {data.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      <span>{data.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex border-b border-gray-200 px-6">
            {(['overview', 'invoices', 'activity', 'notes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-semibold text-sm uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-blue-800">Total Outstanding</span>
                      <CreditCard className="text-blue-600" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-blue-900">{formatCurrency(data.total)}</p>
                    <p className="text-xs text-blue-700 mt-1">
                      {data.overdue ? 'Payment overdue' : 'Current'}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-2xl p-6 border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-yellow-800">Overdue Amount</span>
                      <AlertCircle className="text-yellow-600" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-yellow-900">
                      {formatCurrency(data.days30 + data.days60 + data.days90)}
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      {formatPercentage((data.days30 + data.days60 + data.days90) / data.total * 100)} of total
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-green-800">Current Balance</span>
                      <TrendingUp className="text-green-600" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-green-900">{formatCurrency(data.current)}</p>
                    <p className="text-xs text-green-700 mt-1">Not yet due</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Credit Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Credit Limit</p>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(creditLimit)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Available Credit</p>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(creditLimit - data.total)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600 mb-2">Credit Utilization</p>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            creditUtilization > 90 ? 'bg-red-500' :
                            creditUtilization > 75 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(creditUtilization, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-700 mt-1 font-semibold">{formatPercentage(creditUtilization)}</p>
                    </div>
                  </div>
                </div>

                <div className={`rounded-2xl p-6 border-2 ${getRiskBorderColor(riskAssessment.rating)} bg-gradient-to-br ${
                  riskAssessment.rating === 'critical' ? 'from-red-50 to-red-100/50' :
                  riskAssessment.rating === 'high' ? 'from-orange-50 to-orange-100/50' :
                  riskAssessment.rating === 'medium' ? 'from-yellow-50 to-yellow-100/50' :
                  'from-green-50 to-green-100/50'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle size={24} className={riskAssessment.rating === 'critical' ? 'text-red-600' :
                      riskAssessment.rating === 'high' ? 'text-orange-600' :
                      riskAssessment.rating === 'medium' ? 'text-yellow-600' : 'text-green-600'} />
                    <h3 className="text-lg font-bold text-gray-900">Risk Assessment</h3>
                    <span className={`ml-auto px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(riskAssessment.rating)}`}>
                      Score: {riskAssessment.score}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Risk Factors:</p>
                      <ul className="space-y-1">
                        {riskAssessment.factors.map((factor, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-gray-400 mt-1">•</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-3 border-t border-gray-300">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Recommendation:</p>
                      <p className="text-sm text-gray-800">{riskAssessment.recommendation}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Aging Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-sm font-semibold text-gray-700">Current (Not Due)</span>
                      <span className="text-lg font-bold text-green-600">{formatCurrency(data.current)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-sm font-semibold text-gray-700">1-30 Days Overdue</span>
                      <span className="text-lg font-bold text-blue-600">{formatCurrency(data.days30)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-sm font-semibold text-gray-700">31-60 Days Overdue</span>
                      <span className="text-lg font-bold text-yellow-600">{formatCurrency(data.days60)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="text-sm font-semibold text-gray-700">60+ Days Overdue</span>
                      <span className="text-lg font-bold text-red-600">{formatCurrency(data.days90)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Outstanding Invoices</h3>
                  <span className="text-sm text-gray-600">{invoices.length} invoice(s)</span>
                </div>
                {invoices.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText size={48} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600">No outstanding invoices</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-gray-900">{invoice.number}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                invoice.daysOverdue > 60 ? 'bg-red-100 text-red-800' :
                                invoice.daysOverdue > 30 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {invoice.daysOverdue} days overdue
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Issue Date:</span> {new Date(invoice.date).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-medium">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(invoice.amount)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Activity Timeline</h3>
                  <button
                    onClick={onAddNote}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                  >
                    Add Activity
                  </button>
                </div>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'email' ? 'bg-blue-100' :
                          activity.type === 'call' ? 'bg-green-100' :
                          'bg-gray-100'
                        }`}>
                          {activity.type === 'email' && <Mail size={18} className="text-blue-600" />}
                          {activity.type === 'call' && <Phone size={18} className="text-green-600" />}
                          {activity.type === 'note' && <MessageSquare size={18} className="text-gray-600" />}
                        </div>
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-semibold text-gray-900">{activity.description}</p>
                            <span className="text-xs text-gray-500">
                              {new Date(activity.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">By {activity.user}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Notes & Comments</h3>
                  <button
                    onClick={onAddNote}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                  >
                    Add Note
                  </button>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <div className="flex gap-3">
                    <MessageSquare className="text-yellow-600 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-yellow-900 font-medium mb-1">
                        Customer committed to payment by end of week
                      </p>
                      <p className="text-xs text-yellow-700">Added on {new Date().toLocaleDateString()} by John Doe</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3 justify-end">
              <button
                onClick={onSendReminder}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
              >
                <Mail size={18} />
                Send Reminder
              </button>
              <button
                onClick={onRecordPayment}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
              >
                <CreditCard size={18} />
                Record Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerVendorProfile;
