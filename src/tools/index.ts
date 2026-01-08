import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import type { StateManager } from '../state/state-manager.js';
import type { ClaudeClient } from '../services/claude-client.js';
import { chatWithGramsSchema, handleChatWithGrams } from './chat-with-grams.js';
import { switchGrandmaSchema, handleSwitchGrandma } from './switch-grandma.js';
import { logger } from '../utils/logger.js';

export function registerTools(
  server: Server,
  stateManager: StateManager,
  claudeClient: ClaudeClient
): void {
  // Register tools/call handler
  server.setRequestHandler(
    CallToolRequestSchema,
    async (request) => {
      const { name } = request.params;
      const params = request.params.arguments || {};

      // Extract or generate session ID
      const sessionId = (request.params as any)._meta?.sessionId || 'default';

      logger.debug(`Tool call: ${name} (session: ${sessionId})`);

      try {
        switch (name) {
          case 'chat_with_grams': {
            const validated = chatWithGramsSchema.parse(params);
            return await handleChatWithGrams(validated, sessionId, stateManager, claudeClient);
          }

          case 'switch_grandma': {
            const validated = switchGrandmaSchema.parse(params);
            return await handleSwitchGrandma(validated, sessionId, stateManager, claudeClient);
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        logger.error(`Error handling tool ${name}:`, error);
        throw error;
      }
    }
  );

  // Register tools/list handler
  server.setRequestHandler(
    ListToolsRequestSchema,
    async () => {
      return {
        tools: [
          {
            name: 'chat_with_grams',
            description:
              'Chat with your AI grandma. She responds with warmth and wisdom based on her current personality (Sweet Nana, Wise Bubbe, or Cool Grams).',
            inputSchema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Your message to Grandma',
                },
              },
              required: ['message'],
            },
          },
          {
            name: 'switch_grandma',
            description:
              'Switch between different grandma personalities: Sweet Nana (warm and nurturing), Wise Bubbe (knowledgeable and direct), or Cool Grams (modern and adventurous).',
            inputSchema: {
              type: 'object',
              properties: {
                personality: {
                  type: 'string',
                  enum: ['sweet-nana', 'wise-bubbe', 'cool-grams'],
                  description: 'The personality to switch to',
                },
              },
              required: ['personality'],
            },
          },
        ],
      };
    }
  );

  logger.info('Tools registered: chat_with_grams, switch_grandma');
}
