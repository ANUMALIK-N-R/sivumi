import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MealType } from '../../types/database';
import { getTodayDateString } from '../../services/storage';
import { AddMealModal } from './AddMealModal';
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const FoodView: React.FC = () => {
  const { state, deleteMeal, isAddMealModalOpen, setIsAddMealModalOpen } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [activeMealTypeForModal, setActiveMealTypeForModal] = useState<MealType>('breakfast');

  const todayStr = getTodayDateString();

  const changeDateBy = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    setSelectedDate(`${yr}-${mo}-${da}`);
  };

  const mealsForDate = state.meals.filter(m => m.date === selectedDate);

  const mealSections: { type: MealType; title: string; subtitle: string }[] = [
    { type: 'breakfast', title: 'Breakfast', subtitle: 'Morning nourishment' },
    { type: 'lunch', title: 'Lunch', subtitle: 'Midday meal' },
    { type: 'snack', title: 'Snacks & Sips', subtitle: 'Gentle energy' },
    { type: 'dinner', title: 'Dinner', subtitle: 'Evening nourishment' }
  ];

  return (
    <div className="pb-28 max-w-md mx-auto px-4 pt-3 space-y-4 text-left font-sans">
      {/* Date Switcher */}
      <div className="bg-white rounded-2xl p-2.5 border border-[#EFEAE6] shadow-xs flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeDateBy(-1)}
          className="w-7 h-7 rounded-full bg-[#FAF6F3] text-stone-500 hover:bg-[#F2ECE8] flex items-center justify-center active:scale-95 transition-all"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-3.5 h-3.5 stroke-[2]" />
        </button>

        <div className="text-center">
          <span className="text-xs font-bold text-[#2C2428] block">
            {selectedDate === todayStr ? 'Today' : new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          <span className="text-[10px] text-[#A69A9F]">
            {mealsForDate.length} meal{mealsForDate.length !== 1 ? 's' : ''} logged
          </span>
        </div>

        <button
          type="button"
          onClick={() => changeDateBy(1)}
          className="w-7 h-7 rounded-full bg-[#FAF6F3] text-stone-500 hover:bg-[#F2ECE8] flex items-center justify-center active:scale-95 transition-all"
          aria-label="Next day"
        >
          <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
        </button>
      </div>

      {/* Log Nourishment Button */}
      <button
        type="button"
        onClick={() => {
          setActiveMealTypeForModal('breakfast');
          setIsAddMealModalOpen(true);
        }}
        className="w-full py-2.5 px-4 rounded-xl bg-[#2C2428] hover:bg-black text-white font-medium text-xs shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2]" />
        <span>Log Nourishment</span>
      </button>

      {/* Grouped Meal Cards */}
      <div className="space-y-3">
        {mealSections.map(section => {
          const mealsInType = mealsForDate.filter(m => m.mealType === section.type);

          return (
            <div
              key={section.type}
              className="bg-white rounded-2xl p-4 border border-[#EFEAE6] shadow-xs text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-xs font-bold text-[#2C2428]">
                    {section.title}
                  </h3>
                  <span className="text-[10px] text-[#A69A9F]">
                    {section.subtitle}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveMealTypeForModal(section.type);
                    setIsAddMealModalOpen(true);
                  }}
                  className="text-[11px] font-semibold text-[#B5838D] hover:underline"
                >
                  + Add
                </button>
              </div>

              {mealsInType.length === 0 ? (
                <div className="py-2 text-[11px] text-[#A69A9F]">
                  Not logged yet today.
                </div>
              ) : (
                <div className="space-y-2 mt-1">
                  {mealsInType.map(meal => (
                    <div
                      key={meal.id}
                      className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3DE] flex items-start justify-between gap-3 group"
                    >
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-[#2C2428]">
                          {meal.name}
                        </h4>
                        {meal.description && (
                          <p className="text-[11px] text-[#7A6C74] mt-0.5 leading-relaxed">
                            {meal.description}
                          </p>
                        )}

                        {meal.tags && meal.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {meal.tags.map(t => (
                              <span
                                key={t}
                                className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-white border border-[#E8DFD8] text-[#7A6C74]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteMeal(meal.id)}
                        className="text-stone-300 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Delete meal"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[1.8]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isAddMealModalOpen && (
        <AddMealModal
          onClose={() => setIsAddMealModalOpen(false)}
          defaultMealType={activeMealTypeForModal}
        />
      )}
    </div>
  );
};
