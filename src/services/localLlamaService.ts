import { SivumiState } from '../types/database';
import { generateOfflineCompanionResponse } from './companionEngine';

export interface LlamaResponseResult {
  text: string;
  source: 'gemma270m' | 'offline';
  modelName: string;
}

export interface GemmaStatusResult {
  available: boolean;
  initialized: boolean;
  modelPresent: boolean;
  modelName: string;
  message?: string;
}

type NativeBridge = {
  initialize(requestId: string): void;
  generate(requestId: string, payloadJson: string): void;
  getStatus(): string;
};

type NativeReply = {
  ok: boolean;
  text?: string;
  error?: string;
  modelName?: string;
  status?: GemmaStatusResult;
};

declare global {
  interface Window {
    SivumiGemma?: NativeBridge;
    __sivumiGemmaNativeCallback?: (requestId: string, payloadJson: string) => void;
  }
}

const pending = new Map<
  string,
  { resolve: (value: NativeReply) => void; reject: (reason?: unknown) => void; timer: number }
>();

if (typeof window !== 'undefined') {
  window.__sivumiGemmaNativeCallback = (requestId: string, payloadJson: string) => {
    const item = pending.get(requestId);
    if (!item) return;
    window.clearTimeout(item.timer);
    pending.delete(requestId);
    try {
      item.resolve(JSON.parse(payloadJson) as NativeReply);
    } catch (error) {
      item.reject(error);
    }
  };
}

const nativeRequest = (
  action: 'initialize' | 'generate',
  payload?: unknown,
  timeoutMs = 120_000
): Promise<NativeReply> => {
  const bridge = window.SivumiGemma;
  if (!bridge) {
    return Promise.reject(new Error('Native Gemma bridge is not available. Open the Android build, not a normal browser.'));
  }

  const requestId = `gemma-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      pending.delete(requestId);
      reject(new Error('Gemma request timed out.'));
    }, timeoutMs);

    pending.set(requestId, { resolve, reject, timer });

    if (action === 'initialize') {
      bridge.initialize(requestId);
    } else {
      bridge.generate(requestId, JSON.stringify(payload ?? {}));
    }
  });
};

export const getGemmaStatus = (): GemmaStatusResult => {
  const bridge = typeof window !== 'undefined' ? window.SivumiGemma : undefined;
  if (!bridge) {
    return {
      available: false,
      initialized: false,
      modelPresent: false,
      modelName: 'Gemma 3 270M IT',
      message: 'Native Android bridge not detected.'
    };
  }

  try {
    return JSON.parse(bridge.getStatus()) as GemmaStatusResult;
  } catch {
    return {
      available: true,
      initialized: false,
      modelPresent: false,
      modelName: 'Gemma 3 270M IT',
      message: 'Could not read native Gemma status.'
    };
  }
};

let initializePromise: Promise<void> | null = null;

export const initializeGemma = async (onProgress?: (progressText: string) => void): Promise<void> => {
  if (initializePromise) return initializePromise;

  initializePromise = (async () => {
    onProgress?.('Loading Gemma 3 270M on this device...');
    const result = await nativeRequest('initialize', undefined, 180_000);
    if (!result.ok) {
      throw new Error(result.error || 'Gemma initialization failed.');
    }
    onProgress?.('Gemma 3 270M ready');
  })();

  try {
    await initializePromise;
  } catch (error) {
    initializePromise = null;
    throw error;
  }
};

const buildSystemInstruction = (state: SivumiState): string => {
  const nickname = state.user.nickname || state.user.name || 'Sivuu';
  const companionName = state.companion.companionName || 'Sivumi';
  const personalities = state.companion.personalities.join(', ') || 'Caring, Calm, Playful';
  const affection = state.companion.affectionLevel || 'Sweet';

  return `You are ${companionName}, a private on-device wellness companion for ${nickname}.
Personality: ${personalities}. Warmth level: ${affection}.
Respond in 2 to 4 concise sentences unless the user clearly asks for more detail.
Do not use emojis. Be calm, kind, natural and non-judgmental.
Do not claim to be a doctor and do not diagnose medical conditions.
For urgent or dangerous symptoms, encourage appropriate professional or emergency help.
All conversation is processed locally on the device.`;
};

const buildPrompt = (userMessage: string, state: SivumiState): string => {
  const recent = state.chatMessages
    .slice(-6)
    .map(message => `${message.sender === 'sivumi' ? 'Sivumi' : 'User'}: ${message.content}`)
    .join('\n');

  const memories = state.memories
    .slice(-6)
    .map(memory => `- ${memory.title}: ${memory.details}`)
    .join('\n');

  return `${recent ? `Recent conversation:\n${recent}\n\n` : ''}${memories ? `Helpful private memories:\n${memories}\n\n` : ''}User: ${userMessage}`;
};

export const queryCompanionWithLlama = async (
  userMessage: string,
  state: SivumiState,
  onProgress?: (progressText: string) => void
): Promise<LlamaResponseResult> => {
  try {
    await initializeGemma(onProgress);
    onProgress?.('Gemma 3 270M is thinking locally...');

    const result = await nativeRequest(
      'generate',
      {
        systemInstruction: buildSystemInstruction(state),
        prompt: buildPrompt(userMessage, state)
      },
      180_000
    );

    const text = result.text?.trim();
    if (!result.ok || !text) {
      throw new Error(result.error || 'Gemma returned an empty response.');
    }

    return {
      text,
      source: 'gemma270m',
      modelName: result.modelName || 'Gemma 3 270M IT'
    };
  } catch (error) {
    console.error('Native Gemma 3 270M inference failed:', error);

    // Browser development remains usable, but a real Android release cannot be
    // built without the model because Gradle verifies the model asset.
    return {
      text: generateOfflineCompanionResponse(userMessage, state),
      source: 'offline',
      modelName: 'Offline fallback (Gemma unavailable)'
    };
  }
};
