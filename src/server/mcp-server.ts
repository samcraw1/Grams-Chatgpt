import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

export function createMcpServer(): Server {
  const server = new Server(
    {
      name: config.mcpServerName,
      version: config.mcpServerVersion,
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  logger.info(`MCP Server initialized: ${config.mcpServerName} v${config.mcpServerVersion}`);

  return server;
}
