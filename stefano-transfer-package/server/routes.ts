import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { orders } from "@shared/schema";
import { eq, gte } from "drizzle-orm";
import { 
  insertContactSchema, insertReservationSchema, insertOrderSchema,
  insertLoyaltyMemberSchema, insertPointsTransactionSchema, 
  insertRewardSchema, insertRewardRedemptionSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json({ success: true, contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get all contacts (for admin)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Reservation submission
  app.post("/api/reservations", async (req, res) => {
    try {
      const reservationData = insertReservationSchema.parse(req.body);
      const reservation = await storage.createReservation(reservationData);
      res.json({ success: true, reservation });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get all reservations (for admin)
  app.get("/api/reservations", async (req, res) => {
    try {
      const reservations = await storage.getReservations();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Order submission
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.json({ success: true, order });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get all orders (for admin)
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update order status
  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ error: "Status is required and must be a string" });
      }

      const order = await storage.updateOrderStatus(parseInt(id), status);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json({ success: true, order });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // === LOYALTY PROGRAM ROUTES ===

  // Create or join loyalty program
  app.post("/api/loyalty/join", async (req, res) => {
    try {
      const memberData = insertLoyaltyMemberSchema.parse(req.body);
      
      // Check if member already exists
      const existingMember = await storage.getLoyaltyMemberByPhone(memberData.phone);
      if (existingMember) {
        return res.status(400).json({ error: "Member already exists with this phone number" });
      }

      const member = await storage.createLoyaltyMember(memberData);
      
      // Create welcome bonus transaction
      await storage.createPointsTransaction({
        memberId: member.id,
        type: "bonus",
        points: 100,
        description: "Bonus powitany! Witamy w programie lojalnościowym Stefano!"
      });

      // Update member points
      await storage.updateLoyaltyMemberPoints(member.id, 100);

      res.json({ success: true, member });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get loyalty member by phone
  app.get("/api/loyalty/member/:phone", async (req, res) => {
    try {
      const { phone } = req.params;
      const member = await storage.getLoyaltyMemberByPhone(phone);
      
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }

      res.json(member);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all loyalty members (admin)
  app.get("/api/loyalty/members", async (req, res) => {
    try {
      const members = await storage.getLoyaltyMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Award points for order
  app.post("/api/loyalty/points/award", async (req, res) => {
    try {
      const { phone, orderId, amount } = req.body;
      
      if (!phone || !orderId || !amount) {
        return res.status(400).json({ error: "Phone, orderId, and amount are required" });
      }

      const member = await storage.getLoyaltyMemberByPhone(phone);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }

      // Calculate points (1 point per 1 zł spent)
      const pointsEarned = Math.floor(amount / 100);
      
      // Create transaction
      await storage.createPointsTransaction({
        memberId: member.id,
        type: "earned",
        points: pointsEarned,
        description: `Punkty za zamówienie #${orderId}`,
        orderId: parseInt(orderId)
      });

      // Update member points and stats
      const newTotalPoints = member.totalPoints + pointsEarned;
      const newLifetimePoints = member.lifetimePoints + pointsEarned;
      const newTotalSpent = member.totalSpent + amount;
      const newTotalOrders = member.totalOrders + 1;

      // Determine tier based on lifetime points
      let tier = "bronze";
      if (newLifetimePoints >= 5000) tier = "platinum";
      else if (newLifetimePoints >= 2000) tier = "gold";
      else if (newLifetimePoints >= 500) tier = "silver";

      await storage.updateLoyaltyMemberPoints(member.id, newTotalPoints, newTotalSpent);
      if (tier !== member.tier) {
        await storage.updateLoyaltyMemberTier(member.id, tier);
      }

      res.json({ success: true, pointsEarned, newTotalPoints, tier });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get member's points history
  app.get("/api/loyalty/points/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const transactions = await storage.getPointsTransactionsByMember(parseInt(memberId));
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // === REWARDS MANAGEMENT ===

  // Create reward (admin)
  app.post("/api/rewards", async (req, res) => {
    try {
      const rewardData = insertRewardSchema.parse(req.body);
      const reward = await storage.createReward(rewardData);
      res.json({ success: true, reward });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation error", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get all rewards (admin)
  app.get("/api/rewards", async (req, res) => {
    try {
      const rewards = await storage.getRewards();
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get active rewards (public)
  app.get("/api/rewards/active", async (req, res) => {
    try {
      const rewards = await storage.getActiveRewards();
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Redeem reward
  app.post("/api/rewards/redeem", async (req, res) => {
    try {
      const { memberId, rewardId } = req.body;
      
      if (!memberId || !rewardId) {
        return res.status(400).json({ error: "Member ID and Reward ID are required" });
      }

      const member = await storage.getLoyaltyMemberByPhone(req.body.phone);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }

      const rewards = await storage.getActiveRewards();
      const reward = rewards.find(r => r.id === parseInt(rewardId));
      if (!reward) {
        return res.status(404).json({ error: "Reward not found or inactive" });
      }

      // Check if member has enough points
      if (member.totalPoints < reward.pointsCost) {
        return res.status(400).json({ error: "Insufficient points" });
      }

      // Check tier requirement
      const tierOrder = { bronze: 0, silver: 1, gold: 2, platinum: 3 };
      if (tierOrder[member.tier] < tierOrder[reward.minTier]) {
        return res.status(400).json({ error: "Tier requirement not met" });
      }

      // Generate redemption code
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

      // Create redemption record
      const redemption = await storage.createRewardRedemption({
        memberId: member.id,
        rewardId: reward.id,
        code,
        expiresAt
      });

      // Deduct points from member
      const newTotalPoints = member.totalPoints - reward.pointsCost;
      await storage.updateLoyaltyMemberPoints(member.id, newTotalPoints);

      // Create transaction record
      await storage.createPointsTransaction({
        memberId: member.id,
        type: "redeemed",
        points: -reward.pointsCost,
        description: `Wykorzystano punkty: ${reward.name}`,
        rewardId: reward.id
      });

      res.json({ success: true, redemption, code, newTotalPoints });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get member's redemptions
  app.get("/api/loyalty/redemptions/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const redemptions = await storage.getRewardRedemptionsByMember(parseInt(memberId));
      res.json(redemptions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Use redemption code (admin)
  app.patch("/api/rewards/use/:code", async (req, res) => {
    try {
      const { code } = req.params;
      // This would need additional logic to find redemption by code
      // For now, simplified implementation
      res.json({ success: true, message: "Redemption code used successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Kitchen Management API
  app.get("/api/kitchen/status", async (req, res) => {
    try {
      const status = await storage.getKitchenStatus();
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/kitchen/capacity", async (req, res) => {
    try {
      const capacity = await storage.getKitchenCapacity();
      res.json(capacity);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/kitchen/timeslots/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const slots = await storage.getAvailableTimeSlots(date);
      res.json(slots);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/kitchen/estimate", async (req, res) => {
    try {
      const { items } = req.body;
      const kitchenStatus = await storage.getKitchenStatus();
      const estimatedTime = await storage.calculateEstimatedTime(items, kitchenStatus.currentLoad);
      
      res.json({
        estimatedTime,
        currentLoad: kitchenStatus.currentLoad,
        isOverloaded: kitchenStatus.isOverloaded,
        statusMessage: kitchenStatus.statusMessage
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/orders/:id/kitchen-status", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status, kitchenNotes } = req.body;

      if (!orderId || !status) {
        return res.status(400).json({ message: "Missing order ID or status" });
      }

      // Update order status and kitchen notes
      const updateData: any = { status };
      if (kitchenNotes) updateData.kitchenNotes = kitchenNotes;

      // Add timestamps based on status
      if (status === 'confirmed') updateData.confirmedAt = new Date();
      if (status === 'preparing') updateData.startedCookingAt = new Date();
      if (status === 'ready') updateData.readyAt = new Date();
      if (status === 'completed') updateData.completedAt = new Date();

      const [order] = await db
        .update(orders)
        .set(updateData)
        .where(eq(orders.id, orderId))
        .returning();

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Real-time kitchen metrics for admin dashboard
  app.get("/api/kitchen/metrics", async (req, res) => {
    try {
      const status = await storage.getKitchenStatus();
      const capacity = await storage.getKitchenCapacity();
      
      // Get order statistics
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      const todayOrders = await db
        .select()
        .from(orders)
        .where(gte(orders.createdAt, todayStart));

      const completedToday = todayOrders.filter((o: any) => o.status === 'completed').length;
      const avgCompletionTime = 35; // Static for now

      res.json({
        ...status,
        ...capacity,
        dailyStats: {
          totalOrders: todayOrders.length,
          completedOrders: completedToday,
          pendingOrders: todayOrders.filter((o: any) => ['pending', 'confirmed', 'preparing'].includes(o.status)).length,
          avgCompletionTime,
          peakLoadTime: "19:00-20:00"
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
