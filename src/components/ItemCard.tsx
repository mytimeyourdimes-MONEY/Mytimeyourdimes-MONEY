import React from 'react';
import { ShieldCheck, MapPin, Lock, ArrowUpRight, Camera, CheckCircle2 } from 'lucide-react';
import { MarketplaceItem } from '../types';

interface ItemCardProps {
  item: MarketplaceItem;
  onSelect: (item: MarketplaceItem) => void;
  onBuyQuick?: (item: MarketplaceItem) => void;
  isMyItem?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onSelect,
  onBuyQuick,
  isMyItem = false,
}) => {
  const conditionLabels = {
    brand_new: { text: 'Brand New', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    like_new: { text: 'Like New', color: 'text-amber-800 bg-amber-50 border-amber-200' },
    good: { text: 'Good Condition', color: 'text-slate-700 bg-slate-100 border-slate-200' },
    fair: { text: 'Fair Condition', color: 'text-slate-600 bg-slate-100 border-slate-200' },
  }[item.condition];

  const categoryLabels = {
    tools_hardware: 'Tools & Hardware',
    lawn_garden: 'Lawn & Garden',
    electronics: 'Electronics & Audio',
    furniture_home: 'Furniture & Home',
    sports_outdoors: 'Bikes & Sports',
    auto_parts: 'Auto & Garage',
    other: 'General Goods',
  }[item.category] || 'Item for Sale';

  const pickupLabel: Record<string, string> = {
    local_pickup: 'Porch Pickup',
    meet_public: 'Public Meetup',
    seller_delivery: 'Local Delivery',
    shipping: 'Ships Nationwide',
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative bg-white border border-slate-200 hover:border-amber-400 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Photo Container with Escrow Badge and Category */}
        <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />

          {/* Condition tag top left */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm border ${conditionLabels.color}`}>
              {conditionLabels.text}
            </span>
            <span className="text-[11px] font-semibold text-slate-200 bg-slate-950/80 backdrop-blur-sm px-2 py-1 rounded-md border border-slate-700">
              {pickupLabel[item.pickupType] || 'Local Pickup'}
            </span>
          </div>

          {/* Photo indicator top right */}
          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm text-slate-200 text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1 border border-slate-700">
            <Camera className="w-3 h-3 text-amber-400" />
            <span>Photo Verified</span>
          </div>

          {/* Price overlay bottom left */}
          <div className="absolute bottom-3 left-3">
            <div className="flex items-baseline gap-1 text-white">
              <span className="text-xs text-amber-300 font-bold">$</span>
              <span className="font-display font-black text-2xl text-amber-400 tabular-nums drop-shadow-sm">
                {item.price}
              </span>
            </div>
          </div>

          {/* Escrow guarantee tag bottom right */}
          <div className="absolute bottom-3 right-3 bg-emerald-950/90 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1 shadow-sm">
            <Lock className="w-2.5 h-2.5 text-emerald-400" />
            <span>Escrow Protected</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          {/* Metadata line */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-medium text-slate-600">{categoryLabels}</span>
            <span className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{item.location.neighborhood}, {item.location.city}</span>
              <span className="text-slate-400">({item.location.distanceMiles} mi)</span>
            </span>
          </div>

          {/* Item Title */}
          <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-2 leading-snug">
            {item.title}
          </h3>

          {/* Description snippet */}
          <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Fulfillment Badges: Shipping, Pickup, Delivery */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold">
            {item.fulfillment?.allowShipping && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-bold">
                <span>📦</span>
                <span>{item.fulfillment.shippingCost === 0 ? 'Free Shipping' : `$${item.fulfillment.shippingCost?.toFixed(2)} Shipping`}</span>
              </span>
            )}
            {item.fulfillment?.allowPickup && (
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1 font-bold">
                <span>📍</span>
                <span>Local Pickup</span>
              </span>
            )}
            {item.fulfillment?.allowDelivery && (
              <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-900 border border-sky-200 flex items-center gap-1 font-bold">
                <span>🚚</span>
                <span>Local Delivery</span>
              </span>
            )}
          </div>

          {/* Seller Profile row */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={item.seller.avatar}
                alt={item.seller.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
              <div className="text-xs">
                <div className="flex items-center gap-1 font-semibold text-slate-800">
                  <span>{item.seller.name}</span>
                  {item.seller.isIdVerified && (
                    <span title="Government ID Verified Seller">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </span>
                  )}
                </div>
                <span className="text-slate-400 text-[11px]">
                  ★ {item.seller.rating.toFixed(1)} · Verified Seller
                </span>
              </div>
            </div>

            <span className="text-[11px] text-slate-400 font-medium">
              {item.createdAt}
            </span>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100">
        <div className="text-xs text-slate-500">
          <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
            <CheckCircle2 className="w-3 h-3" />
            <span>Funds held safe until inspect</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {item.status === 'available' && onBuyQuick && !isMyItem ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBuyQuick(item);
              }}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <Lock className="w-3 h-3 text-emerald-200" />
              <span>Buy with Escrow</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item);
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{isMyItem ? 'Manage Item' : 'View Item'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
