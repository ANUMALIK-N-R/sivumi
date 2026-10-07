/**
 * Database schema and types for Sivumi
 * Structured for easy SQLite mapping / offline-first persistence
 */

export interface User {
  id: string;
  name: string;
  nickname: string;
  birthYear?: string;
  height?: string;
  createdAt: string;
}

export interface CycleLog {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  cycleLength: number; // e.g. 32
  periodLength: number; // e.g. 5
  notes?: string;
}

export type FlowIntensity = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';

export interface SymptomScores {
  cramps: number; // 1-5
  bloating: number; // 1-5
  fatigue: number; // 1-5
  headache: number; // 1-5
  acne: number; // 1-5
  moodSwings: number; // 1-5
  cravings: number; // 1-5
}

export interface PeriodDay {
  id: string;
  date: string; // YYYY-MM-DD
  isPeriod: boolean;
  flow: FlowIntensity;
  symptoms: SymptomScores;
  cervicalFluid?: string;
  notes?: string;
  loggedAt: string;
}

export type MoodLevel = 'bad' | 'low' | 'okay' | 'good' | 'great';

export interface DailyCheckin {
  id: string;
  date: string; // YYYY-MM-DD
  mood: MoodLevel;
  energy: number; // 1-5
  stress: number; // 1-5
  sleepHours: number; // e.g. 7.5
  waterGlasses: number; // e.g. 6
  movementMinutes: number; // e.g. 25
  reflectionNotes: string;
  updatedAt: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  name: string;
  description?: string;
  tags: string[]; // e.g. ['Protein', 'Vegetables', 'Whole Grains', 'Healthy Fats']
  hungerBefore?: number; // 1-5
  fullnessAfter?: number; // 1-5
  cravingSatisfied?: boolean;
  loggedAt: string;
}

export type GoalCategory = 
  | 'health' 
  | 'sleep' 
  | 'food' 
  | 'movement' 
  | 'study' 
  | 'personal' 
  | 'emotional';

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  frequency: 'daily' | 'weekly';
  targetCount: number; // e.g. 8 glasses or 1 time
  targetUnit?: string; // e.g. 'glasses', 'mins', 'times'
  iconName: string;
  createdAt: string;
  archived?: boolean;
}

export interface GoalLog {
  id: string;
  goalId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  progressValue?: number;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'sivuu' | 'sivumi';
  content: string;
  timestamp: string; // ISO string
  quickPrompt?: string;
  source?: 'gemma270m' | 'offline';
  modelName?: string;
}

export interface Memory {
  id: string;
  category: 'comfort' | 'food' | 'cycle' | 'hobby' | 'note';
  title: string;
  details: string;
  createdAt: string;
}

export type LlamaMode = 'gemma270m' | 'offline';

export interface CompanionSettings {
  companionName: string;
  personalities: string[]; // ['Caring', 'Calm', 'Playful', 'Motivating']
  affectionLevel: 'Gentle' | 'Sweet' | 'Maximum Warmth';
  reminderStyle: 'cozy' | 'gentle';
  llamaMode: LlamaMode;
  ollamaEndpoint: string;
  ollamaModel: string;
  webLlamaModel: string;
}

export interface AppSettings {
  hasCompletedOnboarding: boolean;
  appLockEnabled: boolean;
  pinCode?: string;
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  cycleTypicalLength: number; // default 32
  periodTypicalLength: number; // default 5
  lastPeriodStartDate: string; // YYYY-MM-DD
  focusCategories: string[];
}

export interface SivumiState {
  user: User;
  settings: AppSettings;
  companion: CompanionSettings;
  periodDays: Record<string, PeriodDay>; // keyed by date YYYY-MM-DD
  cycleLogs: CycleLog[];
  dailyCheckins: Record<string, DailyCheckin>; // keyed by date YYYY-MM-DD
  meals: Meal[];
  goals: Goal[];
  goalLogs: GoalLog[];
  chatMessages: ChatMessage[];
  memories: Memory[];
}
