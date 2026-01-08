import type { GrandmaPersonality, PersonalityId } from './types.js';
import { sweetNana } from './sweet-nana.js';
import { wiseBubbe } from './wise-bubbe.js';
import { coolGrams } from './cool-grams.js';

export * from './types.js';
export { sweetNana, wiseBubbe, coolGrams };

const personalities: Record<PersonalityId, GrandmaPersonality> = {
  'sweet-nana': sweetNana,
  'wise-bubbe': wiseBubbe,
  'cool-grams': coolGrams,
};

export function getPersonalityById(id: PersonalityId): GrandmaPersonality {
  const personality = personalities[id];
  if (!personality) {
    throw new Error(`Unknown personality: ${id}`);
  }
  return personality;
}

export function getAllPersonalities(): GrandmaPersonality[] {
  return Object.values(personalities);
}

export const defaultPersonality: GrandmaPersonality = sweetNana;
