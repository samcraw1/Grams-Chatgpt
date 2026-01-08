# Grams ChatGPT

An AI grandma companion that lives inside ChatGPT, built with the Model Context Protocol (MCP). Chat with three distinct grandma personalities for emotional support, wisdom, and comfort.

## Features

### Three Distinct Personalities

- **Sweet Nana** 👵 - Warm, nurturing, Southern grandmother with unconditional love
  - Uses: "sweetie," "honey," "dear"
  - Perfect for: Comfort, gentle advice, feeling loved

- **Wise Bubbe** 👵📚 - Knowledgeable Jewish grandmother with philosophical wisdom
  - Uses: "bubeleh," "mamaleh," Yiddish expressions
  - Perfect for: Life advice, practical wisdom, real talk

- **Cool Grams** 😎👵 - Modern, tech-savvy grandmother who keeps up with the times
  - Uses: "kiddo," "champ," contemporary slang
  - Perfect for: Encouragement, straight talk, modern perspective

### Key Features

- **Interactive Widget UI** - Beautiful personality switcher that renders in ChatGPT
- **Intelligent Responses** - Works with placeholder responses or Claude API
- **Voice Ready** - Structure prepared for ElevenLabs integration
- **Clean Architecture** - Easy to extend and customize
- **Session Management** - Maintains conversation history and personality across chat

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Build
npm run build

# Start development server
npm run dev

# In another terminal, start ngrok
npm run ngrok
```

Copy the ngrok HTTPS URL and add it to ChatGPT's MCP server settings.

## Tech Stack

- **MCP Server**: @modelcontextprotocol/sdk with SSE transport
- **Runtime**: Node.js with TypeScript
- **AI Integration**: Claude API (Anthropic) - optional
- **Voice**: ElevenLabs (planned)
- **Widget**: Vanilla HTML/CSS/JS

## Documentation

- [Setup Guide](docs/SETUP.md) - Detailed installation and setup instructions
- [API Integration](docs/API_INTEGRATION.md) - Adding Claude API and ElevenLabs
- [Development Guide](docs/DEVELOPMENT.md) - Customization and extension guide

## Project Status

- ✅ MCP server architecture
- ✅ Three grandma personalities with rich characteristics
- ✅ Intelligent placeholder response system
- ✅ Widget UI with personality switcher
- ✅ Session state management
- ⏳ Claude API integration (ready for API keys)
- 📋 ElevenLabs voice (TODO)

## How It Works

1. **User chats in ChatGPT** - "I want to talk to my grandma"
2. **ChatGPT calls MCP tool** - `chat_with_grams` with user message
3. **Server generates response** - Using Claude API or intelligent placeholders
4. **Widget displays in ChatGPT** - Shows grandma's personality, avatar, and message
5. **User can switch personalities** - Click buttons in widget or ask ChatGPT

## No API Keys Required!

The app uses intelligent placeholder responses that demonstrate the personality system without any API costs. Responses are:
- Personality-aware and contextual
- Intent-based (greetings, emotions, questions, advice)
- Natural and varied to avoid repetition
- Perfect for testing and development

When ready, add your Claude API key to `.env` for production-quality AI responses.

## Architecture

```
ChatGPT ←→ MCP Server (Node.js/TypeScript) ←→ Claude API (optional)
              ↓
         Widget UI (HTML/CSS/JS in ChatGPT iframe)
```

**Core Components:**
- **MCP Server** - Handles tool calls and widget resources
- **Tools** - `chat_with_grams`, `switch_grandma`
- **Personalities** - Rich character definitions with system prompts
- **Response Generator** - Intelligent placeholder system
- **Claude Client** - Auto-detects API key, falls back to placeholders
- **State Manager** - Session-based conversation tracking
- **Widget Resource** - Bundles HTML/CSS/JS for ChatGPT display

## Example Usage

**In ChatGPT:**

```
You: I want to talk to my grandma
ChatGPT: [Calls chat_with_grams tool]
Grams Widget appears: 👵 Sweet Nana says "Hello sweetie! How can I help you today?"

You: I'm feeling stressed about work
Widget: "Oh honey, I know worry can feel so heavy. You've gotten through hard times before..."

You: Switch to Cool Grams
[Widget updates to 😎👵]
Widget: "Hey kiddo! Cool Grams reporting for duty! What's up?"
```

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Test thoroughly
4. Submit a pull request

## License

MIT

## Acknowledgments

Built with:
- [Model Context Protocol](https://modelcontextprotocol.io/) by Anthropic
- [Claude API](https://www.anthropic.com/claude) for AI responses
- [OpenAI ChatGPT](https://chat.openai.com) for platform integration

## Support

For issues, questions, or feedback:
- Open an issue on GitHub
- Check [Setup Guide](docs/SETUP.md) for troubleshooting
- See [Development Guide](docs/DEVELOPMENT.md) for customization

---

Made with ❤️ for grandmas everywhere
