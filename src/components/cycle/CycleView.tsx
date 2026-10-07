import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PeriodLogModal } from './PeriodLogModal';
import { getTodayDateString } from '../../services/storage';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Heart,
  Droplet,
  History,
  Calendar
} from 'lucide-react';

import botanicalArt from '../../assets/images/botanical_wellness_cycle_1791342277773.jpg';

const BOTANICAL_ART = botanicalArt;

export const CycleView: React.FC = () => {
  const { state } = useApp();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(getTodayDateString());
  const [showLogModal, setShowLogModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const todayStr = getTodayDateString();

  // Cycle calculations
  const typicalCycleLength = state.settings.cycleTypicalLength || 32;
  const lastPeriodStart = state.settings.lastPeriodStartDate;

  let currentCycleDay = 14;
  let estimatedNextPeriodDays = 18;

  if (lastPeriodStart) {
    const startMs = new Date(lastPeriodStart).getTime();
    const currMs = new Date(todayStr).getTime();
    const diffDays = Math.max(1, Math.floor((currMs - startMs) / (1000 * 60 * 60 * 24)) + 1);
    currentCycleDay = diffDays;
    estimatedNextPeriodDays = Math.max(0, typicalCycleLength - diffDays);
  }

  // Phase estimation (informative & comforting, not diagnostic)
  let currentPhase = 'Follicular Phase';
  let phaseDescription = 'Rising estrogen and refreshed rhythm. Good days for gentle walks, light focus, and balanced nourishing meals.';
  if (currentCycleDay <= 5) {
    currentPhase = 'Menstrual Phase';
    phaseDescription = 'Resting rhythm. Keep warm, stay hydrated, and give yourself quiet permission to move slowly.';
  } else if (currentCycleDay >= 12 && currentCycleDay <= 16) {
    currentPhase = 'Ovulatory Window';
    phaseDescription = 'Natural peak in vitality. Support your body with colorful fresh foods, gentle movement, and water.';
  } else if (currentCycleDay > 16) {
    currentPhase = 'Luteal Phase';
    phaseDescription = 'Progesterone is present. Warmer comfort foods and extra sleep bring ease to the body.';
  }

  // Calendar math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handleDayClick = (dayNum: number) => {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    setSelectedCalendarDate(formatted);
  };

  const selectedDayLog = state.periodDays[selectedCalendarDate];

  return (
    <div className="pb-28 max-w-md mx-auto px-4 pt-3 space-y-4 text-left font-sans">
      {/* Top Header Card */}
      <div className="rounded-2xl bg-white border border-[#EFEAE6] p-4 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block">
              Cycle Rhythm
            </span>
            <h2 className="text-xl font-bold text-[#2C2428] mt-0.5 tracking-tight">
              Day {currentCycleDay}
            </h2>
            <p className="text-xs text-[#7A6C74] mt-0.5">
              Estimated next period: <span className="font-semibold text-[#2C2428]">~{estimatedNextPeriodDays} days</span>
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#EFEAE6] shrink-0 bg-[#FAF6F3]">
            <img
              src={BOTANICAL_ART}
              alt="Botanical illustration"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={e => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Phase Info */}
        <div className="mt-3 pt-3 border-t border-[#FAF6F3]">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold text-[#2C2428]">
              {currentPhase}
            </span>
            <span className="text-[10px] text-[#A69A9F]">· Avg ~{typicalCycleLength} days</span>
          </div>
          <p className="text-xs text-[#7A6C74] leading-relaxed">
            {phaseDescription}
          </p>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => {
            setSelectedCalendarDate(todayStr);
            setShowLogModal(true);
          }}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#2C2428] hover:bg-black text-white font-medium text-xs shadow-xs active:scale-95 transition-all"
        >
          <Droplet className="w-3.5 h-3.5 stroke-[1.8]" />
          <span>Log Period</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setShowLogModal(true);
          }}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-[#FAF6F3] border border-[#EFEAE6] text-[#2C2428] font-medium text-xs active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5 stroke-[1.8]" />
          <span>Symptoms</span>
        </button>

        <button
          type="button"
          onClick={() => setShowHistoryModal(true)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-[#FAF6F3] border border-[#EFEAE6] text-[#6E6168] font-medium text-xs active:scale-95 transition-all"
        >
          <History className="w-3.5 h-3.5 stroke-[1.8]" />
          <span>History</span>
        </button>
      </div>

      {/* Monthly Interactive Calendar */}
      <div className="bg-white rounded-2xl p-4 border border-[#EFEAE6] shadow-xs">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#B5838D]" />
            <span className="text-xs font-bold text-[#2C2428] capitalize">
              {monthName}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="w-7 h-7 rounded-full bg-[#FAF6F3] text-stone-500 hover:bg-[#F2ECE8] flex items-center justify-center active:scale-90 transition-all"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-3.5 h-3.5 stroke-[2]" />
            </button>
            <button
              onClick={nextMonth}
              className="w-7 h-7 rounded-full bg-[#FAF6F3] text-stone-500 hover:bg-[#F2ECE8] flex items-center justify-center active:scale-90 transition-all"
              aria-label="Next month"
            >
              <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {daysOfWeek.map((day, idx) => (
            <span key={idx} className="text-[10px] font-semibold text-[#A69A9F] py-0.5">
              {day}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-8" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const log = state.periodDays[dateStr];
            const hasCheckin = state.dailyCheckins[dateStr];
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedCalendarDate;
            const isPeriod = log?.isPeriod && log?.flow !== 'none';

            return (
              <button
                key={dayNum}
                onClick={() => handleDayClick(dayNum)}
                className={`relative h-8 rounded-xl flex flex-col items-center justify-center text-xs font-medium transition-all duration-150 focus-visible:outline-none ${
                  isSelected
                    ? 'ring-1.5 ring-[#B5838D] ring-offset-1 z-10'
                    : ''
                } ${
                  isPeriod
                    ? 'bg-[#F7EDF0] text-[#8E5D68] font-bold'
                    : 'text-[#2C2428] hover:bg-[#FAF8F5]'
                } ${
                  isToday && !isPeriod ? 'border border-[#B5838D] text-[#B5838D]' : ''
                }`}
              >
                <span>{dayNum}</span>
                <div className="flex items-center gap-0.5 absolute bottom-0.5">
                  {isPeriod && (
                    <span className="w-1 h-1 rounded-full bg-[#B5838D]" />
                  )}
                  {hasCheckin && (
                    <span className="w-1 h-1 rounded-full bg-[#CCA576]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 pt-2.5 border-t border-[#FAF6F3] flex items-center justify-around text-[10px] text-[#8C7E86]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F7EDF0] border border-[#B5838D]" />
            <span>Period</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full border border-[#B5838D]" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#CCA576]" />
            <span>Wellbeing</span>
          </div>
        </div>
      </div>

      {/* Selected Day Details Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#EFEAE6] shadow-xs text-left">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-[#2C2428]">
            Selected: {new Date(selectedCalendarDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          <button
            onClick={() => setShowLogModal(true)}
            className="text-[11px] font-semibold text-[#B5838D] hover:underline"
          >
            {selectedDayLog ? 'Edit details' : '+ Log this day'}
          </button>
        </div>

        {selectedDayLog ? (
          <div className="space-y-2 mt-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#7A6C74]">Flow:</span>
              <span className="text-xs font-semibold capitalize px-2 py-0.5 rounded-md bg-[#FAF5F2] text-[#8E5D68]">
                {selectedDayLog.flow}
              </span>
            </div>

            {selectedDayLog.notes && (
              <p className="text-xs text-[#6E6168] bg-[#FAF8F5] p-2.5 rounded-xl italic">
                &ldquo;{selectedDayLog.notes}&rdquo;
              </p>
            )}

            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {Object.entries(selectedDayLog.symptoms).map(([key, val]) => {
                if (val <= 1) return null;
                return (
                  <div key={key} className="bg-[#FAF8F5] rounded-lg px-2 py-1 text-[10px] flex justify-between">
                    <span className="capitalize text-[#7A6C74]">{key}</span>
                    <span className="font-bold text-[#B5838D]">{val}/5</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#A69A9F] py-0.5">
            No symptoms or bleeding logged for this date.
          </p>
        )}
      </div>

      {/* Gentle PCOS Note */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#EFEAE6] text-left">
        <h4 className="text-xs font-bold text-[#2C2428] flex items-center gap-1.5 mb-1">
          <Heart className="w-3 h-3 text-[#B5838D]" />
          A gentle PCOS note for Sivuu
        </h4>
        <p className="text-[11px] text-[#7A6C74] leading-relaxed">
          Cycle lengths naturally fluctuate, especially with PCOS. You are never &quot;broken&quot; if a cycle varies. Tracking simply offers gentle awareness of your body&apos;s natural rhythms.
        </p>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <PeriodLogModal
          initialDate={selectedCalendarDate}
          onClose={() => setShowLogModal(false)}
        />
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] w-full max-w-md rounded-2xl p-5 shadow-xl border border-[#EFEAE6] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFEAE6]">
              <h3 className="text-xs font-bold text-[#2C2428] uppercase tracking-wider">
                Cycle Logs History
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-xs text-[#B5838D] font-bold"
              >
                Done
              </button>
            </div>
            <div className="overflow-y-auto space-y-2 mt-3 text-left">
              {Object.values(state.periodDays).length === 0 ? (
                <p className="text-xs text-[#A69A9F] py-4 text-center">No logs yet.</p>
              ) : (
                Object.values(state.periodDays)
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map(log => (
                    <div key={log.id} className="p-3 bg-white rounded-xl border border-[#EFEAE6]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2C2428]">{log.date}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#FAF5F2] text-[#B5838D]">
                          {log.flow}
                        </span>
                      </div>
                      {log.notes && <p className="text-xs text-[#7A6C74] mt-1 italic">{log.notes}</p>}
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
