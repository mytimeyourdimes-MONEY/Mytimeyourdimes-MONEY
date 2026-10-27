export type TaskCategory = 
  | 'home_repair'
  | 'yard_lawn'
  | 'moving_heavy'
  | 'cleaning'
  | 'errands'
  | 'tech_setup'
  | 'pet_care'
  | 'event_help';

export type ItemCondition = 'brand_new' | 'like_new' | 'good' | 'fair';

export type ItemCategory = 
  | 'tools_hardware'
  | 'lawn_garden'
  | 'electronics'
  | 'furniture_home'
  | 'sports_outdoors'
  | 'auto_parts'
  | 'other';

export type ListingType = 'item_for_sale' | 'task_needed' | 'service_offered';

export type FulfillmentMethod = 'shipping' | 'local_pickup' | 'local_delivery';

export interface FulfillmentOptions {
  allowShipping: boolean;
  shippingCost?: number; // 0 = free shipping, or specified cost e.g. 9.50
  shippingCarrier?: 'USPS' | 'UPS' | 'FedEx' | 'Standard';
  allowPickup: boolean;
  pickupLocationNotes?: string;
  allowDelivery: boolean;
  deliveryFee?: number;
  deliveryRadiusMiles?: number;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: ItemCondition;
  category: ItemCategory;
  imageUrl: string;
  additionalImages?: string[];
  status: 'available' | 'held_in_escrow' | 'sold';
  location: {
    address: string;
    city: string;
    state: string;
    zipCode?: string;
    neighborhood: string;
    distanceMiles: number;
  };
  pickupType: 'local_pickup' | 'meet_public' | 'seller_delivery' | 'shipping';
  fulfillment: FulfillmentOptions;
  shippingDetails?: {
    buyerAddress?: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    trackingNumber?: string;
    carrier?: string;
    shippedAt?: string;
    deliveredAt?: string;
  };
  deliveryDetails?: {
    buyerAddress?: string;
    deliveryInstructions?: string;
    deliveryFee?: number;
  };
  pickupDetails?: {
    safeSpotLocation?: string;
    pickupCode?: string;
  };
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    isIdVerified: boolean;
    neighborhood: string;
  };
  escrowStatus: EscrowStatus;
  escrowVaultTxId: string;
  createdAt: string;
}

export type TaskStatus = 
  | 'open'
  | 'accepted'
  | 'in_progress'
  | 'review_pending'
  | 'completed'
  | 'cancelled';

export type EscrowStatus = 
  | 'held_in_vault'
  | 'review_hold'
  | 'released'
  | 'refunded';

export type PayoutMethod = 'google_pay' | 'paypal' | 'cashapp' | 'stripe' | 'chime';

export interface TaskMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'poster' | 'tasker' | 'system';
  text: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  budgetOffer: number; // What the poster pays
  platformFeePercent: number; // 15% - 20%
  platformFee: number; // calculated fee held by My Time Your Dime's
  taskerPayout: number; // net amount tasker receives
  status: TaskStatus;
  urgency: 'urgent_today' | 'tomorrow' | 'this_week' | 'flexible';
  deadlineFormatted: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode?: string;
    neighborhood: string;
    distanceMiles: number;
  };
  poster: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    isIdVerified: boolean;
    neighborhood: string;
  };
  tasker?: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    isIdVerified: boolean;
    acceptedAt: string;
  };
  escrowStatus: EscrowStatus;
  escrowVaultTxId: string;
  completionProof?: {
    notes: string;
    photoUrl?: string;
    submittedAt: string;
  };
  createdAt: string;
  messages: TaskMessage[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  city: string;
  state: string;
  zipCode?: string;
  neighborhood: string;
  isIdVerified: boolean;
  idVerificationStatus: 'unverified' | 'pending' | 'verified';
  idDetails?: {
    idType: 'driver_license' | 'passport' | 'state_id';
    idNumberMasked: string;
    verifiedAt: string;
  };
  role: 'both' | 'tasker' | 'poster';
  rating: number;
  completedTasks: number;
  wallet: {
    availableBalance: number;
    inEscrowBalance: number;
    lifetimeEarned: number;
    lifetimePaid: number;
  };
  payoutPreferences: {
    primaryMethod: PayoutMethod;
    googlePayEmail: string;
    paypalEmail: string;
    cashAppTag: string;
    chimeSign: string;
    stripeCardLast4: string;
    dailyAutoPayoutEnabled: boolean;
    nextAutoPayoutTime: string;
  };
}

export interface PayoutTransaction {
  id: string;
  date: string;
  amount: number;
  feeDeducted: number;
  netPayout: number;
  method: PayoutMethod;
  destinationDetails: string;
  status: 'completed' | 'processing' | 'scheduled_today';
  taskId?: string;
  taskTitle: string;
  type: 'daily_batch' | 'instant_transfer';
}

export interface MetroArea {
  id: string;
  name: string;
  city: string;
  state: string;
  zipCode: string;
  region: 'South' | 'Northeast' | 'West' | 'Midwest' | 'National';
  popularNeighborhoods: string[];
}

export interface LocationFilter {
  metroId: string; // 'all' or specific metro
  city: string;
  state: string;
  zipCode?: string;
  customQuery?: string;
  radiusMiles: number; // e.g. 5, 10, 25, 50, 100, or 9999 for nationwide
}

export interface ShowcaseJob {
  id: string;
  title: string;
  category: TaskCategory;
  categoryName: string;
  type: 'completed_job' | 'service_available';
  description: string;
  photoUrl: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  earningsOrPrice: number;
  payoutMethodUsed?: PayoutMethod;
  completedAtText?: string;
  timeSpent?: string;
  location: {
    city: string;
    state: string;
    neighborhood: string;
  };
  provider: {
    name: string;
    avatar: string;
    isIdVerified: boolean;
    rating: number;
    reviewsCount: number;
  };
  clientReview?: {
    author: string;
    comment: string;
    stars: number;
  };
  escrowPayoutStatus: 'paid_out_daily' | 'ready_to_book';
}

