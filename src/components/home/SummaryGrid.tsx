import React from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../services/storage';
import { Calendar, UtensilsCrossed, Activity, CheckCircle2, ChevronRight } from 'lucide-react';

export const SummaryGrid: React.FC = () => {
  const {
    state,
    setActiveTab,
    setIsCheckinModalOpen,
    setIsAddMealModalOpen
  } = useApp();

  const today = getTodayDateString();
  const todayCheckin = state.dailyCheckins[today];
  const todayMeals = state.meals.filter(m => m.date === today);
  const todayGoalLogs = state.goalLogs.filter(gl => gl.date === today && gl.completed);
  const totalGoals = state.goals.length;

  // Calculate cycle day
  let cycleDay = 14;
  let daysUntilNext = 18;
  if (state.settings.lastPeriodStartDate) {
    const lastStart = new Date(state.settings.lastPeriodStartDate).getTime();
    const curr = new Date(today).getTime();
    const diffDays = Math.max(1, Math.floor((curr - lastStart) / (1000 * 60 * 60 * 24)) + 1);
    cycleDay = diffDays;
    const typical = state.settings.cycleTypicalLength || 32;
    daysUntilNext = Math.max(0, typical - diffDays);
  }

  const moodLabel = todayCheckin?.mood
    ? todayCheckin.mood.charAt(0).toUpperCase() + todayCheckin.mood.slice(1)
    : 'Not logged';

  return (
    <div className="grid grid-cols-2 gap-2.5 w-full text-left font-sans">
      {/* 1. Cycle Card */}
      <button
        type="button"
        onClick={() => setActiveTab('cycle')}
        className="group flex flex-col justify-between p-3.5 rounded-2xl bg-white border border-[#EFEAE6] hover:border-[#D49B9B] shadow-xs active:scale-[0.98] transition-all focus-visible:outline-none"
      >
        <div className="flex items-center justify-between w-full mb-2.5">
          <div className="w-6 h-6 rounded-full bg-[#FAF5F2] text-[#B5838D] flex items-center justify-center">
            <Calendar className="w-3 h-3 stroke-[1.8]" />
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#B5838D] transition-colors" />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C7E86] block">
            Cycle
          </span>
          <span className="text-sm font-bold text-[#2C2428] block leading-tight mt-0.5">
            Day {cycleDay}
          </span>
          <span className="text-[10px] text-[#A69A9F] mt-0.5 block">
            Next in ~{daysUntilNext} days
          </span>
        </div>
      </button>

      {/* 2. Nourishment Card */}
      <button
        type="button"
        onClick={() => setIsAddMealModalOpen(true)}
        className="group flex flex-col justify-between p-3.5 rounded-2xl bg-white border border-[#EFEAE6] hover:border-[#D49B9B] shadow-xs active:scale-[0.98] transition-all focus-visible:outline-none"
      >
        <div className="flex items-center justify-between w-full mb-2.5">
          <div className="w-6 h-6 rounded-full bg-[#FAF5F2] text-[#6E6168] flex items-center justify-center">
            <UtensilsCrossed className="w-3 h-3 stroke-[1.8]" />
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#6E6168] transition-colors" />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C7E86] block">
            Food
          </span>
          <span className="text-sm font-bold text-[#2C2428] block leading-tight mt-0.5">
            {todayMeals.length} meal{todayMeals.length !== 1 ? 's' : ''}
          </span>
          <span className="text-[10px] text-[#A69A9F] mt-0.5 block">
            Logged today
          </span>
        </div>
      </button>

      {/* 3. Wellbeing Card */}
      <button
        type="button"
        onClick={() => setIsCheckinModalOpen(true)}
        className="group flex flex-col justify-between p-3.5 rounded-2xl bg-white border border-[#EFEAE6] hover:border-[#D49B9B] shadow-xs active:scale-[0.98] transition-all focus-visible:outline-none"
      >
        <div className="flex items-center justify-between w-full mb-2.5">
          <div className="w-6 h-6 rounded-full bg-[#FAF5F2] text-[#6E6168] flex items-center justify-center">
            <Activity className="w-3 h-3 stroke-[1.8]" />
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#6E6168] transition-colors" />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C7E86] block">
            Wellbeing
          </span>
          <span className="text-sm font-bold text-[#2C2428] block leading-tight mt-0.5">
            {moodLabel}
          </span>
          <span className="text-[10px] text-[#A69A9F] mt-0.5 block">
            Energy {todayCheckin?.energy || 3}/5
          </span>
        </div>
      </button>

      {/* 4. Habits & Goals Card */}
      <button
        type="button"
        onClick={() => setActiveTab('goals')}
        className="group flex flex-col justify-between p-3.5 rounded-2xl bg-white border border-[#EFEAE6] hover:border-[#D49B9B] shadow-xs active:scale-[0.98] transition-all focus-visible:outline-none"
      >
        <div className="flex items-center justify-between w-full mb-2.5">
          <div className="w-6 h-6 rounded-full bg-[#FAF5F2] text-[#6E6168] flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 stroke-[1.8]" />
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#6E6168] transition-colors" />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C7E86] block">
            Goals
          </span>
          <span className="text-sm font-bold text-[#2C2428] block leading-tight mt-0.5">
            {todayGoalLogs.length} / {totalGoals}
          </span>
          <span className="text-[10px] text-[#A69A9F] mt-0.5 block">
            Completed today
          </span>
        </div>
      </button>
    </div>
  );
};
