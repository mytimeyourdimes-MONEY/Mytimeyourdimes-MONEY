import React, { useState, useMemo } from 'react';
import { 
  Camera, CheckCircle2, Sparkles, Star, MapPin, 
  Clock, DollarSign, PlusCircle, ArrowUpRight, ShieldCheck, Eye, Layers 
} from 'lucide-react';
import { ShowcaseJob, TaskCategory } from '../types';

interface ShowcaseGalleryProps {
  showcaseJobs: ShowcaseJob[];
  onSelectJob: (job: ShowcaseJob) => void;
  onOpenUploadModal: () => void;
  onRequestService: (job: ShowcaseJob) => void;
}

export const ShowcaseGallery: React.FC<ShowcaseGalleryProps> = ({
  showcaseJobs,
  onSelectJob,
  onOpenUploadModal,
  onRequestService,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'completed_job' | 'service_available'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredJobs = useMemo(() => {
    return showcaseJobs.filter((job) => {
      if (filterType !== 'all' && job.type !== filterType) return false;
      if (selectedCategory !== 'all' && job.category !== selectedCategory) return false;
      return true;
    });
  }, [showcaseJobs, filterType, selectedCategory]);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'yard_lawn', name: 'Yard & Lawn' },
    { id: 'home_repair', name: 'Handyman & Repairs' },
    { id: 'tech_setup', name: 'Tech & TV Mounting' },
    { id: 'cleaning', name: 'Pressure Wash & Cleaning' },
    { id: 'moving_heavy', name: 'Moving & Assembly' },
  ];

  return (
    <section className="bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-800 relative overflow-hidden">
      {/* Background ambient lighting in Green, Gold, Silver */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header Block: Prominent Brand, Tagline & Direct Upload Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-black/90 border border-amber-400/60 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-md">
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real Photo Proof of Work</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white">
              Photos of <span className="text-emerald-400">Services That Can Be Done</span> &{' '}
              <span className="text-amber-400">Jobs Completed</span>
            </h2>

            {/* User Requested Exact Tagline */}
            <div className="inline-block bg-gradient-to-r from-emerald-950/90 via-black/90 to-amber-950/80 border border-emerald-500/40 rounded-lg px-3.5 py-1.5 shadow-sm">
              <p className="text-xs sm:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-amber-200 to-amber-400">
                Turn items, skills, labor, and services into daily money.
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Browse actual before & after photos, finished work, and services offered by verified neighbors. Every job is paid out daily through Dime Vault™ escrow.
            </p>
          </div>

          <button
            onClick={onOpenUploadModal}
            className="px-5 py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center gap-2 cursor-pointer transition-all shrink-0 border border-emerald-300/40"
          >
            <Camera className="w-4 h-4 text-slate-950" />
            <span>Post Work Photo / Service</span>
          </button>
        </div>

        {/* Filter Controls: Green, Gold, Black, Silver */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Type Tabs */}
          <div className="inline-flex p-1 bg-black/80 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Photos ({showcaseJobs.length})
            </button>

            <button
              onClick={() => setFilterType('completed_job')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                filterType === 'completed_job'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Jobs Completed ({showcaseJobs.filter(j => j.type === 'completed_job').length})</span>
            </button>

            <button
              onClick={() => setFilterType('service_available')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                filterType === 'service_available'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Services Available ({showcaseJobs.filter(j => j.type === 'service_available').length})</span>
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-200 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredJobs.map((job) => {
            const hasBeforePhoto = !!job.beforePhotoUrl;

            return (
              <div
                key={job.id}
                onClick={() => onSelectJob(job)}
                className="group bg-slate-900 border border-slate-800 hover:border-amber-400/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
              >
                {/* Photo Container */}
                <div className="relative aspect-4/3 bg-black overflow-hidden">
                  <img
                    src={job.photoUrl}
                    alt={job.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-md ${
                      job.type === 'completed_job'
                        ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
                        : 'bg-amber-950/90 text-amber-300 border border-amber-500/50'
                    }`}>
                      {job.type === 'completed_job' ? 'Job Completed' : 'Service Available'}
                    </span>

                    {hasBeforePhoto && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/85 text-amber-300 border border-slate-700 backdrop-blur-md flex items-center gap-1">
                        <Layers className="w-3 h-3 text-emerald-400" />
                        <span>Before & After</span>
                      </span>
                    )}
                  </div>

                  {/* Price / Daily Payout Tag */}
                  <div className="absolute bottom-2.5 left-2.5 bg-black/85 backdrop-blur-md border border-slate-700/80 px-2.5 py-1 rounded-lg text-white font-display font-extrabold text-sm shadow-md flex items-center gap-1.5">
                    <span className="text-amber-400 font-black">${job.earningsOrPrice}</span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase">
                      {job.type === 'completed_job' ? 'Paid Daily' : 'Base Rate'}
                    </span>
                  </div>

                  {/* Click to inspect overlay hint */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="bg-black/90 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-400/40 shadow-xl flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Click to View Full Photo Proof</span>
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      {job.categoryName}
                    </div>
                    <h3 className="font-display font-bold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  {/* Provider Info */}
                  <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={job.provider.avatar}
                        alt={job.provider.name}
                        className="w-7 h-7 rounded-full object-cover border border-amber-400"
                      />
                      <div className="text-left">
                        <div className="text-xs font-bold text-white flex items-center gap-1 truncate max-w-[100px]">
                          <span>{job.provider.name}</span>
                          {job.provider.isIdVerified && (
                            <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-0.5 text-[10px] text-amber-400">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          <span>{job.provider.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                        <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                        <span>{job.location.neighborhood}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        {job.type === 'completed_job' ? '✓ Escrow Disbursed' : 'Ready to Book'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout: Turn items, skills, labor, and services into daily money */}
        <div className="bg-gradient-to-r from-black via-slate-900 to-emerald-950 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-display font-extrabold text-white text-base">
              Got photos of work you've completed or services you offer?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Upload them to showcase your craftsmanship and start earning daily money via Google Pay, Cash App, PayPal, Chime, or Stripe.
            </p>
          </div>

          <button
            onClick={onOpenUploadModal}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Upload My Work Photos</span>
          </button>
        </div>

      </div>
    </section>
  );
};
