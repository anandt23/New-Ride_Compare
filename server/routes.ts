import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertSavedPlaceSchema, insertRideHistorySchema } from "@shared/schema";

// Extend Request type to include user
interface AuthRequest extends Request {
  user?: {
    id: number;
    [key: string]: any;
  };
  isAuthenticated(): boolean;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Auth routes
  setupAuth(app);

  // Middleware to check if user is authenticated
  const ensureAuthenticated = (req: AuthRequest, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Saved places routes
  app.get("/api/places", ensureAuthenticated, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const places = await storage.getSavedPlaces(req.user.id);
      res.json(places);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch saved places" });
    }
  });

  app.post("/api/places", ensureAuthenticated, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const placeData = insertSavedPlaceSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const place = await storage.createSavedPlace(placeData);
      res.status(201).json(place);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save place" });
    }
  });

  app.delete("/api/places/:id", ensureAuthenticated, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const placeId = parseInt(req.params.id);
      const place = await storage.getSavedPlace(placeId);
      
      if (!place) {
        return res.status(404).json({ message: "Place not found" });
      }
      
      if (place.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteSavedPlace(placeId);
      res.status(200).json({ message: "Place deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete place" });
    }
  });

  // Ride history routes
  app.get("/api/rides", ensureAuthenticated, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const rides = await storage.getRideHistory(req.user.id);
      res.json(rides);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ride history" });
    }
  });

  app.post("/api/rides", ensureAuthenticated, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const rideData = insertRideHistorySchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const ride = await storage.createRideHistory(rideData);
      res.status(201).json(ride);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save ride" });
    }
  });

  app.get("/api/rides/:id", ensureAuthenticated, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const rideId = parseInt(req.params.id);
      const ride = await storage.getRide(rideId);
      
      if (!ride) {
        return res.status(404).json({ message: "Ride not found" });
      }
      
      if (ride.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(ride);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ride details" });
    }
  });

  // Sample ride estimates - in a real app, this would connect to Uber, Ola, Rapido APIs
  app.post("/api/ride-estimates", async (req, res) => {
    try {
      const { pickupLatitude, pickupLongitude, dropoffLatitude, dropoffLongitude } = req.body;
      
      if (!pickupLatitude || !pickupLongitude || !dropoffLatitude || !dropoffLongitude) {
        return res.status(400).json({ message: "Missing location coordinates" });
      }
      
      // This is where we would call the actual ride services APIs
      // For now, we'll return mock data with realistic structure
      const estimates = [
        {
          service: "uber",
          estimates: [
            {
              rideType: "UberX",
              capacity: 4,
              fare: "249",
              currency: "₹",
              estimatedPickupTime: 12, // minutes
              estimatedDuration: 18, // minutes
              distance: "7.2", // km
              deepLink: "uber://",
            },
            {
              rideType: "UberXL",
              capacity: 6,
              fare: "349",
              currency: "₹",
              estimatedPickupTime: 15,
              estimatedDuration: 18,
              distance: "7.2",
              deepLink: "uber://",
            }
          ]
        },
        {
          service: "ola",
          estimates: [
            {
              rideType: "Ola Mini",
              capacity: 4,
              fare: "279",
              currency: "₹",
              estimatedPickupTime: 8,
              estimatedDuration: 18,
              distance: "7.2",
              deepLink: "ola://",
            },
            {
              rideType: "Ola Prime",
              capacity: 4,
              fare: "369",
              currency: "₹",
              estimatedPickupTime: 10,
              estimatedDuration: 18,
              distance: "7.2",
              deepLink: "ola://",
            }
          ]
        },
        {
          service: "rapido",
          estimates: [
            {
              rideType: "Rapido Bike",
              capacity: 1,
              fare: "149",
              currency: "₹",
              estimatedPickupTime: 5,
              estimatedDuration: 12,
              distance: "7.2",
              deepLink: "rapido://",
            }
          ]
        }
      ];
      
      res.json(estimates);
    } catch (error) {
      res.status(500).json({ message: "Failed to get ride estimates" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
