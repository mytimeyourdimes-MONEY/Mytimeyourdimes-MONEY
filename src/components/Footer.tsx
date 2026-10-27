import React from 'react';
import { ShieldCheck, Lock, Wallet, Heart, CreditCard } from 'lucide-react';

interface FooterProps {
  onBrowseClick: () => void;
  onPostClick: () => void;
  onSellItemClick?: () => void;
  onShowcaseClick?: () => void;
  onCalculatorClick: () => void;
  onWalletClick: () => void;
  onIdClick: () => void;
  onOpenPaymentsClick?: () => void;
  onOpenVideoAdClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onBrowseClick,
  onPostClick,
  onSellItemClick,
  onShowcaseClick,
  onCalculatorClick,
  onWalletClick,
  onIdClick,
  onOpenPaymentsClick,
  onOpenVideoAdClick,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Wordmark & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-600 to-black p-0.5 shadow-md shadow-amber-500/20 shrink-0">
                <div className="w-full h-full rounded-[10px] bg-slate-950 flex flex-col items-center justify-center text-center p-0.5 border border-amber-400/50">
                  <span className="font-display font-black text-[9px] text-amber-300 leading-none">MY TIME</span>
                  <span className="font-display font-black text-[8px] text-emerald-400 leading-none mt-0.5">YOUR DIME</span>
                </div>
              </div>
              <span className="font-display font-black text-lg text-white tracking-tight">
                <span className="text-emerald-400">My Time</span>{' '}
                <span className="text-amber-400">Your Dime</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              The premier hyper-local marketplace. Sell items with photos, post chores & tasks, or provide your services. All transactions held safely in escrow with daily payouts.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% ID-Verified Neighborhood Network</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Marketplace</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={onSellItemClick || onPostClick} className="hover:text-emerald-400 transition-colors font-semibold text-emerald-300 flex items-center gap-1 cursor-pointer">
                  <span>📸 Sell an Item (With Photo)</span>
                </button>
              </li>
              {onOpenVideoAdClick && (
                <li>
                  <button onClick={onOpenVideoAdClick} className="hover:text-amber-300 transition-colors font-bold text-amber-400 flex items-center gap-1 cursor-pointer">
                    <span>🎬 TikTok & Shorts Video Ad</span>
                  </button>
                </li>
              )}
              <li>
                <button onClick={onBrowseClick} className="hover:text-white transition-colors cursor-pointer">
                  Browse Local Tasks & Items
                </button>
              </li>
              <li>
                <button onClick={onPostClick} className="hover:text-white transition-colors cursor-pointer">
                  Post a Task & Name Price
                </button>
              </li>
              <li>
                <button onClick={onCalculatorClick} className="hover:text-white transition-colors cursor-pointer">
                  Escrow & 15-20% Fee Calculator
                </button>
              </li>
              <li>
                <button onClick={onWalletClick} className="hover:text-white transition-colors cursor-pointer">
                  Daily Payouts Wallet
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Escrow & Security */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Trust & Security</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={onIdClick} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mandatory ID Verification</span>
                </button>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>FDIC-Insured Escrow Vault</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <Wallet className="w-3.5 h-3.5 text-blue-400" />
                <span>Same-Day Daily Payout Batches</span>
              </li>
              <li className="text-slate-500 text-[11px]">
                Zero upfront cash risk for posters or taskers.
              </li>
            </ul>
          </div>

          {/* Col 4: Supported Payout Methods */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Daily Payout Rails</h4>
            <p className="text-xs text-slate-400">
              Disbursed daily at 6:00 PM EST into your preferred mobile or bank wallet:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs font-semibold">
                Google Pay
              </span>
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs font-semibold">
                Cash App
              </span>
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs font-semibold">
                PayPal
              </span>
              <span className="px-2.5 py-1 bg-slate-900 border border-teal-800/60 rounded text-teal-300 text-xs font-semibold">
                Chime
              </span>
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200 text-xs font-semibold">
                Stripe Direct
              </span>
            </div>
            <div className="pt-2">
              <button
                onClick={onOpenPaymentsClick || onWalletClick}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer underline text-xs"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Click here to set up payments (GPay · CashApp · PayPal · Chime) →</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Platform keeps 15% to 20% to cover escrow insurance, identity verification, and payment gateways.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} My Time Your Dime's, Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">All 50 US States · Nationwide Local Task Coverage</span>
            <span>·</span>
            <span>Community Escrow Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
