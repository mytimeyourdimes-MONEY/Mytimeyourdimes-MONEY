import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, SlidersHorizontal, AlertCircle, Globe, ChevronDown, 
  Camera, Package, Briefcase, PlusCircle, CheckCircle2, Lock, Sparkles 
} from 'lucide-react';
import { Task, TaskCategory, LocationFilter, MarketplaceItem, ItemCategory } from '../types';
import { CATEGORIES_LIST, ITEM_CATEGORIES_LIST, POPULAR_METROS } from '../data/mockData';
import { TaskCard } from './TaskCard';
import { ItemCard } from './ItemCard';

interface TaskMarketplaceProps {
  tasks: Task[];
  items?: MarketplaceItem[];
  locationFilter: LocationFilter;
  onOpenLocationModal: () => void;
  onSelectMetro: (metroId: string) => void;
  onSelectTask: (task: Task) => void;
  onAcceptTask: (task: Task) => void;
  onSelectItem?: (item: MarketplaceItem) => void;
  onBuyItemQuick?: (item: MarketplaceItem) => void;
  onPostClick: () => void;
  onSellItemClick?: () => void;
  onOfferServiceClick?: () => void;
}

export const TaskMarketplace: React.FC<TaskMarketplaceProps> = ({
  tasks,
  items = [],
  locationFilter,
  onOpenLocationModal,
  onSelectMetro,
  onSelectTask,
  onAcceptTask,
  onSelectItem,
  onBuyItemQuick,
  onPostClick,
  onSellItemClick,
  onOfferServiceClick,
}) => {
  const [viewTab, setViewTab] = useState<'all' | 'items' | 'tasks' | 'services'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskCategory, setSelectedTaskCategory] = useState<TaskCategory | 'all'>('all');
  const [selectedItemCategory, setSelectedItemCategory] = useState<ItemCategory | 'all'>('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<'all' | 'shipping' | 'local_pickup' | 'local_delivery'>('all');
  const [sortBy, setSortBy] = useState<'highest_pay' | 'nearest' | 'newest' | 'price_low'>('newest');

  // Filter Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (task.status !== 'open') return false;

        // Service offering filter
        const isService = task.title.startsWith('[Service Offered]');
        if (viewTab === 'tasks' && isService) return false;
        if (viewTab === 'services' && !isService) return false;

        // Location filtering
        if (locationFilter.metroId !== 'all') {
          const locQuery = (locationFilter.customQuery || locationFilter.city || '').toLowerCase();
          const targetCity = locationFilter.city.toLowerCase();
          const targetState = locationFilter.state.toLowerCase();
          const targetZip = locationFilter.zipCode;

          const matchCity = task.location.city.toLowerCase().includes(targetCity);
          const matchState = targetState && task.location.state.toLowerCase() === targetState;
          const matchZip = targetZip && task.location.zipCode === targetZip;
          const matchQuery = locQuery && (
            task.location.city.toLowerCase().includes(locQuery) ||
            task.location.state.toLowerCase().includes(locQuery) ||
            task.location.neighborhood.toLowerCase().includes(locQuery)
          );

          if (!matchCity && !matchState && !matchZip && !matchQuery) {
            return false;
          }

          if (locationFilter.radiusMiles < 9999 && task.location.distanceMiles > locationFilter.radiusMiles) {
            return false;
          }
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description.toLowerCase().includes(q);
          const matchArea = task.location.neighborhood.toLowerCase().includes(q);
          const matchCity = task.location.city.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchArea && !matchCity) return false;
        }

        // Category filter
        if (selectedTaskCategory !== 'all' && task.category !== selectedTaskCategory) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'highest_pay') return b.budgetOffer - a.budgetOffer;
        if (sortBy === 'nearest') return a.location.distanceMiles - b.location.distanceMiles;
        if (sortBy === 'price_low') return a.budgetOffer - b.budgetOffer;
        return 0; // default newest
      });
  }, [tasks, locationFilter, searchQuery, selectedTaskCategory, sortBy, viewTab]);

  // Filter Items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (item.status !== 'available') return false;

        // Location filtering
        if (locationFilter.metroId !== 'all') {
          const locQuery = (locationFilter.customQuery || locationFilter.city || '').toLowerCase();
          const targetCity = locationFilter.city.toLowerCase();
          const targetState = locationFilter.state.toLowerCase();
          const targetZip = locationFilter.zipCode;

          const matchCity = item.location.city.toLowerCase().includes(targetCity);
          const matchState = targetState && item.location.state.toLowerCase() === targetState;
          const matchZip = targetZip && item.location.zipCode === targetZip;
          const matchQuery = locQuery && (
            item.location.city.toLowerCase().includes(locQuery) ||
            item.location.state.toLowerCase().includes(locQuery) ||
            item.location.neighborhood.toLowerCase().includes(locQuery)
          );

          // If item ships nationwide and user searched or filtered, allow shipping across boundaries
          const canShipNationwide = item.fulfillment?.allowShipping;
          if (!canShipNationwide && !matchCity && !matchState && !matchZip && !matchQuery) {
            return false;
          }

          if (!canShipNationwide && locationFilter.radiusMiles < 9999 && item.location.distanceMiles > locationFilter.radiusMiles) {
            return false;
          }
        }

        // Fulfillment filter
        if (fulfillmentFilter === 'shipping' && !item.fulfillment?.allowShipping) return false;
        if (fulfillmentFilter === 'local_pickup' && !item.fulfillment?.allowPickup) return false;
        if (fulfillmentFilter === 'local_delivery' && !item.fulfillment?.allowDelivery) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchArea = item.location.neighborhood.toLowerCase().includes(q);
          const matchCity = item.location.city.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchArea && !matchCity) return false;
        }

        // Category filter
        if (selectedItemCategory !== 'all' && item.category !== selectedItemCategory) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'highest_pay') return b.price - a.price;
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'nearest') return a.location.distanceMiles - b.location.distanceMiles;
        return 0;
      });
  }, [items, locationFilter, searchQuery, selectedItemCategory, fulfillmentFilter, sortBy]);

  const displayLocationTitle = locationFilter.metroId === 'all'
    ? 'All Areas Nationwide (50 States)'
    : locationFilter.customQuery
    ? locationFilter.customQuery
    : `${locationFilter.city}, ${locationFilter.state} Metro Area`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* 1. APP NAME HEADER - PROMINENTLY ABOVE NATIONWIDE & GOT TASKS STATEMENT */}
      <div className="bg-gradient-to-r from-black via-slate-950 to-emerald-950 border-2 border-amber-400/60 brand-marquee-glow rounded-3xl p-6 sm:p-7 shadow-2xl mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/15 px-3 py-1 rounded-full border border-amber-400/40 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>OFFICIAL APP & MARKETPLACE</span>
              </span>
              <span className="text-xs text-emerald-300 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Protected by Dime Vault™ Escrow
              </span>
            </div>

            {/* Clear & Distinctive Name of the App */}
            <div>
              <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight leading-none text-white drop-shadow-md">
                <span className="text-emerald-shimmer">My Time</span>{' '}
                <span className="text-gold-shimmer">Your Dime</span>
              </h2>
            </div>

            {/* User Requested Tagline: Turn items, skills, labor, and services into money */}
            <div className="inline-block bg-black/80 border border-emerald-400/40 rounded-xl px-4 py-2 shadow-inner">
              <p className="text-sm sm:text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-amber-200 to-amber-400">
                Turn items, skills, labor, and services into money
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Earn money 3 ways: <strong className="text-emerald-400">Sell an item with a photo</strong>, <strong className="text-amber-300">post a task you need done</strong>, or <strong className="text-slate-100">offer a service you can provide</strong>. Guaranteed daily payouts to Google Pay, Cash App, PayPal, Chime, and Stripe.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onSellItemClick || onPostClick}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer border border-emerald-400/30"
            >
              <Camera className="w-3.5 h-3.5 text-amber-300" />
              <span>Sell an Item (Add Photo)</span>
            </button>

            <button
              onClick={onPostClick}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer border border-amber-300/30"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post a Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. THREE-WAY VIEW SWITCHER TABS (Items with Photo, Tasks, Services, All) */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setViewTab('all')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            viewTab === 'all'
              ? 'bg-slate-950 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>All Opportunities ({filteredTasks.length + filteredItems.length})</span>
        </button>

        <button
          onClick={() => setViewTab('items')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            viewTab === 'items'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-amber-400" />
          <span>Items for Sale with Photos ({filteredItems.length})</span>
        </button>

        <button
          onClick={() => setViewTab('tasks')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            viewTab === 'tasks'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-white text-slate-800 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Tasks Needed · "Got Tasks" ({tasks.filter(t => t.status === 'open' && !t.title.startsWith('[Service Offered]')).length})</span>
        </button>

        <button
          onClick={() => setViewTab('services')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            viewTab === 'services'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
          <span>Services Offered by Neighbors</span>
        </button>
      </div>

      {/* 3. SEARCH & LOCATION CONTROL BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm mb-8 space-y-4">
        
        {/* Quick Area Filter Row */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap mr-1">
              Area:
            </span>
            {POPULAR_METROS.slice(0, 7).map((metro) => {
              const isSelected = locationFilter.metroId === metro.id;
              return (
                <button
                  key={metro.id}
                  onClick={() => onSelectMetro(metro.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {metro.name.replace('Metro', '').trim()}
                </button>
              );
            })}
          </div>

          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>Change City / ZIP / Radius</span>
            <ChevronDown className="w-3 h-3 ml-0.5" />
          </button>
        </div>

        {/* Search, Active Location, and Sort Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Keyword Search */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                viewTab === 'items'
                  ? 'Search tools, lawn gear, bikes, furniture, items with photos...'
                  : 'Search by task, item, service, tool, or neighborhood...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Location Area Tag */}
          <div 
            onClick={onOpenLocationModal}
            className="md:col-span-3 flex items-center justify-between gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="text-xs truncate">
                <span className="text-slate-500 block text-[10px]">Active Location:</span>
                <span className="font-bold text-slate-900 truncate block">
                  {locationFilter.metroId === 'all' ? 'Nationwide (All 50 States)' : `${locationFilter.city}, ${locationFilter.state}`}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 shrink-0">
              {locationFilter.radiusMiles >= 9999 ? 'All' : `${locationFilter.radiusMiles}mi`}
            </span>
          </div>

          {/* Sort By */}
          <div className="md:col-span-3 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" />
            <div className="text-xs w-full flex items-center justify-between">
              <span className="text-slate-600 font-medium whitespace-nowrap">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-900 font-semibold focus:outline-none cursor-pointer text-xs"
              >
                <option value="newest">Recently Posted</option>
                <option value="highest_pay">Highest Price / Budget</option>
                <option value="price_low">Lowest Price First</option>
                <option value="nearest">Nearest Distance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Fulfillment Method Selector Row (Shipping, Pickup, Delivery) */}
        {(viewTab === 'items' || viewTab === 'all') && (
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] whitespace-nowrap mr-1">
              Fulfillment:
            </span>
            <button
              onClick={() => setFulfillmentFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                fulfillmentFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Methods
            </button>
            <button
              onClick={() => setFulfillmentFilter('shipping')}
              className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                fulfillmentFilter === 'shipping'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <span>📦 Ships Nationwide</span>
            </button>
            <button
              onClick={() => setFulfillmentFilter('local_pickup')}
              className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                fulfillmentFilter === 'local_pickup'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span>📍 Local Pick-Up</span>
            </button>
            <button
              onClick={() => setFulfillmentFilter('local_delivery')}
              className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                fulfillmentFilter === 'local_delivery'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-sky-50 text-sky-900 border border-sky-200 hover:bg-sky-100'
              }`}
            >
              <span>🚚 Local Doorstep Delivery</span>
            </button>
          </div>
        )}

        {/* Category Filters: Tailored for Items or Tasks */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {viewTab === 'items' ? (
            <>
              <button
                onClick={() => setSelectedItemCategory('all')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedItemCategory === 'all'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                All Items ({items.length})
              </button>
              {ITEM_CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedItemCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    selectedItemCategory === cat.id
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </>
          ) : (
            <>
              <button
                onClick={() => setSelectedTaskCategory('all')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTaskCategory === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                All Task Categories ({tasks.filter((t) => t.status === 'open').length})
              </button>
              {CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedTaskCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    selectedTaskCategory === cat.id
                      ? 'bg-slate-900 text-white font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* 4. RESULTS HEADER & SUMMARY */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
              {displayLocationTitle}
            </h3>
            <button
              onClick={onOpenLocationModal}
              className="text-xs text-amber-800 font-semibold hover:underline cursor-pointer"
            >
              (Change Location)
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Dime Vault™ Escrow Protected · Daily Payouts (GPay, Cash App, PayPal, Chime, Stripe) · 100% ID Verified
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSellItemClick || onPostClick}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-amber-300" />
            <span>Sell Item with Photo</span>
          </button>

          <button
            onClick={onPostClick}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <span>Post a Task</span>
          </button>
        </div>
      </div>

      {/* 5. LISTINGS DISPLAY */}

      {/* SECTION A: ITEMS FOR SALE (When in 'all' or 'items' tab) */}
      {(viewTab === 'all' || viewTab === 'items') && filteredItems.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h4 className="font-display font-bold text-lg text-slate-900">
                Items for Sale in Your Area
              </h4>
              <span className="text-xs text-slate-500">
                ({filteredItems.length} available with verified photos)
              </span>
            </div>

            {viewTab === 'all' && (
              <button
                onClick={() => setViewTab('items')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                View all items →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onSelect={onSelectItem || (() => {})}
                onBuyQuick={onBuyItemQuick || onSelectItem || (() => {})}
              />
            ))}
          </div>
        </div>
      )}

      {/* SECTION B: TASKS & SERVICES (When in 'all', 'tasks', or 'services' tab) */}
      {(viewTab === 'all' || viewTab === 'tasks' || viewTab === 'services') && filteredTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h4 className="font-display font-bold text-lg text-slate-900">
                {viewTab === 'services' ? 'Services Offered by Skilled Neighbors' : 'Tasks Needed · "Got Tasks"'}
              </h4>
              <span className="text-xs text-slate-500">
                ({filteredTasks.length} open jobs with pre-funded escrow)
              </span>
            </div>

            {viewTab === 'all' && (
              <button
                onClick={() => setViewTab('tasks')}
                className="text-xs font-bold text-amber-800 hover:text-amber-900 cursor-pointer"
              >
                View all tasks →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onSelect={onSelectTask}
                onAcceptQuick={onAcceptTask}
              />
            ))}
          </div>
        </div>
      )}

      {/* SECTION C: EMPTY STATE */}
      {filteredTasks.length === 0 && filteredItems.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No listings found in {displayLocationTitle}
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Be the first to post an item for sale with a photo or post a task in this area! Or switch to "All Areas (Nationwide)" to see open jobs across all 50 states.
          </p>
          <div className="mt-5 flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => onSelectMetro('all')}
              className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              <span>Show Nationwide</span>
            </button>
            <button
              onClick={onSellItemClick || onPostClick}
              className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg cursor-pointer"
            >
              Sell an Item (Photo)
            </button>
            <button
              onClick={onPostClick}
              className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg cursor-pointer"
            >
              Post a Task
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
