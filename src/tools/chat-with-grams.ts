import { z } from 'zod';
import type { StateManager } from '../state/state-manager.js';
import type { ClaudeClient } from '../services/claude-client.js';
import { getPersonalityById } from '../personalities/index.js';
import { logger } from '../utils/logger.js';

export const chatWithGramsSchema = z.object({
  message: z.string().describe('The message to send to Grandma'),
});

export type ChatWithGramsParams = z.infer<typeof chatWithGramsSchema>;

export async function handleChatWithGrams(
  params: ChatWithGramsParams,
  sessionId: string,
  stateManager: StateManager,
  claudeClient: ClaudeClient
) {
  logger.info(`Chat request from session ${sessionId}: "${params.message}"`);

  const session = stateManager.getOrCreateSession(sessionId);

  // Add user message to history
  stateManager.addMessage(sessionId, 'user', params.message);

  // Generate response using Claude or placeholder
  const response = await claudeClient.chat(params.message, session);

  // Add assistant message to history
  stateManager.addMessage(sessionId, 'assistant', response);

  const personality = getPersonalityById(session.currentPersonality);

  logger.info(`Chat response from ${personality.name}: "${response.substring(0, 50)}..."`);

  return {
    content: [
      {
        type: 'text',
        text: response,
      },
    ],
    // Include data for widget UI
    _meta: {
      ui: {
        personalityId: personality.id,
        personalityName: personality.name,
        avatar: personality.avatar,
        message: response,
      },
    },
  };
}
