export type PersonalityId = 'sweet-nana' | 'wise-bubbe' | 'cool-grams';

export interface GrandmaPersonality {
  id: PersonalityId;
  name: string;
  displayName: string;
  avatar: string;
  systemPrompt: string;
  characteristics: {
    tone: string[];
    vocabulary: string[];
    topics: string[];
    catchphrases: string[];
  };
  voiceConfig?: {
    elevenLabsVoiceId?: string;
    pitch?: number;
    speed?: number;
  };
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ConversationContext {
  currentPersonality: PersonalityId;
  conversationHistory: Message[];
  sessionStarted: Date;
}
