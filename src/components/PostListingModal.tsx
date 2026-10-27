import React, { useState, useRef } from 'react';
import { 
  X, Lock, ShieldCheck, DollarSign, ArrowRight, CheckCircle2, 
  AlertCircle, MapPin, Camera, Upload, Trash2, Sparkles, Package, Wrench, Briefcase, Truck
} from 'lucide-react';
import { Task, TaskCategory, UserProfile, MarketplaceItem, ItemCategory, ItemCondition } from '../types';
import { CATEGORIES_LIST, ITEM_CATEGORIES_LIST, US_STATES, POPULAR_METROS } from '../data/mockData';

interface PostListingModalProps {
  currentUser: UserProfile;
  initialMode?: 'item' | 'task' | 'service';
  onClose: () => void;
  onTaskCreated: (newTask: Partial<Task>) => void;
  onItemCreated: (newItem: Partial<MarketplaceItem>) => void;
  onOpenIdModal: () => void;
}

const SAMPLE_PHOTO_PRESETS = [
  {
    name: 'Cordless Drill',
    url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    title: 'DeWalt 20V MAX Cordless Drill Kit with 2 Batteries',
    price: 95,
    category: 'tools_hardware' as ItemCategory,
  },
  {
    name: 'Lawn Mower',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22500?auto=format&fit=crop&w=800&q=80',
    title: 'Honda 21” Self-Propelled Gas Lawn Mower (Fresh Tune-Up)',
    price: 185,
    category: 'lawn_garden' as ItemCategory,
  },
  {
    name: 'Mountain Bike',
    url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    title: 'Trek 24-Speed Aluminum Mountain Bike (Disc Brakes)',
    price: 240,
    category: 'sports_outdoors' as ItemCategory,
  },
  {
    name: 'Acoustic Guitar',
    url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
    title: 'Fender Dreadnought Acoustic Guitar with Padded Gig Bag',
    price: 120,
    category: 'electronics' as ItemCategory,
  },
  {
    name: 'Oak Table',
    url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
    title: 'Solid Oak Mid-Century Modern Coffee Table',
    price: 150,
    category: 'furniture_home' as ItemCategory,
  },
];

export const PostListingModal: React.FC<PostListingModalProps> = ({
  currentUser,
  initialMode = 'item',
  onClose,
  onTaskCreated,
  onItemCreated,
  onOpenIdModal,
}) => {
  const [listingMode, setListingMode] = useState<'item' | 'task' | 'service'>(initialMode);

  // Common location state
  const [city, setCity] = useState(currentUser.city || 'Austin');
  const [state, setState] = useState(currentUser.state || 'TX');
  const [zipCode, setZipCode] = useState(currentUser.zipCode || '78704');
  const [neighborhood, setNeighborhood] = useState(currentUser.neighborhood || 'South Congress');
  const [address, setAddress] = useState('1200 Main St');

  // Item form states
  const [itemTitle, setItemTitle] = useState('');
  const [itemPrice, setItemPrice] = useState<number>(75);
  const [itemCondition, setItemCondition] = useState<ItemCondition>('like_new');
  const [itemCategory, setItemCategory] = useState<ItemCategory>('tools_hardware');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPickupType, setItemPickupType] = useState<'local_pickup' | 'meet_public' | 'seller_delivery' | 'shipping'>('local_pickup');
  const [itemPhotoUrl, setItemPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80');
  const [isCustomPhotoUploaded, setIsCustomPhotoUploaded] = useState(false);

  // Fulfillment & Shipping States
  const [allowShipping, setAllowShipping] = useState(true);
  const [shippingCost, setShippingCost] = useState<number>(9.50);
  const [shippingCarrier, setShippingCarrier] = useState<'USPS' | 'UPS' | 'FedEx' | 'Standard'>('USPS');
  const [allowPickup, setAllowPickup] = useState(true);
  const [pickupLocationNotes, setPickupLocationNotes] = useState('Safe public meeting spot or porch pickup');
  const [allowDelivery, setAllowDelivery] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState<number>(10);
  const [deliveryRadiusMiles, setDeliveryRadiusMiles] = useState<number>(15);

  // Task form states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('home_repair');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskBudget, setTaskBudget] = useState<number>(80);
  const [taskUrgency, setTaskUrgency] = useState<'urgent_today' | 'tomorrow' | 'this_week' | 'flexible'>('urgent_today');

  // Service form states
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceRate, setServiceRate] = useState<number>(45);
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceCategory, setServiceCategory] = useState<TaskCategory>('home_repair');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local image file upload with FileReader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setItemPhotoUrl(event.target.result as string);
          setIsCustomPhotoUploaded(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset = (preset: typeof SAMPLE_PHOTO_PRESETS[0]) => {
    setItemPhotoUrl(preset.url);
    setItemTitle(preset.title);
    setItemPrice(preset.price);
    setItemCategory(preset.category);
    setIsCustomPhotoUploaded(true);
  };

  const handleQuickMetroSelect = (metroId: string) => {
    const found = POPULAR_METROS.find((m) => m.id === metroId);
    if (found && found.id !== 'all') {
      setCity(found.city);
      setState(found.state);
      setZipCode(found.zipCode);
      setNeighborhood(found.popularNeighborhoods[0] || 'Central');
    }
  };

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (listingMode === 'item') {
      if (!itemTitle.trim() || itemPrice <= 0 || !itemDescription.trim()) {
        alert('Please fill out the item title, asking price, and description.');
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        const newItem: Partial<MarketplaceItem> = {
          title: itemTitle.trim(),
          description: itemDescription.trim(),
          price: itemPrice,
          condition: itemCondition,
          category: itemCategory,
          imageUrl: itemPhotoUrl || 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
          status: 'available',
          location: {
            address,
            city: city.trim(),
            state: state.trim(),
            zipCode: zipCode.trim(),
            neighborhood: neighborhood.trim() || city.trim(),
            distanceMiles: 0.5,
          },
          pickupType: allowShipping ? 'shipping' : itemPickupType,
          fulfillment: {
            allowShipping,
            shippingCost: allowShipping ? Number(shippingCost) : undefined,
            shippingCarrier: allowShipping ? shippingCarrier : undefined,
            allowPickup,
            pickupLocationNotes: allowPickup ? pickupLocationNotes.trim() : undefined,
            allowDelivery,
            deliveryFee: allowDelivery ? Number(deliveryFee) : undefined,
            deliveryRadiusMiles: allowDelivery ? Number(deliveryRadiusMiles) : undefined,
          },
          seller: {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
            rating: currentUser.rating,
            reviewCount: currentUser.completedTasks,
            isIdVerified: currentUser.isIdVerified,
            neighborhood: neighborhood.trim() || city.trim(),
          },
          escrowStatus: 'held_in_vault',
          escrowVaultTxId: `ESC-ITEM-${Math.floor(10000 + Math.random() * 90000)}-${state}`,
          createdAt: 'Just now',
        };
        onItemCreated(newItem);
        setIsSubmitting(false);
        onClose();
      }, 500);
    } else if (listingMode === 'task') {
      if (!taskTitle.trim() || !taskDescription.trim() || taskBudget <= 10) {
        alert('Please fill out task details and an offer of at least $10.');
        return;
      }
      setIsSubmitting(true);
      const feePercent = 18;
      const platformFee = Number(((taskBudget * feePercent) / 100).toFixed(2));
      const taskerPayout = Number((taskBudget - platformFee).toFixed(2));

      setTimeout(() => {
        const newTask: Partial<Task> = {
          title: taskTitle.trim(),
          description: taskDescription.trim(),
          category: taskCategory,
          budgetOffer: taskBudget,
          platformFeePercent: feePercent,
          platformFee,
          taskerPayout,
          status: 'open',
          urgency: taskUrgency,
          deadlineFormatted: taskUrgency === 'urgent_today' ? 'Today before 6:00 PM' : 'Tomorrow',
          location: {
            address,
            city: city.trim(),
            state: state.trim(),
            zipCode: zipCode.trim(),
            neighborhood: neighborhood.trim() || city.trim(),
            distanceMiles: 1.0,
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
        onTaskCreated(newTask);
        setIsSubmitting(false);
        onClose();
      }, 500);
    } else {
      // Service offered - post as an available service task
      if (!serviceTitle.trim() || serviceRate <= 0) {
        alert('Please enter your service title and rate.');
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        const newTask: Partial<Task> = {
          title: `[Service Offered] ${serviceTitle.trim()}`,
          description: `${serviceDescription.trim()}\n\nService Provider: ${currentUser.name} (Verified Neighbor) · Standard Rate: $${serviceRate}/hr. Available for local booking with Dime Vault Escrow.`,
          category: serviceCategory,
          budgetOffer: serviceRate,
          platformFeePercent: 18,
          platformFee: Number(((serviceRate * 18) / 100).toFixed(2)),
          taskerPayout: Number(((serviceRate * 82) / 100).toFixed(2)),
          status: 'open',
          urgency: 'flexible',
          deadlineFormatted: 'Available This Week',
          location: {
            address,
            city: city.trim(),
            state: state.trim(),
            zipCode: zipCode.trim(),
            neighborhood: neighborhood.trim() || city.trim(),
            distanceMiles: 0.5,
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
          escrowVaultTxId: `ESC-SVC-${Math.floor(10000 + Math.random() * 90000)}-${state}`,
          createdAt: 'Just now',
          messages: [],
        };
        onTaskCreated(newTask);
        setIsSubmitting(false);
        onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                My Time Your Dime
              </span>
            </div>
            <h2 className="font-display font-bold text-lg text-white">
              {listingMode === 'item' && 'Post an Item for Sale with Photo'}
              {listingMode === 'task' && 'Post a Task (Got Tasks You Need Done?)'}
              {listingMode === 'service' && 'Offer a Service You Can Provide'}
            </h2>
            <p className="text-xs text-slate-300">
              Turn items or your time into cash · Protected by Escrow with Daily Payouts
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Way Mode Switcher Tabs */}
        <div className="p-2 bg-slate-100 border-b border-slate-200 grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => setListingMode('item')}
            className={`py-2 px-2 sm:px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              listingMode === 'item'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-amber-300" />
            <span className="truncate">Sell an Item (Photo)</span>
          </button>

          <button
            type="button"
            onClick={() => setListingMode('task')}
            className={`py-2 px-2 sm:px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              listingMode === 'task'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span className="truncate">Need a Task Done</span>
          </button>

          <button
            type="button"
            onClick={() => setListingMode('service')}
            className={`py-2 px-2 sm:px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              listingMode === 'service'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">Offer a Service</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Quick metro selector helper */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Listing Location:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {POPULAR_METROS.slice(1, 7).map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => handleQuickMetroSelect(m.id)}
                  className={`px-2 py-0.5 text-[11px] rounded font-semibold whitespace-nowrap transition-colors ${
                    city === m.city
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {m.city}, {m.state}
                </button>
              ))}
            </div>
          </div>

          {/* === MODE 1: SELL AN ITEM WITH PHOTO === */}
          {listingMode === 'item' && (
            <div className="space-y-4">
              
              {/* Photo Upload Zone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Item Photo (Required)</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Upload from your device or pick a preset
                  </span>
                </label>

                {/* File picker drop area */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="sm:col-span-7 border-2 border-dashed border-emerald-400/60 bg-emerald-50/30 hover:bg-emerald-50/60 rounded-xl p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[140px]"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="w-7 h-7 text-emerald-600 mb-1.5" />
                    <span className="text-xs font-bold text-slate-800">
                      Click to Browse & Upload Photo
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      JPG, PNG, WebP from phone camera or computer
                    </span>
                  </div>

                  {/* Photo Preview Thumbnail */}
                  <div className="sm:col-span-5 relative aspect-4/3 rounded-xl overflow-hidden border border-slate-300 bg-slate-900 shadow-inner flex items-center justify-center">
                    {itemPhotoUrl ? (
                      <>
                        <img
                          src={itemPhotoUrl}
                          alt="Item Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1.5 left-1.5 bg-slate-950/80 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          ✓ Photo Loaded
                        </div>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400">No Photo Selected</span>
                    )}
                  </div>
                </div>

                {/* Instant Sample Presets */}
                <div className="pt-1">
                  <span className="text-[11px] text-slate-500 font-medium block mb-1">
                    Or select a fast sample photo:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {SAMPLE_PHOTO_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset.name}
                        onClick={() => handleApplyPreset(preset)}
                        className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    What item are you selling?
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DeWalt 20V Cordless Drill with 2 Batteries & Charger"
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Asking Price ($ USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                    <input
                      type="number"
                      min="1"
                      required
                      value={itemPrice}
                      onChange={(e) => setItemPrice(Number(e.target.value))}
                      className="w-full text-xs pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Category & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value as ItemCategory)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none"
                  >
                    {ITEM_CATEGORIES_LIST.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Condition</label>
                  <select
                    value={itemCondition}
                    onChange={(e) => setItemCondition(e.target.value as ItemCondition)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none"
                  >
                    <option value="brand_new">Brand New (In Box / Sealed)</option>
                    <option value="like_new">Like New (Mint Condition)</option>
                    <option value="good">Good (Light Wear, 100% Functional)</option>
                    <option value="fair">Fair (Visible Wear, Works Fine)</option>
                  </select>
                </div>
              </div>

              {/* FULFILLMENT: SHIPPING, LOCAL PICKUP & DELIVERY OPTIONS */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Fulfillment: Shipping & Delivery (Select all that apply)</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                    Dime Vault™ Protected
                  </span>
                </div>

                {/* Option 1: Nationwide Shipping */}
                <div className={`p-3 rounded-xl border transition-all ${
                  allowShipping ? 'bg-white border-emerald-400 shadow-xs' : 'bg-slate-100/60 border-slate-200 opacity-80'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={allowShipping}
                        onChange={(e) => setAllowShipping(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                      />
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <span>📦 Nationwide Shipping</span>
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          All 50 States
                        </span>
                      </span>
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Funds hold until tracking delivery scan
                    </span>
                  </div>

                  {allowShipping && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-0.5">
                          Shipping Fee ($0 for Free Shipping)
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={shippingCost}
                            onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                            className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                            placeholder="9.50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-0.5">
                          Shipping Carrier
                        </label>
                        <select
                          value={shippingCarrier}
                          onChange={(e) => setShippingCarrier(e.target.value as any)}
                          className="w-full py-1.5 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                        >
                          <option value="USPS">USPS Priority / Ground Advantage</option>
                          <option value="UPS">UPS Ground</option>
                          <option value="FedEx">FedEx Home Delivery</option>
                          <option value="Standard">Standard Insured Shipping</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Option 2: Local Pick-up */}
                <div className={`p-3 rounded-xl border transition-all ${
                  allowPickup ? 'bg-white border-amber-400 shadow-xs' : 'bg-slate-100/60 border-slate-200 opacity-80'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={allowPickup}
                        onChange={(e) => setAllowPickup(e.target.checked)}
                        className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
                      />
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <span>📍 Local Pick-Up</span>
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          Neighborhood
                        </span>
                      </span>
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Buyer verifies 4-digit code at pickup
                    </span>
                  </div>

                  {allowPickup && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <label className="text-[11px] font-bold text-slate-600 block mb-0.5">
                        Suggested Pick-Up Location / Safe Zone Notes
                      </label>
                      <input
                        type="text"
                        value={pickupLocationNotes}
                        onChange={(e) => setPickupLocationNotes(e.target.value)}
                        placeholder="e.g. Police Dept Safe Exchange Zone, local grocery parking, or front porch"
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Option 3: Local Delivery */}
                <div className={`p-3 rounded-xl border transition-all ${
                  allowDelivery ? 'bg-white border-sky-400 shadow-xs' : 'bg-slate-100/60 border-slate-200 opacity-80'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={allowDelivery}
                        onChange={(e) => setAllowDelivery(e.target.checked)}
                        className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                      />
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <span>🚚 Local Delivery</span>
                        <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                          Doorstep Dropoff
                        </span>
                      </span>
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Earn extra delivery fee
                    </span>
                  </div>

                  {allowDelivery && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-0.5">
                          Delivery Fee
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={deliveryFee}
                            onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                            className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                            placeholder="10.00"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-0.5">
                          Max Delivery Radius
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={deliveryRadiusMiles}
                            onChange={(e) => setDeliveryRadiusMiles(parseInt(e.target.value) || 10)}
                            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                            placeholder="15"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">miles</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Item Description, Brand & Included Accessories
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe what condition it is in, any accessories included, brand model, and why you are selling..."
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Payout guarantee callout */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1 text-emerald-900">
                <div className="flex items-center gap-1.5 font-bold">
                  <Lock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Escrow Guarantee & Daily Payout</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  When a buyer purchases this item, their payment is locked in Dime Vault™ Escrow. After you hand over the item and they confirm, your payout sends directly to your linked Google Pay, Cash App, PayPal, Chime, or Stripe account!
                </p>
              </div>
            </div>
          )}

          {/* === MODE 2: POST A TASK NEEDED ("GOT TASKS") === */}
          {listingMode === 'task' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mow Front and Back Lawn + Trim Edges"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as TaskCategory)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                  >
                    {CATEGORIES_LIST.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Your Budget Offer ($ USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                    <input
                      type="number"
                      min="10"
                      required
                      value={taskBudget}
                      onChange={(e) => setTaskBudget(Number(e.target.value))}
                      className="w-full text-xs pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Urgency</label>
                <select
                  value={taskUrgency}
                  onChange={(e) => setTaskUrgency(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                >
                  <option value="urgent_today">Urgent - Needed Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="this_week">This Week</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Details & Scope of Work</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide details about the job, tools provided or needed, access instructions..."
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* === MODE 3: OFFER A SERVICE === */}
          {listingMode === 'service' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Service Offering Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Experienced Handyman & Drywall Repair Services"
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Service Category</label>
                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value as TaskCategory)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                  >
                    {CATEGORIES_LIST.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Hourly Rate or Base Fee ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                    <input
                      type="number"
                      min="15"
                      required
                      value={serviceRate}
                      onChange={(e) => setServiceRate(Number(e.target.value))}
                      className="w-full text-xs pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Skills, Tools Provided & Past Experience</label>
                <textarea
                  rows={3}
                  required
                  placeholder="List your background, tools you bring, license/certifications, and availability..."
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Location fields */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
              >
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">ZIP</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Neighborhood</label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
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
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-200" />
              <span>
                {isSubmitting
                  ? 'Publishing Listing...'
                  : listingMode === 'item'
                  ? 'Publish Item for Sale (Photo Attached)'
                  : listingMode === 'task'
                  ? 'Post Task & Lock in Escrow'
                  : 'Publish Service Offering'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
