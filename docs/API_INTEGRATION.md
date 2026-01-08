# API Integration Guide

Learn how to integrate real AI APIs for production-quality responses.

## Claude API Integration

The app is already structured for Claude API integration. Just add your API key to activate it!

### Step 1: Get Claude API Key

1. Visit https://console.anthropic.com
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

### Step 2: Install Claude SDK

```bash
npm install @anthropic-ai/sdk
```

### Step 3: Add API Key to Environment

```bash
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" >> .env
```

### Step 4: Uncomment Claude Integration Code

Open `src/services/claude-client.ts` and uncomment:

1. The import at the top:
```typescript
import Anthropic from '@anthropic-ai/sdk';
```

2. The client initialization in the constructor:
```typescript
if (config.anthropicApiKey) {
  this.client = new Anthropic({
    apiKey: config.anthropicApiKey
  });
  logger.info('Claude API client initialized');
}
```

3. Update the `chat` method to use real Claude:
```typescript
if (config.anthropicApiKey) {
  return this.chatWithClaude(message, context);
}
```

4. Uncomment the entire `chatWithClaude` method and `formatConversationHistory` helper

### Step 5: Restart Server

```bash
npm run dev
```

You should now see:
```
[INFO] Claude API client initialized
```

Instead of:
```
[WARN] No Claude API key found, using placeholder responses
```

### Testing Real Claude Integration

Chat with Grams in ChatGPT. Responses will now:
- Be more contextual and natural
- Remember conversation history
- Adapt perfectly to each personality
- Provide deeper emotional intelligence

## ElevenLabs Voice Integration (Future)

Voice integration is scaffolded but not implemented. Here's how to add it:

### Step 1: Get ElevenLabs API Key

1. Visit https://elevenlabs.io
2. Sign up and get API key
3. Create or select three voice IDs (one for each personality)

### Step 2: Add Configuration

```bash
echo "ELEVENLABS_API_KEY=your_key_here" >> .env
echo "ELEVENLABS_VOICE_ID_NANA=voice_id_1" >> .env
echo "ELEVENLABS_VOICE_ID_BUBBE=voice_id_2" >> .env
echo "ELEVENLABS_VOICE_ID_GRAMS=voice_id_3" >> .env
```

### Step 3: Install ElevenLabs SDK

```bash
npm install elevenlabs
```

### Step 4: Implement Voice Service

Edit `src/services/voice-service.ts`:

```typescript
import { ElevenLabsClient } from "elevenlabs";

export class VoiceService {
  private client: ElevenLabsClient;

  constructor() {
    if (config.elevenLabsApiKey) {
      this.client = new ElevenLabsClient({
        apiKey: config.elevenLabsApiKey
      });
    }
  }

  async generateVoice(text: string, personality: PersonalityId): Promise<string | null> {
    const voiceId = this.getVoiceIdForPersonality(personality);
    if (!voiceId) return null;

    const audio = await this.client.generate({
      voice: voiceId,
      text: text,
      model_id: "eleven_monolingual_v1"
    });

    // Upload to storage and return URL
    const audioUrl = await this.uploadAudio(audio);
    return audioUrl;
  }

  private async uploadAudio(audio: Buffer): Promise<string> {
    // TODO: Upload to S3, Cloudflare R2, or other storage
    // Return public URL
  }
}
```

### Step 5: Add Voice to Tools

Update `src/tools/chat-with-grams.ts` to generate voice:

```typescript
const voiceUrl = await voiceService.generateVoice(response, session.currentPersonality);

return {
  content: [{ type: 'text', text: response }],
  _meta: {
    ui: {
      personalityId: personality.id,
      personalityName: personality.name,
      avatar: personality.avatar,
      message: response,
      voiceUrl: voiceUrl  // Add this
    }
  }
};
```

### Step 6: Update Widget to Play Audio

Edit `widget/script.js` to handle voice:

```javascript
setupFromToolOutput() {
  const uiData = window.openai.toolOutput._meta.ui;

  if (uiData.voiceUrl) {
    this.playAudio(uiData.voiceUrl);
  }
}

playAudio(url) {
  const audio = new Audio(url);
  audio.play();
}
```

## API Costs

### Claude API (Anthropic)

- Claude 3.5 Sonnet: $3 per million input tokens, $15 per million output tokens
- Average grandma response: ~200 tokens ($0.003 per response)
- 100 conversations/day = ~$0.30/day

### ElevenLabs

- Starter: $5/month for 30,000 characters
- Creator: $22/month for 100,000 characters
- Average grandma response: ~150 characters
- 100 responses = ~$0.08 on Creator plan

## Production Recommendations

### For Development
- Use placeholder responses (free!)
- Test all features without API costs

### For Testing
- Add Claude API for realistic responses
- Skip voice for now

### For Production
- Claude API for responses
- ElevenLabs for voice
- Cache frequently used responses
- Set rate limits

## Rate Limiting

Add rate limiting to prevent API abuse:

```typescript
// src/middleware/rate-limit.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

Apply to your server:
```typescript
app.use('/sse', apiLimiter);
```

## Monitoring API Usage

Track API calls in your logs:

```typescript
logger.info(`Claude API call: ${tokens} tokens, $${cost.toFixed(4)} cost`);
```

Set up alerts for high usage:
- Daily token count
- Cost per conversation
- Error rates

## Next Steps

- [Development Guide](./DEVELOPMENT.md)
- [Setup Guide](./SETUP.md)
- Customize system prompts in personality files
- Add response caching
- Implement conversation memory
