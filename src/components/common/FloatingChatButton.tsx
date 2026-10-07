import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare } from 'lucide-react';
import { SivumiAvatar } from './SivumiAvatar';

export const FloatingChatButton: React.FC = () => {
  const { setIsChatOpen, isChatOpen, state } = useApp();
  const companionName = state.companion.companionName || 'Sivumi';

  if (isChatOpen) return null;

  return (
    <div className="fixed bottom-18 right-4 z-40 font-sans">
      <button
        type="button"
        onClick={() => setIsChatOpen(true)}
        className="group flex items-center gap-2 pl-1.5 pr-3 py-1 bg-white text-[#2C2428] rounded-full shadow-md border border-[#EAE3DE] hover:border-[#B5838D] active:scale-95 transition-all duration-150"
        aria-label={`Open conversation with ${companionName}`}
      >
        <SivumiAvatar size="sm" showStatus={true} />
        <span className="text-xs font-semibold text-[#2C2428]">
          {companionName}
        </span>
        <MessageSquare className="w-3 h-3 text-[#B5838D] stroke-[1.8]" />
      </button>
    </div>
  );
};
