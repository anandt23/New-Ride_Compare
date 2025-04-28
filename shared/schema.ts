import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  phone: text("phone"),
  fullName: text("full_name"),
  profilePic: text("profile_pic"),
});

export const savedPlaces = pgTable("saved_places", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
});

export const rideHistory = pgTable("ride_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  pickupLocation: text("pickup_location").notNull(),
  dropoffLocation: text("dropoff_location").notNull(),
  pickupLatitude: text("pickup_latitude").notNull(),
  pickupLongitude: text("pickup_longitude").notNull(),
  dropoffLatitude: text("dropoff_latitude").notNull(),
  dropoffLongitude: text("dropoff_longitude").notNull(),
  service: text("service").notNull(), // uber, ola, rapido
  rideType: text("ride_type").notNull(), // economy, premium, xl, bike
  fare: text("fare").notNull(),
  distance: text("distance").notNull(),
  duration: text("duration").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  status: text("status").notNull(), // completed, cancelled, in-progress
  paymentMethod: text("payment_method"),
  driverDetails: jsonb("driver_details"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  phone: true,
  fullName: true,
});

export const insertSavedPlaceSchema = createInsertSchema(savedPlaces).pick({
  userId: true,
  name: true,
  address: true,
  latitude: true,
  longitude: true,
});

export const insertRideHistorySchema = createInsertSchema(rideHistory).pick({
  userId: true,
  pickupLocation: true,
  dropoffLocation: true,
  pickupLatitude: true,
  pickupLongitude: true,
  dropoffLatitude: true,
  dropoffLongitude: true,
  service: true,
  rideType: true,
  fare: true,
  distance: true,
  duration: true,
  status: true,
  paymentMethod: true,
  driverDetails: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSavedPlace = z.infer<typeof insertSavedPlaceSchema>;
export type SavedPlace = typeof savedPlaces.$inferSelect;

export type InsertRideHistory = z.infer<typeof insertRideHistorySchema>;
export type RideHistory = typeof rideHistory.$inferSelect;
