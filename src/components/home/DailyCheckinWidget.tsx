import React from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../services/storage';
import { Moon, Droplets, Plus, Minus } from 'lucide-react';

export const DailyCheckinWidget: React.FC = () => {
  const { state, saveDailyCheckin } = useApp();
  const today = getTodayDateString();
  const checkin = state.dailyCheckins[today] || {
    id: `dc-${Date.now()}`,
    date: today,
    mood: 'good',
    energy: 3,
    stress: 2,
    sleepHours: 7.5,
    waterGlasses: 4,
    movementMinutes: 15,
    reflectionNotes: '',
    updatedAt: new Date().toISOString()
  };

  const handleUpdate = (updates: Partial<typeof checkin>) => {
    saveDailyCheckin({
      date: today,
      ...updates
    });
  };

  return (
    <div className="w-full bg-white rounded-2xl p-4 border border-[#EFEAE6] shadow-xs text-left font-sans">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider">
          Daily Baseline
        </h3>
        <span className="text-[10px] text-[#A69A9F]">
          Auto-saved
        </span>
      </div>

      <div className="space-y-2.5">
        {/* Water */}
        <div className="flex items-center justify-between py-1 border-b border-[#FAF6F3]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#FAF5F2] text-[#6E6168] flex items-center justify-center">
              <Droplets className="w-3 h-3 stroke-[1.8]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#2C2428] block">Water</span>
              <span className="text-[10px] text-[#A69A9F]">Glasses</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleUpdate({ waterGlasses: Math.max(0, checkin.waterGlasses - 1) })}
              className="w-6 h-6 rounded-full bg-[#FAF6F3] text-stone-600 hover:bg-[#F2ECE8] flex items-center justify-center active:scale-95 transition-all"
              aria-label="Decrease water"
            >
              <Minus className="w-3 h-3 stroke-[2]" />
            </button>
            <span className="text-xs font-bold text-[#2C2428] w-6 text-center tabular-nums">
              {checkin.waterGlasses}
            </span>
            <button
              type="button"
              onClick={() => handleUpdate({ waterGlasses: checkin.waterGlasses + 1 })}
              className="w-6 h-6 rounded-full bg-[#FAF6F3] text-[#B5838D] hover:bg-[#F2ECE8] flex items-center justify-center active:scale-95 transition-all"
              aria-label="Increase water"
            >
              <Plus className="w-3 h-3 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Sleep */}
        <div className="flex items-center justify-between py-1 border-b border-[#FAF6F3]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#FAF5F2] text-[#6E6168] flex items-center justify-center">
              <Moon className="w-3 h-3 stroke-[1.8]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#2C2428] block">Rest</span>
              <span className="text-[10px] text-[#A69A9F]">Hours</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleUpdate({ sleepHours: Math.max(3, +(checkin.sleepHours - 0.5).toFixed(1)) })}
              className="w-6 h-6 rounded-full bg-[#FAF6F3] text-stone-600 hover:bg-[#F2ECE8] flex items-center justify-center active:scale-95 transition-all"
              aria-label="Decrease sleep"
            >
              <Minus className="w-3 h-3 stroke-[2]" />
            </button>
            <span className="text-xs font-bold text-[#2C2428] w-8 text-center tabular-nums">
              {checkin.sleepHours}h
            </span>
            <button
              type="button"
              onClick={() => handleUpdate({ sleepHours: Math.min(14, +(checkin.sleepHours + 0.5).toFixed(1)) })}
              className="w-6 h-6 rounded-full bg-[#FAF6F3] text-[#B5838D] hover:bg-[#F2ECE8] flex items-center justify-center active:scale-95 transition-all"
              aria-label="Increase sleep"
            >
              <Plus className="w-3 h-3 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Energy & Stress mini tags */}
        <div className="pt-1 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#8C7E86] uppercase font-semibold">Energy:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => handleUpdate({ energy: v })}
                  className={`w-5 h-5 rounded-md text-[10px] font-bold transition-all ${
                    checkin.energy === v
                      ? 'bg-[#2C2428] text-white'
                      : 'bg-[#FAF6F3] text-[#7A6C74] hover:bg-stone-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#8C7E86] uppercase font-semibold">Stress:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => handleUpdate({ stress: v })}
                  className={`w-5 h-5 rounded-md text-[10px] font-bold transition-all ${
                    checkin.stress === v
                      ? 'bg-[#B5838D] text-white'
                      : 'bg-[#FAF6F3] text-[#7A6C74] hover:bg-stone-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
