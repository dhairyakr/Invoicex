import React, { useState } from 'react';
import { X, Mail, Send, FileText, AlertCircle } from 'lucide-react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  customerEmail?: string;
  totalOutstanding: number;
  daysOverdue: number;
  onSend: (reminderData: ReminderData) => void;
}

export interface ReminderData {
  templateType: string;
  subject: string;
  message: string;
  includeStatement: boolean;
}

const templates = {
  friendly: {
    subject: 'Payment Reminder - Invoice Due',
    message: `Dear {customerName},

This is a friendly reminder that you have an outstanding balance of {amount} with us.

We understand that oversights can happen, and we wanted to bring this to your attention. If you have already made the payment, please disregard this message.

If you have any questions or concerns regarding this invoice, please don't hesitate to reach out to us.

Thank you for your prompt attention to this matter.

Best regards,`
  },
  firm: {
    subject: 'Important: Outstanding Payment Required',
    message: `Dear {customerName},

We are writing to inform you that your account has an overdue balance of {amount}, which is now {daysOverdue} days past due.

We kindly request that you settle this amount at your earliest convenience. If there are any issues preventing payment, please contact us immediately to discuss payment arrangements.

Failure to respond may result in further action, including suspension of services and additional fees.

We value your business and hope to resolve this matter promptly.

Sincerely,`
  },
  final: {
    subject: 'URGENT: Final Notice - Immediate Action Required',
    message: `Dear {customerName},

This is a FINAL NOTICE regarding your seriously overdue account balance of {amount}, which has been outstanding for {daysOverdue} days.

IMMEDIATE PAYMENT IS REQUIRED to avoid:
- Account suspension
- Legal proceedings
- Additional collection fees
- Credit reporting

Please contact us within 48 hours to resolve this matter. If we do not hear from you, we will have no choice but to proceed with collection procedures.

We strongly urge you to take action immediately.

Urgent regards,`
  },
  legal: {
    subject: 'Legal Notice - Debt Collection Proceedings',
    message: `Dear {customerName},

Re: Outstanding Debt of {amount}

This letter serves as formal notice that your account is {daysOverdue} days overdue and legal action is being considered.

You have 7 days from the date of this letter to:
1. Pay the full outstanding amount of {amount}, OR
2. Contact us to arrange an acceptable payment plan

Failure to respond will result in:
- Referral to our legal department
- Court proceedings for debt recovery
- Additional legal costs added to your balance
- Negative impact on your credit rating

This is a serious matter. Please treat it with appropriate urgency.

Legal Department,`
  }
};

const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  customerName,
  customerEmail,
  totalOutstanding,
  daysOverdue,
  onSend
}) => {
  const [templateType, setTemplateType] = useState<keyof typeof templates>('friendly');
  const [subject, setSubject] = useState(templates.friendly.subject);
  const [message, setMessage] = useState(templates.friendly.message);
  const [includeStatement, setIncludeStatement] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleTemplateChange = (newTemplate: keyof typeof templates) => {
    setTemplateType(newTemplate);
    setSubject(templates[newTemplate].subject);
    setMessage(templates[newTemplate].message);
  };

  const getPreviewMessage = () => {
    return message
      .replace('{customerName}', customerName)
      .replace('{amount}', formatCurrency(totalOutstanding))
      .replace('{daysOverdue}', daysOverdue.toString());
  };

  const handleSend = async () => {
    setIsSending(true);

    const reminderData: ReminderData = {
      templateType,
      subject,
      message: getPreviewMessage(),
      includeStatement
    };

    await onSend(reminderData);
    setIsSending(false);
    onClose();
  };

  const getSeverityColor = (template: keyof typeof templates) => {
    const colors = {
      friendly: 'from-blue-50 to-blue-100',
      firm: 'from-yellow-50 to-yellow-100',
      final: 'from-orange-50 to-orange-100',
      legal: 'from-red-50 to-red-100'
    };
    return colors[template];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>

        <div className="relative z-10 flex flex-col h-full max-h-[90vh]">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Send Payment Reminder</h2>
                <p className="text-sm text-gray-600">To: {customerName} {customerEmail && `(${customerEmail})`}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-4 border border-red-200">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
                <div>
                  <p className="text-sm font-semibold text-red-900">Outstanding Balance: {formatCurrency(totalOutstanding)}</p>
                  <p className="text-xs text-red-700">Overdue by {daysOverdue} days</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Select Template</label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(templates) as Array<keyof typeof templates>).map((template) => (
                  <button
                    key={template}
                    onClick={() => handleTemplateChange(template)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      templateType === template
                        ? 'border-blue-500 bg-gradient-to-br ' + getSeverityColor(template)
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <p className="font-bold text-gray-900 capitalize mb-1">{template} Reminder</p>
                    <p className="text-xs text-gray-600">
                      {template === 'friendly' && 'Polite first reminder'}
                      {template === 'firm' && 'More assertive follow-up'}
                      {template === 'final' && 'Urgent final notice'}
                      {template === 'legal' && 'Formal legal warning'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Subject</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message Body</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={10}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                Variables: {'{customerName}'}, {'{amount}'}, {'{daysOverdue}'}
              </p>
            </div>

            <div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeStatement}
                  onChange={(e) => setIncludeStatement(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Include detailed statement of account
                </span>
              </label>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={20} className="text-gray-600" />
                <h4 className="font-bold text-gray-900">Preview</h4>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="font-bold text-gray-900 mb-2">Subject: {subject}</p>
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {getPreviewMessage()}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={isSending || !customerEmail}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send size={18} />
                    Send Reminder
                  </>
                )}
              </button>
            </div>
            {!customerEmail && (
              <p className="text-sm text-red-600 mt-2 text-center">
                No email address available for this customer
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
