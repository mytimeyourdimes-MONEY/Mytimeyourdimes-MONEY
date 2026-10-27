import React from 'react';
import { 
  ShieldCheck, Lock, Clock, Zap, ArrowRight, CheckCircle2, 
  CreditCard, Camera, Sparkles, Tag, Briefcase, Video 
} from 'lucide-react';
import heroImg from '../assets/images/hero_community_taskers_1791345832504.jpg';
import escrowShieldImg from '../assets/images/escrow_shield_vault_1791345842180.jpg';

interface HeroBannerProps {
  onPostClick: () => void;
  onSellItemClick?: () => void;
  onOfferServiceClick?: () => void;
  onBrowseClick: () => void;
  onLearnEscrowClick: () => void;
  onOpenPaymentsClick?: () => void;
  onOpenVideoAdClick?: () => void;
  onViewShowcaseClick?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onPostClick,
  onSellItemClick,
  onOfferServiceClick,
  onBrowseClick,
  onLearnEscrowClick,
  onOpenPaymentsClick,
  onOpenVideoAdClick,
  onViewShowcaseClick,
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white border-b border-slate-800">
      {/* Background ambient lighting - Green, Gold, Black, Silver hues */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-slate-950/95 to-emerald-950/80 z-10" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero background image with proper fallback */}
      <img
        src={heroImg}
        alt="Friendly local neighborhood helpers collaborating on home tasks"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-25 select-none"
      />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Standout App Name & Core Value Proposition */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* 1. APP NAME: ULTRA EYE-CATCHING, STAND-OUT CENTERPIECE */}
            <div className="relative p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-black via-slate-950 to-emerald-950/90 border-2 border-amber-400/70 brand-marquee-glow shadow-2xl overflow-hidden">
              {/* Radial background glows */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

              {/* Top Announcement Ribbon */}
              <div className="relative z-10 flex items-center justify-between gap-2 flex-wrap pb-3 mb-2 border-b border-amber-500/20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-black to-emerald-500/20 border border-amber-400/50 text-amber-300 text-xs font-black uppercase tracking-widest shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>★ OFFICIAL MARKETPLACE APP ★</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-bold text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ACTIVE NATIONWIDE</span>
                </div>
              </div>

              {/* Main Eye-Catching App Name Title */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight leading-none drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] filter">
                    <span className="text-emerald-shimmer inline-block drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                      My Time
                    </span>{' '}
                    <span className="text-gold-shimmer inline-block drop-shadow-[0_0_25px_rgba(245,158,11,0.5)]">
                      Your Dime
                    </span>
                  </h1>
                </div>

                {/* Visual Bullion Coin / Dime Medallion Emblem */}
                <div className="shrink-0 flex items-center gap-2 sm:flex-col sm:items-end">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-300 to-amber-500 p-0.5 shadow-xl shadow-amber-500/30 border border-amber-200">
                    <div className="w-full h-full rounded-[14px] bg-slate-950 flex flex-col items-center justify-center text-center p-1 border border-amber-400/50">
                      <span className="text-[10px] font-extrabold text-amber-300 uppercase leading-none">DIME</span>
                      <span className="text-lg font-black text-white tracking-tighter leading-none mt-0.5">VAULT</span>
                      <span className="text-[9px] font-bold text-emerald-400 leading-none mt-0.5">100% SAFE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Tagline: Turn items, skills, labor, and services into money */}
              <div className="relative z-10 mt-3.5 pt-3 border-t border-slate-800/90">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-black via-slate-950 to-black border border-amber-400/40 shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  <p className="text-sm sm:text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-amber-200 to-amber-400 tracking-wide">
                    Turn items, skills, labor, and services into money
                  </p>
                </div>
              </div>
            </div>

            {/* 2. NATIONWIDE / LOCAL STATEMENT (BELOW THE APP NAME) */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-300 bg-black/80 border border-slate-700 px-4 py-2 rounded-xl shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
              <span>Nationwide Local Task, Goods & Services Network · All 50 States & Local Neighborhoods</span>
            </div>

            {/* 3. GOT TASKS STATEMENT (BELOW THE APP NAME AND NATIONWIDE STATEMENT) */}
            <div className="space-y-1.5 pt-1">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold tracking-wider text-slate-300 bg-slate-900/90 px-2.5 py-0.5 rounded border border-slate-700">
                <span>Task & Labor Request:</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold tracking-tight text-white leading-tight">
                Got tasks you don’t have time for?{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-emerald-400">
                  Your dime, their time.
                </span>
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Earn money 3 easy ways: <strong>sell an item with a photo</strong>, <strong>hire a verified neighbor for tasks</strong>, or <strong>offer your skills</strong>. 
              Every transaction is held safe in Dime Vault™ Escrow with guaranteed daily payouts to Google Pay, Cash App, PayPal, Chime, or Stripe.
            </p>

            {/* Action Buttons: Green, Gold, Black, Silver */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Button 1: Sell an Item with Photo */}
              <button
                onClick={onSellItemClick || onPostClick}
                className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-all cursor-pointer border border-emerald-400/40"
              >
                <Camera className="w-4 h-4 text-amber-300" />
                <span>Sell an Item (Add Photo)</span>
              </button>

              {/* Button 2: Post a Task (Got tasks) */}
              <button
                onClick={onPostClick}
                className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer border border-amber-300/40"
              >
                <span>Post a Task (Name Price)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Button 3: Offer a Service */}
              <button
                onClick={onOfferServiceClick || onPostClick}
                className="px-4 py-3 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Offer a Service</span>
              </button>

              {/* Button 4: Set Up Payments */}
              {onOpenPaymentsClick && (
                <button
                  onClick={onOpenPaymentsClick}
                  className="px-4 py-3 bg-black hover:bg-slate-900 text-amber-400 font-bold rounded-xl border border-amber-500/40 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Set Up Payments</span>
                </button>
              )}

              {/* Button 5: Watch TikTok & Shorts Ad */}
              {onOpenVideoAdClick && (
                <button
                  onClick={onOpenVideoAdClick}
                  className="px-4 py-3 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 hover:from-red-500 hover:to-pink-500 text-white font-black rounded-xl shadow-lg shadow-pink-600/30 transition-all flex items-center gap-2 cursor-pointer border border-pink-400/50"
                >
                  <Video className="w-4 h-4 text-amber-300" />
                  <span>Watch TikTok & Shorts Ad</span>
                </button>
              )}
            </div>

            {/* Proof Points in Green, Gold, Silver */}
            <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% ID Verified Neighbors</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Escrow Held Safe in Vault</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Daily Payouts: GPay · CashApp · Chime</span>
              </div>
            </div>
          </div>

          {/* Right Column: Escrow Vault & 3 Ways to Earn Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={escrowShieldImg}
                    alt="Escrow Shield Vault"
                    className="w-11 h-11 rounded-xl object-cover border border-amber-500/40"
                  />
                  <div>
                    <h3 className="font-display font-bold text-white text-base">The Dime Vault™ Escrow</h3>
                    <p className="text-xs text-slate-400">3 Safe Ways to Earn or Hire</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Protected
                </span>
              </div>

              {/* 3 Pillars */}
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-emerald-300">Sell an Item with Photo</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      List tools, furniture, equipment, or goods. Buyer funds lock into Escrow before pickup.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-amber-300">Got Tasks? Name Your Price</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Post repairs, chores, or lawn jobs. Pre-fund into Escrow so neighbors know funds are real.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="w-6 h-6 rounded-lg bg-slate-700 text-slate-200 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-slate-200">Provide a Service & Cash Out</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Offer your trade or labor. Daily automated disbursements to Google Pay, Cash App, PayPal, or Chime.
                    </p>
                  </div>
                </div>
              </div>

              {/* Daily payout badge */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Daily Payout Cycle: <strong>6:00 PM EST</strong></span>
                <span className="text-emerald-400 font-semibold">100% Guaranteed</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
