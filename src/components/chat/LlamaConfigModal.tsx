import React, { useEffect, useState } from 'react';
import { Cpu, HardDrive, Lock, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getGemmaStatus, initializeGemma, GemmaStatusResult } from '../../services/localLlamaService';

interface LlamaConfigModalProps {
  onClose: () => void;
}

export const LlamaConfigModal: React.FC<LlamaConfigModalProps> = ({ onClose }) => {
  const [status, setStatus] = useState<GemmaStatusResult>(() => getGemmaStatus());
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setStatus(getGemmaStatus()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const initialize = async () => {
    setMessage('Loading Gemma 3 270M...');
    try {
      await initializeGemma(setMessage);
      setStatus(getGemmaStatus());
      setMessage('Gemma is ready.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Gemma initialization failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/25 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="w-full max-w-md bg-[#FAF8F5] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EFEAE6] p-5 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#B5838D]" />
            <h2 className="text-sm font-bold text-[#2C2428]">Offline AI Engine</h2>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white text-[#7A6C74]" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#EFEAE6] p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#2C2428]">Gemma 3 270M IT</p>
              <p className="text-[10px] text-[#8C7E86] mt-0.5">Google LiteRT-LM · CPU · on-device</p>
            </div>
            {status.initialized ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertTriangle className="w-5 h-5 text-amber-500" />}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="rounded-xl bg-[#FAF8F5] p-2 flex items-center gap-1.5"><HardDrive className="w-3 h-3" />Model: {status.modelPresent ? 'present' : 'missing'}</div>
            <div className="rounded-xl bg-[#FAF8F5] p-2 flex items-center gap-1.5"><Cpu className="w-3 h-3" />Engine: {status.initialized ? 'ready' : 'not loaded'}</div>
            <div className="rounded-xl bg-[#FAF8F5] p-2 flex items-center gap-1.5 col-span-2"><Lock className="w-3 h-3" />No INTERNET permission in AndroidManifest</div>
          </div>

          {status.message && <p className="text-[11px] text-[#7A6C74] leading-relaxed">{status.message}</p>}
          {message && <p className="text-[11px] text-[#7A6C74] leading-relaxed">{message}</p>}

          <button type="button" onClick={initialize} disabled={!status.modelPresent || status.initialized} className="w-full py-2 rounded-xl bg-[#2C2428] disabled:bg-stone-300 text-white text-xs font-semibold transition-colors">
            {status.initialized ? 'Gemma Ready' : 'Initialize Gemma'}
          </button>
        </div>

        <p className="text-[10px] leading-relaxed text-[#8C7E86]">
          This build has no Ollama, Gemini API, WebLLM download, analytics, or cloud fallback. A real Gemma model file must be bundled at build time.
        </p>
      </div>
    </div>
  );
};
