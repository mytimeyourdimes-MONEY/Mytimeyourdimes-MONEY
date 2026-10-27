import React, { useState } from 'react';
import { 
  X, ShieldCheck, Lock, MapPin, CheckCircle2, 
  DollarSign, Send, ArrowRight, Camera, HelpCircle, Truck, PackageCheck 
} from 'lucide-react';
import { MarketplaceItem, UserProfile } from '../types';

interface ItemDetailModalProps {
  item: MarketplaceItem;
  currentUser: UserProfile;
  onClose: () => void;
  onBuyItem: (item: MarketplaceItem, paymentMethod: string) => void;
  onSendMessage?: (itemId: string, message: string) => void;
  onOpenIdModal: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  currentUser,
  onClose,
  onBuyItem,
  onSendMessage,
  onOpenIdModal,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'google_pay' | 'cashapp' | 'paypal' | 'chime' | 'stripe'>('google_pay');
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: string; text: string; time: string }[]>([
    {
      id: 'msg-01',
      sender: item.seller.name,
      text: `Hi! Thanks for checking out my ${item.title}. Feel free to ask any questions or send an offer!`,
      time: 'Earlier today',
    },
  ]);
  const [isProcessingBuy, setIsProcessingBuy] = useState(false);
  const [isBoughtSuccess, setIsBoughtSuccess] = useState(false);

  const isSeller = item.seller.id === currentUser.id;

  const conditionDescription = {
    brand_new: 'Unused in original box or packaging with zero wear.',
    like_new: 'Used gently once or twice. No blemishes, fully functional.',
    good: 'Clean, well-maintained with normal minor cosmetic signs of use.',
    fair: 'Functional and operational with noticeable cosmetic wear.',
  }[item.condition];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: currentUser.name,
        text: chatMessage.trim(),
        time: 'Just now',
      },
    ]);
    if (onSendMessage) {
      onSendMessage(item.id, chatMessage.trim());
    }
    setChatMessage('');
  };

  const defaultFulfillment = item.fulfillment?.allowShipping 
    ? 'shipping' 
    : (item.fulfillment?.allowPickup ? 'local_pickup' : 'local_delivery');
    
  const [chosenFulfillment, setChosenFulfillment] = useState<'shipping' | 'local_pickup' | 'local_delivery'>(defaultFulfillment);

  // Shipping address fields
  const [shippingStreet, setShippingStreet] = useState('742 Evergreen Terrace');
  const [shippingCity, setShippingCity] = useState(currentUser.city || 'Austin');
  const [shippingState, setShippingState] = useState(currentUser.state || 'TX');
  const [shippingZip, setShippingZip] = useState(currentUser.zipCode || '78704');
  
  // Delivery details
  const [deliveryInstructions, setDeliveryInstructions] = useState('Please leave on front porch near ring doorbell');
  
  // Post-purchase generated tracking / code
  const [generatedTracking, setGeneratedTracking] = useState<string>('');
  const [generatedPin, setGeneratedPin] = useState<string>('');

  const shippingFee = chosenFulfillment === 'shipping' ? (item.fulfillment?.shippingCost ?? 0) : 0;
  const deliveryFee = chosenFulfillment === 'local_delivery' ? (item.fulfillment?.deliveryFee ?? 10) : 0;
  const totalEscrowAmount = item.price + shippingFee + deliveryFee;

  const handleConfirmPurchase = () => {
    if (!currentUser.isIdVerified) {
      onOpenIdModal();
      return;
    }
    setIsProcessingBuy(true);
    setTimeout(() => {
      const carrier = item.fulfillment?.shippingCarrier || 'USPS';
      const tracking = chosenFulfillment === 'shipping'
        ? `${carrier}-9400-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
        : '';
      const pin = chosenFulfillment === 'local_pickup'
        ? `${Math.floor(1000 + Math.random() * 9000)}`
        : '';
      
      setGeneratedTracking(tracking);
      setGeneratedPin(pin);
      setIsProcessingBuy(false);
      setIsBoughtSuccess(true);

      const updatedItem: MarketplaceItem = {
        ...item,
        status: 'held_in_escrow',
        pickupType: chosenFulfillment === 'local_delivery' ? 'seller_delivery' : (chosenFulfillment === 'local_pickup' ? 'local_pickup' : 'shipping'),
        shippingDetails: chosenFulfillment === 'shipping' ? {
          buyerAddress: {
            street: shippingStreet,
            city: shippingCity,
            state: shippingState,
            zip: shippingZip,
          },
          trackingNumber: tracking,
          carrier,
          shippedAt: 'Pending seller package dropoff',
        } : undefined,
        deliveryDetails: chosenFulfillment === 'local_delivery' ? {
          buyerAddress: `${shippingStreet}, ${shippingCity}, ${shippingState} ${shippingZip}`,
          deliveryInstructions,
          deliveryFee,
        } : undefined,
        pickupDetails: chosenFulfillment === 'local_pickup' ? {
          safeSpotLocation: item.fulfillment?.pickupLocationNotes || `${item.location.neighborhood} safe meeting area`,
          pickupCode: pin,
        } : undefined,
      };

      onBuyItem(updatedItem, selectedPaymentMethod);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base sm:text-lg text-white truncate max-w-[280px] sm:max-w-md">
                  {item.title}
                </h2>
              </div>
              <p className="text-xs text-amber-300">
                Item for Sale · Protected by Dime Vault™ Escrow
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Item Details & Photos
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Ask Seller / Make Offer</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </button>
        </div>

        {/* Modal content body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Photo & Pricing showcase */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                <div className="md:col-span-7 relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 aspect-4/3 shadow-sm">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-sm text-slate-200 text-xs px-2.5 py-1 rounded-md border border-slate-700 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>Original Seller Photo</span>
                  </div>
                </div>

                {/* Pricing & Escrow Box */}
                <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Asking Price</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-sm font-bold text-slate-500">$</span>
                      <span className="font-display font-black text-3xl sm:text-4xl text-slate-900 tabular-nums">
                        {item.price}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">USD</span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Zero-Risk Escrow Protection</span>
                    </div>
                    <p className="text-emerald-700 leading-relaxed text-[11px]">
                      Your money is locked in Dime Vault™ Escrow. The seller is NOT paid until you meet up, inspect the item in person, and click "Approve Item".
                    </p>
                  </div>

                  {/* Fulfillment Method Selection (Shipping, Pickup, Delivery) */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                      Choose How to Receive Item:
                    </label>

                    <div className="grid grid-cols-1 gap-2">
                      {/* Shipping Option */}
                      {item.fulfillment?.allowShipping && (
                        <button
                          type="button"
                          onClick={() => setChosenFulfillment('shipping')}
                          className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                            chosenFulfillment === 'shipping'
                              ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">📦</span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900">Ship to My Address</span>
                                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                  {item.fulfillment.shippingCarrier || 'USPS'} Insured
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500">
                                Escrow held until tracking scan confirms delivery
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-black text-slate-900 tabular-nums">
                            {item.fulfillment.shippingCost === 0 ? 'FREE' : `+$${item.fulfillment.shippingCost?.toFixed(2)}`}
                          </span>
                        </button>
                      )}

                      {/* Local Pick-Up Option */}
                      {item.fulfillment?.allowPickup && (
                        <button
                          type="button"
                          onClick={() => setChosenFulfillment('local_pickup')}
                          className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                            chosenFulfillment === 'local_pickup'
                              ? 'bg-amber-50 border-amber-500 shadow-xs ring-1 ring-amber-500'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">📍</span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900">Local Pick-Up</span>
                                <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                                  Safe Meeting Zone
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500">
                                {item.fulfillment.pickupLocationNotes || `${item.location.neighborhood}, ${item.location.city}`}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-black text-emerald-700">
                            FREE
                          </span>
                        </button>
                      )}

                      {/* Local Delivery Option */}
                      {item.fulfillment?.allowDelivery && (
                        <button
                          type="button"
                          onClick={() => setChosenFulfillment('local_delivery')}
                          className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                            chosenFulfillment === 'local_delivery'
                              ? 'bg-sky-50 border-sky-500 shadow-xs ring-1 ring-sky-500'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">🚚</span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900">Doorstep Local Delivery</span>
                                <span className="text-[10px] font-semibold text-sky-800 bg-sky-100 px-1.5 py-0.2 rounded">
                                  Within {item.fulfillment.deliveryRadiusMiles || 15} mi
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500">
                                Seller or neighbor delivers directly to you
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-black text-slate-900 tabular-nums">
                            +${item.fulfillment.deliveryFee || 10}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Shipping address form if shipping chosen */}
                  {!isBoughtSuccess && chosenFulfillment === 'shipping' && (
                    <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 text-xs">
                      <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                        Enter Shipping Address:
                      </span>
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={shippingStreet}
                        onChange={(e) => setShippingStreet(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="City"
                          value={shippingCity}
                          onChange={(e) => setShippingCity(e.target.value)}
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={shippingState}
                          onChange={(e) => setShippingState(e.target.value)}
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          placeholder="ZIP"
                          value={shippingZip}
                          onChange={(e) => setShippingZip(e.target.value)}
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* Delivery instructions if local delivery chosen */}
                  {!isBoughtSuccess && chosenFulfillment === 'local_delivery' && (
                    <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5 text-xs">
                      <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                        Delivery Address & Dropoff Notes:
                      </span>
                      <input
                        type="text"
                        placeholder="Street address for delivery"
                        value={shippingStreet}
                        onChange={(e) => setShippingStreet(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Instructions (e.g. Ring bell, gate code 1234)"
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  )}

                  {/* Price breakdown */}
                  <div className="p-3 bg-slate-100 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Item Price:</span>
                      <strong className="text-slate-900 tabular-nums">${item.price.toFixed(2)}</strong>
                    </div>
                    {chosenFulfillment === 'shipping' && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Shipping ({item.fulfillment?.shippingCarrier || 'USPS'}):</span>
                        <strong className="text-slate-900 tabular-nums">
                          {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                        </strong>
                      </div>
                    )}
                    {chosenFulfillment === 'local_delivery' && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Local Doorstep Delivery Fee:</span>
                        <strong className="text-slate-900 tabular-nums">${deliveryFee.toFixed(2)}</strong>
                      </div>
                    )}
                    <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900 text-sm">
                      <span>Total Escrow Amount:</span>
                      <span className="text-emerald-700 tabular-nums">${totalEscrowAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {!isSeller && !isBoughtSuccess && (
                    <div className="pt-1 space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Fund Escrow via Linked Account:
                        </label>
                        <select
                          value={selectedPaymentMethod}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value as any)}
                          className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium"
                        >
                          <option value="google_pay">Google Pay</option>
                          <option value="cashapp">Cash App</option>
                          <option value="paypal">PayPal</option>
                          <option value="chime">Chime</option>
                          <option value="stripe">Debit / Credit Card (Stripe)</option>
                        </select>
                      </div>

                      <button
                        onClick={handleConfirmPurchase}
                        disabled={isProcessingBuy}
                        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Lock className="w-4 h-4 text-emerald-200" />
                        <span>
                          {isProcessingBuy 
                            ? 'Locking in Dime Vault™...' 
                            : `Buy with Escrow ($${totalEscrowAmount.toFixed(2)})`}
                        </span>
                      </button>
                    </div>
                  )}

                  {isBoughtSuccess && (
                    <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-xs text-emerald-950 space-y-2.5">
                      <div className="flex items-center gap-1.5 font-black text-emerald-800 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Escrow Funded! Item Secured.</span>
                      </div>
                      
                      <p className="text-[11px] text-emerald-900 leading-relaxed">
                        <strong>${totalEscrowAmount.toFixed(2)}</strong> is locked safely in Dime Vault™ Escrow. The seller does not get paid until fulfillment is confirmed!
                      </p>

                      {/* Shipping details confirmed */}
                      {chosenFulfillment === 'shipping' && (
                        <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 flex items-center gap-1">
                              <span>📦 Shipping Carrier:</span>
                              <span className="text-emerald-700">{item.fulfillment?.shippingCarrier || 'USPS'}</span>
                            </span>
                            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                              PREPAID LABEL READY
                            </span>
                          </div>
                          <div className="font-mono text-xs font-bold text-slate-700 bg-slate-50 p-1.5 rounded border border-slate-200">
                            Tracking: {generatedTracking}
                          </div>
                          <p className="text-[10px] text-slate-500">
                            Ship to: {shippingStreet}, {shippingCity}, {shippingState} {shippingZip}
                          </p>
                        </div>
                      )}

                      {/* Pickup PIN code */}
                      {chosenFulfillment === 'local_pickup' && (
                        <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1.5">
                          <span className="font-bold text-amber-900 block">
                            📍 Local Pickup Confirmation PIN:
                          </span>
                          <div className="text-center py-2 bg-amber-50 rounded-lg border border-amber-300">
                            <span className="font-mono font-black text-2xl tracking-widest text-slate-950">
                              {generatedPin}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-600 text-center">
                            Provide this 4-digit PIN to {item.seller.name} when you inspect and take the item.
                          </p>
                        </div>
                      )}

                      {/* Local delivery notice */}
                      {chosenFulfillment === 'local_delivery' && (
                        <div className="p-3 bg-white rounded-xl border border-sky-200 space-y-1 text-sky-900">
                          <span className="font-bold block">🚚 Doorstep Delivery Scheduled:</span>
                          <p className="text-[11px]">
                            Delivering to: {shippingStreet}, {shippingCity}. Seller will notify you upon dropoff.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-display font-bold text-sm text-slate-900">About this Item</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {item.description}
                </p>
                <p className="text-xs text-slate-500 italic">
                  Condition note: {conditionDescription}
                </p>
              </div>

              {/* Seller Trust Profile */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.seller.avatar}
                    alt={item.seller.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-display font-bold text-sm text-slate-900">{item.seller.name}</h4>
                      {item.seller.isIdVerified && (
                        <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>ID Verified</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      ★ {item.seller.rating.toFixed(1)} rating · Verified Local Neighbor ({item.seller.neighborhood})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('chat')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Message Seller</span>
                </button>
              </div>

              {/* How it works for buying items */}
              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2">
                <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-amber-700" />
                  <span>How Buying & Selling Works on My Time Your Dime:</span>
                </h5>
                <ol className="text-xs text-amber-800 space-y-1 pl-4 list-decimal leading-relaxed">
                  <li><strong>Post with Photo:</strong> Anyone can list items to sell by snapping or uploading a photo.</li>
                  <li><strong>Protected Escrow:</strong> When you buy, your payment is held safe in the Dime Vault™.</li>
                  <li><strong>Meet & Inspect:</strong> Pick up or receive your item and check its condition.</li>
                  <li><strong>Instant Daily Payout:</strong> Once approved, the seller receives daily payout directly to Google Pay, Cash App, PayPal, Chime, or Stripe!</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[220px] max-h-[340px] overflow-y-auto space-y-3">
                {chatMessages.map((msg) => {
                  const isMe = msg.sender === currentUser.name;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[11px] text-slate-400 mb-0.5">
                        {msg.sender} · {msg.time}
                      </div>
                      <div
                        className={`p-3 rounded-xl max-w-md text-xs leading-relaxed ${
                          isMe
                            ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about dimensions, offer a price, or coordinate pickup..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Escrow Vault Tx: {item.escrowVaultTxId}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
