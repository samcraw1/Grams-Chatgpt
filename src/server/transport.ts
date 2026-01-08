import express from 'express';
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { logger } from '../utils/logger.js';
import { config } from '../utils/config.js';

export async function setupHttpServer(mcpServer: Server): Promise<void> {
  const app = express();

  app.use(express.json());

  // Enable CORS for ChatGPT
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }

    next();
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      server: config.mcpServerName,
      version: config.mcpServerVersion,
      timestamp: new Date().toISOString(),
    });
  });

  // MCP SSE endpoint
  app.get('/sse', async (req, res) => {
    logger.info('SSE connection established');

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    const transport = new SSEServerTransport('/message', res);
    await mcpServer.connect(transport);

    req.on('close', () => {
      logger.info('SSE connection closed');
    });
  });

  // MCP message endpoint
  app.post('/message', async (req, res) => {
    // This endpoint is handled by the SSE transport
    // Just acknowledge receipt
    res.json({ received: true });
  });

  // Start HTTP server
  const port = config.port;
  app.listen(port, () => {
    logger.info(`✓ Grams ChatGPT MCP Server ready!`);
    logger.info(`  HTTP server: http://localhost:${port}`);
    logger.info(`  SSE endpoint: http://localhost:${port}/sse`);
    logger.info(`  Health check: http://localhost:${port}/health`);

    if (!config.anthropicApiKey) {
      logger.warn('  ⚠ Claude API key not configured - using placeholder responses');
    }
  });
}
