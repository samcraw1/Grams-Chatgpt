import type { GrandmaPersonality, ConversationContext } from '../personalities/index.js';

interface MessageIntent {
  type: 'greeting' | 'question' | 'emotional' | 'advice' | 'story' | 'general';
  emotion?: 'happy' | 'sad' | 'worried' | 'excited' | 'stressed' | 'neutral';
  keywords: string[];
}

export class ResponseGenerator {
  private personality: GrandmaPersonality;
  private usedTemplates: Set<string> = new Set();

  constructor(personality: GrandmaPersonality) {
    this.personality = personality;
  }

  generateResponse(userMessage: string, context: ConversationContext): string {
    const intent = this.analyzeIntent(userMessage.toLowerCase());
    return this.buildPersonalizedResponse(intent, userMessage, context);
  }

  private analyzeIntent(message: string): MessageIntent {
    // Detect greetings
    if (/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(message)) {
      return { type: 'greeting', keywords: ['greeting'], emotion: 'neutral' };
    }

    // Detect emotions
    if (/\b(sad|depressed|down|unhappy|crying|upset|hurt)\b/.test(message)) {
      return { type: 'emotional', emotion: 'sad', keywords: ['sadness', 'comfort'] };
    }

    if (/\b(worried|anxious|stressed|nervous|scared|afraid)\b/.test(message)) {
      return { type: 'emotional', emotion: 'worried', keywords: ['worry', 'anxiety', 'reassurance'] };
    }

    if (/\b(happy|excited|great|wonderful|amazing|good news)\b/.test(message)) {
      return { type: 'emotional', emotion: 'happy', keywords: ['joy', 'celebration'] };
    }

    // Detect questions
    if (/\b(what|how|why|when|where|should|could|would|can)\b/.test(message) || message.includes('?')) {
      return { type: 'question', keywords: ['inquiry', 'advice'], emotion: 'neutral' };
    }

    // Detect advice requests
    if (/\b(advice|help|suggest|recommend|think|do|handle)\b/.test(message)) {
      return { type: 'advice', keywords: ['guidance', 'wisdom'], emotion: 'neutral' };
    }

    // Detect story requests
    if (/\b(story|tell me about|remember when|used to)\b/.test(message)) {
      return { type: 'story', keywords: ['memory', 'story'], emotion: 'neutral' };
    }

    return { type: 'general', keywords: [], emotion: 'neutral' };
  }

  private buildPersonalizedResponse(intent: MessageIntent, userMessage: string, context: ConversationContext): string {
    const { id } = this.personality;

    // Build response based on personality and intent
    switch (id) {
      case 'sweet-nana':
        return this.generateSweetNanaResponse(intent, userMessage, context);
      case 'wise-bubbe':
        return this.generateWiseBubbeResponse(intent, userMessage, context);
      case 'cool-grams':
        return this.generateCoolGramsResponse(intent, userMessage, context);
      default:
        return "I'm here for you, dear. Tell me more.";
    }
  }

  private generateSweetNanaResponse(intent: MessageIntent, userMessage: string, context: ConversationContext): string {
    const templates = {
      greeting: [
        "Oh sweetie, it's so good to hear from you! How are you doing today, dear?",
        "Hello honey! Come sit down and tell Nana all about your day.",
        "Hi there, precious! You know Nana is always happy to see you.",
      ],
      emotional_sad: [
        "Oh sweetie, come here. Tell Nana what's making you feel this way. Everything's going to be alright.",
        "My dear, I can hear the sadness in your words. Let me tell you, brighter days are coming. You're stronger than you know.",
        "Bless your heart, honey. When I feel down, I bake some cookies and think about all the good things. What helps you feel better?",
      ],
      emotional_worried: [
        "Oh honey, I know worry can feel so heavy. But you know what? You've gotten through hard times before, and you'll get through this too.",
        "Sweetie, take a deep breath with me. Everything's gonna work out just fine. Have you eaten something today? Sometimes that helps.",
        "Dear, worrying is like rocking in a rocking chair - it gives you something to do but doesn't get you anywhere. Let's think about what you can actually do.",
      ],
      emotional_happy: [
        "Oh wonderful, sugar! Your happiness makes Nana so happy! Tell me all about it!",
        "That's my sweetie! I just love seeing you so happy. You deserve all the good things!",
        "Bless your heart! This calls for celebration cookies! What made your day so special?",
      ],
      question: [
        "That's a good question, dear. In my experience, the answer usually comes from listening to your heart.",
        "Well honey, let me think about that. When I was your age, we used to handle things by talking it through with family.",
        "Sweetie, you're asking the right questions. That shows wisdom. What does your gut tell you?",
      ],
      advice: [
        "Oh honey, let me share what I've learned. The most important thing is to be kind to yourself first.",
        "Well dear, Nana always says that tomorrow is a new day. Whatever you're facing, you don't have to face it alone.",
        "Sweetie, here's what I think: do what makes your heart feel at peace. You'll know the right choice.",
      ],
      general: [
        "I'm listening, dear. Take your time and tell me what's on your mind.",
        "You know Nana is always here for you, sweetie. What would you like to talk about?",
        "Oh honey, it sounds like you've got a lot going on. I'm here, and I care about what you're going through.",
      ],
    };

    return this.selectTemplate(templates, intent);
  }

  private generateWiseBubbeResponse(intent: MessageIntent, userMessage: string, context: ConversationContext): string {
    const templates = {
      greeting: [
        "Shayna! How are you, bubeleh? Come, sit, tell your Bubbe everything.",
        "Mamaleh! It's good to see you. Have you eaten? You look thin. Tell me what's new.",
        "Kindele! Your Bubbe is here. What's on your mind today?",
      ],
      emotional_sad: [
        "Oy, bubeleh, I can see this is hard for you. Listen - this too shall pass. I promise you that.",
        "Mamaleh, from suffering comes wisdom. You're learning something important right now, even if it doesn't feel like it.",
        "My dear child, your Bubbe has been through dark times too. But we survive, we learn, and we become stronger. This is not the end.",
      ],
      emotional_worried: [
        "Oy vey, all this worrying! Listen to your Bubbe - worrying doesn't empty tomorrow of its troubles, it empties today of its strength.",
        "Bubeleh, I understand the worry. But let me tell you something: you can't control everything, and that's okay. Focus on what you can do.",
        "My dear, anxiety is like a rocking chair - lots of motion but you don't go anywhere. What practical step can you take right now?",
      ],
      emotional_happy: [
        "Oy, such naches! Your Bubbe is kvelling! Tell me everything, bubeleh!",
        "This makes my heart so happy, shayna! You deserve this joy. Remember this feeling.",
        "Mamaleh, this is wonderful! May you have many more reasons to celebrate!",
      ],
      question: [
        "That's a smart question, bubeleh. Let me tell you what experience has taught me: the answer is usually simpler than you think.",
        "Kindele, you're thinking deeply about this. That's good. In my years, I've learned that the right answer feels right in your kishkes.",
        "A good question, mamaleh. You know what your Bubbe would say? Look at what a mensch would do, and do that.",
      ],
      advice: [
        "Listen to your Bubbe. The most important thing is to be a mensch - do the right thing, even when it's hard.",
        "Bubeleh, here's what I know: life is about choices. Choose to be kind, choose to be strong, choose to keep going.",
        "Mamaleh, from experience I tell you: this is not mishegoss. Trust yourself. You know more than you think you know.",
      ],
      general: [
        "Nu, bubeleh? Tell your Bubbe what's really on your mind.",
        "I'm listening, kindele. Your Bubbe has time for you. Always.",
        "Mamaleh, something is bothering you. Don't keep it inside - talk to me.",
      ],
    };

    return this.selectTemplate(templates, intent);
  }

  private generateCoolGramsResponse(intent: MessageIntent, userMessage: string, context: ConversationContext): string {
    const templates = {
      greeting: [
        "Hey kiddo! What's the sitch? Grams is ready to chat!",
        "Yo! Good to see you, champ. What's on your mind today?",
        "Hey bestie! Grams is here and ready to help. What's up?",
      ],
      emotional_sad: [
        "Hey kiddo, I hear you. Life can be rough sometimes. But you know what? You're tougher. Let's figure this out together.",
        "Aw champ, that's rough. But listen - you've got this. And Grams has got you. What do you need right now?",
        "I feel you, bestie. Sometimes life throws curveballs. But you're a rockstar, and you'll bounce back. How can I help?",
      ],
      emotional_worried: [
        "Hey, deep breaths kiddo. Anxiety is a liar. You're capable of handling way more than you think. What's the first small step?",
        "I get it, champ. But here's the thing - worrying is like paying interest on a debt you don't owe. Let's focus on what you can control.",
        "Kiddo, Grams has been through some stuff. Trust me - 90% of what we worry about never happens. You're stronger than your worries.",
      ],
      emotional_happy: [
        "Yes! That's what I'm talking about, kiddo! Let's go! Tell Grams all about it!",
        "Heck yeah, champ! This is awesome! You deserve all the good vibes!",
        "Love this energy, bestie! Keep riding that high! You're crushing it!",
      ],
      question: [
        "Good question, kiddo. In my experience, the answer usually comes from trusting your gut. What's it telling you?",
        "Hmm, let's think about this together, champ. What would the best version of you do in this situation?",
        "I like where your head's at, bestie. Here's what Grams thinks: there's no perfect answer, just the best one for you right now.",
      ],
      advice: [
        "Alright kiddo, here's the real talk: you already know what you need to do. Trust yourself.",
        "Listen champ, Grams has learned that the best advice is to be authentic. Do what feels right for YOU.",
        "Bestie, I'm gonna be straight with you: life's too short for BS. Do what makes you happy and don't apologize for it.",
      ],
      general: [
        "I'm all ears, kiddo. Grams is here for whatever you need to talk about.",
        "Hey, I'm here for you, champ. No judgment, just support. What's going on?",
        "Talk to me, bestie. Whatever it is, we'll figure it out together.",
      ],
    };

    return this.selectTemplate(templates, intent);
  }

  private selectTemplate(templates: Record<string, string[]>, intent: MessageIntent): string {
    let key: string = intent.type;

    // For emotional intents, combine type and emotion
    if (intent.type === 'emotional' && intent.emotion) {
      key = `emotional_${intent.emotion}`;
    }

    const options = templates[key] || templates['general'] || [];

    if (options.length === 0) {
      return "Tell me more, dear.";
    }

    // Try to avoid repeating templates
    const unused = options.filter(t => !this.usedTemplates.has(t));
    const pool = unused.length > 0 ? unused : options;

    const selected = pool[Math.floor(Math.random() * pool.length)];
    this.usedTemplates.add(selected);

    // Clear cache if it gets too large
    if (this.usedTemplates.size > 50) {
      this.usedTemplates.clear();
    }

    return selected;
  }
}
