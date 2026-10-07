import React from 'react';
import { useApp } from '../../context/AppContext';
import { SivumiAvatar } from './SivumiAvatar';
import { Lock, MessageSquare } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { state, lockApp, setIsChatOpen } = useApp();
  const companionName = state.companion.companionName || 'Sivumi';

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EFEAE6] px-4 py-2.5 font-sans">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand / Page Title */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2 focus-visible:outline-none"
            aria-label="Open chat with Sivumi"
          >
            <SivumiAvatar size="sm" showStatus={true} />
            <span className="font-bold text-xs tracking-tight text-[#2C2428]">
              {title || companionName}
            </span>
          </button>
        </div>

        {/* Space indicator */}
        <div className="text-[10px] text-[#A69A9F] font-medium hidden sm:block">
          <span>{state.user.nickname || 'Sivuu'}&apos;s space</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {state.settings.appLockEnabled && (
            <button
              type="button"
              onClick={lockApp}
              title="Lock space"
              className="w-7 h-7 flex items-center justify-center rounded-full text-[#7A6C74] hover:text-[#2C2428] hover:bg-white active:scale-95 transition-all"
              aria-label="Lock space"
            >
              <Lock className="w-3.5 h-3.5 stroke-[1.8]" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full bg-white text-[#2C2428] hover:bg-[#FAF5F2] border border-[#EAE3DE] active:scale-95 transition-all"
          >
            <MessageSquare className="w-3 h-3 text-[#B5838D] stroke-[2]" />
            <span>Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
};
