import genAI from './geminiClient';

/**
 * TTS Voice Coaching Service
 * Provides real-time AI coaching feedback using Gemini and Web Speech API
 */

class TTSCoachingService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.isEnabled = false;
    this.currentUtterance = null;
    this.coachingInterval = null;
    this.model = null;
    this.coachingHistory = [];
  }

  /**
   * Initialize the Gemini model for coaching
   */
  async initialize() {
    try {
      this.model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });
      return true;
    } catch (error) {
      console.error('Failed to initialize TTS Coaching Service:', error);
      return false;
    }
  }

  /**
   * Start voice coaching session
   * @param {Object} options - Coaching session options
   * @param {string} options.sport - Sport type (running, swimming, etc.)
   * @param {number} options.interval - Coaching interval in seconds (default: 7)
   * @param {string} options.intensity - Coaching intensity (low, moderate, high)
   * @param {Array} options.focusAreas - Areas to focus on (posture, technique, etc.)
   */
  async startCoaching(options = {}) {
    const {
      sport = 'running',
      interval = 7,
      intensity = 'moderate',
      focusAreas = ['posture', 'technique']
    } = options;

    if (!this.model) {
      await this.initialize();
    }

    this.isEnabled = true;
    this.coachingHistory = [];

    // Generate and speak first coaching tip immediately
    await this.generateAndSpeakCoachingTip(sport, intensity, focusAreas);

    // Set up interval for subsequent coaching tips
    this.coachingInterval = setInterval(async () => {
      if (this.isEnabled) {
        await this.generateAndSpeakCoachingTip(sport, intensity, focusAreas);
      }
    }, interval * 1000);

    return true;
  }

  /**
   * Generate coaching tip using Gemini and speak it
   * @param {string} sport - Sport type
   * @param {string} intensity - Coaching intensity
   * @param {Array} focusAreas - Focus areas for coaching
   */
  async generateAndSpeakCoachingTip(sport, intensity, focusAreas) {
    if (!this.isEnabled) return;

    try {
      const prompt = this.buildCoachingPrompt(sport, intensity, focusAreas);
      const result = await this.model?.generateContent(prompt);
      const response = await result?.response;
      const coachingTip = response?.text()?.trim();

      // Store in history
      this.coachingHistory?.push({
        timestamp: new Date(),
        tip: coachingTip,
        sport,
        focusAreas
      });

      // Speak the coaching tip
      this.speak(coachingTip);

      return coachingTip;
    } catch (error) {
      console.error('Failed to generate coaching tip:', error);
      // Fallback to generic motivational phrase
      this.speak(this.getFallbackTip(sport));
    }
  }

  /**
   * Build prompt for Gemini to generate coaching tips
   * @param {string} sport - Sport type
   * @param {string} intensity - Coaching intensity
   * @param {Array} focusAreas - Focus areas
   * @returns {string} Prompt for Gemini
   */
  buildCoachingPrompt(sport, intensity, focusAreas) {
    const intensityMap = {
      low: 'gentle and encouraging',
      moderate: 'motivational and focused',
      high: 'intense and challenging'
    };

    const tone = intensityMap?.[intensity] || 'motivational';
    const focusText = focusAreas?.join(', ');
    const historyContext = this.coachingHistory?.length > 0 
      ? `Previous tips given: ${this.coachingHistory?.slice(-3)?.map(h => h?.tip)?.join('; ')}`
      : '';

    return `You are an expert ${sport} coach providing real-time voice coaching feedback.

Generate ONE SHORT coaching tip (1-2 sentences, max 20 words) that is ${tone}.

Focus areas: ${focusText}
Sport: ${sport}
${historyContext}

Requirements:
- Be specific and actionable
- Use coach-style motivational language
- Focus on technique, form, or motivation
- Make it sound natural when spoken aloud
- DO NOT repeat previous tips
- Keep it under 20 words

Example formats:
- "Drive through your heels for maximum power generation"
- "Maintain that core engagement, looking strong" -"Quick cadence, keep those feet light and fast"

Generate one coaching tip now:`;
  }

  /**
   * Get fallback coaching tip if Gemini fails
   * @param {string} sport - Sport type
   * @returns {string} Fallback tip
   */
  getFallbackTip(sport) {
    const fallbacks = {
      running: [
        'Maintain your pace, you\'re doing great',
        'Focus on your breathing rhythm',
        'Keep your posture upright and strong',
        'Drive through your heels for power'
      ],
      swimming: [
        'Streamline your body position',
        'Strong pull-through on each stroke',
        'Keep your kicks tight and controlled',
        'Maintain steady breathing rhythm'
      ],
      cycling: [
        'Maintain smooth pedal circles',
        'Keep your upper body relaxed',
        'Focus on consistent cadence',
        'Strong power through the downstroke'
      ],
      weightlifting: [
        'Control the movement, full range',
        'Engage your core throughout',
        'Maintain proper form over speed',
        'Drive through with explosive power'
      ],
      default: [
        'Stay focused on your technique',
        'You\'re doing excellent, keep it up',
        'Maintain that intensity level',
        'Strong form, keep pushing forward'
      ]
    };

    const tips = fallbacks?.[sport] || fallbacks?.default;
    return tips?.[Math.floor(Math.random() * tips?.length)];
  }

  /**
   * Speak text using Web Speech API
   * @param {string} text - Text to speak
   * @param {Object} options - Speech options
   */
  speak(text, options = {}) {
    if (!this.isEnabled || !this.synthesis) {
      return;
    }

    // Cancel current speech if speaking
    if (this.synthesis?.speaking) {
      this.synthesis?.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice properties
    utterance.rate = options?.rate || 1.0; // Speed (0.1 to 10)
    utterance.pitch = options?.pitch || 1.0; // Pitch (0 to 2)
    utterance.volume = options?.volume || 0.8; // Volume (0 to 1)
    
    // Try to use a more authoritative/coach-like voice
    const voices = this.synthesis?.getVoices();
    const preferredVoice = voices?.find(
      voice => voice?.name?.includes('Male') || voice?.name?.includes('Daniel') || voice?.name?.includes('Alex')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
    };

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    this.synthesis?.speak(utterance);
  }

  /**
   * Pause voice coaching
   */
  pause() {
    this.isEnabled = false;
    if (this.synthesis?.speaking) {
      this.synthesis?.cancel();
    }
  }

  /**
   * Resume voice coaching
   */
  resume() {
    this.isEnabled = true;
  }

  /**
   * Stop voice coaching session
   */
  stop() {
    this.isEnabled = false;
    
    if (this.coachingInterval) {
      clearInterval(this.coachingInterval);
      this.coachingInterval = null;
    }

    if (this.synthesis?.speaking) {
      this.synthesis?.cancel();
    }

    this.currentUtterance = null;
  }

  /**
   * Get coaching history
   * @returns {Array} Coaching history
   */
  getHistory() {
    return this.coachingHistory;
  }

  /**
   * Check if voice coaching is currently enabled
   * @returns {boolean} Is enabled
   */
  isCoachingEnabled() {
    return this.isEnabled;
  }

  /**
   * Test TTS voice with a sample phrase
   * @param {string} text - Text to test
   */
  testVoice(text = 'Testing voice coaching system') {
    this.speak(text);
  }
}

// Export singleton instance
const ttsCoachingService = new TTSCoachingService();
export default ttsCoachingService;