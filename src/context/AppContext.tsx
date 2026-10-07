import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SivumiState,
  PeriodDay,
  DailyCheckin,
  Meal,
  Goal,
  GoalLog,
  ChatMessage,
  Memory,
  User,
  AppSettings,
  CompanionSettings,
  MoodLevel
} from '../types/database';
import {
  loadStoredState,
  saveStoredState,
  getDefaultInitialState,
  getTodayDateString,
  exportUserDataAsJson
} from '../services/storage';
import { queryCompanionWithLlama } from '../services/localLlamaService';

export type ActiveTab = 'home' | 'cycle' | 'goals' | 'me';

interface AppContextType {
  state: SivumiState;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isCheckinModalOpen: boolean;
  setIsCheckinModalOpen: (open: boolean) => void;
  isAddMealModalOpen: boolean;
  setIsAddMealModalOpen: (open: boolean) => void;
  isLogPeriodModalOpen: boolean;
  setIsLogPeriodModalOpen: (open: boolean) => void;
  isLocked: boolean;
  unlockWithPin: (pin: string) => boolean;
  unlockWithBiometrics: () => boolean;
  lockApp: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  updateCompanion: (updates: Partial<CompanionSettings>) => void;
  logDailyMood: (mood: MoodLevel) => void;
  saveDailyCheckin: (checkinData: Partial<DailyCheckin>) => void;
  savePeriodDay: (periodData: Partial<PeriodDay> & { date: string }) => void;
  addMeal: (meal: Omit<Meal, 'id' | 'loggedAt'>) => void;
  deleteMeal: (id: string) => void;
  toggleGoalCompletion: (goalId: string, date?: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  deleteGoal: (id: string) => void;
  sendChatMessage: (content: string, quickPrompt?: string) => Promise<void>;
  clearChatHistory: () => void;
  addMemory: (memory: Omit<Memory, 'id' | 'createdAt'>) => void;
  deleteMemory: (id: string) => void;
  clearAllMemories: () => void;
  resetWellnessData: () => void;
  resetAllData: () => void;
  exportData: () => void;
  importData: (jsonStr: string) => boolean;
  llamaProgressText: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SivumiState>(() => loadStoredState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [isAddMealModalOpen, setIsAddMealModalOpen] = useState(false);
  const [isLogPeriodModalOpen, setIsLogPeriodModalOpen] = useState(false);
  const [llamaProgressText, setLlamaProgressText] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    const s = loadStoredState();
    return Boolean(s.settings.appLockEnabled && s.settings.hasCompletedOnboarding);
  });

  // Sync to local storage
  useEffect(() => {
    saveStoredState(state);
  }, [state]);

  const unlockWithPin = (pin: string): boolean => {
    if (!state.settings.appLockEnabled || pin === (state.settings.pinCode || '1234')) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const unlockWithBiometrics = (): boolean => {
    setIsLocked(false);
    return true;
  };

  const lockApp = () => {
    if (state.settings.appLockEnabled) {
      setIsLocked(true);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: { ...prev.user, ...updates }
    }));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
  };

  const updateCompanion = (updates: Partial<CompanionSettings>) => {
    setState(prev => ({
      ...prev,
      companion: { ...prev.companion, ...updates }
    }));
  };

  const logDailyMood = (mood: MoodLevel) => {
    const today = getTodayDateString();
    setState(prev => {
      const existing = prev.dailyCheckins[today] || {
        id: `dc-${Date.now()}`,
        date: today,
        mood: 'okay',
        energy: 3,
        stress: 3,
        sleepHours: 7.5,
        waterGlasses: 4,
        movementMinutes: 0,
        reflectionNotes: '',
        updatedAt: new Date().toISOString()
      };

      return {
        ...prev,
        dailyCheckins: {
          ...prev.dailyCheckins,
          [today]: {
            ...existing,
            mood,
            updatedAt: new Date().toISOString()
          }
        }
      };
    });
  };

  const saveDailyCheckin = (checkinData: Partial<DailyCheckin>) => {
    const date = checkinData.date || getTodayDateString();
    setState(prev => {
      const existing = prev.dailyCheckins[date] || {
        id: `dc-${Date.now()}`,
        date,
        mood: 'okay',
        energy: 3,
        stress: 3,
        sleepHours: 7,
        waterGlasses: 4,
        movementMinutes: 0,
        reflectionNotes: '',
        updatedAt: new Date().toISOString()
      };

      return {
        ...prev,
        dailyCheckins: {
          ...prev.dailyCheckins,
          [date]: {
            ...existing,
            ...checkinData,
            date,
            updatedAt: new Date().toISOString()
          }
        }
      };
    });
  };

  const savePeriodDay = (periodData: Partial<PeriodDay> & { date: string }) => {
    const date = periodData.date;
    setState(prev => {
      const existing = prev.periodDays[date] || {
        id: `p-${Date.now()}`,
        date,
        isPeriod: true,
        flow: 'medium',
        symptoms: {
          cramps: 1,
          bloating: 1,
          fatigue: 1,
          headache: 1,
          acne: 1,
          moodSwings: 1,
          cravings: 1
        },
        notes: '',
        loggedAt: new Date().toISOString()
      };

      const updated = {
        ...existing,
        ...periodData,
        loggedAt: new Date().toISOString()
      };

      return {
        ...prev,
        periodDays: {
          ...prev.periodDays,
          [date]: updated
        }
      };
    });
  };

  const addMeal = (meal: Omit<Meal, 'id' | 'loggedAt'>) => {
    const newMeal: Meal = {
      ...meal,
      id: `m-${Date.now()}`,
      loggedAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      meals: [newMeal, ...prev.meals]
    }));
  };

  const deleteMeal = (id: string) => {
    setState(prev => ({
      ...prev,
      meals: prev.meals.filter(m => m.id !== id)
    }));
  };

  const toggleGoalCompletion = (goalId: string, date = getTodayDateString()) => {
    setState(prev => {
      const existingLog = prev.goalLogs.find(gl => gl.goalId === goalId && gl.date === date);
      let updatedLogs: GoalLog[];

      if (existingLog) {
        updatedLogs = prev.goalLogs.map(gl =>
          gl.id === existingLog.id ? { ...gl, completed: !gl.completed } : gl
        );
      } else {
        const newLog: GoalLog = {
          id: `gl-${Date.now()}`,
          goalId,
          date,
          completed: true
        };
        updatedLogs = [...prev.goalLogs, newLog];
      }

      return {
        ...prev,
        goalLogs: updatedLogs
      };
    });
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: `g-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));
  };

  const deleteGoal = (id: string) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id),
      goalLogs: prev.goalLogs.filter(gl => gl.goalId !== id)
    }));
  };

  const sendChatMessage = async (content: string, quickPrompt?: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'sivuu',
      content,
      timestamp: new Date().toISOString(),
      quickPrompt
    };

    // Append user message immediately
    setState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, userMsg]
    }));

    try {
      // Trigger Llama companion engine (Ollama, WebLLM, or offline)
      const reply = await queryCompanionWithLlama(content, state, progress => {
        setLlamaProgressText(progress);
      });

      const companionMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'sivumi',
        content: reply.text,
        timestamp: new Date().toISOString(),
        source: reply.source,
        modelName: reply.modelName
      };

      setState(prev => ({
        ...prev,
        chatMessages: [...prev.chatMessages, companionMsg]
      }));
    } finally {
      setLlamaProgressText(null);
    }
  };

  const clearChatHistory = () => {
    setState(prev => ({
      ...prev,
      chatMessages: [
        {
          id: `cm-${Date.now()}`,
          sender: 'sivumi',
          content: `Hey ${prev.user.nickname || 'Sivuu'}, our conversation is fresh and quiet. How are you feeling right now?`,
          timestamp: new Date().toISOString()
        }
      ]
    }));
  };

  const addMemory = (memory: Omit<Memory, 'id' | 'createdAt'>) => {
    const newMem: Memory = {
      ...memory,
      id: `mem-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      memories: [...prev.memories, newMem]
    }));
  };

  const deleteMemory = (id: string) => {
    setState(prev => ({
      ...prev,
      memories: prev.memories.filter(m => m.id !== id)
    }));
  };

  const clearAllMemories = () => {
    setState(prev => ({
      ...prev,
      memories: []
    }));
  };

  const resetWellnessData = () => {
    setState(prev => ({
      ...prev,
      periodDays: {},
      cycleLogs: [],
      dailyCheckins: {},
      meals: [],
      goalLogs: []
    }));
  };

  const resetAllData = () => {
    const initial = getDefaultInitialState();
    setState(initial);
    saveStoredState(initial);
  };

  const exportData = () => {
    exportUserDataAsJson(state);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.user) {
        setState(parsed);
        saveStoredState(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        state,
        activeTab,
        setActiveTab,
        isChatOpen,
        setIsChatOpen,
        isCheckinModalOpen,
        setIsCheckinModalOpen,
        isAddMealModalOpen,
        setIsAddMealModalOpen,
        isLogPeriodModalOpen,
        setIsLogPeriodModalOpen,
        isLocked,
        unlockWithPin,
        unlockWithBiometrics,
        lockApp,
        updateUser,
        updateSettings,
        updateCompanion,
        logDailyMood,
        saveDailyCheckin,
        savePeriodDay,
        addMeal,
        deleteMeal,
        toggleGoalCompletion,
        addGoal,
        deleteGoal,
        sendChatMessage,
        clearChatHistory,
        addMemory,
        deleteMemory,
        clearAllMemories,
        resetWellnessData,
        resetAllData,
        exportData,
        importData,
        llamaProgressText
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
