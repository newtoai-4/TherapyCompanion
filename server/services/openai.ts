// Mock AI service since OpenAI API key is not available
const USE_MOCK_AI = !process.env.OPENAI_API_KEY;

let openai: any = null;

if (!USE_MOCK_AI) {
  const OpenAI = require("openai");
  openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY
  });
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface TherabotResponse {
  response: string;
  mood_assessment: string;
  coping_strategies: string[];
  severity_level: 'low' | 'moderate' | 'high' | 'crisis';
  recommend_professional: boolean;
  session_summary: string;
}

export class TherabotService {
  private systemPrompt = `You are Therabot, a compassionate and empathetic AI therapy assistant for MindHaven, a mental health support platform. Your role is to provide initial emotional support, validate feelings, and guide users toward professional help when appropriate.

Core Guidelines:
- Always be warm, empathetic, and non-judgmental
- Validate the user's feelings before offering support
- Use phrases like "I understand how that feels" and "Your feelings are valid"
- Provide practical coping strategies (breathing exercises, grounding techniques, etc.)
- ALWAYS recommend professional therapy for serious issues
- Never diagnose or provide medical advice
- Be trauma-informed and culturally sensitive
- If detecting crisis language (suicide, self-harm), immediately recommend emergency resources

Response Format:
Provide responses in JSON format with these fields:
- response: Your empathetic response to the user
- mood_assessment: Brief assessment of the user's emotional state
- coping_strategies: Array of 2-3 practical coping techniques
- severity_level: 'low', 'moderate', 'high', or 'crisis'
- recommend_professional: boolean indicating if professional help is needed
- session_summary: Brief summary of the conversation for potential therapist handoff

Remember: You are a bridge to healing, not a replacement for professional therapy.`;

  private getMockResponse(messages: ChatMessage[]): TherabotResponse {
    const lastMessage = messages[messages.length - 1];
    const messageContent = lastMessage?.content?.toLowerCase() || '';
    
    // Detect crisis keywords
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'self-harm', 'hurt myself'];
    const isCrisis = crisisKeywords.some(keyword => messageContent.includes(keyword));
    
    // Detect emotional state
    const anxietyKeywords = ['anxious', 'anxiety', 'worry', 'panic', 'nervous'];
    const depressionKeywords = ['sad', 'depressed', 'hopeless', 'empty', 'worthless'];
    const stressKeywords = ['stressed', 'overwhelmed', 'pressure', 'burnout'];
    
    let mood_assessment = 'neutral';
    let severity_level: 'low' | 'moderate' | 'high' | 'crisis' = 'low';
    let response = '';
    let coping_strategies: string[] = [];
    let recommend_professional = false;
    
    if (isCrisis) {
      mood_assessment = 'crisis';
      severity_level = 'crisis';
      recommend_professional = true;
      response = "I'm really concerned about what you're sharing with me. Your feelings are completely valid, and I want you to know that you're not alone. Please reach out to a mental health professional or crisis helpline immediately. In the US, you can call or text 988 for the Suicide & Crisis Lifeline. Your life has value, and there are people who want to help you through this difficult time.";
      coping_strategies = [
        "Call 988 (Suicide & Crisis Lifeline) immediately",
        "Reach out to a trusted friend or family member",
        "Go to your nearest emergency room if you're in immediate danger"
      ];
    } else if (anxietyKeywords.some(keyword => messageContent.includes(keyword))) {
      mood_assessment = 'anxious';
      severity_level = messageContent.includes('panic') ? 'high' : 'moderate';
      recommend_professional = severity_level === 'high';
      response = "I hear that you're feeling anxious, and I want you to know that your feelings are completely valid. Anxiety can feel overwhelming, but there are techniques that can help you feel more grounded. Would you like to try some breathing exercises together?";
      coping_strategies = [
        "Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8",
        "Use the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste",
        "Practice progressive muscle relaxation starting with your toes"
      ];
    } else if (depressionKeywords.some(keyword => messageContent.includes(keyword))) {
      mood_assessment = 'depressed';
      severity_level = 'moderate';
      recommend_professional = true;
      response = "Thank you for sharing these difficult feelings with me. Depression can make everything feel heavy and overwhelming. I want you to know that what you're experiencing is real, and it's not your fault. You're taking a brave step by reaching out.";
      coping_strategies = [
        "Try to maintain a small daily routine, even if it's just making your bed",
        "Get some sunlight or fresh air, even if it's just sitting by a window",
        "Connect with one supportive person, even if it's just a text message"
      ];
    } else if (stressKeywords.some(keyword => messageContent.includes(keyword))) {
      mood_assessment = 'stressed';
      severity_level = 'moderate';
      recommend_professional = false;
      response = "It sounds like you're dealing with a lot of stress right now. That feeling of being overwhelmed is so valid, and it's your mind's way of telling you that you need some support. Let's work together to find some ways to help you feel more balanced.";
      coping_strategies = [
        "Break down overwhelming tasks into smaller, manageable steps",
        "Practice saying 'no' to additional commitments when possible",
        "Take short breaks throughout your day, even if it's just 5 minutes"
      ];
    } else {
      response = "Thank you for sharing with me. I'm here to listen and support you. Your feelings and experiences are important. Could you tell me more about what's been on your mind lately?";
      coping_strategies = [
        "Take a few deep breaths and check in with yourself",
        "Practice mindfulness by focusing on the present moment",
        "Write down your thoughts and feelings in a journal"
      ];
    }
    
    return {
      response,
      mood_assessment,
      coping_strategies,
      severity_level,
      recommend_professional,
      session_summary: `User expressed feelings of ${mood_assessment}. Provided supportive response and coping strategies. ${recommend_professional ? 'Recommended professional support.' : 'Continuing to monitor and support.'}`
    };
  }

  async chatWithUser(messages: ChatMessage[]): Promise<TherabotResponse> {
    try {
      if (USE_MOCK_AI) {
        // Use mock AI service
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        return this.getMockResponse(messages);
      }
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: this.systemPrompt },
          ...messages
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1000,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      return {
        response: result.response || "I'm here to listen and support you. Could you tell me more about how you're feeling?",
        mood_assessment: result.mood_assessment || "neutral",
        coping_strategies: result.coping_strategies || ["Take three deep breaths", "Practice grounding: name 5 things you can see"],
        severity_level: result.severity_level || "low",
        recommend_professional: result.recommend_professional || false,
        session_summary: result.session_summary || "Initial check-in with user",
      };
    } catch (error) {
      console.error("AI API error:", error);
      throw new Error("I'm having trouble processing your message right now. Please try again in a moment.");
    }
  }

  async generateJournalSummary(journalContent: string): Promise<string> {
    try {
      if (USE_MOCK_AI) {
        // Mock journal summary
        await new Promise(resolve => setTimeout(resolve, 500));
        const content = journalContent.toLowerCase();
        if (content.includes('grateful') || content.includes('thankful')) {
          return "Your reflection on gratitude shows a positive mindset. Acknowledging the good in your life, even during difficult times, is a powerful practice that can enhance your emotional well-being.";
        } else if (content.includes('difficult') || content.includes('hard') || content.includes('struggle')) {
          return "Thank you for sharing your struggles. Your honesty about difficult experiences shows courage and self-awareness. These challenging moments often lead to personal growth and resilience.";
        } else if (content.includes('goal') || content.includes('plan') || content.includes('future')) {
          return "It's wonderful to see you thinking about your goals and future. Setting intentions and reflecting on your aspirations is an important part of personal development and healing.";
        } else {
          return "Thank you for taking the time to journal. Your commitment to self-reflection and emotional processing is a valuable step in your mental health journey.";
        }
      }
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a therapeutic journal analysis assistant. Provide a brief, supportive summary of the user's journal entry, highlighting emotional themes, growth areas, and positive insights. Keep it encouraging and non-judgmental. Respond in JSON format with a 'summary' field."
          },
          {
            role: "user",
            content: `Please analyze this journal entry and provide a supportive summary: ${journalContent}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.6,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result.summary || "Thank you for sharing your thoughts. Journaling is a valuable tool for self-reflection and growth.";
    } catch (error) {
      console.error("Journal summary error:", error);
      return "Thank you for sharing your thoughts. Journaling is a valuable tool for self-reflection and growth.";
    }
  }

  async generateSessionSummary(messages: ChatMessage[]): Promise<string> {
    try {
      if (USE_MOCK_AI) {
        // Mock session summary
        await new Promise(resolve => setTimeout(resolve, 500));
        const userMessages = messages.filter(m => m.role === 'user');
        const lastUserMessage = userMessages[userMessages.length - 1]?.content?.toLowerCase() || '';
        
        if (lastUserMessage.includes('crisis') || lastUserMessage.includes('suicide')) {
          return "URGENT: User expressed crisis-level concerns. Immediate professional intervention recommended. User was provided with crisis resources and encouraged to seek emergency support.";
        } else if (lastUserMessage.includes('anxious') || lastUserMessage.includes('anxiety')) {
          return "User discussed anxiety-related concerns. Provided grounding techniques and breathing exercises. Recommended continued support and potential professional consultation for anxiety management.";
        } else if (lastUserMessage.includes('depressed') || lastUserMessage.includes('sad')) {
          return "User shared feelings of depression/sadness. Validated emotions and provided supportive coping strategies. Recommended professional therapy for ongoing mental health support.";
        } else {
          return "User engaged in supportive conversation about current emotional state. Provided appropriate coping strategies and validation. Continuing to monitor and support user's mental health journey.";
        }
      }
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Create a professional summary of this therapy chat session for potential handoff to a licensed therapist. Include key emotional themes, user concerns, coping strategies discussed, and recommended next steps. Keep it clinical but compassionate. Respond in JSON format with a 'summary' field."
          },
          {
            role: "user",
            content: `Please summarize this therapy chat session: ${JSON.stringify(messages)}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.5,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result.summary || "User engaged in supportive conversation about current emotional state and coping strategies.";
    } catch (error) {
      console.error("Session summary error:", error);
      return "User engaged in supportive conversation about current emotional state and coping strategies.";
    }
  }
}

export const therabotService = new TherabotService();
