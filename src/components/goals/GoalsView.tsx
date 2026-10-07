import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../services/storage';
import { AddGoalModal } from './AddGoalModal';
import { Plus, Check, Trash2 } from 'lucide-react';

export const GoalsView: React.FC = () => {
  const { state, toggleGoalCompletion, deleteGoal } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const today = getTodayDateString();

  const totalGoals = state.goals.length;
  const completedToday = state.goalLogs.filter(
    gl => gl.date === today && gl.completed && state.goals.some(g => g.id === gl.goalId)
  ).length;

  const percentage = totalGoals > 0 ? Math.round((completedToday / totalGoals) * 100) : 0;

  return (
    <div className="pb-28 max-w-md mx-auto px-4 pt-3 space-y-4 text-left font-sans">
      {/* Top Banner / Progress */}
      <div className="rounded-2xl bg-white border border-[#EFEAE6] p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <span className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block">
              Daily Intentions
            </span>
            <h2 className="text-xl font-bold text-[#2C2428] mt-0.5">
              Habits & Care
            </h2>
          </div>
          <span className="text-sm font-bold text-[#2C2428] tabular-nums">
            {completedToday}/{totalGoals}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full h-1.5 rounded-full bg-[#FAF5F2] overflow-hidden">
            <div
              className="h-full bg-[#B5838D] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-[10px] text-[#A69A9F] text-right">
            {percentage}% completed today
          </div>
        </div>
      </div>

      {/* Add Goal Button */}
      <button
        type="button"
        onClick={() => setShowAddModal(true)}
        className="w-full py-2.5 px-4 rounded-xl bg-[#2C2428] hover:bg-black text-white font-medium text-xs shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2]" />
        <span>New Habit</span>
      </button>

      {/* Goal Cards List */}
      <div className="space-y-2">
        {state.goals.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#EFEAE6]">
            <p className="text-xs text-[#A69A9F]">
              No habits set yet. Tap above to add your first daily intention.
            </p>
          </div>
        ) : (
          state.goals.map(goal => {
            const isCompleted = state.goalLogs.some(
              gl => gl.goalId === goal.id && gl.date === today && gl.completed
            );

            return (
              <div
                key={goal.id}
                className={`p-3 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-3 group ${
                  isCompleted
                    ? 'bg-[#FAF8F5]/80 border-[#EFEAE6]'
                    : 'bg-white border-[#EFEAE6] hover:border-[#D49B9B]'
                }`}
              >
                {/* Custom Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleGoalCompletion(goal.id, today)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 active:scale-90 ${
                    isCompleted
                      ? 'bg-[#B5838D] text-white'
                      : 'bg-[#FAF6F3] border border-[#EAE3DE] text-transparent hover:border-[#B5838D]'
                  }`}
                  aria-label={`Toggle habit: ${goal.title}`}
                >
                  <Check className={`w-3.5 h-3.5 stroke-[2.2] ${isCompleted ? 'text-white' : 'opacity-0'}`} />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-xs font-semibold truncate ${
                      isCompleted ? 'line-through text-[#A69A9F]' : 'text-[#2C2428]'
                    }`}
                  >
                    {goal.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] font-medium uppercase px-1.5 py-0.2 rounded-md bg-[#FAF5F2] text-[#8C7E86]">
                      {goal.category}
                    </span>
                    <span className="text-[10px] text-[#A69A9F]">
                      {goal.targetCount} {goal.targetUnit || 'times'}
                    </span>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => deleteGoal(goal.id)}
                  className="text-stone-300 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Delete habit"
                >
                  <Trash2 className="w-3.5 h-3.5 stroke-[1.8]" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {showAddModal && <AddGoalModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};
