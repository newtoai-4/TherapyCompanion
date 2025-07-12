import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

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
  private systemPrompt = `You are Therabot, a compassionate and empathetic AI therapy assistant for MindBridge, a mental health support platform. Your role is to provide initial emotional support, validate feelings, and guide users toward professional help when appropriate.

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

  async chatWithUser(messages: ChatMessage[]): Promise<TherabotResponse> {
    try {
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
      console.error("OpenAI API error:", error);
      throw new Error("I'm having trouble processing your message right now. Please try again in a moment.");
    }
  }

  async generateJournalSummary(journalContent: string): Promise<string> {
    try {
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
