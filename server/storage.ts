import { users, type User, type InsertUser, savedPlaces, type SavedPlace, type InsertSavedPlace, rideHistory, type RideHistory, type InsertRideHistory } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

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
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private savedPlaces: Map<number, SavedPlace>;
  private rideHistory: Map<number, RideHistory>;
  sessionStore: session.SessionStore;
  
  currentUserId: number;
  currentSavedPlaceId: number;
  currentRideHistoryId: number;

  constructor() {
    this.users = new Map();
    this.savedPlaces = new Map();
    this.rideHistory = new Map();
    this.currentUserId = 1;
    this.currentSavedPlaceId = 1;
    this.currentRideHistoryId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Saved places methods
  async getSavedPlaces(userId: number): Promise<SavedPlace[]> {
    return Array.from(this.savedPlaces.values()).filter(
      (place) => place.userId === userId,
    );
  }
  
  async getSavedPlace(id: number): Promise<SavedPlace | undefined> {
    return this.savedPlaces.get(id);
  }
  
  async createSavedPlace(place: InsertSavedPlace): Promise<SavedPlace> {
    const id = this.currentSavedPlaceId++;
    const savedPlace: SavedPlace = { ...place, id };
    this.savedPlaces.set(id, savedPlace);
    return savedPlace;
  }
  
  async deleteSavedPlace(id: number): Promise<void> {
    this.savedPlaces.delete(id);
  }
  
  // Ride history methods
  async getRideHistory(userId: number): Promise<RideHistory[]> {
    return Array.from(this.rideHistory.values())
      .filter((ride) => ride.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  async getRide(id: number): Promise<RideHistory | undefined> {
    return this.rideHistory.get(id);
  }
  
  async createRideHistory(ride: InsertRideHistory): Promise<RideHistory> {
    const id = this.currentRideHistoryId++;
    const timestamp = new Date();
    const rideRecord: RideHistory = { ...ride, id, timestamp };
    this.rideHistory.set(id, rideRecord);
    return rideRecord;
  }
}

export const storage = new MemStorage();
