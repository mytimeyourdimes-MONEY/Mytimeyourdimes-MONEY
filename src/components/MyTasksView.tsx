import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, Lock, ArrowUpRight, ShieldCheck, 
  AlertCircle, PlusCircle, MessageSquare, Link as LinkIcon, Wallet 
} from 'lucide-react';
import { Task, UserProfile } from '../types';

interface MyTasksViewProps {
  tasks: Task[];
  currentUser: UserProfile;
  onSelectTask: (task: Task) => void;
  onOpenPostModal: () => void;
  onApproveEscrow: (taskId: string) => void;
  onOpenLinkAccounts?: () => void;
}

export const MyTasksView: React.FC<MyTasksViewProps> = ({
  tasks,
  currentUser,
  onSelectTask,
  onOpenPostModal,
  onApproveEscrow,
  onOpenLinkAccounts,
}) => {
  const [subTab, setSubTab] = useState<'working_on' | 'posted_by_me'>('working_on');

  const myClaimedTasks = tasks.filter(
    (t) => t.tasker?.id === currentUser.id
  );

  const myPostedTasks = tasks.filter(
    (t) => t.poster.id === currentUser.id
  );

  const primaryHandle = {
    google_pay: `Google Pay (${currentUser.payoutPreferences.googlePayEmail})`,
    paypal: `PayPal (${currentUser.payoutPreferences.paypalEmail})`,
    cashapp: `Cash App (${currentUser.payoutPreferences.cashAppTag})`,
    chime: `Chime (${currentUser.payoutPreferences.chimeSign || '$DawnChime'})`,
    stripe: `Stripe Direct (•••• ${currentUser.payoutPreferences.stripeCardLast4})`,
  }[currentUser.payoutPreferences.primaryMethod];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Payout Destination Banner */}
      <div className="mb-6 p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Wallet className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              Daily Earnings Destination: <strong className="text-emerald-800">{primaryHandle}</strong>
            </span>
            <span className="text-[11px] text-slate-500">
              Money is released here automatically every day upon task approval via Google Pay, Cash App, PayPal, Chime, or Stripe.
            </span>
          </div>
        </div>

        {onOpenLinkAccounts && (
          <button
            onClick={onOpenLinkAccounts}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors whitespace-nowrap flex items-center gap-1.5 w-fit cursor-pointer"
          >
            <LinkIcon className="w-3.5 h-3.5 text-emerald-100" />
            <span>Set Up / Change Payment Account</span>
          </button>
        )}
      </div>

      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900">
            My Tasks & Escrow Activity
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track active jobs you've accepted and tasks you've funded in Escrow.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl w-fit">
          <button
            onClick={() => setSubTab('working_on')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              subTab === 'working_on'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tasks I'm Doing ({myClaimedTasks.length})
          </button>
          <button
            onClick={() => setSubTab('posted_by_me')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              subTab === 'posted_by_me'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tasks I've Posted ({myPostedTasks.length})
          </button>
        </div>
      </div>

      {/* Subtab 1: Tasks I'm Doing (Tasker view) */}
      {subTab === 'working_on' && (
        <div className="space-y-4">
          {myClaimedTasks.length > 0 ? (
            <div className="space-y-4">
              {myClaimedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-800">Task #{task.id}</span>
                      <span>·</span>
                      <span>{task.location.neighborhood}</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Escrow: ${task.budgetOffer.toFixed(2)} Secured
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-slate-900">
                      {task.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-1">
                      {task.description}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
                      <span>Posted by {task.poster.name}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-amber-700">
                        <Clock className="w-3 h-3" />
                        {task.deadlineFormatted}
                      </span>
                    </div>
                  </div>

                  {/* Financial & Status block */}
                  <div className="flex items-center gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Your Daily Net Payout</span>
                      <span className="font-display font-black text-xl text-emerald-700 tabular-nums">
                        ${task.taskerPayout.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">(18% fee deducted)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {task.status === 'review_pending' ? (
                        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          Reviewing Proof
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTask(task);
                          }}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
                        >
                          Submit Proof & Get Paid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto">
              <Clock className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No active jobs claimed yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Explore the marketplace and accept tasks in your area to earn money into your daily payout wallet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Subtab 2: Tasks I've Posted (Poster view) */}
      {subTab === 'posted_by_me' && (
        <div className="space-y-4">
          {myPostedTasks.length > 0 ? (
            <div className="space-y-4">
              {myPostedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-800">Task #{task.id}</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Vault Tx #{task.escrowVaultTxId}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-slate-900">
                      {task.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-1">
                      {task.description}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Status:</span>
                      <span className="font-bold text-slate-800 capitalize">
                        {task.status === 'open' ? 'Waiting for local helper' : task.status.replace('_', ' ')}
                      </span>
                      {task.tasker && (
                        <span>· Assigned to {task.tasker.name}</span>
                      )}
                    </div>
                  </div>

                  {/* Financial & Action block */}
                  <div className="flex items-center gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Funds in Escrow Vault</span>
                      <span className="font-display font-black text-xl text-slate-900 tabular-nums">
                        ${task.budgetOffer.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-emerald-700 block font-medium">Protected 100%</span>
                    </div>

                    <div>
                      {task.status === 'review_pending' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onApproveEscrow(task.id);
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Release Pay</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTask(task);
                          }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto">
              <PlusCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">You haven't posted any tasks yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Got home repairs, yard work, furniture moving, or errands you don't have time to do?
              </p>
              <button
                onClick={onOpenPostModal}
                className="mt-4 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
              >
                Post Your First Task Now
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
