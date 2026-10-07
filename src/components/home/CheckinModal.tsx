import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../services/storage';
import { MoodLevel } from '../../types/database';
import { X, Moon, Zap, Shield, Droplets, Footprints } from 'lucide-react';

interface CheckinModalProps {
  onClose: () => void;
}

export const CheckinModal: React.FC<CheckinModalProps> = ({ onClose }) => {
  const { state, saveDailyCheckin } = useApp();
  const today = getTodayDateString();
  const existing = state.dailyCheckins[today];

  const [mood, setMood] = useState<MoodLevel>(existing?.mood || 'good');
  const [energy, setEnergy] = useState<number>(existing?.energy ?? 3);
  const [stress, setStress] = useState<number>(existing?.stress ?? 2);
  const [sleepHours, setSleepHours] = useState<number>(existing?.sleepHours ?? 7.5);
  const [waterGlasses, setWaterGlasses] = useState<number>(existing?.waterGlasses ?? 5);
  const [movementMinutes, setMovementMinutes] = useState<number>(existing?.movementMinutes ?? 20);
  const [reflectionNotes, setReflectionNotes] = useState<string>(existing?.reflectionNotes || '');

  const moodButtons: { id: MoodLevel; label: string }[] = [
    { id: 'great', label: 'Radiant' },
    { id: 'good', label: 'Calm' },
    { id: 'okay', label: 'Gentle' },
    { id: 'low', label: 'Tender' },
    { id: 'bad', label: 'Heavy' }
  ];

  const handleSave = () => {
    saveDailyCheckin({
      date: today,
      mood,
      energy,
      stress,
      sleepHours,
      waterGlasses,
      movementMinutes,
      reflectionNotes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#FAF8F5] w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden border border-[#EFEAE6]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-white border-b border-[#EFEAE6] flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xs font-bold text-[#2C2428] uppercase tracking-wider">
              Daily Wellbeing Check-in
            </h3>
            <p className="text-[11px] text-[#7A6C74]">A gentle pause for {state.user.nickname || 'Sivuu'}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#FAF6F3] text-stone-400 hover:text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-left font-sans">
          {/* Mood Selector */}
          <div>
            <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1.5">
              Current Feeling
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {moodButtons.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  className={`py-2 px-1 rounded-xl text-center border transition-all ${
                    mood === m.id
                      ? 'bg-white border-[#B5838D] text-[#2C2428] font-bold shadow-xs'
                      : 'bg-white/60 border-[#EFEAE6] text-[#7A6C74] hover:border-stone-300'
                  }`}
                >
                  <span className="text-[11px] font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy & Stress */}
          <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-[#EFEAE6]">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Zap className="w-3 h-3 text-[#B5838D]" />
                <span className="text-xs font-bold text-[#2C2428]">Energy</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setEnergy(v)}
                    className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                      energy === v
                        ? 'bg-[#2C2428] text-white'
                        : 'bg-[#FAF6F3] text-[#7A6C74] hover:bg-stone-200'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Shield className="w-3 h-3 text-[#B5838D]" />
                <span className="text-xs font-bold text-[#2C2428]">Stress</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setStress(v)}
                    className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                      stress === v
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

          {/* Sleep & Water */}
          <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-[#EFEAE6]">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Moon className="w-3 h-3 text-[#6E6168]" />
                <span className="text-xs font-bold text-[#2C2428]">Sleep Hours</span>
              </div>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={sleepHours}
                onChange={e => setSleepHours(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-xl border border-[#EAE3DE] bg-[#FAF8F5] text-xs font-semibold text-[#2C2428] focus:outline-none focus:border-[#B5838D]"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Droplets className="w-3 h-3 text-[#6E6168]" />
                <span className="text-xs font-bold text-[#2C2428]">Water Glasses</span>
              </div>
              <input
                type="number"
                step="1"
                min="0"
                max="30"
                value={waterGlasses}
                onChange={e => setWaterGlasses(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-1.5 rounded-xl border border-[#EAE3DE] bg-[#FAF8F5] text-xs font-semibold text-[#2C2428] focus:outline-none focus:border-[#B5838D]"
              />
            </div>
          </div>

          {/* Movement */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#EFEAE6]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Footprints className="w-3 h-3 text-[#6E6168]" />
                <span className="text-xs font-bold text-[#2C2428]">Gentle Movement</span>
              </div>
              <span className="text-xs font-semibold text-[#B5838D]">{movementMinutes} mins</span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              step="5"
              value={movementMinutes}
              onChange={e => setMovementMinutes(parseInt(e.target.value, 10))}
              className="w-full accent-[#B5838D]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
              Quiet Reflections
            </label>
            <textarea
              rows={2}
              value={reflectionNotes}
              onChange={e => setReflectionNotes(e.target.value)}
              placeholder="What felt comforting or challenging today? (Private to you)"
              className="w-full p-3 rounded-xl border border-[#EAE3DE] bg-white text-xs text-[#2C2428] placeholder:text-[#A69A9F] focus:outline-none focus:border-[#B5838D]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#EFEAE6] flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#7A6C74] hover:bg-[#FAF8F5] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#2C2428] hover:bg-black text-white text-xs font-semibold shadow-xs active:scale-95 transition-all"
          >
            Save Check-in
          </button>
        </div>
      </div>
    </div>
  );
};
