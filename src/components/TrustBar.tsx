import React from 'react';
import { ShieldCheck, Lock, Zap, Camera, CreditCard, Sparkles } from 'lucide-react';

export const TrustBar: React.FC<{ 
  onOpenIdModal: () => void;
  onOpenPaymentsClick?: () => void;
  onSellItemClick?: () => void;
}> = ({ onOpenIdModal, onOpenPaymentsClick, onSellItemClick }) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 py-6 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Pillar 1: Sell Items with Photos */}
          <div 
            onClick={onSellItemClick}
            className="flex items-start gap-3.5 p-3 rounded-xl bg-black/40 border border-slate-800 hover:border-emerald-500/50 hover:bg-black/60 transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40 group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                Sell Items (Photo)
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
                  New
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Snap a photo and name your price. Buyer funds are locked in Escrow before pickup.
              </p>
            </div>
          </div>

          {/* Pillar 2: Mandatory ID Check */}
          <div 
            onClick={onOpenIdModal}
            className="flex items-start gap-3.5 p-3 rounded-xl bg-black/40 border border-slate-800 hover:border-amber-400/50 hover:bg-black/60 transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                Mandatory ID Check
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Verified
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                100% government ID verified neighbors. Zero fake or anonymous profiles.
              </p>
            </div>
          </div>

          {/* Pillar 3: Protected Escrow */}
          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-black/40 border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 border border-slate-700">
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Dime Vault™ Escrow</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Money is held secure until you inspect the item or approve the finished task.
              </p>
            </div>
          </div>

          {/* Pillar 4: Daily Payouts */}
          <div 
            onClick={onOpenPaymentsClick}
            className="flex items-start gap-3.5 p-3 rounded-xl bg-black/40 border border-slate-800 hover:border-emerald-400/50 hover:bg-black/60 transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                Daily Payouts
                {onOpenPaymentsClick && (
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    Set Up →
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated evening payouts to Google Pay, Cash App, PayPal, Chime, or Stripe.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
