# Development Guide

Guide for customizing and extending Grams ChatGPT.

## Project Structure

```
/Users/sam/Desktop/Grams Chatgpt/
├── src/
│   ├── server/           # MCP server setup
│   ├── tools/            # MCP tool implementations
│   ├── personalities/    # Grandma personality definitions
│   ├── services/         # Business logic (Claude, voice, etc.)
│   ├── state/            # Session management
│   ├── resources/        # MCP resources (widget)
│   └── utils/            # Utilities (config, logger)
├── widget/               # UI components
├── docs/                 # Documentation
└── dist/                 # Compiled output
```

## Adding a New Personality

1. Create personality file in `src/personalities/`:

```typescript
// src/personalities/spicy-abuela.ts
import type { GrandmaPersonality } from './types.js';

export const spicyAbuela: GrandmaPersonality = {
  id: 'spicy-abuela',
  name: 'Spicy Abuela',
  displayName: 'Abuela',
  avatar: '👵🌶️',
  systemPrompt: `You are Spicy Abuela, a feisty Latina grandmother...`,
  characteristics: {
    tone: ['fiery', 'passionate', 'protective'],
    vocabulary: ['mijo', 'mija', 'ay dios mío'],
    topics: ['family', 'cooking', 'tough love'],
    catchphrases: ['Ay dios mío!', 'Listen to your abuela...']
  }
};
```

2. Add to `src/personalities/types.ts`:
```typescript
export type PersonalityId = 'sweet-nana' | 'wise-bubbe' | 'cool-grams' | 'spicy-abuela';
```

3. Export from `src/personalities/index.ts`:
```typescript
import { spicyAbuela } from './spicy-abuela.js';

const personalities: Record<PersonalityId, GrandmaPersonality> = {
  // ... existing
  'spicy-abuela': spicyAbuela,
};
```

4. Update response generator in `src/services/response-generator.ts`:
```typescript
private buildPersonalizedResponse(...) {
  switch (id) {
    case 'spicy-abuela':
      return this.generateSpicyAbuelaResponse(...);
    // ... other cases
  }
}
```

5. Add greeting in `src/tools/switch-grandma.ts`:
```typescript
const greetings: Record<PersonalityId, string> = {
  // ... existing
  'spicy-abuela': 'Ay mijo! Abuela is here! What do you need?',
};
```

6. Update widget `widget/index.html`:
```html
<button class="personality-btn" data-personality="spicy-abuela">
  <span class="personality-avatar">👵🌶️</span>
  <span class="personality-label">Spicy Abuela</span>
</button>
```

7. Add color in `widget/styles.css`:
```css
:root {
  --color-abuela: #ffcc99;
}
.personality-btn[data-personality="spicy-abuela"].active {
  border-color: var(--color-abuela);
}
```

8. Update widget script `widget/script.js`:
```javascript
this.personalities = {
  // ... existing
  'spicy-abuela': {
    name: 'Spicy Abuela',
    avatar: '👵🌶️',
    color: '#ffcc99'
  }
};
```

## Customizing Response Templates

Edit `src/services/response-generator.ts`:

```typescript
private generateSweetNanaResponse(...): string {
  const templates = {
    greeting: [
      "New greeting template here",
      "Another greeting option",
    ],
    emotional_sad: [
      "Comforting response for sadness",
    ],
    // Add more intent types
  };

  return this.selectTemplate(templates, intent);
}
```

## Adding a New MCP Tool

1. Create tool file:
```typescript
// src/tools/get-recipe.ts
import { z } from 'zod';

export const getRecipeSchema = z.object({
  dish: z.string().describe('The dish to get a recipe for'),
});

export async function handleGetRecipe(params, sessionId, stateManager) {
  const personality = getPersonalityById(
    stateManager.getSession(sessionId).currentPersonality
  );

  const recipe = generateRecipe(params.dish, personality);

  return {
    content: [{ type: 'text', text: recipe }],
    _meta: {
      ui: {
        recipe: recipe,
        dish: params.dish,
      }
    }
  };
}
```

2. Register in `src/tools/index.ts`:
```typescript
import { getRecipeSchema, handleGetRecipe } from './get-recipe.js';

// In tool handler
case 'get_recipe': {
  const validated = getRecipeSchema.parse(params);
  return await handleGetRecipe(validated, sessionId, stateManager);
}

// In tools/list
{
  name: 'get_recipe',
  description: 'Get a grandma recipe for a specific dish',
  inputSchema: {
    type: 'object',
    properties: {
      dish: { type: 'string', description: 'The dish name' }
    },
    required: ['dish']
  }
}
```

## Widget Development

### Modify Widget Layout

Edit `widget/index.html` for structure changes.

### Update Widget Styles

Edit `widget/styles.css`. Changes take effect after server restart (widget is bundled at runtime).

### Add Widget Features

Edit `widget/script.js`:

```javascript
class GramsWidget {
  // Add new methods
  showRecipe(recipe) {
    // Display recipe in widget
  }

  setupFromToolOutput() {
    // Handle new tool output types
    if (uiData.recipe) {
      this.showRecipe(uiData.recipe);
    }
  }
}
```

## Development Workflow

### Local Development
```bash
npm run dev  # Auto-reload on file changes
```

### Build for Production
```bash
npm run build
npm start
```

### Testing

1. **Test Health Endpoint**:
```bash
curl http://localhost:3000/health
```

2. **Test MCP Tools** (requires MCP inspector):
```bash
npx @modelcontextprotocol/inspector@latest \
  --server-url http://localhost:3000/sse \
  --transport sse
```

3. **Test in ChatGPT**:
- Use ngrok tunnel
- Add to ChatGPT MCP servers
- Test all personalities and features

## Debugging

### Enable Debug Logging

Add to `src/utils/logger.ts`:
```typescript
debug(message: string, ...args: any[]): void {
  if (config.nodeEnv === 'development') {
    this.log('debug', message, ...args);
  }
}
```

### Inspect Tool Calls

Check server logs:
```
[DEBUG] Tool call: chat_with_grams (session: abc123)
[INFO] Chat request from session abc123: "I'm feeling sad"
[INFO] Chat response from Sweet Nana: "Oh sweetie, come here..."
```

### Widget Debugging

Open browser dev tools in ChatGPT:
```javascript
console.log(window.openai.toolOutput);
```

## Production Deployment

### Environment Setup

1. Use production environment:
```bash
NODE_ENV=production
```

2. Set production port:
```bash
PORT=8080
```

3. Add API keys:
```bash
ANTHROPIC_API_KEY=sk-ant-prod-key
```

### Deployment Options

**Vercel** (Recommended):
```bash
npm install -g vercel
vercel
```

**Fly.io**:
```bash
flyctl launch
flyctl deploy
```

**Railway**:
```bash
railway link
railway up
```

### Production Checklist

- [ ] Add error handling and logging
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Add rate limiting
- [ ] Configure CORS properly
- [ ] Use Redis for session storage
- [ ] Set up SSL/TLS
- [ ] Add health checks
- [ ] Configure auto-scaling

## Performance Tips

1. **Cache Responses**: Store common responses in memory
2. **Limit History**: Keep only last 20 messages (already implemented)
3. **Batch Requests**: Bundle multiple API calls
4. **Use CDN**: Serve widget from CDN
5. **Compress Responses**: Enable gzip compression

## Common Issues

### TypeScript Errors

```bash
npm run build  # Check for type errors
```

### Widget Not Updating

Server restart required when changing widget files:
```bash
# Kill server (Ctrl+C)
npm run dev
```

### Session State Lost

In-memory sessions reset on restart. For production, use Redis:

```typescript
import Redis from 'ioredis';

class StateManager {
  private redis: Redis;

  async getOrCreateSession(id: string) {
    const data = await this.redis.get(`session:${id}`);
    return data ? JSON.parse(data) : this.createNew(id);
  }
}
```

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Create pull request
5. Describe changes clearly

## Resources

- [MCP SDK Docs](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude API Docs](https://docs.anthropic.com)
- [ElevenLabs API Docs](https://elevenlabs.io/docs)
- [ChatGPT MCP Integration](https://platform.openai.com/docs/mcp)
