import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { randomUUID } from 'crypto';
import { logger } from '../utils/logger.js';
import { config } from '../utils/config.js';

// Wire-level response logger that captures everything (including SSE streams)
function responseWireLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  const chunks: Buffer[] = [];
  const origWrite = res.write.bind(res);
  const origEnd = res.end.bind(res);

  // Capture headers once they're committed
  const logHeadersOnce = (() => {
    let logged = false;
    return () => {
      if (logged) return;
      logged = true;
      const headers = res.getHeaders();
      logger.info(`[MCP][RESP] ${req.method} ${req.originalUrl} status=${res.statusCode}`);
      logger.info(`[MCP][RESP] headers=${JSON.stringify(headers)}`);
    };
  })();

  // Intercept streaming writes
  (res.write as any) = (chunk: any, encoding?: any, cb?: any) => {
    try {
      logHeadersOnce();
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
    } catch (e) {
      // ignore capture errors
    }
    return origWrite(chunk, encoding, cb);
  };

  // Intercept end (final chunk)
  (res.end as any) = (chunk?: any, encoding?: any, cb?: any) => {
    try {
      logHeadersOnce();
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
    } catch (e) {
      // ignore capture errors
    }

    const ms = Date.now() - start;

    // Let the response finish, then log the body safely (truncate)
    const ret = origEnd(chunk as any, encoding as any, cb as any);

    try {
      const body = Buffer.concat(chunks).toString('utf8');
      const trimmed = body.length > 4000 ? body.slice(0, 4000) + '…(truncated)' : body;
      logger.info(`[MCP][RESP] duration_ms=${ms} body=${JSON.stringify(trimmed)}`);
    } catch (e) {
      logger.info(`[MCP][RESP] duration_ms=${ms} (body capture failed)`);
    }

    return ret;
  };

  next();
}

export async function setupHttpServer(mcpServer: Server): Promise<void> {
  const app = express();

  // Wire-level response logging (must be early)
  app.use(responseWireLogger);

  app.use(express.json({ limit: '1mb' }));

  // Enable CORS for ChatGPT
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, MCP-Protocol-Version');

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

  // OpenAI domain verification endpoint
  app.get('/.well-known/openai-apps-challenge', (req, res) => {
    res.type('text/plain');
    res.send('5pdRJeLm1mFKd4MY2eUsgIFeotq-uBR341nDDMhJ6iM');
  });

  // Create transport instance in stateless mode (allows multiple initialize attempts)
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  // Connect the MCP server to the transport
  await mcpServer.connect(transport);

  // MCP endpoint - handle both GET and POST
  const handleMcpRequest = async (req: express.Request, res: express.Response) => {
    logger.info(`[MCP][REQ] ${req.method} ${req.originalUrl}`);
    logger.info(`[MCP][REQ] headers=${JSON.stringify(req.headers)}`);
    logger.info(`[MCP][REQ] body=${JSON.stringify(req.body)}`);

    try {
      await transport.handleRequest(req, res, req.body);
    } catch (err: any) {
      logger.error('[MCP][ERR] transport.handleRequest threw', err);

      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          id: null,
          error: { code: -32000, message: 'Transport error', data: String(err?.message ?? err) },
        });
      } else {
        // If headers already sent, just end the stream
        try {
          res.end();
        } catch {}
      }
    }
  };

  app.get('/mcp', handleMcpRequest);
  app.post('/mcp', handleMcpRequest);

  // Start HTTP server
  const port = config.port;
  app.listen(port, () => {
    logger.info(`✓ Grams ChatGPT MCP Server ready!`);
    logger.info(`  HTTP server: http://localhost:${port}`);
    logger.info(`  MCP endpoint: http://localhost:${port}/mcp`);
    logger.info(`  Health check: http://localhost:${port}/health`);

    if (!config.anthropicApiKey) {
      logger.warn('  ⚠ Claude API key not configured - using placeholder responses');
    }
  });
}
