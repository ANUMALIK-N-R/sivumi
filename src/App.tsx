import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { FloatingChatButton } from './components/common/FloatingChatButton';
import { PinLock } from './components/common/PinLock';
import { SplashScreen } from './components/splash/SplashScreen';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { HomeView } from './components/home/HomeView';
import { CycleView } from './components/cycle/CycleView';
import { GoalsView } from './components/goals/GoalsView';
import { MeView } from './components/me/MeView';
import { FoodView } from './components/food/FoodView';
import { ChatView } from './components/chat/ChatView';
import { CheckinModal } from './components/home/CheckinModal';
import { AddMealModal } from './components/food/AddMealModal';
import { PeriodLogModal } from './components/cycle/PeriodLogModal';

const AppContent: React.FC = () => {
  const {
    state,
    activeTab,
    isChatOpen,
    isCheckinModalOpen,
    setIsCheckinModalOpen,
    isAddMealModalOpen,
    setIsAddMealModalOpen,
    isLogPeriodModalOpen,
    setIsLogPeriodModalOpen,
    isLocked
  } = useApp();

  const [showSplash, setShowSplash] = useState(true);
  const [isOnboarding, setIsOnboarding] = useState(false);

  const handleSplashComplete = () => {
    setShowSplash(false);
    if (!state.settings.hasCompletedOnboarding) {
      setIsOnboarding(true);
    }
  };

  const handleOnboardingComplete = () => {
    setIsOnboarding(false);
  };

  // 1. Show Splash Screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // 2. Show Onboarding Flow if not completed
  if (isOnboarding && !state.settings.hasCompletedOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // 3. Show PIN Lock if active
  if (isLocked) {
    return <PinLock />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C2428] flex flex-col font-sans selection:bg-[#B5838D]/20">
      {/* Top Header */}
      <Header
        title={
          activeTab === 'home'
            ? undefined
            : activeTab === 'cycle'
            ? 'Cycle'
            : activeTab === 'goals'
            ? 'Goals'
            : 'Me'
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-md mx-auto w-full">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'cycle' && <CycleView />}
        {activeTab === 'goals' && <GoalsView />}
        {activeTab === 'me' && <MeView />}
      </main>

      {/* Prominent Floating "Talk to me" Action Button */}
      {!isChatOpen && <FloatingChatButton />}

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Overlays / Modals */}
      {isChatOpen && <ChatView />}

      {isCheckinModalOpen && (
        <CheckinModal onClose={() => setIsCheckinModalOpen(false)} />
      )}

      {isAddMealModalOpen && (
        <AddMealModal onClose={() => setIsAddMealModalOpen(false)} />
      )}

      {isLogPeriodModalOpen && (
        <PeriodLogModal onClose={() => setIsLogPeriodModalOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
