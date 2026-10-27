import React, { useState } from 'react';
import { X, Calculator, Lock, ShieldCheck, DollarSign, Zap, Check } from 'lucide-react';

interface EscrowCalculatorModalProps {
  onClose: () => void;
  onPostWithBudget?: (budget: number) => void;
}

export const EscrowCalculatorModal: React.FC<EscrowCalculatorModalProps> = ({
  onClose,
  onPostWithBudget,
}) => {
  const [amount, setAmount] = useState<number>(100);
  const [feePercent, setFeePercent] = useState<number>(18); // Between 15% and 20%

  const feeAmount = (amount * feePercent) / 100;
  const taskerNet = amount - feeAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Transparent Escrow & Fee Calculator
              </h3>
              <p className="text-xs text-slate-500">
                See exactly where every penny goes (15% to 20% user fee)
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

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Interactive Calculator Section */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Task Offer Amount
                </label>
                <div className="flex items-center gap-1 font-display font-black text-2xl text-slate-950">
                  <span>$</span>
                  <input
                    type="number"
                    min={20}
                    max={2000}
                    step={5}
                    value={amount}
                    onChange={(e) => setAmount(Math.max(10, Number(e.target.value)))}
                    className="w-28 text-right bg-white border border-slate-300 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Range slider */}
              <input
                type="range"
                min={20}
                max={500}
                step={5}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                <span>$20</span>
                <span>$100</span>
                <span>$250</span>
                <span>$500+</span>
              </div>
            </div>

            {/* Platform Fee Selector (15% - 20%) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Platform Fee Tier ({feePercent}%)
                </label>
                <span className="text-xs text-slate-500 font-medium">Standard range: 15% to 20%</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[15, 17, 18, 20].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setFeePercent(rate)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      feePercent === rate
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {rate}% Fee
                  </button>
                ))}
              </div>
            </div>

            {/* Result Breakdown Card */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-[11px] text-slate-500 block">Poster Deposits:</span>
                <span className="text-xl font-display font-extrabold text-slate-900 tabular-nums">
                  ${amount.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Pre-authorized in Escrow</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-[11px] text-slate-500 block">App Fee ({feePercent}%):</span>
                <span className="text-xl font-display font-extrabold text-amber-700 tabular-nums">
                  ${feeAmount.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Insurance & payouts</span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-[11px] text-emerald-800 font-semibold block">Tasker Net Payout:</span>
                <span className="text-xl font-display font-extrabold text-emerald-800 tabular-nums">
                  ${taskerNet.toFixed(2)}
                </span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">Daily automated transfer</span>
              </div>
            </div>
          </div>

          {/* Value Proof */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Why My Time Your Dime's Keeps 15% to 20%
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Escrow Guarantee Vault</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Funds are secured upon posting. No worker gets stiffed, and no customer pays for incomplete work.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mandatory ID Verification</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  We fund real-time DMV and government database ID checks on every user to keep neighbors safe.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Daily Payout Rails</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  We cover payment gateway fees to batch transfer your earnings every evening directly to Google Pay, PayPal, Cash App, or Stripe.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-purple-600" />
                  <span>24/7 Human Mediation</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  If there is ever a disagreement over task scope, a live local mediator reviews photos and notes to resolve fairly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Offer: ${amount} → Tasker gets ${taskerNet.toFixed(2)}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100"
            >
              Close
            </button>
            {onPostWithBudget && (
              <button
                onClick={() => {
                  onClose();
                  onPostWithBudget(amount);
                }}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Post Task for ${amount}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
