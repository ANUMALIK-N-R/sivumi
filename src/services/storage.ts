import { SivumiState, PeriodDay, Meal, Goal, GoalLog, ChatMessage, Memory, DailyCheckin } from '../types/database';

const STORAGE_KEY = 'sivumi_wellness_data_v1';

export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getOffsetDateString = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDefaultInitialState = (): SivumiState => {
  const today = getTodayDateString();
  const yesterday = getOffsetDateString(-1);
  const twoDaysAgo = getOffsetDateString(-2);
  const lastPeriodStart = getOffsetDateString(-14); // Cycle Day 14!

  const initialPeriodDays: Record<string, PeriodDay> = {
    [lastPeriodStart]: {
      id: 'p-1',
      date: lastPeriodStart,
      isPeriod: true,
      flow: 'medium',
      symptoms: { cramps: 3, bloating: 2, fatigue: 4, headache: 2, acne: 3, moodSwings: 2, cravings: 3 },
      notes: 'Period started gently, used a warm heating pad.',
      loggedAt: new Date(Date.now() - 14 * 86400000).toISOString()
    },
    [getOffsetDateString(-13)]: {
      id: 'p-2',
      date: getOffsetDateString(-13),
      isPeriod: true,
      flow: 'heavy',
      symptoms: { cramps: 4, bloating: 3, fatigue: 3, headache: 1, acne: 2, moodSwings: 3, cravings: 4 },
      notes: 'Drank raspberry leaf tea, rested in bed in the afternoon.',
      loggedAt: new Date(Date.now() - 13 * 86400000).toISOString()
    },
    [getOffsetDateString(-12)]: {
      id: 'p-3',
      date: getOffsetDateString(-12),
      isPeriod: true,
      flow: 'medium',
      symptoms: { cramps: 2, bloating: 2, fatigue: 2, headache: 1, acne: 2, moodSwings: 1, cravings: 2 },
      notes: 'Felt much better today, went for a slow evening walk.',
      loggedAt: new Date(Date.now() - 12 * 86400000).toISOString()
    },
    [getOffsetDateString(-11)]: {
      id: 'p-4',
      date: getOffsetDateString(-11),
      isPeriod: true,
      flow: 'light',
      symptoms: { cramps: 1, bloating: 1, fatigue: 2, headache: 1, acne: 1, moodSwings: 1, cravings: 1 },
      notes: 'Flow tapering down.',
      loggedAt: new Date(Date.now() - 11 * 86400000).toISOString()
    },
    [getOffsetDateString(-10)]: {
      id: 'p-5',
      date: getOffsetDateString(-10),
      isPeriod: true,
      flow: 'spotting',
      symptoms: { cramps: 1, bloating: 1, fatigue: 1, headache: 1, acne: 1, moodSwings: 1, cravings: 1 },
      notes: 'Final day of period.',
      loggedAt: new Date(Date.now() - 10 * 86400000).toISOString()
    }
  };

  const initialCheckins: Record<string, DailyCheckin> = {
    [twoDaysAgo]: {
      id: 'dc-1',
      date: twoDaysAgo,
      mood: 'good',
      energy: 4,
      stress: 2,
      sleepHours: 8,
      waterGlasses: 7,
      movementMinutes: 30,
      reflectionNotes: 'Slept really well and felt clear-headed. Enjoyed a cozy matcha latte.',
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    [yesterday]: {
      id: 'dc-2',
      date: yesterday,
      mood: 'okay',
      energy: 3,
      stress: 3,
      sleepHours: 7,
      waterGlasses: 6,
      movementMinutes: 15,
      reflectionNotes: 'Busy afternoon, but remembered to breathe and take quiet moments.',
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    },
    [today]: {
      id: 'dc-3',
      date: today,
      mood: 'good',
      energy: 4,
      stress: 2,
      sleepHours: 7.5,
      waterGlasses: 5,
      movementMinutes: 20,
      reflectionNotes: 'Soft morning sunshine today. Feeling peaceful.',
      updatedAt: new Date().toISOString()
    }
  };

  const initialMeals: Meal[] = [
    {
      id: 'm-1',
      date: today,
      mealType: 'breakfast',
      name: 'Fluffy chia pudding with berries & almond butter',
      description: 'Topped with toasted pumpkin seeds and cinnamon',
      tags: ['Protein', 'Healthy Fats', 'Fiber', 'PCOS-Friendly'],
      hungerBefore: 4,
      fullnessAfter: 4,
      cravingSatisfied: true,
      loggedAt: new Date().toISOString()
    },
    {
      id: 'm-2',
      date: today,
      mealType: 'lunch',
      name: 'Warm quinoa bowl with roasted veggies & grilled tofu',
      description: 'Avocado slices, olive oil dressing, and baby greens',
      tags: ['Vegetables', 'Protein', 'Healthy Fats', 'Whole Grains'],
      hungerBefore: 3,
      fullnessAfter: 4,
      cravingSatisfied: true,
      loggedAt: new Date().toISOString()
    }
  ];

  const initialGoals: Goal[] = [
    {
      id: 'g-1',
      title: 'Drink 8 glasses of water',
      category: 'health',
      frequency: 'daily',
      targetCount: 8,
      targetUnit: 'glasses',
      iconName: 'Droplet',
      createdAt: new Date().toISOString()
    },
    {
      id: 'g-2',
      title: 'Gentle 20-min stroll',
      category: 'movement',
      frequency: 'daily',
      targetCount: 20,
      targetUnit: 'mins',
      iconName: 'Footprints',
      createdAt: new Date().toISOString()
    },
    {
      id: 'g-3',
      title: '15 mins cozy reading / study',
      category: 'study',
      frequency: 'daily',
      targetCount: 15,
      targetUnit: 'mins',
      iconName: 'BookOpen',
      createdAt: new Date().toISOString()
    },
    {
      id: 'g-4',
      title: 'Evening chamomile tea & wind down',
      category: 'sleep',
      frequency: 'daily',
      targetCount: 1,
      targetUnit: 'time',
      iconName: 'Moon',
      createdAt: new Date().toISOString()
    }
  ];

  const initialGoalLogs: GoalLog[] = [
    { id: 'gl-1', goalId: 'g-1', date: today, completed: false, progressValue: 5 },
    { id: 'gl-2', goalId: 'g-2', date: today, completed: true, progressValue: 20 },
    { id: 'gl-3', goalId: 'g-3', date: today, completed: true, progressValue: 15 },
    { id: 'gl-4', goalId: 'g-4', date: today, completed: false, progressValue: 0 }
  ];

  const initialChat: ChatMessage[] = [
    {
      id: 'cm-1',
      sender: 'sivumi',
      content: 'Hey Sivuu, welcome home to your little cozy space. How are you feeling today?',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  const initialMemories: Memory[] = [
    {
      id: 'mem-1',
      category: 'comfort',
      title: 'Favorite soothing drink',
      details: 'Chamomile tea with a drop of honey and warm oat milk.',
      createdAt: new Date().toISOString()
    },
    {
      id: 'mem-2',
      category: 'comfort',
      title: 'Comfort item',
      details: 'Soft weighted blanket and gentle lo-fi piano music.',
      createdAt: new Date().toISOString()
    },
    {
      id: 'mem-3',
      category: 'cycle',
      title: 'PCOS comfort habit',
      details: 'Gentle evening walks and spearmint tea help ease cycle tension.',
      createdAt: new Date().toISOString()
    }
  ];

  return {
    user: {
      id: 'usr-sivuu',
      name: 'Sivuu',
      nickname: 'Sivu',
      birthYear: '2001',
      height: '163 cm',
      createdAt: new Date().toISOString()
    },
    settings: {
      hasCompletedOnboarding: false, // will show splash then onboarding if false
      appLockEnabled: false,
      pinCode: '1234',
      biometricEnabled: false,
      notificationsEnabled: true,
      cycleTypicalLength: 32,
      periodTypicalLength: 5,
      lastPeriodStartDate: lastPeriodStart,
      focusCategories: ['Better sleep', 'Food', 'Movement', 'Mental wellbeing']
    },
    companion: {
      companionName: 'Sivumi',
      personalities: ['Caring', 'Calm', 'Playful'],
      affectionLevel: 'Sweet',
      reminderStyle: 'cozy',
      llamaMode: 'gemma270m',
      // Legacy fields are retained only so old backup JSON remains importable.
      // The Android build never connects to these endpoints.
      ollamaEndpoint: '',
      ollamaModel: 'Gemma 3 270M IT',
      webLlamaModel: ''
    },
    periodDays: initialPeriodDays,
    cycleLogs: [
      {
        id: 'cl-1',
        startDate: lastPeriodStart,
        endDate: getOffsetDateString(-10),
        cycleLength: 32,
        periodLength: 5,
        notes: 'Regular flow, manageable cramps with heating pad.'
      }
    ],
    dailyCheckins: initialCheckins,
    meals: initialMeals,
    goals: initialGoals,
    goalLogs: initialGoalLogs,
    chatMessages: initialChat,
    memories: initialMemories
  };
};

export const loadStoredState = (): SivumiState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const def = getDefaultInitialState();
      saveStoredState(def);
      return def;
    }
    const parsed = JSON.parse(raw);
    return {
      ...getDefaultInitialState(),
      ...parsed,
      user: { ...getDefaultInitialState().user, ...(parsed.user || {}) },
      settings: { ...getDefaultInitialState().settings, ...(parsed.settings || {}) },
      companion: {
        ...getDefaultInitialState().companion,
        ...(parsed.companion || {}),
        // Migrate every old install to the native, fully offline Gemma engine.
        llamaMode: 'gemma270m',
        ollamaEndpoint: '',
        ollamaModel: 'Gemma 3 270M IT',
        webLlamaModel: ''
      }
    };
  } catch (err) {
    console.error('Failed to load state from localStorage', err);
    return getDefaultInitialState();
  }
};

export const saveStoredState = (state: SivumiState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage', err);
  }
};

export const exportUserDataAsJson = (state: SivumiState): void => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `sivumi_backup_${getTodayDateString()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
