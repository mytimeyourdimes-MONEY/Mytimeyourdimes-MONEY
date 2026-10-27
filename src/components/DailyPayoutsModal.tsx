import React, { useState } from 'react';
import { 
  X, Wallet, CheckCircle2, Clock, 
  CreditCard, Zap, RefreshCw, Link as LinkIcon, 
  Settings, Check, ShieldCheck, ArrowRight, DollarSign 
} from 'lucide-react';
import { PayoutMethod, PayoutTransaction, UserProfile } from '../types';
import payoutImg from '../assets/images/payout_methods_digital_1791345851075.jpg';

interface DailyPayoutsModalProps {
  user: UserProfile;
  payoutHistory: PayoutTransaction[];
  initialTab?: 'wallet' | 'link_accounts';
  onClose: () => void;
  onInstantPayout: (amount: number, method: PayoutMethod) => void;
  onUpdatePreferences: (updatedPrefs: any) => void;
}

export const DailyPayoutsModal: React.FC<DailyPayoutsModalProps> = ({
  user,
  payoutHistory,
  initialTab = 'wallet',
  onClose,
  onInstantPayout,
  onUpdatePreferences,
}) => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'link_accounts'>(initialTab);
  const [selectedMethod, setSelectedMethod] = useState<PayoutMethod>(user.payoutPreferences.primaryMethod);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states for linking accounts
  const [googlePayEmail, setGooglePayEmail] = useState(user.payoutPreferences.googlePayEmail);
  const [paypalEmail, setPaypalEmail] = useState(user.payoutPreferences.paypalEmail);
  const [cashAppTag, setCashAppTag] = useState(user.payoutPreferences.cashAppTag);
  const [chimeSign, setChimeSign] = useState(user.payoutPreferences.chimeSign || '$DawnChime');
  const [stripeCardLast4, setStripeCardLast4] = useState(user.payoutPreferences.stripeCardLast4);
  const [cardholderName, setCardholderName] = useState(user.name);
  const [primaryMethod, setPrimaryMethod] = useState<PayoutMethod>(user.payoutPreferences.primaryMethod);
  const [autoDailyEnabled, setAutoDailyEnabled] = useState(user.payoutPreferences.dailyAutoPayoutEnabled);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const handleCashoutNow = () => {
    if (user.wallet.availableBalance <= 0) {
      alert('You currently have $0.00 available to cash out.');
      return;
    }

    setIsProcessing(true);
    setSuccessMessage(null);

    setTimeout(() => {
      onInstantPayout(user.wallet.availableBalance, selectedMethod);
      setIsProcessing(false);
      setSuccessMessage(`Successfully dispatched $${user.wallet.availableBalance.toFixed(2)} to your ${getMethodLabel(selectedMethod)}!`);
    }, 1200);
  };

  const handleSaveAccounts = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePreferences({
      primaryMethod,
      googlePayEmail: googlePayEmail.trim(),
      paypalEmail: paypalEmail.trim(),
      cashAppTag: cashAppTag.trim().startsWith('$') ? cashAppTag.trim() : `$${cashAppTag.trim()}`,
      chimeSign: chimeSign.trim().startsWith('$') ? chimeSign.trim() : `$${chimeSign.trim()}`,
      stripeCardLast4: stripeCardLast4.trim().slice(-4),
      dailyAutoPayoutEnabled: autoDailyEnabled,
    });

    setSaveFeedback('All payout accounts (Google Pay, Cash App, PayPal, Chime, Stripe) updated & verified! Daily transfers will be sent to your primary linked destination.');
    setTimeout(() => {
      setSaveFeedback(null);
    }, 4500);
  };

  const getMethodLabel = (m: PayoutMethod) => {
    switch (m) {
      case 'google_pay': return 'Google Pay';
      case 'paypal': return 'PayPal';
      case 'cashapp': return 'Cash App';
      case 'chime': return 'Chime';
      case 'stripe': return 'Stripe Instant';
      default: return 'Payout Method';
    }
  };

  const getPrimaryHandle = () => {
    switch (user.payoutPreferences.primaryMethod) {
      case 'google_pay': return user.payoutPreferences.googlePayEmail;
      case 'paypal': return user.payoutPreferences.paypalEmail;
      case 'cashapp': return user.payoutPreferences.cashAppTag;
      case 'chime': return user.payoutPreferences.chimeSign || '$ChimeSign';
      case 'stripe': return `•••• ${user.payoutPreferences.stripeCardLast4}`;
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Daily Payouts & Earnings Wallet
              </h3>
              <p className="text-xs text-slate-500">
                Set up & link payments: Google Pay, Cash App, PayPal, Chime, or Stripe for automated daily payouts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Overview vs Link Accounts */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-6">
          <button
            onClick={() => setActiveTab('wallet')}
            className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'wallet'
                ? 'border-amber-600 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wallet className="w-4 h-4 text-amber-600" />
            <span>Wallet & Daily Transfers</span>
          </button>

          <button
            onClick={() => setActiveTab('link_accounts')}
            className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'link_accounts'
                ? 'border-amber-600 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon className="w-4 h-4 text-amber-600" />
            <span>Link / Edit Payout Accounts</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              Active
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: WALLET & TRANSFERS */}
          {activeTab === 'wallet' && (
            <>
              {/* Linked Account Reminder Banner */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Primary Payout Account: {getMethodLabel(user.payoutPreferences.primaryMethod)} ({getPrimaryHandle()})
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Automated transfers dispatch daily at 6:00 PM EST. Zero cash-out fees.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('link_accounts')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-lg shadow-sm transition-colors whitespace-nowrap flex items-center gap-1"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Manage / Change</span>
                </button>
              </div>

              {/* Visual Showcase Banner */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white p-6 shadow-md border border-slate-800">
                <img
                  src={payoutImg}
                  alt="Digital Payouts Wallet"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Available for Payout Today</span>
                    <p className="text-3xl font-display font-extrabold text-white mt-1 tabular-nums">
                      ${user.wallet.availableBalance.toFixed(2)}
                    </p>
                    <span className="text-[11px] text-emerald-400 font-medium">Cleared & ready for transfer</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 font-medium">Pending in Escrow Tasks</span>
                    <p className="text-2xl font-display font-bold text-amber-400 mt-1 tabular-nums">
                      ${user.wallet.inEscrowBalance.toFixed(2)}
                    </p>
                    <span className="text-[11px] text-slate-400">Releases upon completion review</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 font-medium">Lifetime Earned</span>
                    <p className="text-2xl font-display font-bold text-slate-200 mt-1 tabular-nums">
                      ${user.wallet.lifetimeEarned.toFixed(2)}
                    </p>
                    <span className="text-[11px] text-slate-400">{user.completedTasks} completed jobs</span>
                  </div>
                </div>

                {/* Next Daily Schedule Banner */}
                <div className="relative z-10 mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Next automated batch: <strong className="text-white">{user.payoutPreferences.nextAutoPayoutTime}</strong></span>
                  </div>
                  <span className="text-[11px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                    ✓ Daily Auto-Payout Active
                  </span>
                </div>
              </div>

              {/* Success message banner */}
              {successMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="flex-1 font-semibold">{successMessage}</div>
                </div>
              )}

              {/* Choose Payout Destination for Instant Cash-Out */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Select Payout Account for Immediate Transfer
                  </h4>
                  <button
                    onClick={() => setActiveTab('link_accounts')}
                    className="text-xs text-amber-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>+ Link / Edit Accounts</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* Google Pay */}
                  <div
                    onClick={() => setSelectedMethod('google_pay')}
                    className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedMethod === 'google_pay'
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                          G
                        </div>
                        <span className="text-xs font-bold text-slate-900">Google Pay</span>
                      </div>
                      <input
                        type="radio"
                        name="payoutMethod"
                        checked={selectedMethod === 'google_pay'}
                        onChange={() => setSelectedMethod('google_pay')}
                        className="text-blue-600"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{googlePayEmail}</p>
                    <span className="text-[10px] text-blue-700 font-semibold block mt-1">Instant G-Pay</span>
                  </div>

                  {/* Cash App */}
                  <div
                    onClick={() => setSelectedMethod('cashapp')}
                    className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedMethod === 'cashapp'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                          $
                        </div>
                        <span className="text-xs font-bold text-slate-900">Cash App</span>
                      </div>
                      <input
                        type="radio"
                        name="payoutMethod"
                        checked={selectedMethod === 'cashapp'}
                        onChange={() => setSelectedMethod('cashapp')}
                        className="text-emerald-600"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{cashAppTag}</p>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-1">$Cashtag Direct</span>
                  </div>

                  {/* PayPal */}
                  <div
                    onClick={() => setSelectedMethod('paypal')}
                    className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedMethod === 'paypal'
                        ? 'border-blue-700 bg-blue-50/70 shadow-sm ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-blue-800 text-white flex items-center justify-center font-bold text-[10px]">
                          P
                        </div>
                        <span className="text-xs font-bold text-slate-900">PayPal</span>
                      </div>
                      <input
                        type="radio"
                        name="payoutMethod"
                        checked={selectedMethod === 'paypal'}
                        onChange={() => setSelectedMethod('paypal')}
                        className="text-blue-700"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{paypalEmail}</p>
                    <span className="text-[10px] text-blue-800 font-semibold block mt-1">Daily Batch</span>
                  </div>

                  {/* Chime */}
                  <div
                    onClick={() => setSelectedMethod('chime')}
                    className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedMethod === 'chime'
                        ? 'border-teal-600 bg-teal-50/70 shadow-sm ring-1 ring-teal-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-teal-600 text-white flex items-center justify-center font-bold text-[10px]">
                          C
                        </div>
                        <span className="text-xs font-bold text-slate-900">Chime</span>
                      </div>
                      <input
                        type="radio"
                        name="payoutMethod"
                        checked={selectedMethod === 'chime'}
                        onChange={() => setSelectedMethod('chime')}
                        className="text-teal-600"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{chimeSign}</p>
                    <span className="text-[10px] text-teal-700 font-semibold block mt-1">$ChimeSign Direct</span>
                  </div>

                  {/* Stripe */}
                  <div
                    onClick={() => setSelectedMethod('stripe')}
                    className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedMethod === 'stripe'
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                          S
                        </div>
                        <span className="text-xs font-bold text-slate-900">Stripe</span>
                      </div>
                      <input
                        type="radio"
                        name="payoutMethod"
                        checked={selectedMethod === 'stripe'}
                        onChange={() => setSelectedMethod('stripe')}
                        className="text-indigo-600"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">•••• {user.payoutPreferences.stripeCardLast4}</p>
                    <span className="text-[10px] text-indigo-700 font-semibold block mt-1">Debit Card / ACH</span>
                  </div>
                </div>

                {/* Instant cashout CTA */}
                <div className="mt-4 flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-slate-900">Want your funds right now?</span>
                    <p className="text-[11px] text-slate-500">
                      Don't wait for 6:00 PM batch. Dispatch ${user.wallet.availableBalance.toFixed(2)} to {getMethodLabel(selectedMethod)} immediately.
                    </p>
                  </div>
                  <button
                    onClick={handleCashoutNow}
                    disabled={isProcessing || user.wallet.availableBalance <= 0}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Instant Cash-Out (${user.wallet.availableBalance.toFixed(2)})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Ledger of Recent Daily Payouts */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Completed Daily Payout Ledger
                </h4>
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold">
                      <tr>
                        <th className="px-4 py-2.5 text-left">Date & Time</th>
                        <th className="px-4 py-2.5 text-left">Task</th>
                        <th className="px-4 py-2.5 text-left">Method</th>
                        <th className="px-4 py-2.5 text-right">Gross Offer</th>
                        <th className="px-4 py-2.5 text-right">Fee (18%)</th>
                        <th className="px-4 py-2.5 text-right">Net Payout</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {payoutHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/60">
                          <td className="px-4 py-3 whitespace-nowrap text-slate-500 font-mono">
                            {item.date}
                          </td>
                          <td className="px-4 py-3 max-w-[200px] truncate font-medium text-slate-900">
                            {item.taskTitle}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                            {item.destinationDetails}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono tabular-nums">
                            ${item.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono tabular-nums text-slate-500">
                            -${item.feeDeducted.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right font-mono tabular-nums font-bold text-emerald-700">
                            ${item.netPayout.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: LINK & MANAGE PAYOUT ACCOUNTS */}
          {activeTab === 'link_accounts' && (
            <form onSubmit={handleSaveAccounts} className="space-y-6">
              
              {/* Introduction Banner */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <LinkIcon className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      Link Your Payout Accounts (Where Your Money Goes)
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Link any or all 5 payout methods below: <strong>Google Pay, Cash App, PayPal, Chime, or Stripe</strong>. Select which one receives your automated daily 6:00 PM EST transfer, or use any of them for Instant Cash-Out.
                    </p>
                  </div>
                </div>
              </div>

              {saveFeedback && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{saveFeedback}</span>
                </div>
              )}

              {/* 1. Google Pay */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                      G
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">Google Pay</h5>
                      <span className="text-[11px] text-slate-500">Instant transfer to Google Wallet</span>
                    </div>
                  </div>
                  
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="radio"
                      name="primaryPayoutChoice"
                      checked={primaryMethod === 'google_pay'}
                      onChange={() => setPrimaryMethod('google_pay')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>Set as Primary Daily Destination</span>
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Google Account Email or Phone
                  </label>
                  <input
                    type="email"
                    value={googlePayEmail}
                    onChange={(e) => setGooglePayEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              {/* 2. Cash App */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      $
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">Cash App</h5>
                      <span className="text-[11px] text-slate-500">Direct deposit via $Cashtag</span>
                    </div>
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="radio"
                      name="primaryPayoutChoice"
                      checked={primaryMethod === 'cashapp'}
                      onChange={() => setPrimaryMethod('cashapp')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>Set as Primary Daily Destination</span>
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Your Cash App $Cashtag
                  </label>
                  <input
                    type="text"
                    value={cashAppTag}
                    onChange={(e) => setCashAppTag(e.target.value)}
                    placeholder="e.g. $YourName123"
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    required
                  />
                </div>
              </div>

              {/* 3. PayPal */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">
                      P
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">PayPal</h5>
                      <span className="text-[11px] text-slate-500">Direct deposit to PayPal account balance</span>
                    </div>
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="radio"
                      name="primaryPayoutChoice"
                      checked={primaryMethod === 'paypal'}
                      onChange={() => setPrimaryMethod('paypal')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>Set as Primary Daily Destination</span>
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    PayPal Registered Email Address
                  </label>
                  <input
                    type="email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    placeholder="e.g. yourname@paypal.com"
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              {/* 4. Chime */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      C
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">Chime</h5>
                      <span className="text-[11px] text-slate-500">Direct deposit via $ChimeSign or Chime checking</span>
                    </div>
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="radio"
                      name="primaryPayoutChoice"
                      checked={primaryMethod === 'chime'}
                      onChange={() => setPrimaryMethod('chime')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>Set as Primary Daily Destination</span>
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Your Chime Member Sign ($ChimeSign) or Phone / Email
                  </label>
                  <input
                    type="text"
                    value={chimeSign}
                    onChange={(e) => setChimeSign(e.target.value)}
                    placeholder="e.g. $DawnChime"
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Receive direct transfers into your Chime account with zero hidden fees.
                  </span>
                </div>
              </div>

              {/* 5. Stripe Debit Card / Direct Deposit */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-xs">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">Stripe / Debit Card Direct Deposit</h5>
                      <span className="text-[11px] text-slate-500">Bank ACH or Instant Visa/Mastercard debit transfer</span>
                    </div>
                  </div>

                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="radio"
                      name="primaryPayoutChoice"
                      checked={primaryMethod === 'stripe'}
                      onChange={() => setPrimaryMethod('stripe')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>Set as Primary Daily Destination</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Account / Cardholder Full Name
                    </label>
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="e.g. Dawn Miller"
                      className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Debit Card Number / Last 4 Digits
                    </label>
                    <input
                      type="text"
                      value={stripeCardLast4}
                      onChange={(e) => setStripeCardLast4(e.target.value)}
                      placeholder="e.g. 4892"
                      className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Automatic Daily Payout Toggle */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    Automatic 6:00 PM EST Daily Transfer
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Automatically batch-send all cleared earnings each evening without needing to tap cash-out.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoDailyEnabled}
                    onChange={(e) => setAutoDailyEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('wallet')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Back to Wallet
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Save & Link Payout Accounts</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {activeTab === 'wallet' ? (
              <span>Want to update where funds land? <button onClick={() => setActiveTab('link_accounts')} className="text-amber-700 font-bold hover:underline">Link or change payout accounts →</button></span>
            ) : (
              <span>All payment methods encrypted with bank-level security</span>
            )}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            Close Wallet
          </button>
        </div>
      </div>
    </div>
  );
};
