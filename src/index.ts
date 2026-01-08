import 'dotenv/config';
import { createMcpServer } from './server/mcp-server.js';
import { setupHttpServer } from './server/transport.js';
import { registerTools } from './tools/index.js';
import { registerWidgetResource } from './resources/widget-resource.js';
import { StateManager } from './state/state-manager.js';
import { ClaudeClient } from './services/claude-client.js';
import { defaultPersonality } from './personalities/index.js';
import { logger } from './utils/logger.js';

async function main() {
  try {
    logger.info('Starting Grams ChatGPT MCP Server...');

    // Initialize state manager
    const stateManager = new StateManager();

    // Initialize Claude client with default personality (Sweet Nana)
    const claudeClient = new ClaudeClient(defaultPersonality);

    // Create MCP server
    const server = createMcpServer();

    // Register tools and resources
    registerTools(server, stateManager, claudeClient);
    registerWidgetResource(server);

    // Setup HTTP transport and start server
    await setupHttpServer(server);

    logger.info('Grams ChatGPT MCP Server is ready! 👵');
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Shutting down gracefully...');
  process.exit(0);
});

// Start the server
main();
