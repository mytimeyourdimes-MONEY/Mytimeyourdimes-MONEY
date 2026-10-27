import React, { useState } from 'react';
import { 
  ShieldCheck, Wallet, PlusCircle, MapPin, Link as LinkIcon, 
  Menu, X, Compass, CheckCircle2, Calculator, ArrowRight, CreditCard, Camera, Sparkles, Video 
} from 'lucide-react';
import { UserProfile, LocationFilter } from '../types';

interface NavbarProps {
  user: UserProfile;
  locationFilter: LocationFilter;
  openLocationModal: () => void;
  activeTab: 'browse' | 'my_tasks' | 'calculator' | 'wallet' | 'showcase';
  setActiveTab: (tab: 'browse' | 'my_tasks' | 'calculator' | 'wallet' | 'showcase') => void;
  openPostModal: () => void;
  openSellItemModal?: () => void;
  openIdModal: () => void;
  openWalletModal: () => void;
  openLinkAccountsModal: () => void;
  openVideoAdModal?: () => void;
  userRoleMode: 'tasker' | 'poster';
  setUserRoleMode: (mode: 'tasker' | 'poster') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  locationFilter,
  openLocationModal,
  activeTab,
  setActiveTab,
  openPostModal,
  openSellItemModal,
  openIdModal,
  openWalletModal,
  openLinkAccountsModal,
  openVideoAdModal,
  userRoleMode,
  setUserRoleMode,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const displayLocation = locationFilter.metroId === 'all'
    ? 'All Areas (USA)'
    : locationFilter.customQuery
    ? locationFilter.customQuery
    : `${locationFilter.city}, ${locationFilter.state}`;

  const handleNavClick = (tab: 'browse' | 'my_tasks' | 'calculator' | 'wallet') => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Zone 1: Brand Wordmark */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick('browse')}
                className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
                title="My Time Your Dime - Home"
              >
                {/* Eye-catching Medallion Icon with Gold border & Emerald center */}
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-600 to-black p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 group-hover:rotate-1 transition-all shrink-0">
                  <div className="w-full h-full rounded-[14px] bg-slate-950 flex flex-col items-center justify-center text-center p-0.5 border border-amber-400/60">
                    <span className="font-display font-black text-xs text-amber-300 tracking-tighter leading-none">MY TIME</span>
                    <span className="font-display font-black text-[10px] text-emerald-400 tracking-tight leading-none mt-0.5">YOUR DIME</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-black text-lg sm:text-2xl tracking-tight leading-none text-slate-950 flex items-center gap-1">
                      <span className="text-emerald-600 drop-shadow-xs">My Time</span>
                      <span className="text-amber-500 drop-shadow-xs">Your Dime</span>
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 hidden sm:inline" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 tracking-wide mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 inline-block" />
                    <span>Turn items, skills & tasks into cash</span>
                  </span>
                </div>
              </button>
            </div>

            {/* Zone 2: Desktop Navigation Links (Visible on tablets and laptops >= 768px) */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
              <button
                onClick={() => handleNavClick('browse')}
                className={`transition-colors relative py-1 ${
                  activeTab === 'browse'
                    ? 'text-slate-950 font-bold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Browse Tasks
                {activeTab === 'browse' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
                )}
              </button>

              <button
                onClick={() => handleNavClick('my_tasks')}
                className={`transition-colors relative py-1 ${
                  activeTab === 'my_tasks'
                    ? 'text-slate-950 font-bold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                My Activity
                {activeTab === 'my_tasks' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
                )}
              </button>

              <button
                onClick={() => handleNavClick('calculator')}
                className={`transition-colors relative py-1 ${
                  activeTab === 'calculator'
                    ? 'text-slate-950 font-bold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Escrow & Fee Calculator
                {activeTab === 'calculator' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
                )}
              </button>

              <button
                onClick={() => handleNavClick('wallet')}
                className={`transition-colors relative py-1 ${
                  activeTab === 'wallet'
                    ? 'text-slate-950 font-bold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Daily Payouts
                {activeTab === 'wallet' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
                )}
              </button>
            </nav>

            {/* Zone 3: Primary Actions (Location, ID Status, Wallet & Link Payout, Post Task) */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Location Picker Pill */}
              <button
                onClick={openLocationModal}
                title="Change area or browse nationwide"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-200/80 max-w-[130px] sm:max-w-none truncate"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">{displayLocation}</span>
              </button>

              {/* ID Verification Pill Button */}
              <button
                onClick={openIdModal}
                title="Mandatory Government ID Verification status"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  user.isIdVerified
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                    : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 animate-pulse'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 ${user.isIdVerified ? 'text-emerald-600' : 'text-amber-600'}`} />
                <span className="hidden lg:inline">
                  {user.isIdVerified ? 'ID Verified' : 'Verify ID'}
                </span>
              </button>

              {/* Daily Payouts Wallet Chip */}
              <button
                onClick={openWalletModal}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                title="Daily Payouts & Escrow Vault"
              >
                <Wallet className="w-3.5 h-3.5 text-amber-600" />
                <span className="tabular-nums font-bold">${user.wallet.availableBalance.toFixed(2)}</span>
              </button>

              {/* Direct Set Up Payments Button */}
              <button
                onClick={openLinkAccountsModal}
                title="Set up & link your payout accounts: Google Pay, Cash App, PayPal, Chime, Stripe"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-black hover:bg-slate-900 text-amber-400 border border-amber-400/40 shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Set Up Payments</span>
                <span className="sm:hidden">Payments</span>
              </button>

              {/* TikTok / Shorts Video Ad Button */}
              {openVideoAdModal && (
                <button
                  onClick={openVideoAdModal}
                  title="Watch our eye-catching TikTok & YouTube Shorts Video Ad with catchy music"
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-black bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 hover:from-red-500 hover:to-pink-500 text-white shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">TikTok / Shorts Ad</span>
                  <span className="sm:hidden">Video</span>
                </button>
              )}

              {/* Sell Item with Photo Button */}
              <button
                onClick={openSellItemModal || openPostModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all whitespace-nowrap cursor-pointer border border-emerald-400/30"
              >
                <Camera className="w-3.5 h-3.5 text-amber-300" />
                <span>Sell Item (Photo)</span>
              </button>

              {/* Post a Task CTA Button */}
              <button
                onClick={openPostModal}
                className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-smooth whitespace-nowrap cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                <span>Post Task</span>
              </button>

              {/* Mobile Hamburger Menu Toggle Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-slate-900" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-900" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Dedicated Quick-Access Sub-Navigation Bar for Payments (Google Pay, Cash App, PayPal, Chime, Stripe) */}
        <div className="bg-slate-900 text-white border-t border-slate-800 px-3 sm:px-6 py-2 text-xs shadow-inner">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" />
                Set Up Payments:
              </span>
              <span className="text-slate-300 hidden md:inline">
                Daily payouts automatically sent to:
              </span>
              <div className="flex flex-wrap items-center gap-1 font-bold">
                <span className="px-2 py-0.5 rounded bg-blue-900/80 border border-blue-500/40 text-blue-200 text-[11px]">Google Pay</span>
                <span className="px-2 py-0.5 rounded bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 text-[11px]">Cash App</span>
                <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-400/40 text-blue-100 text-[11px]">PayPal</span>
                <span className="px-2 py-0.5 rounded bg-teal-900/80 border border-teal-400/40 text-teal-200 text-[11px]">Chime</span>
                <span className="px-2 py-0.5 rounded bg-indigo-900/80 border border-indigo-400/40 text-indigo-200 text-[11px]">Stripe</span>
              </div>
            </div>
            <button
              onClick={openLinkAccountsModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-lg shadow-sm transition-all hover:scale-102 text-xs whitespace-nowrap cursor-pointer"
            >
              <LinkIcon className="w-3 h-3 text-slate-900" />
              <span>Click to Set Up Payments →</span>
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Menu (When user clicks Hamburger on phones/tablets) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fade-in">
            {/* Quick action card for Payment Setup in mobile drawer */}
            <div 
              onClick={() => {
                openLinkAccountsModal();
                setIsMobileMenuOpen(false);
              }}
              className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-xl cursor-pointer hover:border-emerald-400 transition-colors shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  Set Up Payments & Payouts
                </span>
                <span className="text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded">
                  Configure
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mb-2">
                Connect your account for daily earnings disbursements:
              </p>
              <div className="flex flex-wrap gap-1 text-[10px] font-bold">
                <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-blue-700">Google Pay</span>
                <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-emerald-700">Cash App</span>
                <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-blue-900">PayPal</span>
                <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-teal-700">Chime</span>
                <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-indigo-700">Stripe</span>
              </div>
            </div>

            {/* Video Ad CTA for Mobile */}
            {openVideoAdModal && (
              <button
                onClick={() => {
                  openVideoAdModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md animate-pulse cursor-pointer"
              >
                <Video className="w-4 h-4 text-amber-300" />
                <span>🎬 Watch TikTok & Shorts Video Ad</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
              <button
                onClick={() => {
                  if (openSellItemModal) openSellItemModal();
                  else openPostModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Camera className="w-4 h-4 text-amber-300" />
                <span>Sell an Item</span>
              </button>

              <button
                onClick={() => {
                  openPostModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>Post a Task</span>
              </button>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => handleNavClick('browse')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === 'browse'
                    ? 'bg-amber-50 text-amber-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-amber-600" />
                  <span>Browse Tasks</span>
                </div>
                {activeTab === 'browse' && <span className="w-2 h-2 rounded-full bg-amber-500" />}
              </button>

              <button
                onClick={() => handleNavClick('my_tasks')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === 'my_tasks'
                    ? 'bg-amber-50 text-amber-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>My Activity & Active Jobs</span>
                </div>
                {activeTab === 'my_tasks' && <span className="w-2 h-2 rounded-full bg-amber-500" />}
              </button>

              <button
                onClick={() => handleNavClick('wallet')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === 'wallet'
                    ? 'bg-amber-50 text-amber-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Wallet className="w-4 h-4 text-blue-600" />
                  <span>Daily Payouts Wallet</span>
                </div>
                <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                  ${user.wallet.availableBalance.toFixed(2)}
                </span>
              </button>

              <button
                onClick={() => handleNavClick('calculator')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  activeTab === 'calculator'
                    ? 'bg-amber-50 text-amber-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-4 h-4 text-purple-600" />
                  <span>Escrow & 15-20% Fee Calculator</span>
                </div>
                {activeTab === 'calculator' && <span className="w-2 h-2 rounded-full bg-amber-500" />}
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  openLocationModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-800"
              >
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Current Area: {displayLocation}</span>
                </span>
                <span className="text-amber-700 text-[11px] font-bold">Change →</span>
              </button>

              <button
                onClick={() => {
                  openIdModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-800"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ID Verification: {user.isIdVerified ? 'Verified' : 'Unverified'}</span>
                </span>
                <span className="text-emerald-700 text-[11px] font-bold">Status →</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Tab Bar (Permanent Thumb Navigation on phones < 768px) */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-2 flex items-center justify-around shadow-lg"
        aria-label="Mobile Bottom Navigation Bar"
      >
        <button
          onClick={() => handleNavClick('browse')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold transition-colors ${
            activeTab === 'browse' ? 'text-amber-700' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Compass className={`w-5 h-5 mb-0.5 ${activeTab === 'browse' ? 'text-amber-600' : 'text-slate-500'}`} />
          <span>Browse</span>
        </button>

        <button
          onClick={() => handleNavClick('my_tasks')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold transition-colors ${
            activeTab === 'my_tasks' ? 'text-amber-700' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className={`w-5 h-5 mb-0.5 ${activeTab === 'my_tasks' ? 'text-amber-600' : 'text-slate-500'}`} />
          <span>My Tasks</span>
        </button>

        {/* Center Prominent Post Button */}
        <button
          onClick={openPostModal}
          className="flex flex-col items-center justify-center -mt-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold p-2.5 rounded-full shadow-lg shadow-amber-500/30 hover:scale-105 transition-transform"
          title="Post a Task & Name Your Price"
        >
          <PlusCircle className="w-6 h-6 text-slate-950" />
        </button>

        <button
          onClick={() => handleNavClick('wallet')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold transition-colors ${
            activeTab === 'wallet' ? 'text-amber-700' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Wallet className={`w-5 h-5 mb-0.5 ${activeTab === 'wallet' ? 'text-amber-600' : 'text-slate-500'}`} />
          <span>Payouts</span>
        </button>

        <button
          onClick={() => handleNavClick('calculator')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold transition-colors ${
            activeTab === 'calculator' ? 'text-amber-700' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calculator className={`w-5 h-5 mb-0.5 ${activeTab === 'calculator' ? 'text-amber-600' : 'text-slate-500'}`} />
          <span>Fees</span>
        </button>
      </nav>
    </>
  );
};
