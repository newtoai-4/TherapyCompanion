import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { isAdminOnly } from "./adminMiddleware";
import { therabotService } from "./services/openai";
import {
  insertTherapySessionSchema,
  insertMoodEntrySchema,
  insertJournalEntrySchema,
  insertCommunityPostSchema,
  insertCommunityCommentSchema,
  insertTherapistRequestSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, isAdminOnly, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin route to promote user to admin (for initial setup)
  app.post('/api/admin/promote-self', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userEmail = req.user.claims.email;
      
      // Only allow the first user or specific email to become admin
      const existingUser = await storage.getUser(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Make the current user admin
      await storage.upsertUser({
        ...existingUser,
        isAdmin: true,
      });
      
      res.json({ message: "Admin privileges granted" });
    } catch (error) {
      console.error("Error promoting user to admin:", error);
      res.status(500).json({ message: "Failed to grant admin privileges" });
    }
  });

  // Therapist routes
  app.get('/api/therapists', isAdminOnly, async (req, res) => {
    try {
      const { specialization, location, availability } = req.query;
      const therapists = await storage.getTherapists({
        specialization: specialization as string,
        location: location as string,
        availability: availability as string,
      });
      res.json(therapists);
    } catch (error) {
      console.error("Error fetching therapists:", error);
      res.status(500).json({ message: "Failed to fetch therapists" });
    }
  });

  app.get('/api/therapists/:id', async (req, res) => {
    try {
      const therapist = await storage.getTherapist(parseInt(req.params.id));
      if (!therapist) {
        return res.status(404).json({ message: "Therapist not found" });
      }
      res.json(therapist);
    } catch (error) {
      console.error("Error fetching therapist:", error);
      res.status(500).json({ message: "Failed to fetch therapist" });
    }
  });

  // Therabot chat routes
  app.post('/api/chat/therabot', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Invalid messages format" });
      }

      const response = await therabotService.chatWithUser(messages);

      // Save the session
      const sessionData = {
        userId,
        sessionType: 'ai' as const,
        sessionData: { messages, response },
        mood: response.mood_assessment,
        status: 'completed' as const,
        completedAt: new Date(),
      };

      await storage.createTherapySession(sessionData);

      res.json(response);
    } catch (error) {
      console.error("Therabot chat error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to process chat" });
    }
  });

  // Mood tracking routes
  app.post('/api/mood', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertMoodEntrySchema.parse({ ...req.body, userId });
      const moodEntry = await storage.createMoodEntry(validatedData);
      res.json(moodEntry);
    } catch (error) {
      console.error("Error creating mood entry:", error);
      res.status(500).json({ message: "Failed to save mood entry" });
    }
  });

  app.get('/api/mood', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 30;
      const moodEntries = await storage.getUserMoodEntries(userId, limit);
      res.json(moodEntries);
    } catch (error) {
      console.error("Error fetching mood entries:", error);
      res.status(500).json({ message: "Failed to fetch mood entries" });
    }
  });

  // Journal routes
  app.post('/api/journal', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { content, title, isPrivate } = req.body;

      // Generate AI summary
      const aiSummary = await therabotService.generateJournalSummary(content);

      const validatedData = insertJournalEntrySchema.parse({
        userId,
        title,
        content,
        aiSummary,
        isPrivate: isPrivate ?? true,
      });

      const journalEntry = await storage.createJournalEntry(validatedData);
      res.json(journalEntry);
    } catch (error) {
      console.error("Error creating journal entry:", error);
      res.status(500).json({ message: "Failed to save journal entry" });
    }
  });

  app.get('/api/journal', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const journalEntries = await storage.getUserJournalEntries(userId);
      res.json(journalEntries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  // Community routes
  app.get('/api/community/posts', async (req, res) => {
    try {
      const { category, limit } = req.query;
      const posts = await storage.getCommunityPosts(
        category as string,
        limit ? parseInt(limit as string) : 20
      );
      res.json(posts);
    } catch (error) {
      console.error("Error fetching community posts:", error);
      res.status(500).json({ message: "Failed to fetch community posts" });
    }
  });

  app.post('/api/community/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertCommunityPostSchema.parse({ ...req.body, userId });
      const post = await storage.createCommunityPost(validatedData);
      res.json(post);
    } catch (error) {
      console.error("Error creating community post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.get('/api/community/posts/:id/comments', async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const comments = await storage.getPostComments(postId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/community/posts/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      const validatedData = insertCommunityCommentSchema.parse({
        ...req.body,
        userId,
        postId,
      });
      const comment = await storage.createCommunityComment(validatedData);
      res.json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Therapist request routes
  app.post('/api/therapist-requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { therapistId, message } = req.body;

      // Get user's recent AI sessions for summary
      const recentSessions = await storage.getUserSessions(userId);
      const aiSessions = recentSessions.filter(s => s.sessionType === 'ai').slice(0, 3);
      
      let aiSessionSummary = '';
      if (aiSessions.length > 0) {
        const messages = aiSessions.flatMap(s => (s.sessionData as any)?.messages || []);
        aiSessionSummary = await therabotService.generateSessionSummary(messages);
      }

      const validatedData = insertTherapistRequestSchema.parse({
        userId,
        therapistId: parseInt(therapistId),
        message,
        aiSessionSummary,
      });

      const request = await storage.createTherapistRequest(validatedData);
      res.json(request);
    } catch (error) {
      console.error("Error creating therapist request:", error);
      res.status(500).json({ message: "Failed to create therapist request" });
    }
  });

  // User sessions routes
  app.get('/api/sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getUserSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
