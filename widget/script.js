// Widget state management
class GramsWidget {
  constructor() {
    this.currentPersonality = 'sweet-nana';
    this.personalities = {
      'sweet-nana': {
        name: 'Sweet Nana',
        avatar: '👵',
        color: '#ffb3ba'
      },
      'wise-bubbe': {
        name: 'Wise Bubbe',
        avatar: '👵📚',
        color: '#bae1ff'
      },
      'cool-grams': {
        name: 'Cool Grams',
        avatar: '😎👵',
        color: '#baffc9'
      }
    };

    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Check if window.openai is available (ChatGPT environment)
    if (typeof window !== 'undefined' && window.openai) {
      this.setupFromToolOutput();
    }

    this.setupEventListeners();
  }

  setupFromToolOutput() {
    // Read data from ChatGPT's injected context
    if (!window.openai || !window.openai.toolOutput) {
      return;
    }

    const toolOutput = window.openai.toolOutput;

    // Check for UI data in _meta
    if (toolOutput._meta && toolOutput._meta.ui) {
      const uiData = toolOutput._meta.ui;

      // Update personality
      if (uiData.personalityId) {
        this.currentPersonality = uiData.personalityId;
        this.updatePersonalityDisplay();
      }

      // Update message
      if (uiData.message) {
        this.updateMessage(uiData.message);
      }
    }
  }

  setupEventListeners() {
    // Personality switcher buttons
    const buttons = document.querySelectorAll('.personality-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const personality = btn.dataset.personality;
        this.switchPersonality(personality);
      });
    });

    // Voice button (when implemented)
    const voiceBtn = document.getElementById('play-voice');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        this.playVoice();
      });
    }

    // Set initial active state
    this.updatePersonalityDisplay();
  }

  switchPersonality(personalityId) {
    // Call MCP tool through window.openai
    if (typeof window !== 'undefined' && window.openai && window.openai.callTool) {
      window.openai.callTool({
        name: 'switch_grandma',
        arguments: {
          personality: personalityId
        }
      });
    } else {
      // Local fallback (for testing outside ChatGPT)
      this.currentPersonality = personalityId;
      this.updatePersonalityDisplay();
      this.updateMessage(this.getGreeting(personalityId));
    }
  }

  updatePersonalityDisplay() {
    const personality = this.personalities[this.currentPersonality];

    // Update header
    const avatarEl = document.getElementById('avatar');
    const nameEl = document.getElementById('grandma-name');

    if (avatarEl) avatarEl.textContent = personality.avatar;
    if (nameEl) nameEl.textContent = personality.name;

    // Update active button
    document.querySelectorAll('.personality-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.personality === this.currentPersonality) {
        btn.classList.add('active');
      }
    });
  }

  updateMessage(message) {
    const messageEl = document.getElementById('message-text');
    if (!messageEl) return;

    messageEl.textContent = message;

    // Trigger fade-in animation
    const bubble = messageEl.closest('.message-bubble');
    if (bubble) {
      bubble.style.animation = 'none';
      setTimeout(() => {
        bubble.style.animation = 'fadeIn 0.5s ease';
      }, 10);
    }
  }

  getGreeting(personalityId) {
    const greetings = {
      'sweet-nana': "Hello sweetie! It's Nana now. How can I help you, dear?",
      'wise-bubbe': "Shayna! Bubbe is here. What's on your mind, bubeleh?",
      'cool-grams': 'Hey kiddo! Cool Grams reporting for duty! What\'s up?'
    };
    return greetings[personalityId] || greetings['sweet-nana'];
  }

  playVoice() {
    // Future: ElevenLabs integration
    console.log('Voice playback not yet implemented');

    // When implemented:
    // 1. Get current message text
    // 2. Call MCP tool to generate voice
    // 3. Play audio through Audio API
  }
}

// Initialize widget
new GramsWidget();
