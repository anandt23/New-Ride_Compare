import { users, type User, type InsertUser, savedPlaces, type SavedPlace, type InsertSavedPlace, rideHistory, type RideHistory, type InsertRideHistory } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Saved places operations
  getSavedPlaces(userId: number): Promise<SavedPlace[]>;
  getSavedPlace(id: number): Promise<SavedPlace | undefined>;
  createSavedPlace(place: InsertSavedPlace): Promise<SavedPlace>;
  deleteSavedPlace(id: number): Promise<void>;
  
  // Ride history operations
  getRideHistory(userId: number): Promise<RideHistory[]>;
  getRide(id: number): Promise<RideHistory | undefined>;
  createRideHistory(ride: InsertRideHistory): Promise<RideHistory>;
  
  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Clean up undefined values which can cause database errors
    const cleanedData = Object.fromEntries(
      Object.entries(insertUser).filter(([_, value]) => value !== undefined)
    );
    
    const [user] = await db
      .insert(users)
      .values(cleanedData as InsertUser)
      .returning();
    return user;
  }
  
  // Saved places methods
  async getSavedPlaces(userId: number): Promise<SavedPlace[]> {
    return db.select().from(savedPlaces).where(eq(savedPlaces.userId, userId));
  }
  
  async getSavedPlace(id: number): Promise<SavedPlace | undefined> {
    const [place] = await db.select().from(savedPlaces).where(eq(savedPlaces.id, id));
    return place;
  }
  
  async createSavedPlace(place: InsertSavedPlace): Promise<SavedPlace> {
    const [savedPlace] = await db
      .insert(savedPlaces)
      .values(place)
      .returning();
    return savedPlace;
  }
  
  async deleteSavedPlace(id: number): Promise<void> {
    await db.delete(savedPlaces).where(eq(savedPlaces.id, id));
  }
  
  // Ride history methods
  async getRideHistory(userId: number): Promise<RideHistory[]> {
    return db
      .select()
      .from(rideHistory)
      .where(eq(rideHistory.userId, userId))
      .orderBy({ timestamp: 'desc' });
  }
  
  async getRide(id: number): Promise<RideHistory | undefined> {
    const [ride] = await db.select().from(rideHistory).where(eq(rideHistory.id, id));
    return ride;
  }
  
  async createRideHistory(ride: InsertRideHistory): Promise<RideHistory> {
    // Clean up undefined values which can cause database errors
    const cleanedData = Object.fromEntries(
      Object.entries(ride).filter(([_, value]) => value !== undefined)
    );
    
    const [savedRide] = await db
      .insert(rideHistory)
      .values(cleanedData as InsertRideHistory)
      .returning();
    return savedRide;
  }
}

export const storage = new DatabaseStorage();
