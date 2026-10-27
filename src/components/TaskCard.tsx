import React from 'react';
import { ShieldCheck, MapPin, Clock, Lock, ArrowUpRight } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onSelect: (task: Task) => void;
  onAcceptQuick?: (task: Task) => void;
  isMyTask?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onSelect,
  onAcceptQuick,
  isMyTask = false,
}) => {
  const urgencyLabel = {
    urgent_today: 'Needed Today',
    tomorrow: 'Due Tomorrow',
    this_week: 'Due This Week',
    flexible: 'Flexible Schedule',
  }[task.urgency];

  const categoryName = {
    home_repair: 'Handyman & Repairs',
    yard_lawn: 'Yard & Lawn Care',
    moving_heavy: 'Moving & Heavy',
    cleaning: 'Deep Cleaning',
    errands: 'Errands & Delivery',
    tech_setup: 'Smart Home & Tech',
    pet_care: 'Pet Sitting & Walks',
    event_help: 'Event & Party Help',
  }[task.category];

  return (
    <div
      onClick={() => onSelect(task)}
      className="group relative bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-amber-400/80 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Unboxed clean metadata line (Anti-slop compliant) */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <span>{categoryName}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1 text-slate-600 truncate">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{task.location.neighborhood}, {task.location.city} {task.location.state}</span>
              <span className="text-slate-400">({task.location.distanceMiles} mi)</span>
            </span>
          </div>

          {/* Urgency quiet indicator */}
          <span className={`text-xs font-semibold ${
            task.urgency === 'urgent_today' ? 'text-amber-700' : 'text-slate-500'
          }`}>
            {urgencyLabel}
          </span>
        </div>

        {/* Task Title */}
        <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-2 leading-snug">
          {task.title}
        </h3>

        {/* Description snippet */}
        <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {task.description}
        </p>

        {/* Poster & Trust Info */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={task.poster.avatar}
              alt={task.poster.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
            <div className="text-xs">
              <div className="flex items-center gap-1 font-semibold text-slate-800">
                <span>{task.poster.name}</span>
                {task.poster.isIdVerified && (
                  <span title="Government ID Verified">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </span>
                )}
              </div>
              <span className="text-slate-400 text-[11px]">
                ★ {task.poster.rating.toFixed(1)} · {task.poster.reviewCount} tasks
              </span>
            </div>
          </div>

          {/* Escrow badge */}
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>Escrow Locked</span>
          </div>
        </div>
      </div>

      {/* Pricing and Action row */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Poster pays:</span>
            <span className="font-display font-extrabold text-xl text-slate-900 tabular-nums">
              ${task.budgetOffer}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Net take-home: <strong className="text-emerald-700 font-semibold tabular-nums">${task.taskerPayout.toFixed(2)}</strong> (after 18% fee)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {task.status === 'open' && onAcceptQuick && !isMyTask ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAcceptQuick(task);
              }}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-smooth whitespace-nowrap"
            >
              Accept Task
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(task);
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
            >
              <span>{isMyTask ? 'Manage' : 'Details'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
