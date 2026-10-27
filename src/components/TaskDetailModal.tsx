import React, { useState } from 'react';
import { 
  X, ShieldCheck, Lock, MapPin, Clock, Send, CheckCircle2, 
  AlertTriangle, DollarSign, ExternalLink, Camera, ArrowRight 
} from 'lucide-react';
import { Task, UserProfile } from '../types';

interface TaskDetailModalProps {
  task: Task;
  currentUser: UserProfile;
  onClose: () => void;
  onAcceptTask: (task: Task) => void;
  onSubmitCompletion: (taskId: string, notes: string, photoUrl?: string) => void;
  onApproveAndReleaseEscrow: (taskId: string) => void;
  onSendMessage: (taskId: string, messageText: string) => void;
  onOpenIdModal: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  currentUser,
  onClose,
  onAcceptTask,
  onSubmitCompletion,
  onApproveAndReleaseEscrow,
  onSendMessage,
  onOpenIdModal,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'chat' | 'escrow'>('details');
  const [chatInput, setChatInput] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);

  const isPoster = task.poster.id === currentUser.id;
  const isAssignedTasker = task.tasker?.id === currentUser.id;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(task.id, chatInput.trim());
    setChatInput('');
  };

  const handleFinishTask = () => {
    if (!completionNotes.trim()) {
      alert('Please enter a brief description of the completed work.');
      return;
    }
    onSubmitCompletion(
      task.id, 
      completionNotes, 
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'
    );
    setIsSubmittingProof(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="text-slate-900 font-bold">Task ID #{task.id}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded font-medium">
              <Lock className="w-3 h-3 text-emerald-600" />
              Vault ID: {task.escrowVaultTxId}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-amber-600 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Requirements
          </button>
          <button
            onClick={() => setActiveTab('escrow')}
            className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'escrow'
                ? 'border-amber-600 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Escrow Protection (18% Fee)
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'border-amber-600 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Live Chat</span>
            {task.messages.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {task.messages.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Title & Status Banner */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs text-slate-500 font-medium">
                  <span className="capitalize">{task.category.replace('_', ' ')}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    {task.location.address}, {task.location.neighborhood} ({task.location.distanceMiles} mi away)
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {task.deadlineFormatted}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 leading-tight">
                  {task.title}
                </h2>
              </div>

              {/* Financial Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Total Offer from Poster</span>
                  <p className="text-2xl font-display font-extrabold text-slate-900 tabular-nums">
                    ${task.budgetOffer}
                  </p>
                  <span className="text-[11px] text-emerald-700 font-medium">100% Locked in Escrow</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium">Platform Protection Fee (18%)</span>
                  <p className="text-xl font-display font-bold text-slate-700 tabular-nums">
                    ${task.platformFee.toFixed(2)}
                  </p>
                  <span className="text-[11px] text-slate-500">Insurance & daily payout processing</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium">Tasker Daily Take-Home</span>
                  <p className="text-2xl font-display font-extrabold text-emerald-700 tabular-nums">
                    ${task.taskerPayout.toFixed(2)}
                  </p>
                  <span className="text-[11px] text-emerald-700 font-medium">Dispatched to GPay/CashApp/PayPal</span>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Task Details & Instructions
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
                  {task.description}
                </p>
              </div>

              {/* Poster Profile */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={task.poster.avatar}
                    alt={task.poster.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                      <span>{task.poster.name}</span>
                      {task.poster.isIdVerified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          ID Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ★ {task.poster.rating.toFixed(1)} rating · {task.poster.reviewCount} tasks posted · {task.poster.neighborhood}
                    </p>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-xs text-slate-400">Identity Status:</span>
                  <p className="text-xs font-semibold text-emerald-700">Driver License Verified</p>
                </div>
              </div>

              {/* Tasker Info if assigned */}
              {task.tasker && (
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={task.tasker.avatar}
                      alt={task.tasker.name}
                      className="w-12 h-12 rounded-full object-cover border border-amber-300"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                        <span>Assigned Tasker: {task.tasker.name}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Claimed {task.tasker.acceptedAt} · 100% ID Verified
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-amber-900 bg-amber-200/60 px-2.5 py-1 rounded">
                    {task.status === 'review_pending' ? 'Reviewing Work' : 'In Progress'}
                  </span>
                </div>
              )}

              {/* Completion Proof Review Box if pending */}
              {task.status === 'review_pending' && task.completionProof && (
                <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Tasker Submitted Work for Final Inspection
                    </h4>
                    <span className="text-xs text-slate-500 font-medium">
                      {task.completionProof.submittedAt}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-emerald-200">
                    "{task.completionProof.notes}"
                  </p>
                  {task.completionProof.photoUrl && (
                    <div className="rounded-lg overflow-hidden border border-emerald-200 max-h-48 w-fit">
                      <img
                        src={task.completionProof.photoUrl}
                        alt="Completion proof"
                        className="h-44 object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Proof Submission form for tasker */}
              {isSubmittingProof && (
                <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/60 space-y-3">
                  <h4 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-700" />
                    Submit Proof of Completed Task
                  </h4>
                  <p className="text-xs text-slate-600">
                    Provide a brief note confirming the job is finished to standard. The poster will review and release funds from Escrow into your daily payout wallet.
                  </p>
                  <textarea
                    rows={3}
                    placeholder="e.g. Assembled dresser completely, tightened all cam locks, and mounted firmly into wall studs. Cleaned up packing debris."
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    className="w-full text-xs p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsSubmittingProof(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleFinishTask}
                      className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm"
                    >
                      Submit for Release
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Escrow & Fee Breakdown */}
          {activeTab === 'escrow' && (
            <div className="space-y-6">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-700 shadow-md">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-amber-400" />
                    <h3 className="font-display font-bold text-lg">My Time Your Dime's Escrow Guarantee</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                    Vault Secured
                  </span>
                </div>

                <div className="py-4 space-y-3 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Task Offer Amount</span>
                    <span className="font-semibold text-white tabular-nums">${task.budgetOffer.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Platform & Insurance Escrow Fee (18%)</span>
                    <span className="font-semibold text-amber-400 tabular-nums">-${task.platformFee.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-700 flex justify-between text-sm font-bold text-white">
                    <span>Net Paid to Tasker via Daily Transfer</span>
                    <span className="text-emerald-400 font-display tabular-nums">${task.taskerPayout.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-700/60 leading-relaxed">
                  Vault Reference Hash: <span className="font-mono text-slate-300">{task.escrowVaultTxId}</span>.
                  Funds remain safely locked in FDIC-backed trust accounts until the poster confirms satisfactory completion.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  What the 15% to 20% User Fee Covers
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <strong className="text-slate-900 block mb-1">✓ Non-Payment Guarantee</strong>
                    Tasker is 100% guaranteed to be paid once task is done. The money is already in the vault.
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <strong className="text-slate-900 block mb-1">✓ Property & Damage Coverage</strong>
                    Up to $1,000,000 community damage insurance on eligible verified local tasks.
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <strong className="text-slate-900 block mb-1">✓ Mandatory ID Verification</strong>
                    Automated biometric and identity checks verifying driver licenses and state IDs.
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <strong className="text-slate-900 block mb-1">✓ Daily Automated Payouts</strong>
                    Instant batch transfers daily to Google Pay, Cash App, PayPal, or Stripe.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Live Chat */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[400px]">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
                <div className="p-2.5 bg-slate-100 rounded-xl text-center text-xs text-slate-500">
                  <Lock className="w-3 h-3 inline mr-1 text-slate-400" />
                  Direct encrypted chat between verified neighbors regarding Task #{task.id}.
                </div>

                {task.messages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[11px] text-slate-400 mb-0.5 px-1">
                        {msg.senderName} · {msg.timestamp}
                      </div>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 text-xs leading-relaxed ${
                          isMe
                            ? 'bg-slate-900 text-white rounded-br-none'
                            : 'bg-slate-100 text-slate-900 rounded-bl-none border border-slate-200'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input form */}
              <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-200">
                <input
                  type="text"
                  placeholder="Type a message (e.g., 'What time works best?', 'I just arrived')..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {task.status === 'open' && (
              <span>Looking for qualified ID-verified local neighbor</span>
            )}
            {task.status === 'accepted' && (
              <span>Job is locked in. Funds held securely in Escrow.</span>
            )}
            {task.status === 'review_pending' && (
              <span className="font-semibold text-emerald-800">
                Waiting for poster to approve work & release daily payment
              </span>
            )}
            {task.status === 'completed' && (
              <span className="font-semibold text-emerald-700">
                ✓ Completed & daily payout queued!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* If task is open and current user wants to accept */}
            {task.status === 'open' && !isPoster && (
              <button
                onClick={() => {
                  if (!currentUser.isIdVerified) {
                    onOpenIdModal();
                  } else {
                    onAcceptTask(task);
                  }
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-smooth flex items-center gap-1.5"
              >
                <span>Accept Job & Earn ${task.taskerPayout.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {/* If assigned tasker and task is in progress */}
            {isAssignedTasker && task.status === 'accepted' && !isSubmittingProof && (
              <button
                onClick={() => {
                  setIsSubmittingProof(true);
                  setActiveTab('details');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Done & Request Escrow Release</span>
              </button>
            )}

            {/* If poster and review is pending */}
            {task.status === 'review_pending' && (
              <button
                onClick={() => onApproveAndReleaseEscrow(task.id)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-smooth flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Work & Release ${task.taskerPayout.toFixed(2)} to Daily Payout</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
