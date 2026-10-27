/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { TrustBar } from './components/TrustBar';
import { TaskMarketplace } from './components/TaskMarketplace';
import { TaskDetailModal } from './components/TaskDetailModal';
import { PostListingModal } from './components/PostListingModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { IdVerificationModal } from './components/IdVerificationModal';
import { DailyPayoutsModal } from './components/DailyPayoutsModal';
import { EscrowCalculatorModal } from './components/EscrowCalculatorModal';
import { AreaSelectorModal } from './components/AreaSelectorModal';
import { MyTasksView } from './components/MyTasksView';
import { ShowcaseGallery } from './components/ShowcaseGallery';
import { ShowcaseDetailModal } from './components/ShowcaseDetailModal';
import { UploadShowcaseModal } from './components/UploadShowcaseModal';
import { VideoAdModal } from './components/VideoAdModal';
import { Footer } from './components/Footer';
import { INITIAL_USER, INITIAL_TASKS, INITIAL_ITEMS, INITIAL_SHOWCASE_JOBS, INITIAL_PAYOUT_HISTORY, POPULAR_METROS } from './data/mockData';
import { Task, MarketplaceItem, UserProfile, PayoutTransaction, PayoutMethod, LocationFilter, ShowcaseJob } from './types';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [items, setItems] = useState<MarketplaceItem[]>(INITIAL_ITEMS);
  const [showcaseJobs, setShowcaseJobs] = useState<ShowcaseJob[]>(INITIAL_SHOWCASE_JOBS);
  const [payoutHistory, setPayoutHistory] = useState<PayoutTransaction[]>(INITIAL_PAYOUT_HISTORY);
  
  // Nationwide Location State
  const [locationFilter, setLocationFilter] = useState<LocationFilter>({
    metroId: 'all',
    city: 'All',
    state: 'USA',
    radiusMiles: 9999,
    customQuery: 'All Areas (Nationwide)',
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'browse' | 'my_tasks' | 'calculator' | 'wallet' | 'showcase'>('browse');
  const [userRoleMode, setUserRoleMode] = useState<'tasker' | 'poster'>('tasker');
  
  // Modals
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [selectedShowcaseJob, setSelectedShowcaseJob] = useState<ShowcaseJob | null>(null);
  const [isUploadShowcaseModalOpen, setIsUploadShowcaseModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postListingMode, setPostListingMode] = useState<'item' | 'task' | 'service'>('item');
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletModalTab, setWalletModalTab] = useState<'wallet' | 'link_accounts'>('wallet');
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [isVideoAdModalOpen, setIsVideoAdModalOpen] = useState(false);

  // Toast notifications
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification((curr) => (curr === message ? null : curr));
    }, 4500);
  };

  const openWallet = (tab: 'wallet' | 'link_accounts' = 'wallet') => {
    setWalletModalTab(tab);
    setIsWalletModalOpen(true);
  };

  const openPostingModal = (mode: 'item' | 'task' | 'service' = 'item') => {
    setPostListingMode(mode);
    setIsPostModalOpen(true);
  };

  const handleSelectMetro = (metroId: string) => {
    const found = POPULAR_METROS.find((m) => m.id === metroId);
    if (!found || found.id === 'all') {
      setLocationFilter({
        metroId: 'all',
        city: 'All',
        state: 'USA',
        radiusMiles: 9999,
        customQuery: 'All Areas (Nationwide)',
      });
    } else {
      setLocationFilter({
        metroId: found.id,
        city: found.city,
        state: found.state,
        zipCode: found.zipCode,
        radiusMiles: 25,
      });
    }
  };

  // Handler: Post new item for sale (with photo!)
  const handleItemCreated = (newItemData: Partial<MarketplaceItem>) => {
    const itemCity = newItemData.location?.city || user.city;
    const itemState = newItemData.location?.state || user.state;
    const itemZip = newItemData.location?.zipCode || user.zipCode || '';

    const newItem: MarketplaceItem = {
      id: `itm_${Date.now().toString().slice(-4)}`,
      title: newItemData.title || 'Untitled Item',
      description: newItemData.description || '',
      price: newItemData.price || 50,
      condition: newItemData.condition || 'good',
      category: newItemData.category || 'tools_hardware',
      imageUrl: newItemData.imageUrl || 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
      status: 'available',
      location: newItemData.location || {
        address: 'Main St',
        city: itemCity,
        state: itemState,
        zipCode: itemZip,
        neighborhood: 'Local Area',
        distanceMiles: 0.5,
      },
      pickupType: newItemData.pickupType || 'local_pickup',
      seller: newItemData.seller || {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        rating: user.rating,
        reviewCount: user.completedTasks,
        isIdVerified: user.isIdVerified,
        neighborhood: `${itemCity}, ${itemState}`,
      },
      escrowStatus: 'held_in_vault',
      escrowVaultTxId: newItemData.escrowVaultTxId || `ESC-ITEM-${Math.floor(10000 + Math.random() * 90000)}-${itemState}`,
      fulfillment: newItemData.fulfillment || {
        allowShipping: true,
        shippingCost: 12,
        shippingCarrier: 'USPS',
        allowPickup: true,
        pickupLocationNotes: `${itemCity} Safe-Exchange Police Precinct or Porch`,
        allowDelivery: false,
        deliveryFee: 15,
        deliveryRadiusMiles: 15,
      },
      shippingDetails: newItemData.shippingDetails,
      deliveryDetails: newItemData.deliveryDetails,
      pickupDetails: newItemData.pickupDetails,
      createdAt: 'Just now',
    };

    setItems((prev) => [newItem, ...prev]);
    showToast(`Item "${newItem.title}" posted with photo! Buyer payments will be protected in Escrow.`);
  };

  // Handler: Buy item with escrow
  const handleBuyItem = (item: MarketplaceItem, paymentMethod: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, status: 'held_in_escrow' } : i
      )
    );

    setUser((prev) => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        lifetimePaid: prev.wallet.lifetimePaid + item.price,
      },
    }));

    showToast(`$${item.price} funded into Dime Vault™ Escrow! Meet ${item.seller.name} to inspect & pick up.`);
  };

  // Handler: Post new task
  const handleTaskCreated = (newTaskData: Partial<Task>) => {
    const taskCity = newTaskData.location?.city || user.city;
    const taskState = newTaskData.location?.state || user.state;
    const taskZip = newTaskData.location?.zipCode || user.zipCode || '';

    const newTask: Task = {
      id: `tsk_${Date.now().toString().slice(-4)}`,
      title: newTaskData.title || 'Untitled Task',
      description: newTaskData.description || '',
      category: newTaskData.category || 'home_repair',
      budgetOffer: newTaskData.budgetOffer || 50,
      platformFeePercent: newTaskData.platformFeePercent || 18,
      platformFee: newTaskData.platformFee || 9,
      taskerPayout: newTaskData.taskerPayout || 41,
      status: 'open',
      urgency: newTaskData.urgency || 'urgent_today',
      deadlineFormatted: newTaskData.deadlineFormatted || 'Today',
      location: newTaskData.location || {
        address: 'Downtown',
        city: taskCity,
        state: taskState,
        zipCode: taskZip,
        neighborhood: 'Central',
        distanceMiles: 1.0,
      },
      poster: newTaskData.poster || {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        rating: user.rating,
        reviewCount: user.completedTasks,
        isIdVerified: user.isIdVerified,
        neighborhood: `${taskCity}, ${taskState}`,
      },
      escrowStatus: 'held_in_vault',
      escrowVaultTxId: newTaskData.escrowVaultTxId || `ESC-VAULT-${Math.floor(10000 + Math.random() * 90000)}-${taskState}`,
      createdAt: 'Just now',
      messages: [],
    };

    setTasks((prev) => [newTask, ...prev]);
    setUser((prev) => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        lifetimePaid: prev.wallet.lifetimePaid + newTask.budgetOffer,
      },
    }));

    showToast(`Task posted in ${newTask.location.city}, ${newTask.location.state}! $${newTask.budgetOffer} secured in Escrow.`);
  };

  // Handler: Add job or service photo to showcase
  const handleAddShowcaseJob = (newJob: ShowcaseJob) => {
    setShowcaseJobs((prev) => [newJob, ...prev]);
    showToast(`Work photo "${newJob.title}" published! Neighbors can view and book with Dime Vault™ escrow.`);
  };

  // Handler: Request similar work based on a showcase photo
  const handleRequestShowcaseService = (job: ShowcaseJob) => {
    openPostingModal('task');
    showToast(`Quote request started for: "${job.title}". Name your price and pre-fund into escrow.`);
  };

  // Handler: Accept a task (requires ID verification!)
  const handleAcceptTask = (task: Task) => {
    if (!user.isIdVerified) {
      setIsIdModalOpen(true);
      showToast('Mandatory Government ID Verification required before accepting tasks.');
      return;
    }

    const updatedTask: Task = {
      ...task,
      status: 'accepted',
      tasker: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        rating: user.rating,
        reviewCount: user.completedTasks,
        isIdVerified: true,
        acceptedAt: 'Just now',
      },
      messages: [
        ...task.messages,
        {
          id: `msg_${Date.now()}`,
          senderId: user.id,
          senderName: user.name,
          senderRole: 'tasker',
          text: `Hi ${task.poster.name}! I have accepted your task. The $${task.budgetOffer} is safely held in Escrow. I am heading over to your location soon.`,
          timestamp: 'Just now',
        },
      ],
    };

    setTasks((prev) => prev.map((t) => (t.id === task.id ? updatedTask : t)));
    setSelectedTask(updatedTask);
    
    // Add pending escrow to user wallet
    setUser((prev) => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        inEscrowBalance: prev.wallet.inEscrowBalance + task.taskerPayout,
      },
    }));

    showToast(`You claimed Task #${task.id}! Funds are locked in Escrow. Contact the poster in chat.`);
  };

  // Handler: Submit task completion proof
  const handleSubmitCompletion = (taskId: string, notes: string, photoUrl?: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updated: Task = {
          ...t,
          status: 'review_pending',
          escrowStatus: 'review_hold',
          completionProof: {
            notes,
            photoUrl,
            submittedAt: 'Just now',
          },
          messages: [
            ...t.messages,
            {
              id: `msg_${Date.now()}`,
              senderId: user.id,
              senderName: user.name,
              senderRole: 'tasker',
              text: `Work marked as completed: "${notes}". Proof attached for inspection.`,
              timestamp: 'Just now',
            },
          ],
        };
        if (selectedTask?.id === taskId) {
          setSelectedTask(updated);
        }
        return updated;
      })
    );

    showToast('Completion proof submitted! Poster notified to review and release payment.');
  };

  // Handler: Approve work & release escrow
  const handleApproveAndReleaseEscrow = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedTask: Task = {
      ...task,
      status: 'completed',
      escrowStatus: 'released',
      messages: [
        ...task.messages,
        {
          id: `msg_${Date.now()}`,
          senderId: 'system',
          senderName: "My Time Your Dime's Escrow",
          senderRole: 'system',
          text: `Work approved by ${task.poster.name}! Escrow released: $${task.taskerPayout.toFixed(2)} dispatched to ${task.tasker?.name || 'tasker'} wallet for daily payout. 18% fee retained.`,
          timestamp: 'Just now',
        },
      ],
    };

    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
    if (selectedTask?.id === taskId) {
      setSelectedTask(updatedTask);
    }

    // Add to tasker wallet
    setUser((prev) => ({
      ...prev,
      completedTasks: prev.completedTasks + 1,
      wallet: {
        ...prev.wallet,
        availableBalance: prev.wallet.availableBalance + task.taskerPayout,
        inEscrowBalance: Math.max(0, prev.wallet.inEscrowBalance - task.taskerPayout),
        lifetimeEarned: prev.wallet.lifetimeEarned + task.taskerPayout,
      },
    }));

    // Record in payout ledger
    const getMethodDisplay = () => {
      switch (user.payoutPreferences.primaryMethod) {
        case 'google_pay': return 'Google Pay';
        case 'cashapp': return 'Cash App';
        case 'paypal': return 'PayPal';
        case 'chime': return 'Chime';
        case 'stripe': return 'Stripe';
        default: return 'Bank Account';
      }
    };

    const newTx: PayoutTransaction = {
      id: `PAY-TX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Just now · Scheduled Daily Batch',
      amount: task.budgetOffer,
      feeDeducted: task.platformFee,
      netPayout: task.taskerPayout,
      method: user.payoutPreferences.primaryMethod,
      destinationDetails: `${getMethodDisplay()} · ${user.email}`,
      status: 'completed',
      taskId: task.id,
      taskTitle: task.title,
      type: 'daily_batch',
    };

    setPayoutHistory((prev) => [newTx, ...prev]);
    showToast(`Escrow Released! $${task.taskerPayout.toFixed(2)} deposited into Daily Payout Wallet.`);
  };

  // Handler: Send chat message in task
  const handleSendMessage = (taskId: string, messageText: string) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderRole: 'tasker' as const,
      text: messageText,
      timestamp: 'Just now',
    };

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updated = {
          ...t,
          messages: [...t.messages, newMessage],
        };
        if (selectedTask?.id === taskId) {
          setSelectedTask(updated);
        }
        return updated;
      })
    );
  };

  // Handler: Instant cash-out from wallet
  const handleInstantPayout = (amount: number, method: PayoutMethod) => {
    setUser((prev) => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        availableBalance: 0,
      },
    }));

    const methodDestination = {
      google_pay: `Google Pay · ${user.payoutPreferences.googlePayEmail}`,
      paypal: `PayPal · ${user.payoutPreferences.paypalEmail}`,
      cashapp: `Cash App · ${user.payoutPreferences.cashAppTag}`,
      chime: `Chime · ${user.payoutPreferences.chimeSign || '$DawnChime'}`,
      stripe: `Stripe Debit · •••• ${user.payoutPreferences.stripeCardLast4}`,
    }[method];

    const instantTx: PayoutTransaction = {
      id: `INST-TX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Just now · Instant Transfer',
      amount,
      feeDeducted: 0,
      netPayout: amount,
      method,
      destinationDetails: methodDestination,
      status: 'completed',
      taskTitle: 'Instant Daily Payout Cash-Out',
      type: 'instant_transfer',
    };

    setPayoutHistory((prev) => [instantTx, ...prev]);
  };

  // Handler: ID Verification completion
  const handleVerificationComplete = (updatedDetails: any) => {
    setUser((prev) => ({
      ...prev,
      isIdVerified: true,
      idVerificationStatus: 'verified',
      idDetails: updatedDetails,
    }));
    showToast('Identity Verified! Full access unlocked for daily tasks and escrow payouts.');
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 bg-slate-950 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2.5 max-w-md animate-fade-in text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{notification}</span>
        </div>
      )}

      {/* Top 3-Zone Navbar */}
      <Navbar
        user={user}
        locationFilter={locationFilter}
        openLocationModal={() => setIsLocationModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openPostModal={() => openPostingModal('task')}
        openSellItemModal={() => openPostingModal('item')}
        openIdModal={() => setIsIdModalOpen(true)}
        openWalletModal={() => openWallet('wallet')}
        openLinkAccountsModal={() => openWallet('link_accounts')}
        openVideoAdModal={() => setIsVideoAdModalOpen(true)}
        userRoleMode={userRoleMode}
        setUserRoleMode={setUserRoleMode}
      />

      {/* Main Content Areas based on Active Tab */}
      <main className="flex-1 pb-20 md:pb-0">
        {activeTab === 'browse' && (
          <>
            <HeroBanner
              onPostClick={() => openPostingModal('task')}
              onSellItemClick={() => openPostingModal('item')}
              onOfferServiceClick={() => openPostingModal('service')}
              onBrowseClick={() => {
                const el = document.getElementById('marketplace-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onLearnEscrowClick={() => setIsCalculatorModalOpen(true)}
              onOpenPaymentsClick={() => openWallet('link_accounts')}
              onOpenVideoAdClick={() => setIsVideoAdModalOpen(true)}
              onViewShowcaseClick={() => {
                const el = document.getElementById('showcase-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <TrustBar 
              onOpenIdModal={() => setIsIdModalOpen(true)} 
              onOpenPaymentsClick={() => openWallet('link_accounts')}
              onSellItemClick={() => openPostingModal('item')}
            />

            {/* Photos of Services That Can Be Done & Jobs Completed */}
            <div id="showcase-section">
              <ShowcaseGallery
                showcaseJobs={showcaseJobs}
                onSelectJob={(job) => setSelectedShowcaseJob(job)}
                onOpenUploadModal={() => setIsUploadShowcaseModalOpen(true)}
                onRequestService={handleRequestShowcaseService}
              />
            </div>

            <div id="marketplace-section">
              <TaskMarketplace
                tasks={tasks}
                items={items}
                locationFilter={locationFilter}
                onOpenLocationModal={() => setIsLocationModalOpen(true)}
                onSelectMetro={handleSelectMetro}
                onSelectTask={(task) => setSelectedTask(task)}
                onAcceptTask={handleAcceptTask}
                onSelectItem={(item) => setSelectedItem(item)}
                onBuyItemQuick={(item) => setSelectedItem(item)}
                onPostClick={() => openPostingModal('task')}
                onSellItemClick={() => openPostingModal('item')}
                onOfferServiceClick={() => openPostingModal('service')}
              />
            </div>
          </>
        )}

        {activeTab === 'showcase' && (
          <div className="py-2">
            <ShowcaseGallery
              showcaseJobs={showcaseJobs}
              onSelectJob={(job) => setSelectedShowcaseJob(job)}
              onOpenUploadModal={() => setIsUploadShowcaseModalOpen(true)}
              onRequestService={handleRequestShowcaseService}
            />
          </div>
        )}

        {activeTab === 'my_tasks' && (
          <MyTasksView
            tasks={tasks}
            currentUser={user}
            onSelectTask={(task) => setSelectedTask(task)}
            onOpenPostModal={() => openPostingModal('task')}
            onApproveEscrow={handleApproveAndReleaseEscrow}
            onOpenLinkAccounts={() => openWallet('link_accounts')}
          />
        )}

        {activeTab === 'calculator' && (
          <div className="max-w-4xl mx-auto px-4 py-10">
            <EscrowCalculatorModal
              onClose={() => setActiveTab('browse')}
              onPostWithBudget={(budget) => {
                setActiveTab('browse');
                openPostingModal('task');
              }}
            />
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="max-w-4xl mx-auto px-4 py-10">
            <DailyPayoutsModal
              user={user}
              payoutHistory={payoutHistory}
              initialTab="link_accounts"
              onClose={() => setActiveTab('browse')}
              onInstantPayout={handleInstantPayout}
              onUpdatePreferences={(prefs) => {
                setUser((prev) => ({
                  ...prev,
                  payoutPreferences: { ...prev.payoutPreferences, ...prefs },
                }));
                showToast(`Payout settings updated! Daily payouts sent to ${prefs.primaryMethod.replace('_', ' ')}.`);
              }}
            />
          </div>
        )}
      </main>

      {/* Floating Fast Action Payout Button for Quick Access */}
      <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-30">
        <button
          onClick={() => openWallet('link_accounts')}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-950 hover:bg-black text-white rounded-full shadow-2xl border border-amber-400/50 transition-all hover:scale-105 group cursor-pointer"
          title="Click to set up payments: Google Pay, Cash App, PayPal, Chime, Stripe"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0">
            $
          </div>
          <div className="flex flex-col text-left pr-1">
            <span className="text-xs font-bold leading-tight flex items-center gap-1 text-amber-400">
              Set Up Payments
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </span>
            <span className="text-[10px] text-slate-400 leading-none">
              GPay · CashApp · PayPal · Chime
            </span>
          </div>
        </button>
      </div>

      {/* Footer */}
      <Footer
        onBrowseClick={() => setActiveTab('browse')}
        onPostClick={() => openPostingModal('task')}
        onSellItemClick={() => openPostingModal('item')}
        onShowcaseClick={() => setActiveTab('showcase')}
        onCalculatorClick={() => setIsCalculatorModalOpen(true)}
        onWalletClick={() => openWallet('wallet')}
        onOpenPaymentsClick={() => openWallet('link_accounts')}
        onOpenVideoAdClick={() => setIsVideoAdModalOpen(true)}
        onIdClick={() => setIsIdModalOpen(true)}
      />

      {/* Overlays / Modals */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          currentUser={user}
          onClose={() => setSelectedTask(null)}
          onAcceptTask={handleAcceptTask}
          onSubmitCompletion={handleSubmitCompletion}
          onApproveAndReleaseEscrow={handleApproveAndReleaseEscrow}
          onSendMessage={handleSendMessage}
          onOpenIdModal={() => setIsIdModalOpen(true)}
        />
      )}

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          currentUser={user}
          onClose={() => setSelectedItem(null)}
          onBuyItem={handleBuyItem}
          onOpenIdModal={() => setIsIdModalOpen(true)}
        />
      )}

      {isPostModalOpen && (
        <PostListingModal
          currentUser={user}
          initialMode={postListingMode}
          onClose={() => setIsPostModalOpen(false)}
          onTaskCreated={handleTaskCreated}
          onItemCreated={handleItemCreated}
          onOpenIdModal={() => setIsIdModalOpen(true)}
        />
      )}

      {isIdModalOpen && (
        <IdVerificationModal
          user={user}
          onClose={() => setIsIdModalOpen(false)}
          onVerificationComplete={handleVerificationComplete}
        />
      )}

      {isWalletModalOpen && activeTab !== 'wallet' && (
        <DailyPayoutsModal
          user={user}
          payoutHistory={payoutHistory}
          initialTab={walletModalTab}
          onClose={() => setIsWalletModalOpen(false)}
          onInstantPayout={handleInstantPayout}
          onUpdatePreferences={(prefs) => {
            setUser((prev) => ({
              ...prev,
              payoutPreferences: { ...prev.payoutPreferences, ...prefs },
            }));
            showToast(`Payout settings updated! Daily payouts sent to ${prefs.primaryMethod.replace('_', ' ')}.`);
          }}
        />
      )}

      {isCalculatorModalOpen && activeTab !== 'calculator' && (
        <EscrowCalculatorModal
          onClose={() => setIsCalculatorModalOpen(false)}
          onPostWithBudget={(budget) => {
            setIsCalculatorModalOpen(false);
            setIsPostModalOpen(true);
          }}
        />
      )}

      {selectedShowcaseJob && (
        <ShowcaseDetailModal
          job={selectedShowcaseJob}
          isOpen={!!selectedShowcaseJob}
          onClose={() => setSelectedShowcaseJob(null)}
          onRequestService={handleRequestShowcaseService}
        />
      )}

      {isUploadShowcaseModalOpen && (
        <UploadShowcaseModal
          isOpen={isUploadShowcaseModalOpen}
          onClose={() => setIsUploadShowcaseModalOpen(false)}
          onAddShowcaseJob={handleAddShowcaseJob}
          currentUser={user}
        />
      )}

      {isLocationModalOpen && (
        <AreaSelectorModal
          currentLocation={locationFilter}
          onSelectLocation={(newLoc) => {
            setLocationFilter(newLoc);
            showToast(`Location set to ${newLoc.customQuery || `${newLoc.city}, ${newLoc.state}`}`);
          }}
          onClose={() => setIsLocationModalOpen(false)}
        />
      )}

      {/* TikTok & YouTube Shorts Video Ad Studio & Player */}
      <VideoAdModal
        isOpen={isVideoAdModalOpen}
        onClose={() => setIsVideoAdModalOpen(false)}
        onOpenSellModal={() => openPostingModal('item')}
        onOpenPostTaskModal={() => openPostingModal('task')}
      />
    </div>
  );
}
