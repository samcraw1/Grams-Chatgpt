import type { ConversationContext, PersonalityId, Message } from '../personalities/index.js';
import { logger } from '../utils/logger.js';

export class StateManager {
  private sessions: Map<string, ConversationContext>;

  constructor() {
    this.sessions = new Map();
    logger.info('State manager initialized');
  }

  getOrCreateSession(sessionId: string): ConversationContext {
    if (!this.sessions.has(sessionId)) {
      const newSession: ConversationContext = {
        currentPersonality: 'sweet-nana',
        conversationHistory: [],
        sessionStarted: new Date(),
      };
      this.sessions.set(sessionId, newSession);
      logger.debug(`Created new session: ${sessionId}`);
    }

    return this.sessions.get(sessionId)!;
  }

  switchPersonality(sessionId: string, newPersonality: PersonalityId): void {
    const session = this.getOrCreateSession(sessionId);
    const oldPersonality = session.currentPersonality;

    session.currentPersonality = newPersonality;

    // Add a system message about the personality switch
    const switchMessage: Message = {
      role: 'assistant',
      content: `[Switched to ${newPersonality}]`,
      timestamp: new Date(),
    };
    session.conversationHistory.push(switchMessage);

    logger.info(`Session ${sessionId}: Switched from ${oldPersonality} to ${newPersonality}`);
  }

  addMessage(sessionId: string, role: 'user' | 'assistant', content: string): void {
    const session = this.getOrCreateSession(sessionId);

    const message: Message = {
      role,
      content,
      timestamp: new Date(),
    };

    session.conversationHistory.push(message);

    // Keep only the last 20 messages to manage memory
    if (session.conversationHistory.length > 20) {
      session.conversationHistory = session.conversationHistory.slice(-20);
      logger.debug(`Trimmed conversation history for session ${sessionId}`);
    }
  }

  getSession(sessionId: string): ConversationContext | undefined {
    return this.sessions.get(sessionId);
  }

  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
    logger.info(`Cleared session: ${sessionId}`);
  }

  getSessionCount(): number {
    return this.sessions.size;
  }
}
