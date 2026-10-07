import React from 'react';
import { useApp } from '../../context/AppContext';
import { MoodSelector } from './MoodSelector';
import { SummaryGrid } from './SummaryGrid';
import { DailyCheckinWidget } from './DailyCheckinWidget';
import { InsightsView } from '../insights/InsightsView';
import { SivumiAvatar } from '../common/SivumiAvatar';
import { ChevronRight } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { state, setIsChatOpen } = useApp();
  const nickname = state.user.nickname || state.user.name || 'Sivuu';
  const companionName = state.companion.companionName || 'Sivumi';

  const hour = new Date().getHours();
  let timeGreeting = 'Good morning';
  if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good afternoon';
  } else if (hour >= 17) {
    timeGreeting = 'Good evening';
  }

  return (
    <div className="pb-28 max-w-md mx-auto px-4 pt-3 space-y-4 font-sans text-left">
      {/* Editorial Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] font-semibold tracking-wider text-[#9C8F96] uppercase block">
            {timeGreeting}
          </span>
          <h1 className="text-xl font-bold text-[#2C2428] tracking-tight mt-0.5">
            {nickname}
          </h1>
          <p className="text-[11px] text-[#7A6C74] mt-0.5">
            Your quiet space to breathe.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          className="focus-visible:outline-none transition-transform active:scale-95"
          aria-label={`Open conversation with ${companionName}`}
        >
          <SivumiAvatar size="md" showStatus={true} />
        </button>
      </div>

      {/* Mood / Feeling Selector */}
      <div className="bg-white rounded-2xl p-4 border border-[#EFEAE6] shadow-xs">
        <MoodSelector />
      </div>

      {/* Companion Banner */}
      <button
        type="button"
        onClick={() => setIsChatOpen(true)}
        className="w-full text-left p-3.5 rounded-2xl bg-white border border-[#EFEAE6] hover:border-[#D49B9B] shadow-xs active:scale-[0.99] transition-all flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <SivumiAvatar size="sm" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#2C2428]">
                Talk with {companionName}
              </span>
              <span className="text-[9px] text-[#6E6168] bg-[#FAF5F2] px-1.5 py-0.5 rounded-md font-medium">
                Local Llama
              </span>
            </div>
            <p className="text-[11px] text-[#7A6C74] mt-0.5">
              Always listening, whenever you need a pause.
            </p>
          </div>
        </div>

        <div className="w-6 h-6 rounded-full bg-[#FAF6F3] flex items-center justify-center text-[#7A6C74] group-hover:text-[#2C2428] transition-colors">
          <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
        </div>
      </button>

      {/* Summary Cards 2x2 Grid */}
      <SummaryGrid />

      {/* Daily Check-in Mini Widget */}
      <DailyCheckinWidget />

      {/* Observations / Insights */}
      <div className="pt-1">
        <InsightsView />
      </div>
    </div>
  );
};
