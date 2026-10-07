import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SivumiAvatar } from '../common/SivumiAvatar';
import {
  Lock,
  Download,
  Upload,
  Trash2,
  Plus,
  Check,
  AlertTriangle,
  Cpu
} from 'lucide-react';

export const MeView: React.FC = () => {
  const {
    state,
    updateUser,
    updateCompanion,
    updateSettings,
    addMemory,
    deleteMemory,
    clearAllMemories,
    clearChatHistory,
    resetWellnessData,
    resetAllData,
    exportData,
    importData
  } = useApp();

  const [name, setName] = useState(state.user.name);
  const [nickname, setNickname] = useState(state.user.nickname);
  const [companionName, setCompanionName] = useState(state.companion.companionName);
  const [affectionLevel, setAffectionLevel] = useState(state.companion.affectionLevel);
  const [appLock, setAppLock] = useState(state.settings.appLockEnabled);
  const [pinCode, setPinCode] = useState(state.settings.pinCode || '1234');
  const [biometrics, setBiometrics] = useState(state.settings.biometricEnabled);

  // New Memory Modal / input
  const [newMemTitle, setNewMemTitle] = useState('');
  const [newMemDetails, setNewMemDetails] = useState('');
  const [showAddMem, setShowAddMem] = useState(false);

  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSaveProfile = () => {
    updateUser({ name, nickname });
    updateCompanion({
      companionName,
      affectionLevel,
      llamaMode: 'gemma270m',
      ollamaEndpoint: '',
      ollamaModel: 'Gemma 3 270M IT',
      webLlamaModel: ''
    });
    updateSettings({
      appLockEnabled: appLock,
      pinCode,
      biometricEnabled: biometrics
    });
    showToast('Preferences updated');
  };

  const handleAddMemory = () => {
    if (!newMemTitle.trim() || !newMemDetails.trim()) return;
    addMemory({
      title: newMemTitle.trim(),
      details: newMemDetails.trim(),
      category: 'comfort'
    });
    setNewMemTitle('');
    setNewMemDetails('');
    setShowAddMem(false);
    showToast('Memory saved');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        const content = event.target?.result as string;
        if (content) {
          const success = importData(content);
          if (success) {
            showToast('Backup restored successfully');
          } else {
            showToast('Invalid backup file format');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="pb-28 max-w-md mx-auto px-4 pt-3 space-y-4 text-left font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#2C2428] text-white text-xs px-4 py-2 rounded-full shadow-lg">
          {toastMessage}
        </div>
      )}

      {/* Top Profile Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#EFEAE6] shadow-xs flex items-center gap-3">
        <SivumiAvatar size="lg" />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-[#2C2428] truncate">
            {state.user.name} ({state.user.nickname})
          </h2>
          <p className="text-[11px] text-[#7A6C74] mt-0.5">
            Companion: {state.companion.companionName}
          </p>
          <span className="inline-block mt-1 text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-[#FAF5F2] text-[#8C7E86]">
            Gemma 3 270M · Offline
          </span>
        </div>
      </div>

      {/* Section 1: Profile & Companion Settings */}
      <div className="bg-white rounded-2xl p-4 border border-[#EFEAE6] shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-[#2C2428] uppercase tracking-wider">
          Profile & Companion
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-[#EAE3DE] bg-[#FAF8F5] text-xs text-[#2C2428] focus:outline-none focus:border-[#B5838D]"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
              Nickname
            </label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-[#EAE3DE] bg-[#FAF8F5] text-xs text-[#2C2428] focus:outline-none focus:border-[#B5838D]"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
            Companion Name
          </label>
          <input
            type="text"
            value={companionName}
            onChange={e => setCompanionName(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-[#EAE3DE] bg-[#FAF8F5] text-xs text-[#2C2428] focus:outline-none focus:border-[#B5838D]"
          />
        </div>

        <div>
          <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
            Companion Tone
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['Gentle', 'Sweet', 'Maximum Warmth'] as const).map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => setAffectionLevel(lvl)}
                className={`py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  affectionLevel === lvl
                    ? 'bg-[#2C2428] text-white border-[#2C2428]'
                    : 'bg-[#FAF8F5] text-[#7A6C74] border-[#EAE3DE]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveProfile}
          className="w-full py-2 rounded-xl bg-[#2C2428] hover:bg-black text-white text-xs font-semibold shadow-xs active:scale-95 transition-all mt-2"
        >
          Save Changes
        </button>
      </div>

      {/* Section 2: On-device Gemma */}
      <div className="bg-white rounded-2xl p-4 border border-[#EFEAE6] shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#B5838D]" />
          <h3 className="text-xs font-bold text-[#2C2428] uppercase tracking-wider">
            Offline AI
          </h3>
        </div>
        <div className="rounded-xl bg-[#FAF8F5] border border-[#EAE3DE] p-3">
          <p className="text-xs font-bold text-[#2C2428]">Gemma 3 270M IT</p>
          <p className="text-[11px] text-[#7A6C74] leading-relaxed mt-1">
            Runs locally through Google LiteRT-LM. The Android app does not request INTERNET permission, so chat and private wellness data cannot be sent to a cloud AI service.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] text-[#6E6168]">
          <div className="bg-[#FAF8F5] rounded-lg p-2">✓ On-device inference</div>
          <div className="bg-[#FAF8F5] rounded-lg p-2">✓ No cloud API</div>
          <div className="bg-[#FAF8F5] rounded-lg p-2">✓ No model download at runtime</div>
          <div className="bg-[#FAF8F5] rounded-lg p-2">✓ Local storage</div>
        </div>
      </div>

      {/* Section 3: What I Remember (Memories) */}
      <div className="bg-white rounded-2xl p-4 border border-[#EFEAE6] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#2C2428] uppercase tracking-wider">
              What Sivumi Remembers
            </h3>
            <span className="text-[10px] text-[#A69A9F]">
              {state.memories.length} comfort notes stored
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAddMem(!showAddMem)}
            className="text-xs font-semibold text-[#B5838D] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {showAddMem && (
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3DE] space-y-2">
            <input
              type="text"
              value={newMemTitle}
              onChange={e => setNewMemTitle(e.target.value)}
              placeholder="e.g. Favorite tea or cozy item"
              className="w-full px-3 py-1.5 rounded-lg border border-[#EAE3DE] bg-white text-xs text-[#2C2428] focus:outline-none focus:border-[#B5838D]"
            />
            <textarea
              rows={2}
              value={newMemDetails}
              onChange={e => setNewMemDetails(e.target.value)}
              placeholder="e.g. Chamomile with a spoon of honey"
              className="w-full p-2.5 rounded-lg border border-[#EAE3DE] bg-white text-xs text-[#2C2428] focus:outline-none focus:border-[#B5838D]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddMem(false)}
                className="px-3 py-1 text-xs text-[#7A6C74]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddMemory}
                className="px-3 py-1 bg-[#2C2428] text-white rounded-lg text-xs font-medium"
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {state.memories.map(m => (
            <div
              key={m.id}
              className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3DE] flex items-start justify-between gap-2"
            >
              <div>
                <span className="text-xs font-bold text-[#2C2428] block">{m.title}</span>
                <p className="text-[11px] text-[#7A6C74] mt-0.5">{m.details}</p>
              </div>
              <button
                type="button"
                onClick={() => deleteMemory(m.id)}
                className="text-stone-300 hover:text-rose-500 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {state.memories.length > 0 && (
          <button
            type="button"
            onClick={clearAllMemories}
            className="text-[11px] text-[#A69A9F] hover:text-rose-500 underline"
          >
            Clear all remembered preferences
          </button>
        )}
      </div>

      {/* Section 4: Privacy & App Lock */}
      <div className="bg-white rounded-2xl p-4 border border-[#EFEAE6] shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-[#2C2428] uppercase tracking-wider">
          Privacy & Lock
        </h3>

        <div className="flex items-center justify-between py-1">
          <div>
            <span className="text-xs font-bold text-[#2C2428] block">App Lock (PIN)</span>
            <span className="text-[10px] text-[#A69A9F]">Lock app when backgrounded</span>
          </div>
          <button
            type="button"
            onClick={() => setAppLock(!appLock)}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ${
              appLock ? 'bg-[#2C2428]' : 'bg-stone-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                appLock ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {appLock && (
          <div>
            <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
              4-Digit PIN Code
            </label>
            <input
              type="password"
              maxLength={4}
              value={pinCode}
              onChange={e => setPinCode(e.target.value.replace(/\D/g, ''))}
              className="w-24 px-3 py-1.5 rounded-xl border border-[#EAE3DE] bg-[#FAF8F5] text-center text-sm font-bold tracking-widest text-[#2C2428] focus:outline-none focus:border-[#B5838D]"
            />
          </div>
        )}
      </div>

      {/* Section 5: Data Backup & Reset */}
      <div className="bg-white rounded-2xl p-4 border border-[#EFEAE6] shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-[#2C2428] uppercase tracking-wider">
          Backup & Export
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={exportData}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#FAF6F3] border border-[#EAE3DE] hover:bg-[#F2ECE8] text-[#2C2428] text-xs font-medium transition-all"
          >
            <Download className="w-3.5 h-3.5 stroke-[1.8]" />
            <span>Export JSON</span>
          </button>

          <label className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#FAF6F3] border border-[#EAE3DE] hover:bg-[#F2ECE8] text-[#2C2428] text-xs font-medium cursor-pointer transition-all">
            <Upload className="w-3.5 h-3.5 stroke-[1.8]" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        {/* Reset Actions */}
        <div className="pt-2 border-t border-[#FAF6F3] space-y-2">
          {confirmAction ? (
            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-rose-800 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Confirm {confirmAction === 'chat' ? 'clearing chat' : confirmAction === 'wellness' ? 'resetting logs' : 'full factory reset'}?</span>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setConfirmAction(null)}
                  className="px-3 py-1 rounded-lg text-xs bg-white text-stone-600 border border-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirmAction === 'chat') clearChatHistory();
                    if (confirmAction === 'wellness') resetWellnessData();
                    if (confirmAction === 'all') resetAllData();
                    setConfirmAction(null);
                    showToast('Data reset completed');
                  }}
                  className="px-3 py-1 rounded-lg text-xs bg-rose-600 text-white font-semibold"
                >
                  Confirm
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1 text-[11px] text-[#A69A9F]">
              <button
                type="button"
                onClick={() => setConfirmAction('chat')}
                className="text-left hover:text-stone-700"
              >
                Clear chat conversation history
              </button>
              <button
                type="button"
                onClick={() => setConfirmAction('wellness')}
                className="text-left hover:text-stone-700"
              >
                Reset period and daily wellness logs
              </button>
              <button
                type="button"
                onClick={() => setConfirmAction('all')}
                className="text-left text-rose-500/80 hover:text-rose-600"
              >
                Reset all application data
              </button>
            </div>
          )}
        </div>
      </div>

      {/* About */}
      <div className="p-3 text-center text-[10px] text-[#A69A9F] space-y-0.5">
        <p>Sivumi v1.0.0 · Private Offline Sanctuary</p>
        <p>Crafted with love for Sivuu</p>
      </div>
    </div>
  );
};
