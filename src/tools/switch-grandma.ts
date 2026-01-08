import { z } from 'zod';
import type { StateManager } from '../state/state-manager.js';
import type { ClaudeClient } from '../services/claude-client.js';
import { getPersonalityById, type PersonalityId } from '../personalities/index.js';
import { logger } from '../utils/logger.js';

export const switchGrandmaSchema = z.object({
  personality: z.enum(['sweet-nana', 'wise-bubbe', 'cool-grams']).describe('The grandma personality to switch to'),
});

export type SwitchGrandmaParams = z.infer<typeof switchGrandmaSchema>;

const greetings: Record<PersonalityId, string> = {
  'sweet-nana': "Hello sweetie! It's Nana now. How can I help you, dear?",
  'wise-bubbe': "Shayna! Bubbe is here. What's on your mind, bubeleh?",
  'cool-grams': 'Hey kiddo! Cool Grams reporting for duty! What\'s up?',
};

export async function handleSwitchGrandma(
  params: SwitchGrandmaParams,
  sessionId: string,
  stateManager: StateManager,
  claudeClient: ClaudeClient
) {
  logger.info(`Switch personality request from session ${sessionId}: ${params.personality}`);

  stateManager.switchPersonality(sessionId, params.personality);
  const newPersonality = getPersonalityById(params.personality);

  // Update Claude client with new personality
  claudeClient.updatePersonality(newPersonality);

  const greeting = greetings[params.personality];

  logger.info(`Switched to ${newPersonality.name}`);

  return {
    content: [
      {
        type: 'text',
        text: greeting,
      },
    ],
    // Include data for widget UI
    _meta: {
      ui: {
        personalityId: newPersonality.id,
        personalityName: newPersonality.name,
        avatar: newPersonality.avatar,
        message: greeting,
        switchedTo: true,
      },
    },
  };
}
