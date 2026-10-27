import React, { useState, useRef } from 'react';
import { 
  X, Camera, Upload, CheckCircle2, DollarSign, Sparkles, 
  MapPin, Clock, ArrowRight, ShieldCheck, AlertCircle, Trash2 
} from 'lucide-react';
import { ShowcaseJob, TaskCategory, PayoutMethod, UserProfile } from '../types';

interface UploadShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddShowcaseJob: (job: ShowcaseJob) => void;
  currentUser: UserProfile;
}

const SAMPLE_SHOWCASE_PHOTOS = [
  {
    name: 'Striped Lawn Cut',
    category: 'yard_lawn' as TaskCategory,
    categoryName: 'Yard & Lawn Care',
    photoUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=1000&q=80',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=800&q=80',
    title: 'Precision Commercial Zero-Turn Lawn Cut & Edging',
    price: 130,
  },
  {
    name: 'Mounted TV No Wires',
    category: 'tech_setup' as TaskCategory,
    categoryName: 'Tech & Electronics',
    photoUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1000&q=80',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=800&q=80',
    title: 'Flush TV Mount & In-Wall Power Bridge',
    price: 150,
  },
  {
    name: 'Freshly Stained Deck',
    category: 'home_repair' as TaskCategory,
    categoryName: 'Handyman & Repairs',
    photoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
    title: 'Power-Sanded & Weatherproof Stained Patio',
    price: 340,
  },
  {
    name: 'Concrete Power Wash',
    category: 'cleaning' as TaskCategory,
    categoryName: 'Cleaning & Pressure Wash',
    photoUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    title: 'Driveway Rotary Pressure Washing',
    price: 185,
  },
  {
    name: 'Car Ceramic Detailing',
    category: 'cleaning' as TaskCategory,
    categoryName: 'Auto Care & Detailing',
    photoUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1000&q=80',
    title: 'Interior Steam & Exterior Gloss Buff',
    price: 160,
  },
  {
    name: 'Wardrobe Assembly',
    category: 'moving_heavy' as TaskCategory,
    categoryName: 'Assembly & Moving',
    photoUrl: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1000&q=80',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    title: 'Complex Furniture & Wardrobe Assembly',
    price: 210,
  },
];

export const UploadShowcaseModal: React.FC<UploadShowcaseModalProps> = ({
  isOpen,
  onClose,
  onAddShowcaseJob,
  currentUser,
}) => {
  const [type, setType] = useState<'completed_job' | 'service_available'>('completed_job');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('yard_lawn');
  const [description, setDescription] = useState('');
  const [earningsOrPrice, setEarningsOrPrice] = useState<number>(140);
  const [payoutMethodUsed, setPayoutMethodUsed] = useState<PayoutMethod>('cashapp');
  const [timeSpent, setTimeSpent] = useState('2 hours');
  const [photoUrl, setPhotoUrl] = useState('');
  const [beforePhotoUrl, setBeforePhotoUrl] = useState('');
  const [neighborhood, setNeighborhood] = useState(currentUser.neighborhood || 'Local Metro');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const beforeFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof SAMPLE_SHOWCASE_PHOTOS[0]) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setPhotoUrl(preset.photoUrl);
    setBeforePhotoUrl(preset.beforePhotoUrl || '');
    setEarningsOrPrice(preset.price);
    setDescription(`Professional quality ${preset.categoryName.toLowerCase()} service with Dime Vault escrow protection. All tools and equipment provided.`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isBefore = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (isBefore) {
            setBeforePhotoUrl(reader.result);
          } else {
            setPhotoUrl(reader.result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errList: string[] = [];
    if (!title.trim()) errList.push('Please enter a descriptive title for the work.');
    if (!photoUrl.trim()) errList.push('Please upload or select a main photo of the work or service.');
    if (!earningsOrPrice || earningsOrPrice <= 0) errList.push('Please specify a valid earnings or service price.');

    if (errList.length > 0) {
      setErrors(errList);
      return;
    }

    setErrors([]);

    const categoryNames: Record<TaskCategory, string> = {
      yard_lawn: 'Yard & Lawn Care',
      home_repair: 'Handyman & Repairs',
      tech_setup: 'Tech & Electronics',
      cleaning: 'Cleaning & Pressure Wash',
      moving_heavy: 'Assembly & Heavy Moving',
      errands: 'Local Errands & Delivery',
      pet_care: 'Pet Sitting & Walking',
      event_help: 'Event & Hospitality Help',
    };

    const newShowcaseJob: ShowcaseJob = {
      id: `shw_${Date.now()}`,
      title,
      category,
      categoryName: categoryNames[category] || 'General Service',
      type,
      description: description.trim() || `Verified ${type === 'completed_job' ? 'completed task' : 'available service'} by ${currentUser.name}. Protected by Dime Vault™ daily escrow.`,
      photoUrl,
      beforePhotoUrl: beforePhotoUrl || undefined,
      afterPhotoUrl: photoUrl,
      earningsOrPrice: Number(earningsOrPrice),
      payoutMethodUsed: type === 'completed_job' ? payoutMethodUsed : undefined,
      completedAtText: type === 'completed_job' ? 'Just now' : undefined,
      timeSpent: timeSpent || '2 hours',
      location: {
        city: currentUser.city || 'Austin',
        state: currentUser.state || 'TX',
        neighborhood: neighborhood || 'Local Neighborhood',
      },
      provider: {
        name: currentUser.name || 'Verified Neighbor',
        avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        isIdVerified: true,
        rating: 4.97,
        reviewsCount: (currentUser.completedTasks || 12) + 1,
      },
      clientReview: type === 'completed_job' ? {
        author: 'Satisfied Customer',
        comment: 'Outstanding attention to detail. Released funds immediately through Dime Vault™ escrow!',
        stars: 5,
      } : undefined,
      escrowPayoutStatus: type === 'completed_job' ? 'paid_out_daily' : 'ready_to_book',
    };

    onAddShowcaseJob(newShowcaseJob);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full text-white shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-slate-950 shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-white">
                Post Photo of Work or Service
              </h3>
              <p className="text-xs text-slate-400">
                Showcase jobs you’ve completed or services you can provide to earn daily money
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-display font-bold text-white">Photo Published to Showcase!</h4>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your work photo has been added to the public gallery for neighbors to view, hire, and book with Dime Vault™ escrow protection.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Errors */}
            {errors.length > 0 && (
              <div className="p-3.5 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-200 space-y-1">
                {errors.map((err, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Toggle Type: Completed Job vs Available Service */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                What are you posting?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('completed_job')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    type === 'completed_job'
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Job I Completed</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Proof of work done, showing before/after & daily money earned
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setType('service_available')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    type === 'service_available'
                      ? 'bg-amber-950/80 border-amber-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-amber-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Service I Can Provide</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Photos of your skills, equipment & rate to get booked
                  </p>
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Work Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={type === 'completed_job' ? "e.g. Lawn Mowed & Edged with Striping Pattern" : "e.g. Mobile Pressure Washing & Surface Cleaning"}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="yard_lawn">Yard & Lawn Care</option>
                <option value="home_repair">Handyman & Home Repairs</option>
                <option value="tech_setup">Tech & Electronics</option>
                <option value="cleaning">Cleaning & Pressure Washing</option>
                <option value="moving_heavy">Moving & Furniture Assembly</option>
                <option value="errands">Errands & Local Delivery</option>
                <option value="pet_care">Pet Care & Dog Walking</option>
                <option value="event_help">Event Help</option>
              </select>
            </div>

            {/* Photo Upload Section */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Photo of Work / Service *
              </label>

              {photoUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-emerald-500/50 aspect-16/9 bg-black">
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="absolute top-2 right-2 p-1.5 bg-black/80 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/80 text-emerald-400 text-xs px-2.5 py-1 rounded-md font-bold">
                    ✓ Main Photo Ready
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/70 transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, false)}
                  />
                  <Upload className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">Click to Upload Photo</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, or WEBP from your device or camera</p>
                </div>
              )}

              {/* Sample Photo Presets for Quick Testing */}
              <div>
                <p className="text-xs text-slate-400 font-semibold mb-2">
                  Or pick a one-click sample photo preset:
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {SAMPLE_SHOWCASE_PHOTOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="group relative rounded-xl overflow-hidden border border-slate-700 hover:border-amber-400 text-left p-1 bg-slate-950 transition-all cursor-pointer"
                    >
                      <img src={preset.photoUrl} alt={preset.name} className="w-full h-12 object-cover rounded-lg group-hover:scale-105 transition-transform" />
                      <p className="text-[10px] font-bold text-slate-200 mt-1 truncate">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional Before Photo (for completed jobs) */}
            {type === 'completed_job' && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Optional "Before" Photo (for Before & After Proof)
                  </label>
                  {beforePhotoUrl && (
                    <button
                      type="button"
                      onClick={() => setBeforePhotoUrl('')}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {beforePhotoUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 aspect-16/9 bg-black max-h-36">
                    <img src={beforePhotoUrl} alt="Before Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 bg-black/80 text-amber-300 text-[10px] px-2 py-0.5 rounded font-bold">
                      Before Photo Set
                    </span>
                  </div>
                ) : (
                  <div
                    onClick={() => beforeFileInputRef.current?.click()}
                    className="border border-dashed border-slate-800 hover:border-slate-600 rounded-xl p-3 text-center cursor-pointer bg-slate-950/40 text-xs text-slate-400"
                  >
                    <input
                      ref={beforeFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, true)}
                    />
                    <span>+ Add Before Photo (e.g. overgrown lawn, plain wall, uncleaned driveway)</span>
                  </div>
                )}
              </div>
            )}

            {/* Earnings / Price & Payout method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {type === 'completed_job' ? 'Amount Earned ($) *' : 'Service Starting Price ($) *'}
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1"
                    value={earningsOrPrice}
                    onChange={(e) => setEarningsOrPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {type === 'completed_job' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Daily Payout Received Via
                  </label>
                  <select
                    value={payoutMethodUsed}
                    onChange={(e) => setPayoutMethodUsed(e.target.value as PayoutMethod)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="cashapp">Cash App ($Cashtag)</option>
                    <option value="google_pay">Google Pay</option>
                    <option value="chime">Chime Banking</option>
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe Instant</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Estimated Turnaround
                  </label>
                  <input
                    type="text"
                    value={timeSpent}
                    onChange={(e) => setTimeSpent(e.target.value)}
                    placeholder="e.g. 2 - 3 hours"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Work Details / Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what was done, equipment used, or service guarantee..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publish Photo to Showcase</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
