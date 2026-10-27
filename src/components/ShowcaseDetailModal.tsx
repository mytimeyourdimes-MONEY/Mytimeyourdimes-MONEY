import React, { useState } from 'react';
import { 
  X, ShieldCheck, CheckCircle2, MapPin, DollarSign, 
  ArrowRight, Sparkles, Star, Calendar, Clock, Lock, UserCheck, Eye 
} from 'lucide-react';
import { ShowcaseJob } from '../types';

interface ShowcaseDetailModalProps {
  job: ShowcaseJob | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestService: (job: ShowcaseJob) => void;
}

export const ShowcaseDetailModal: React.FC<ShowcaseDetailModalProps> = ({
  job,
  isOpen,
  onClose,
  onRequestService,
}) => {
  const [activePhotoView, setActivePhotoView] = useState<'after' | 'before'>('after');

  if (!isOpen || !job) return null;

  const currentPhoto = (activePhotoView === 'before' && job.beforePhotoUrl) 
    ? job.beforePhotoUrl 
    : job.photoUrl;

  const getPayoutMethodName = (method?: string) => {
    switch (method) {
      case 'cashapp':
      case 'cash_app': return 'Cash App ($Cashtag)';
      case 'google_pay': return 'Google Pay';
      case 'chime': return 'Chime Banking';
      case 'paypal': return 'PayPal';
      case 'stripe': return 'Stripe Instant';
      default: return 'Daily Dime Vault Escrow';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full text-white shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
              job.type === 'completed_job'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {job.type === 'completed_job' ? 'Verified Completed Job' : 'Service Available to Book'}
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              {job.categoryName}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 max-h-[80vh] overflow-y-auto">
          {/* Left Column: Photo Showcase with Before / After Toggle */}
          <div className="lg:col-span-7 bg-black p-4 sm:p-6 flex flex-col justify-between space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-4/3 sm:aspect-16/10 bg-slate-950">
              <img
                src={currentPhoto}
                alt={job.title}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* View Overlay Tag */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-white font-bold text-xs rounded-lg border border-slate-700 shadow-md flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activePhotoView === 'before' ? 'BEFORE WORK' : 'COMPLETED RESULT'}</span>
                </span>
              </div>

              {/* Verified Payout Stamp */}
              {job.type === 'completed_job' && (
                <div className="absolute bottom-3 left-3 bg-emerald-950/90 backdrop-blur-md border border-emerald-500/50 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dime Vault™ Paid: ${job.earningsOrPrice} ({getPayoutMethodName(job.payoutMethodUsed)})</span>
                </div>
              )}
            </div>

            {/* Before / After Selector Buttons */}
            {job.beforePhotoUrl && (
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setActivePhotoView('before')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                    activePhotoView === 'before'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black scale-105'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>1. View Before Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhotoView('after')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                    activePhotoView === 'after'
                      ? 'bg-emerald-500 text-white shadow-md font-black scale-105'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>2. View Completed Result</span>
                </button>
              </div>
            )}

            {/* Location & Time stats */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1 border-t border-slate-900 pt-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {job.location.neighborhood}, {job.location.city}, {job.location.state}
              </span>
              {job.timeSpent && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {job.timeSpent} turnaround
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Work Details, Verified Provider & Client Feedback */}
          <div className="lg:col-span-5 p-5 sm:p-6 space-y-5 flex flex-col justify-between bg-slate-900">
            <div className="space-y-4">
              {/* Title & Price */}
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white leading-snug">
                  {job.title}
                </h3>
                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-3xl font-display font-black text-amber-400">
                    ${job.earningsOrPrice}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    {job.type === 'completed_job' ? 'Paid Daily to Provider' : 'Service Base Quote'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {job.description}
              </div>

              {/* Provider Info Card */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {job.type === 'completed_job' ? 'Completed by Verified Neighbor' : 'Service Provider'}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={job.provider.avatar}
                      alt={job.provider.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
                    />
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        <span>{job.provider.name}</span>
                        {job.provider.isIdVerified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                            <ShieldCheck className="w-3 h-3" />
                            ID Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-400 mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold">{job.provider.rating}</span>
                        <span className="text-slate-500">({job.provider.reviewsCount} tasks)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Review Box */}
              {job.clientReview && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-400/30 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300">{job.clientReview.author}</span>
                    <div className="flex items-center text-amber-400">
                      {[...Array(job.clientReview.stars)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 italic">
                    "{job.clientReview.comment}"
                  </p>
                </div>
              )}

              {/* Escrow Guarantee Pill */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Dime Vault™ Guaranteed:</strong> Funds held safely in escrow until you approve the completed photo & job.
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  onRequestService(job);
                  onClose();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 font-black rounded-xl text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Hire / Request Work Like This</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Showcase
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
