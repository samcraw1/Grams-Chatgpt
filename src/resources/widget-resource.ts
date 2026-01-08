import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function registerWidgetResource(server: Server): void {
  // Register resources/list handler
  server.setRequestHandler(
    ListResourcesRequestSchema,
    async () => {
      return {
        resources: [
          {
            uri: 'grams://widget',
            name: 'Grams Widget',
            description: 'Interactive widget for chatting with AI grandmas',
            mimeType: 'text/html',
          },
        ],
      };
    }
  );

  // Register resources/read handler
  server.setRequestHandler(
    ReadResourceRequestSchema,
    async (request) => {
      const { uri } = request.params;

      if (uri === 'grams://widget') {
        try {
          const widgetHtml = loadWidgetHtml();

          return {
            contents: [
              {
                uri: 'grams://widget',
                mimeType: 'text/html',
                text: widgetHtml,
              },
            ],
          };
        } catch (error) {
          logger.error('Error loading widget:', error);
          throw new Error('Failed to load widget HTML');
        }
      }

      throw new Error(`Unknown resource: ${uri}`);
    }
  );

  logger.info('Widget resource registered: grams://widget');
}

function loadWidgetHtml(): string {
  try {
    // Get path to widget directory (relative to project root)
    const projectRoot = join(__dirname, '..', '..');
    const widgetPath = join(projectRoot, 'widget');

    // Read HTML, CSS, and JS files
    const html = readFileSync(join(widgetPath, 'index.html'), 'utf-8');
    const css = readFileSync(join(widgetPath, 'styles.css'), 'utf-8');
    const js = readFileSync(join(widgetPath, 'script.js'), 'utf-8');

    // Bundle by replacing placeholders
    return html
      .replace('<!-- CSS_PLACEHOLDER -->', `<style>${css}</style>`)
      .replace('<!-- JS_PLACEHOLDER -->', `<script>${js}</script>`);
  } catch (error) {
    logger.error('Error reading widget files:', error);
    // Return a minimal fallback widget
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Grams Widget</title>
</head>
<body>
  <div style="padding: 20px; text-align: center;">
    <h2>👵 Grams Widget</h2>
    <p>Error loading widget. Check server logs.</p>
  </div>
</body>
</html>
`;
  }
}
