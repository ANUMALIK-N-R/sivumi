import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SivumiAvatar } from '../common/SivumiAvatar';
import { LlamaConfigModal } from './LlamaConfigModal';
import { ChevronLeft, ArrowUp, RotateCcw, Cpu } from 'lucide-react';
import { getGemmaStatus, initializeGemma, GemmaStatusResult } from '../../services/localLlamaService';

export const ChatView: React.FC = () => {
  const { state, setIsChatOpen, sendChatMessage, clearChatHistory, llamaProgressText } = useApp();
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showLlamaModal, setShowLlamaModal] = useState(false);
  const [gemmaStatus, setGemmaStatus] = useState<GemmaStatusResult>(() => getGemmaStatus());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const companionName = state.companion.companionName || 'Sivumi';
  const nickname = state.user.nickname || 'Sivuu';

  useEffect(() => {
    let alive = true;
    const refresh = () => alive && setGemmaStatus(getGemmaStatus());
    refresh();
    initializeGemma().then(refresh).catch(refresh);
    const timer = window.setInterval(refresh, 2500);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, []);

  const quickChips = [
    { label: 'Low energy', text: 'I have low energy and feel drained today.' },
    { label: 'Cycle started', text: 'My period started today and I am feeling crampy.' },
    { label: 'Quiet pause', text: 'Just wanted to pause and check in with you.' },
    { label: 'Gentle focus', text: 'I need some calm focus to get through my tasks.' },
    { label: 'Feeling tender', text: 'I am feeling a little down and overwhelmed today.' }
  ];

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [state.chatMessages, isSending, llamaProgressText]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;
    setInputText('');
    setIsSending(true);
    try {
      await sendChatMessage(text);
    } finally {
      setIsSending(false);
      setGemmaStatus(getGemmaStatus());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const badge = gemmaStatus.initialized
    ? { label: 'Gemma 3 270M · Offline', dotClass: 'bg-emerald-500' }
    : gemmaStatus.modelPresent
      ? { label: 'Gemma 3 270M · Loading', dotClass: 'bg-amber-400' }
      : { label: 'Gemma model missing', dotClass: 'bg-rose-400' };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF8F5] flex flex-col max-w-md mx-auto h-full font-sans">
      <header className="bg-white/95 backdrop-blur-md border-b border-[#EFEAE6] px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setIsChatOpen(false)} className="w-8 h-8 rounded-full bg-[#FAF6F3] hover:bg-[#F2ECE8] text-[#4A3E45] flex items-center justify-center active:scale-95 transition-all" aria-label="Back">
            <ChevronLeft className="w-4 h-4 stroke-[2]" />
          </button>
          <div className="flex items-center gap-2.5">
            <SivumiAvatar size="sm" showStatus={gemmaStatus.initialized} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold text-[#2C2428] leading-tight">{companionName}</h2>
                <button type="button" onClick={() => setShowLlamaModal(true)} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FAF5F2] hover:bg-[#F4ECE8] border border-[#EBE3DE] text-[10px] text-[#6E6168] transition-colors">
                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
                  <span className="font-medium">{badge.label}</span>
                </button>
              </div>
              <p className="text-[10px] text-[#9A8D94] mt-0.5">Private on-device space for {nickname}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setShowLlamaModal(true)} title="Offline AI status" className="w-8 h-8 rounded-full text-[#8C7E86] hover:text-[#2C2428] hover:bg-[#FAF6F3] flex items-center justify-center transition-colors" aria-label="Offline AI status">
            <Cpu className="w-3.5 h-3.5 stroke-[1.8]" />
          </button>
          <button type="button" onClick={clearChatHistory} title="Reset conversation" className="w-8 h-8 rounded-full text-[#8C7E86] hover:text-rose-600 hover:bg-rose-50/50 flex items-center justify-center transition-colors" aria-label="Clear chat">
            <RotateCcw className="w-3.5 h-3.5 stroke-[1.8]" />
          </button>
        </div>
      </header>

      {!gemmaStatus.modelPresent && (
        <div className="bg-[#FFF5F5] border-b border-[#F4DADA] px-4 py-2 text-[11px] text-[#8C4B4B]">
          Gemma 3 270M model asset is not installed. The Android build is configured to fail rather than create a fake AI APK.
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {state.chatMessages.map(msg => {
          const isCompanion = msg.sender === 'sivumi';
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isCompanion ? 'justify-start' : 'justify-end'}`}>
              {isCompanion && <SivumiAvatar size="sm" />}
              <div className={`max-w-[84%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed transition-all ${isCompanion ? 'bg-white text-[#2C2428] border border-[#EFEAE6] shadow-xs' : 'bg-[#F6EDF0] text-[#2C2428] border border-[#EEDDE2]'}`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <div className="mt-1 flex items-center justify-end gap-1.5 text-[9px] text-[#A69A9F]">
                  {isCompanion && msg.modelName && <span className="font-medium text-[#B5838D]/90">{msg.modelName}</span>}
                  {isCompanion && msg.modelName && <span>·</span>}
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          );
        })}

        {llamaProgressText && (
          <div className="flex items-end gap-2 justify-start">
            <SivumiAvatar size="sm" />
            <div className="bg-white border border-[#EFEAE6] rounded-2xl px-3.5 py-2 text-xs text-[#7A6C74] flex items-center gap-2 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B5838D] animate-ping" />
              <span>{llamaProgressText}</span>
            </div>
          </div>
        )}

        {isSending && !llamaProgressText && (
          <div className="flex items-end gap-2 justify-start">
            <SivumiAvatar size="sm" />
            <div className="bg-white border border-[#EFEAE6] rounded-2xl px-3.5 py-2 text-xs text-[#7A6C74] flex items-center gap-2 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B5838D] animate-ping" />
              <span>Gemma 3 270M is thinking locally...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-3 py-1 bg-gradient-to-t from-white via-white to-transparent">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {quickChips.map((chip, idx) => (
            <button key={idx} type="button" onClick={() => handleSend(chip.text)} disabled={isSending} className="shrink-0 px-3 py-1 rounded-full bg-white hover:bg-[#FAF6F3] text-[#6E6168] text-[11px] font-medium border border-[#EAE3DE] active:scale-95 transition-all disabled:opacity-50">
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 bg-white border-t border-[#EFEAE6] pb-[env(safe-area-inset-bottom,12px)]">
        <div className="flex items-center gap-2 bg-[#FAF7F5] rounded-full border border-[#EBE3DE] focus-within:border-[#B5838D] px-3.5 py-1.5 transition-colors">
          <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={handleKeyDown} placeholder={`Write to ${companionName}...`} className="flex-1 bg-transparent text-xs text-[#2C2428] placeholder:text-[#A69A9F] focus:outline-none py-1" />
          <button type="button" onClick={() => handleSend()} disabled={!inputText.trim() || isSending} className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${inputText.trim() ? 'bg-[#2C2428] text-white active:scale-90' : 'text-stone-300'}`} aria-label="Send message">
            <ArrowUp className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {showLlamaModal && <LlamaConfigModal onClose={() => setShowLlamaModal(false)} />}
    </div>
  );
};
