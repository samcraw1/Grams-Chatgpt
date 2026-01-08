import type { GrandmaPersonality, ConversationContext, Message } from '../personalities/index.js';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import { ResponseGenerator } from './response-generator.js';

/**
 * Claude API Client
 *
 * This client is ready for Claude API integration but gracefully falls back
 * to intelligent placeholder responses when no API key is configured.
 *
 * To activate real Claude API responses:
 * 1. Install: npm install @anthropic-ai/sdk
 * 2. Add ANTHROPIC_API_KEY to .env
 * 3. Uncomment the Anthropic import and implementation below
 */

// Uncomment when ready to use Claude API:
// import Anthropic from '@anthropic-ai/sdk';

export class ClaudeClient {
  private personality: GrandmaPersonality;
  private fallbackGenerator: ResponseGenerator;
  // private client: Anthropic | null = null;

  constructor(personality: GrandmaPersonality) {
    this.personality = personality;
    this.fallbackGenerator = new ResponseGenerator(personality);

    // Initialize Claude client if API key exists
    // Uncomment when @anthropic-ai/sdk is installed:
    /*
    if (config.anthropicApiKey) {
      this.client = new Anthropic({
        apiKey: config.anthropicApiKey
      });
      logger.info('Claude API client initialized');
    } else {
      logger.info('No Claude API key found, using placeholder responses');
    }
    */

    if (!config.anthropicApiKey) {
      logger.info('No Claude API key found, using intelligent placeholder responses');
    }
  }

  async chat(message: string, context: ConversationContext): Promise<string> {
    // Check if Claude API is available
    if (config.anthropicApiKey) {
      // Uncomment when ready to use real Claude API:
      // return this.chatWithClaude(message, context);

      // For now, even with API key, use placeholders until SDK is installed
      logger.warn('Claude API key found but SDK not installed. Using placeholders.');
      return this.chatWithPlaceholder(message, context);
    } else {
      return this.chatWithPlaceholder(message, context);
    }
  }

  private chatWithPlaceholder(message: string, context: ConversationContext): string {
    return this.fallbackGenerator.generateResponse(message, context);
  }

  /*
   * Uncomment this method when @anthropic-ai/sdk is installed and you're ready to use real Claude API:
   *
  private async chatWithClaude(message: string, context: ConversationContext): Promise<string> {
    try {
      const response = await this.client!.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: this.personality.systemPrompt,
        messages: this.formatConversationHistory(context, message)
      });

      const textContent = response.content.find(c => c.type === 'text');
      if (textContent && textContent.type === 'text') {
        return textContent.text;
      }

      return 'I'm here for you, dear.';
    } catch (error) {
      logger.error('Claude API error:', error);
      // Fallback to placeholder on error
      return this.chatWithPlaceholder(message, context);
    }
  }

  private formatConversationHistory(context: ConversationContext, newMessage: string) {
    // Convert conversation history to Claude message format
    const messages = context.conversationHistory.map((msg: Message) => ({
      role: msg.role,
      content: msg.content
    }));

    // Add the new user message
    messages.push({
      role: 'user' as const,
      content: newMessage
    });

    return messages;
  }
  */

  updatePersonality(personality: GrandmaPersonality): void {
    this.personality = personality;
    this.fallbackGenerator = new ResponseGenerator(personality);
  }
}
