# Grams ChatGPT - Setup Guide

Complete setup instructions for running Grams locally and connecting to ChatGPT.

## Prerequisites

- Node.js 18+ installed
- npm or pnpm
- ngrok account (free tier works fine)
- ChatGPT Plus or Pro account (for MCP server integration)

## Installation

1. Navigate to the project directory:
```bash
cd "/Users/sam/Desktop/Grams Chatgpt"
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. (Optional) Add your ngrok auth token to `ngrok-config.yml`

## Local Development

### Start the MCP Server

```bash
npm run dev
```

You should see output like:
```
[INFO] Starting Grams ChatGPT MCP Server...
[INFO] MCP Server initialized: grams-chatgpt v1.0.0
[INFO] Tools registered: chat_with_grams, switch_grandma
[INFO] Widget resource registered: grams://widget
[INFO] ✓ Grams ChatGPT MCP Server ready!
[INFO]   HTTP server: http://localhost:3000
[INFO]   SSE endpoint: http://localhost:3000/sse
[INFO]   Health check: http://localhost:3000/health
[WARN]   ⚠ Claude API key not configured - using placeholder responses
```

### Test Locally

In another terminal, test the health endpoint:
```bash
curl http://localhost:3000/health
```

You should see:
```json
{
  "status": "healthy",
  "server": "grams-chatgpt",
  "version": "1.0.0",
  "timestamp": "2026-01-08T..."
}
```

### Expose with ngrok

In a separate terminal:
```bash
npm run ngrok
```

Or manually:
```bash
ngrok http 3000
```

Copy the HTTPS URL from the output (e.g., `https://abc123.ngrok.app`)

## Connect to ChatGPT

1. Open ChatGPT (https://chat.openai.com)

2. Go to Settings → Developer Tools

3. Enable Developer Mode (requires ChatGPT Plus/Pro)

4. Add MCP Server:
   - Name: Grams ChatGPT
   - URL: `https://abc123.ngrok.app/sse`
   - Click "Add Server"

5. Test the connection

## Testing in ChatGPT

Try these prompts:

1. **Basic chat**: "I want to talk to my grandma"
2. **Switch personality**: "Switch to Wise Bubbe"
3. **Ask for advice**: "I'm feeling stressed about work"
4. **Get comfort**: "I had a bad day"
5. **Try Cool Grams**: "Switch to Cool Grams" then "I'm worried about a big presentation"

The widget should appear with:
- Current grandma avatar and name
- Three personality buttons
- Grandma's response in a message bubble

## Troubleshooting

### Server won't start

**Issue**: Port 3000 already in use
```bash
# Find process using port 3000
lsof -i :3000
# Kill it or change PORT in .env
```

**Issue**: TypeScript errors
```bash
# Clean build and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### Widget not displaying in ChatGPT

1. Check ngrok tunnel is active
2. Verify MCP server URL in ChatGPT settings ends with `/sse`
3. Check browser console for errors
4. Restart ChatGPT conversation

### Responses seem generic

This is expected without Claude API keys! The app uses intelligent placeholder responses that demonstrate the personality system. See [API_INTEGRATION.md](./API_INTEGRATION.md) to add real Claude API integration.

### ngrok tunnel expires

Free ngrok tunnels expire after 2 hours. Options:
- Restart ngrok and update ChatGPT MCP server URL
- Upgrade to ngrok paid plan for persistent URLs
- Use alternative tunneling: Cloudflare Tunnel, localtunnel

## Next Steps

- [Add Claude API integration](./API_INTEGRATION.md)
- [Development guide](./DEVELOPMENT.md)
- Customize personalities in `src/personalities/`
- Add more response templates in `src/services/response-generator.ts`
