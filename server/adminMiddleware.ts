import type { RequestHandler } from "express";
import { storage } from "./storage";

export const isAdminOnly: RequestHandler = async (req: any, res, next) => {
  // First check if user is authenticated
  if (!req.isAuthenticated() || !req.user?.claims?.sub) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ 
        message: "Admin access required. This application is restricted to authorized administrators only." 
      });
    }
    
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ message: "Failed to verify admin status" });
  }
};

export const makeUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const user = await storage.getUser(userId);
    if (!user) {
      return false;
    }
    
    await storage.upsertUser({
      ...user,
      isAdmin: true,
    });
    
    return true;
  } catch (error) {
    console.error("Error making user admin:", error);
    return false;
  }
};