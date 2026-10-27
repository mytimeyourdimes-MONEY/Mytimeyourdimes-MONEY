import React, { useState } from 'react';
import { X, Lock, ShieldCheck, DollarSign, ArrowRight, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';
import { Task, TaskCategory, UserProfile } from '../types';
import { CATEGORIES_LIST, US_STATES, POPULAR_METROS } from '../data/mockData';

interface PostTaskModalProps {
  currentUser: UserProfile;
  onClose: () => void;
  onTaskCreated: (newTask: Partial<Task>) => void;
  onOpenIdModal: () => void;
}

export const PostTaskModal: React.FC<PostTaskModalProps> = ({
  currentUser,
  onClose,
  onTaskCreated,
  onOpenIdModal,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('home_repair');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState<number>(80);
  const [urgency, setUrgency] = useState<'urgent_today' | 'tomorrow' | 'this_week' | 'flexible'>('urgent_today');
  const [address, setAddress] = useState('1204 Main St');
  const [neighborhood, setNeighborhood] = useState('Downtown');
  const [city, setCity] = useState(currentUser.city || 'Austin');
  const [state, setState] = useState(currentUser.state || 'TX');
  const [zipCode, setZipCode] = useState(currentUser.zipCode || '78704');
  const [fundingMethod, setFundingMethod] = useState<'google_pay' | 'stripe' | 'paypal' | 'cashapp'>('google_pay');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fee percentage between 15% and 20%
  const feePercent = 18;
  const platformFee = Number(((budget * feePercent) / 100).toFixed(2));
  const taskerTakeHome = Number((budget - platformFee).toFixed(2));

  const handleQuickMetroSelect = (metroId: string) => {
    const found = POPULAR_METROS.find((m) => m.id === metroId);
    if (found && found.id !== 'all') {
      setCity(found.city);
      setState(found.state);
      setZipCode(found.zipCode);
      setNeighborhood(found.popularNeighborhoods[0] || 'Central');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || budget <= 10) {
      alert('Please fill out task details and enter an offer of at least $10.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const createdTask: Partial<Task> = {
        title: title.trim(),
        description: description.trim(),
        category,
        budgetOffer: budget,
        platformFeePercent: feePercent,
        platformFee,
        taskerPayout: taskerTakeHome,
        status: 'open',
        urgency,
        deadlineFormatted: urgency === 'urgent_today' ? 'Today before 6:00 PM' : 'Tomorrow by 1:00 PM',
        location: {
          address,
          city: city.trim(),
          state: state.trim(),
          zipCode: zipCode.trim(),
          neighborhood: neighborhood.trim() || city.trim(),
          distanceMiles: 1.2,
        },
        poster: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          rating: currentUser.rating,
          reviewCount: currentUser.completedTasks,
          isIdVerified: currentUser.isIdVerified,
          neighborhood: neighborhood.trim() || city.trim(),
        },
        escrowStatus: 'held_in_vault',
        escrowVaultTxId: `ESC-VAULT-${Math.floor(10000 + Math.random() * 90000)}-${state}`,
        createdAt: 'Just now',
        messages: [],
      };

      onTaskCreated(createdTask);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="font-display font-bold text-lg text-slate-900">
              Post a Task & Name Your Price
            </h2>
            <p className="text-xs text-slate-500">
              Available in all 50 states. Funds are safely held in Escrow until you approve the work.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES_LIST.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all ${
                    category === cat.id
                      ? 'border-amber-500 bg-amber-50/70 text-slate-950 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="block truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Task Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              What do you need done? (Task Title)
            </label>
            <input
              type="text"
              placeholder="e.g. Help haul 2 wooden dressers to curbside, or assemble patio furniture"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Detailed Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Task Details & What's Provided
            </label>
            <textarea
              rows={3}
              placeholder="Describe what needs to be done, heavy tools required vs what you provide, parking directions, and any specific safety requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
              required
            />
          </div>

          {/* Nationwide Location Section */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Task Location (Any City & State in the US)</span>
              </label>
              <span className="text-[11px] text-slate-500">Nationwide Coverage</span>
            </div>

            {/* Quick Metro Autofill Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">Quick fill:</span>
              {[
                { id: 'austin-tx', label: 'Austin' },
                { id: 'nyc-ny', label: 'NYC' },
                { id: 'la-ca', label: 'LA' },
                { id: 'miami-fl', label: 'Miami' },
                { id: 'chicago-il', label: 'Chicago' },
                { id: 'atlanta-ga', label: 'Atlanta' },
                { id: 'denver-co', label: 'Denver' },
                { id: 'seattle-wa', label: 'Seattle' },
                { id: 'dallas-tx', label: 'Dallas' },
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => handleQuickMetroSelect(m.id)}
                  className="px-2 py-0.5 text-[11px] font-semibold bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 whitespace-nowrap transition-colors"
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Street & Neighborhood */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Street Address or Cross Streets
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1420 Main St or 5th & Elm"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Neighborhood or Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Downtown, South Congress, Lincoln Park"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* City, State, ZIP */}
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-6 sm:col-span-5">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Austin, Miami, Boise"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="col-span-3 sm:col-span-3">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs px-2 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                >
                  {US_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-3 sm:col-span-4">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. 78704"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>

            {/* Timing & Urgency */}
            <div className="pt-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Urgency & Timing
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              >
                <option value="urgent_today">Needed Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="this_week">This Week</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>

          {/* What are you willing to pay? */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                What are you willing to pay for this task?
              </label>
              <div className="flex items-center gap-1 font-display font-extrabold text-2xl text-slate-950">
                <span>$</span>
                <input
                  type="number"
                  min={15}
                  max={2500}
                  value={budget}
                  onChange={(e) => setBudget(Math.max(0, Number(e.target.value)))}
                  className="w-24 text-right bg-white border border-slate-300 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Quick Price Buttons */}
            <div className="flex items-center gap-2 pt-1">
              {[40, 65, 95, 120, 180].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setBudget(preset)}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors ${
                    budget === preset
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>

            {/* Transparent 18% Fee & Escrow calculation breakdown */}
            <div className="pt-3 border-t border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Your Escrow Deposit:</span>
                <span className="font-semibold text-slate-900 tabular-nums">${budget.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Escrow & Protection Fee (18%):</span>
                <span className="font-semibold text-amber-700 tabular-nums">-${platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-slate-200">
                <span>Local Tasker Net Payout:</span>
                <span className="text-emerald-700 font-display text-base tabular-nums">
                  ${taskerTakeHome.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                Money is held in our secure FDIC-insured Escrow vault. Your card is pre-authorized now, but zero funds are released to the tasker until you inspect and approve the completed job.
              </p>
            </div>
          </div>

          {/* Escrow Pre-Authorization Funding Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Escrow Pre-Authorization Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setFundingMethod('google_pay')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  fundingMethod === 'google_pay'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Google Pay</span>
                <span className="text-[10px] text-slate-500 font-normal">Instant hold</span>
              </button>

              <button
                type="button"
                onClick={() => setFundingMethod('stripe')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  fundingMethod === 'stripe'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Stripe / Card</span>
                <span className="text-[10px] text-slate-500 font-normal">•••• 4892</span>
              </button>

              <button
                type="button"
                onClick={() => setFundingMethod('paypal')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  fundingMethod === 'paypal'
                    ? 'border-blue-700 bg-blue-50/70 text-blue-900 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>PayPal</span>
                <span className="text-[10px] text-slate-500 font-normal">Vault hold</span>
              </button>

              <button
                type="button"
                onClick={() => setFundingMethod('cashapp')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  fundingMethod === 'cashapp'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Cash App Pay</span>
                <span className="text-[10px] text-slate-500 font-normal">Instant lock</span>
              </button>
            </div>
          </div>

          {/* Mandatory ID Notice */}
          <div className="flex items-start gap-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Posting with ID-Verified Badge:</span>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Posting as {currentUser.name} ({currentUser.idDetails?.idType ? 'State ID Verified' : 'ID Checked'}).
                All neighbors claiming your task must also be fully government ID-verified.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-smooth flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Securing in Escrow...' : `Lock $${budget} in Escrow & Post Task`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
