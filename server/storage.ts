import {
  users,
  therapists,
  therapySessions,
  moodEntries,
  journalEntries,
  communityPosts,
  communityComments,
  therapistRequests,
  type User,
  type UpsertUser,
  type Therapist,
  type InsertTherapist,
  type TherapySession,
  type InsertTherapySession,
  type MoodEntry,
  type InsertMoodEntry,
  type JournalEntry,
  type InsertJournalEntry,
  type CommunityPost,
  type InsertCommunityPost,
  type CommunityComment,
  type InsertCommunityComment,
  type TherapistRequest,
  type InsertTherapistRequest,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Therapist operations
  getTherapists(filters?: { specialization?: string; location?: string; availability?: string }): Promise<Therapist[]>;
  getTherapist(id: number): Promise<Therapist | undefined>;
  createTherapist(therapist: InsertTherapist): Promise<Therapist>;
  
  // Therapy session operations
  createTherapySession(session: InsertTherapySession): Promise<TherapySession>;
  getUserSessions(userId: string): Promise<TherapySession[]>;
  updateTherapySession(id: number, updates: Partial<TherapySession>): Promise<TherapySession>;
  
  // Mood tracking operations
  createMoodEntry(moodEntry: InsertMoodEntry): Promise<MoodEntry>;
  getUserMoodEntries(userId: string, limit?: number): Promise<MoodEntry[]>;
  
  // Journal operations
  createJournalEntry(journalEntry: InsertJournalEntry): Promise<JournalEntry>;
  getUserJournalEntries(userId: string): Promise<JournalEntry[]>;
  updateJournalEntry(id: number, updates: Partial<JournalEntry>): Promise<JournalEntry>;
  
  // Community operations
  getCommunityPosts(category?: string, limit?: number): Promise<(CommunityPost & { author?: User })[]>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  getPostComments(postId: number): Promise<(CommunityComment & { author?: User })[]>;
  createCommunityComment(comment: InsertCommunityComment): Promise<CommunityComment>;
  
  // Therapist request operations
  createTherapistRequest(request: InsertTherapistRequest): Promise<TherapistRequest>;
  getTherapistRequests(therapistId: number): Promise<TherapistRequest[]>;
  updateTherapistRequest(id: number, updates: Partial<TherapistRequest>): Promise<TherapistRequest>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Therapist operations
  async getTherapists(filters?: { specialization?: string; location?: string; availability?: string }): Promise<Therapist[]> {
    let query = db.select().from(therapists);
    let whereConditions = [eq(therapists.isActive, true)];
    
    if (filters?.specialization) {
      whereConditions.push(sql`${therapists.specializations} @> ARRAY[${filters.specialization}]`);
    }
    
    if (filters?.location) {
      whereConditions.push(like(therapists.location, `%${filters.location}%`));
    }
    
    return await query
      .where(and(...whereConditions))
      .orderBy(desc(therapists.rating));
  }

  async getTherapist(id: number): Promise<Therapist | undefined> {
    const [therapist] = await db.select().from(therapists).where(eq(therapists.id, id));
    return therapist;
  }

  async createTherapist(therapistData: InsertTherapist): Promise<Therapist> {
    const [therapist] = await db.insert(therapists).values(therapistData).returning();
    return therapist;
  }

  // Therapy session operations
  async createTherapySession(sessionData: InsertTherapySession): Promise<TherapySession> {
    const [session] = await db.insert(therapySessions).values(sessionData).returning();
    return session;
  }

  async getUserSessions(userId: string): Promise<TherapySession[]> {
    return await db
      .select()
      .from(therapySessions)
      .where(eq(therapySessions.userId, userId))
      .orderBy(desc(therapySessions.createdAt));
  }

  async updateTherapySession(id: number, updates: Partial<TherapySession>): Promise<TherapySession> {
    const [session] = await db
      .update(therapySessions)
      .set({ ...updates, completedAt: new Date() })
      .where(eq(therapySessions.id, id))
      .returning();
    return session;
  }

  // Mood tracking operations
  async createMoodEntry(moodEntryData: InsertMoodEntry): Promise<MoodEntry> {
    const [moodEntry] = await db.insert(moodEntries).values(moodEntryData).returning();
    return moodEntry;
  }

  async getUserMoodEntries(userId: string, limit = 30): Promise<MoodEntry[]> {
    return await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.createdAt))
      .limit(limit);
  }

  // Journal operations
  async createJournalEntry(journalEntryData: InsertJournalEntry): Promise<JournalEntry> {
    const [journalEntry] = await db.insert(journalEntries).values(journalEntryData).returning();
    return journalEntry;
  }

  async getUserJournalEntries(userId: string): Promise<JournalEntry[]> {
    return await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt));
  }

  async updateJournalEntry(id: number, updates: Partial<JournalEntry>): Promise<JournalEntry> {
    const [journalEntry] = await db
      .update(journalEntries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(journalEntries.id, id))
      .returning();
    return journalEntry;
  }

  // Community operations
  async getCommunityPosts(category?: string, limit = 20): Promise<(CommunityPost & { author?: User })[]> {
    let whereConditions = [eq(communityPosts.isModerated, true)];
    
    if (category) {
      whereConditions.push(eq(communityPosts.category, category));
    }

    const results = await db
      .select({
        id: communityPosts.id,
        userId: communityPosts.userId,
        title: communityPosts.title,
        content: communityPosts.content,
        category: communityPosts.category,
        isAnonymous: communityPosts.isAnonymous,
        likesCount: communityPosts.likesCount,
        commentsCount: communityPosts.commentsCount,
        isModerated: communityPosts.isModerated,
        createdAt: communityPosts.createdAt,
        updatedAt: communityPosts.updatedAt,
        authorId: users.id,
        authorEmail: users.email,
        authorFirstName: users.firstName,
        authorLastName: users.lastName,
        authorProfileImageUrl: users.profileImageUrl,
        authorAge: users.age,
        authorRegion: users.region,
        authorCountry: users.country,
        authorAllowLocationAccess: users.allowLocationAccess,
        authorIsAdmin: users.isAdmin,
        authorCreatedAt: users.createdAt,
        authorUpdatedAt: users.updatedAt,
      })
      .from(communityPosts)
      .leftJoin(users, eq(communityPosts.userId, users.id))
      .where(and(...whereConditions))
      .orderBy(desc(communityPosts.createdAt))
      .limit(limit);

    return results.map(row => ({
      id: row.id,
      userId: row.userId,
      title: row.title,
      content: row.content,
      category: row.category,
      isAnonymous: row.isAnonymous,
      likesCount: row.likesCount,
      commentsCount: row.commentsCount,
      isModerated: row.isModerated,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      author: row.authorId ? {
        id: row.authorId,
        email: row.authorEmail,
        firstName: row.authorFirstName,
        lastName: row.authorLastName,
        profileImageUrl: row.authorProfileImageUrl,
        age: row.authorAge,
        region: row.authorRegion,
        country: row.authorCountry,
        allowLocationAccess: row.authorAllowLocationAccess,
        isAdmin: row.authorIsAdmin,
        createdAt: row.authorCreatedAt,
        updatedAt: row.authorUpdatedAt,
      } : undefined
    }));
  }

  async createCommunityPost(postData: InsertCommunityPost): Promise<CommunityPost> {
    const [post] = await db.insert(communityPosts).values(postData).returning();
    return post;
  }

  async getPostComments(postId: number): Promise<(CommunityComment & { author?: User })[]> {
    const results = await db
      .select({
        id: communityComments.id,
        postId: communityComments.postId,
        userId: communityComments.userId,
        content: communityComments.content,
        isAnonymous: communityComments.isAnonymous,
        likesCount: communityComments.likesCount,
        createdAt: communityComments.createdAt,
        authorId: users.id,
        authorEmail: users.email,
        authorFirstName: users.firstName,
        authorLastName: users.lastName,
        authorProfileImageUrl: users.profileImageUrl,
        authorAge: users.age,
        authorRegion: users.region,
        authorCountry: users.country,
        authorAllowLocationAccess: users.allowLocationAccess,
        authorIsAdmin: users.isAdmin,
        authorCreatedAt: users.createdAt,
        authorUpdatedAt: users.updatedAt,
      })
      .from(communityComments)
      .leftJoin(users, eq(communityComments.userId, users.id))
      .where(eq(communityComments.postId, postId))
      .orderBy(desc(communityComments.createdAt));

    return results.map(row => ({
      id: row.id,
      postId: row.postId,
      userId: row.userId,
      content: row.content,
      isAnonymous: row.isAnonymous,
      likesCount: row.likesCount,
      createdAt: row.createdAt,
      author: row.authorId ? {
        id: row.authorId,
        email: row.authorEmail,
        firstName: row.authorFirstName,
        lastName: row.authorLastName,
        profileImageUrl: row.authorProfileImageUrl,
        age: row.authorAge,
        region: row.authorRegion,
        country: row.authorCountry,
        allowLocationAccess: row.authorAllowLocationAccess,
        isAdmin: row.authorIsAdmin,
        createdAt: row.authorCreatedAt,
        updatedAt: row.authorUpdatedAt,
      } : undefined
    }));
  }

  async createCommunityComment(commentData: InsertCommunityComment): Promise<CommunityComment> {
    const [comment] = await db.insert(communityComments).values(commentData).returning();
    
    // Update comment count on the post
    await db
      .update(communityPosts)
      .set({ commentsCount: sql`${communityPosts.commentsCount} + 1` })
      .where(eq(communityPosts.id, commentData.postId));
    
    return comment;
  }

  // Therapist request operations
  async createTherapistRequest(requestData: InsertTherapistRequest): Promise<TherapistRequest> {
    const [request] = await db.insert(therapistRequests).values(requestData).returning();
    return request;
  }

  async getTherapistRequests(therapistId: number): Promise<TherapistRequest[]> {
    return await db
      .select()
      .from(therapistRequests)
      .where(eq(therapistRequests.therapistId, therapistId))
      .orderBy(desc(therapistRequests.requestedAt));
  }

  async updateTherapistRequest(id: number, updates: Partial<TherapistRequest>): Promise<TherapistRequest> {
    const [request] = await db
      .update(therapistRequests)
      .set({ ...updates, respondedAt: new Date() })
      .where(eq(therapistRequests.id, id))
      .returning();
    return request;
  }
}

export const storage = new DatabaseStorage();
