import type { PersonalityId } from '../personalities/index.js';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

/**
 * Voice Service for ElevenLabs Integration
 *
 * TODO: This is a scaffold for future voice integration.
 *
 * To implement:
 * 1. Install ElevenLabs SDK
 * 2. Add ELEVENLABS_API_KEY and voice IDs to .env
 * 3. Implement generateVoice() method
 * 4. Add voice streaming endpoint in server
 * 5. Update widget to play audio
 */

export class VoiceService {
  constructor() {
    if (!config.elevenLabsApiKey) {
      logger.info('ElevenLabs API key not configured - voice features disabled');
    }
  }

  async generateVoice(text: string, personality: PersonalityId): Promise<string | null> {
    // TODO: Implement ElevenLabs voice generation
    logger.warn('Voice generation not yet implemented');
    return null;

    /*
     * Implementation outline:
     *
     * 1. Get voice ID for personality:
     *    const voiceId = this.getVoiceIdForPersonality(personality);
     *
     * 2. Call ElevenLabs API:
     *    const audio = await elevenlabs.textToSpeech({
     *      voiceId,
     *      text,
     *      modelId: 'eleven_monolingual_v1'
     *    });
     *
     * 3. Upload audio to storage (S3, Cloudflare R2, etc.)
     *    const audioUrl = await this.uploadAudio(audio);
     *
     * 4. Return audio URL for widget to play
     *    return audioUrl;
     */
  }

  private getVoiceIdForPersonality(personality: PersonalityId): string | undefined {
    const voiceIds = config.elevenLabsVoiceIds;

    switch (personality) {
      case 'sweet-nana':
        return voiceIds.nana;
      case 'wise-bubbe':
        return voiceIds.bubbe;
      case 'cool-grams':
        return voiceIds.grams;
      default:
        return undefined;
    }
  }
}
