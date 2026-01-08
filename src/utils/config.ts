import { config as dotenvConfig } from 'dotenv';

// Load environment variables
dotenvConfig();

export interface Config {
  port: number;
  nodeEnv: string;
  mcpServerName: string;
  mcpServerVersion: string;
  anthropicApiKey?: string;
  elevenLabsApiKey?: string;
  elevenLabsVoiceIds: {
    nana?: string;
    bubbe?: string;
    grams?: string;
  };
}

function loadConfig(): Config {
  return {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    mcpServerName: process.env.MCP_SERVER_NAME || 'grams-chatgpt',
    mcpServerVersion: process.env.MCP_SERVER_VERSION || '1.0.0',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    elevenLabsApiKey: process.env.ELEVENLABS_API_KEY,
    elevenLabsVoiceIds: {
      nana: process.env.ELEVENLABS_VOICE_ID_NANA,
      bubbe: process.env.ELEVENLABS_VOICE_ID_BUBBE,
      grams: process.env.ELEVENLABS_VOICE_ID_GRAMS,
    },
  };
}

export const config = loadConfig();
