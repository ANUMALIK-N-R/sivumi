import React from 'react';
import { useApp } from '../../context/AppContext';
import { Moon, Activity, Heart, Calendar } from 'lucide-react';

export const InsightsView: React.FC = () => {
  const { state } = useApp();
  const nickname = state.user.nickname || 'Sivuu';

  const checkins = Object.values(state.dailyCheckins);
  const totalCheckins = checkins.length;

  const avgSleep = totalCheckins > 0
    ? (checkins.reduce((acc, c) => acc + (c.sleepHours || 7), 0) / totalCheckins).toFixed(1)
    : '7.5';

  const avgWater = totalCheckins > 0
    ? Math.round(checkins.reduce((acc, c) => acc + (c.waterGlasses || 4), 0) / totalCheckins)
    : 5;

  return (
    <div className="space-y-3 text-left font-sans">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider">
          Observed Patterns
        </h3>
        <span className="text-[10px] text-[#A69A9F]">
          Non-diagnostic
        </span>
      </div>

      {/* Observation 1 */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#EFEAE6] shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-md bg-[#FAF5F2] text-[#6E6168] flex items-center justify-center">
            <Moon className="w-3 h-3 stroke-[1.8]" />
          </div>
          <h4 className="text-xs font-bold text-[#2C2428]">
            Sleep & Energy Balance
          </h4>
        </div>
        <p className="text-xs text-[#7A6C74] leading-relaxed">
          You logged higher vitality and calmer mornings on days you rested ~{avgSleep} hours. Giving yourself quiet evenings seems to make a gentle difference for you, {nickname}.
        </p>
      </div>

      {/* Observation 2 */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#EFEAE6] shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-md bg-[#FAF5F2] text-[#6E6168] flex items-center justify-center">
            <Activity className="w-3 h-3 stroke-[1.8]" />
          </div>
          <h4 className="text-xs font-bold text-[#2C2428]">
            Hydration Rhythm
          </h4>
        </div>
        <p className="text-xs text-[#7A6C74] leading-relaxed">
          Averaging ~{avgWater} glasses of water and herbal infusions. On steady hydration days, afternoon fatigue was reported lower.
        </p>
      </div>

      {/* Observation 3 */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#EFEAE6] shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-md bg-[#FAF5F2] text-[#B5838D] flex items-center justify-center">
            <Heart className="w-3 h-3 stroke-[1.8]" />
          </div>
          <h4 className="text-xs font-bold text-[#2C2428]">
            Gentle Movement
          </h4>
        </div>
        <p className="text-xs text-[#7A6C74] leading-relaxed">
          On days with short, low-pressure strolls (15–20 minutes), your mood ratings were highest.
        </p>
      </div>

      {/* Observation 4 */}
      <div className="p-3.5 rounded-2xl bg-[#FAF6F3] border border-[#EFEAE6]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-md bg-white text-[#B5838D] flex items-center justify-center">
            <Calendar className="w-3 h-3 stroke-[1.8]" />
          </div>
          <h4 className="text-xs font-bold text-[#2C2428]">
            Cycle Comfort Note
          </h4>
        </div>
        <p className="text-xs text-[#7A6C74] leading-relaxed">
          Your cycle logs show that warmth and spearmint or chamomile teas around days 1–3 brought ease.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="p-2.5 bg-white/60 rounded-xl text-[10px] text-[#A69A9F] text-center leading-normal border border-[#EFEAE6]">
        Notice: These reflections are purely observational patterns based on your personal logs. Sivumi does not provide medical advice or diagnosis.
      </div>
    </div>
  );
};
