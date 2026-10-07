import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SivumiAvatar } from '../common/SivumiAvatar';
import {
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

import cozyJournalArt from '../../assets/images/cozy_journal_morning_1791342267946.jpg';

const COZY_JOURNAL_ART = cozyJournalArt;

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const { updateUser, updateCompanion, updateSettings } = useApp();
  const [step, setStep] = useState(2); // 2: Welcome, 3: Profile, 4: Cycle, 5: Goals, 6: Companion, 7: Privacy

  // Form states
  const [name, setName] = useState('Sivuu');
  const [nickname, setNickname] = useState('Sivu');
  const [birthYear, setBirthYear] = useState('2001');
  const [height, setHeight] = useState('163 cm');

  // Cycle states
  const [lastPeriodStart, setLastPeriodStart] = useState('2026-09-12');
  const [cycleLength, setCycleLength] = useState(32);
  const [periodLength, setPeriodLength] = useState(5);

  // Goals states
  const [selectedFocus, setSelectedFocus] = useState<string[]>([
    'Better sleep',
    'Food',
    'Movement',
    'Mental wellbeing'
  ]);

  // Companion states
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>([
    'Caring',
    'Calm',
    'Playful'
  ]);
  const [companionName, setCompanionName] = useState('Sivumi');

  // Privacy states
  const [appLock, setAppLock] = useState(false);
  const [biometrics, setBiometrics] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const focusOptions = [
    'Better sleep',
    'Food',
    'Movement',
    'Mental wellbeing',
    'Study',
    'Personal goals',
    'Hydration',
    'Exercise'
  ];

  const personalityOptions = [
    'Caring',
    'Calm',
    'Playful',
    'Motivating'
  ];

  const toggleFocus = (item: string) => {
    if (selectedFocus.includes(item)) {
      setSelectedFocus(selectedFocus.filter(f => f !== item));
    } else {
      setSelectedFocus([...selectedFocus, item]);
    }
  };

  const togglePersonality = (p: string) => {
    if (selectedPersonalities.includes(p)) {
      if (selectedPersonalities.length > 1) {
        setSelectedPersonalities(selectedPersonalities.filter(item => item !== p));
      }
    } else {
      setSelectedPersonalities([...selectedPersonalities, p]);
    }
  };

  const handleFinish = () => {
    updateUser({
      name,
      nickname,
      birthYear,
      height
    });

    updateCompanion({
      companionName,
      personalities: selectedPersonalities,
      affectionLevel: 'Sweet'
    });

    updateSettings({
      hasCompletedOnboarding: true,
      lastPeriodStartDate: lastPeriodStart,
      cycleTypicalLength: cycleLength,
      periodTypicalLength: periodLength,
      appLockEnabled: appLock,
      biometricEnabled: biometrics,
      notificationsEnabled: notifications
    });

    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF8F5] flex flex-col justify-between p-5 max-w-md mx-auto h-full font-sans overflow-y-auto">
      {/* Top Progress Indicator */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider">
          Step {step - 1} of 6
        </span>
        <div className="flex items-center gap-1">
          {[2, 3, 4, 5, 6, 7].map(s => (
            <span
              key={s}
              className={`h-1 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-5 bg-[#2C2428]'
                  : s < step
                  ? 'w-2 bg-[#B5838D]'
                  : 'w-2 bg-[#EAE3DE]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Screen 2: Welcome */}
      {step === 2 && (
        <div className="my-auto space-y-6 py-4 text-center">
          <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-[#EFEAE6] shadow-xs bg-[#FAF5F2]">
            <img
              src={COZY_JOURNAL_ART}
              alt="Cozy morning journal"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={e => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="space-y-2 px-2 text-left">
            <span className="text-[10px] font-semibold tracking-wider text-[#B5838D] uppercase block">
              Crafted for Sivuu
            </span>
            <h1 className="text-2xl font-bold text-[#2C2428] tracking-tight">
              Hi Sivuu
            </h1>
            <p className="text-xs text-[#7A6C74] leading-relaxed">
              This is your private space for taking care of yourself, tracking your days, and having someone calm to talk to.
            </p>
          </div>

          <button
            onClick={() => setStep(3)}
            className="w-full py-3 rounded-xl bg-[#2C2428] hover:bg-black text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <span>Let&apos;s begin</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Screen 3: Profile Setup */}
      {step === 3 && (
        <div className="my-auto space-y-4 py-4 text-left">
          <div>
            <h2 className="text-lg font-bold text-[#2C2428]">
              What should I call you?
            </h2>
            <p className="text-xs text-[#7A6C74]">
              Personalized just for your comfort
            </p>
          </div>

          <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#EFEAE6] shadow-xs">
            <div>
              <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EAE3DE] rounded-xl px-3 py-2 text-xs text-[#2C2428] font-bold focus:outline-none focus:border-[#B5838D]"
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
                className="w-full bg-[#FAF8F5] border border-[#EAE3DE] rounded-xl px-3 py-2 text-xs text-[#2C2428] font-bold focus:outline-none focus:border-[#B5838D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div>
                <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
                  Birth year (optional)
                </label>
                <input
                  type="text"
                  value={birthYear}
                  onChange={e => setBirthYear(e.target.value)}
                  placeholder="e.g. 2001"
                  className="w-full bg-[#FAF8F5] border border-[#EAE3DE] rounded-xl px-3 py-1.5 text-xs text-[#2C2428] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
                  Height (optional)
                </label>
                <input
                  type="text"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  placeholder="e.g. 163 cm"
                  className="w-full bg-[#FAF8F5] border border-[#EAE3DE] rounded-xl px-3 py-1.5 text-xs text-[#2C2428] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <p className="text-[10px] text-[#A69A9F] text-center">
            You can skip anything you&apos;re not comfortable sharing.
          </p>

          <button
            onClick={() => setStep(4)}
            className="w-full py-3 rounded-xl bg-[#2C2428] hover:bg-black text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Screen 4: Cycle Setup */}
      {step === 4 && (
        <div className="my-auto space-y-4 py-4 text-left">
          <div>
            <h2 className="text-lg font-bold text-[#2C2428]">
              Let&apos;s understand your cycle
            </h2>
            <p className="text-xs text-[#7A6C74]">
              Helps Sivumi gently estimate your rhythm
            </p>
          </div>

          <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#EFEAE6] shadow-xs">
            <div>
              <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
                Last Period Start Date
              </label>
              <input
                type="date"
                value={lastPeriodStart}
                onChange={e => setLastPeriodStart(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EAE3DE] rounded-xl px-3 py-2 text-xs text-[#2C2428] font-bold focus:outline-none focus:border-[#B5838D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
                  Cycle Length (Days)
                </label>
                <input
                  type="number"
                  min="21"
                  max="60"
                  value={cycleLength}
                  onChange={e => setCycleLength(parseInt(e.target.value, 10) || 32)}
                  className="w-full bg-[#FAF8F5] border border-[#EAE3DE] rounded-xl px-3 py-2 text-xs text-[#2C2428] font-bold text-center focus:outline-none"
                />
                <span className="text-[10px] text-[#A69A9F] block mt-0.5 text-center">
                  Usually 28–36 days
                </span>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
                  Period Length (Days)
                </label>
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={periodLength}
                  onChange={e => setPeriodLength(parseInt(e.target.value, 10) || 5)}
                  className="w-full bg-[#FAF8F5] border border-[#EAE3DE] rounded-xl px-3 py-2 text-xs text-[#2C2428] font-bold text-center focus:outline-none"
                />
                <span className="text-[10px] text-[#A69A9F] block mt-0.5 text-center">
                  Usually 4–6 days
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white/70 rounded-xl border border-[#EFEAE6] text-[10px] text-[#7A6C74] text-center leading-normal">
            This app is for personal tracking and does not diagnose or treat medical conditions.
          </div>

          <button
            onClick={() => setStep(5)}
            className="w-full py-3 rounded-xl bg-[#2C2428] hover:bg-black text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Screen 5: Goals Setup */}
      {step === 5 && (
        <div className="my-auto space-y-4 py-4 text-left">
          <div>
            <h2 className="text-lg font-bold text-[#2C2428]">
              What would you like to focus on, {nickname}?
            </h2>
            <p className="text-xs text-[#7A6C74]">
              Select any self-care areas close to your heart
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {focusOptions.map(opt => {
              const isSelected = selectedFocus.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleFocus(opt)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-white border-[#B5838D] text-[#2C2428] shadow-xs'
                      : 'bg-white/60 border-[#EFEAE6] text-[#7A6C74] hover:border-stone-300'
                  }`}
                >
                  <span className="text-xs font-semibold">{opt}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#B5838D]" />}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setStep(6)}
            className="w-full py-3 rounded-xl bg-[#2C2428] hover:bg-black text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Screen 6: Companion Setup */}
      {step === 6 && (
        <div className="my-auto space-y-4 py-4 text-left">
          <div className="text-center space-y-1">
            <SivumiAvatar size="md" className="mx-auto" />
            <h2 className="text-lg font-bold text-[#2C2428] mt-2">
              How should your companion be?
            </h2>
            <p className="text-xs text-[#7A6C74]">
              Choose the emotional warmth of your companion
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {personalityOptions.map(p => {
              const isSelected = selectedPersonalities.includes(p);
              return (
                <button
                  key={p}
                  onClick={() => togglePersonality(p)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-white border-[#B5838D] text-[#2C2428] font-bold shadow-xs'
                      : 'bg-white/60 border-[#EFEAE6] text-[#7A6C74]'
                  }`}
                >
                  <span className="text-xs">{p}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#EFEAE6] shadow-xs">
            <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
              Companion Name
            </label>
            <input
              type="text"
              value={companionName}
              onChange={e => setCompanionName(e.target.value)}
              placeholder="Sivumi"
              className="w-full bg-[#FAF8F5] border border-[#EAE3DE] rounded-xl px-3 py-2 text-xs text-[#2C2428] font-bold focus:outline-none focus:border-[#B5838D]"
            />
          </div>

          <button
            onClick={() => setStep(7)}
            className="w-full py-3 rounded-xl bg-[#2C2428] hover:bg-black text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Screen 7: Privacy Setup */}
      {step === 7 && (
        <div className="my-auto space-y-4 py-4 text-left">
          <div className="text-center space-y-1">
            <div className="w-10 h-10 rounded-full bg-[#FAF5F2] text-[#B5838D] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h2 className="text-lg font-bold text-[#2C2428] mt-2">
              Your Privacy Matters
            </h2>
            <p className="text-xs text-[#7A6C74] leading-relaxed">
              Your wellness information, personal notes, and conversations are private. Sivumi is designed around local storage just for you.
            </p>
          </div>

          <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-[#EFEAE6] shadow-xs">
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-xs font-bold text-[#2C2428] block">
                  Passcode App Lock
                </span>
                <span className="text-[10px] text-[#A69A9F]">
                  Optional PIN protection
                </span>
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

            <div className="flex items-center justify-between py-1 border-t border-[#FAF6F3]">
              <div>
                <span className="text-xs font-bold text-[#2C2428] block">
                  Biometric Unlock
                </span>
                <span className="text-[10px] text-[#A69A9F]">
                  Touch ID / Face ID simulation
                </span>
              </div>
              <button
                type="button"
                onClick={() => setBiometrics(!biometrics)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ${
                  biometrics ? 'bg-[#2C2428]' : 'bg-stone-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                    biometrics ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-1 border-t border-[#FAF6F3]">
              <div>
                <span className="text-xs font-bold text-[#2C2428] block">
                  Gentle Reminders
                </span>
                <span className="text-[10px] text-[#A69A9F]">
                  Cozy check-in prompts
                </span>
              </div>
              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ${
                  notifications ? 'bg-[#2C2428]' : 'bg-stone-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                    notifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="w-full py-3 rounded-xl bg-[#2C2428] hover:bg-black text-white font-semibold text-xs shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <span>Create My Space</span>
          </button>
        </div>
      )}
    </div>
  );
};
