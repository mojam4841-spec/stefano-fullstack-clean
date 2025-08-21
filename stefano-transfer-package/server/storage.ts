import { 
  contacts, reservations, orders, loyaltyMembers, pointsTransactions, rewards, rewardRedemptions,
  type Contact, type InsertContact, type Reservation, type InsertReservation, type Order, type InsertOrder,
  type LoyaltyMember, type InsertLoyaltyMember, type PointsTransaction, type InsertPointsTransaction,
  type Reward, type InsertReward, type RewardRedemption, type InsertRewardRedemption
} from "@shared/schema";

export interface IStorage {
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  
  // Reservations
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  getReservations(): Promise<Reservation[]>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  updateOrderPayment(id: number, paymentData: { 
    paymentStatus: string, 
    stripePaymentIntentId?: string, 
    paidAmount?: number, 
    paidAt?: Date 
  }): Promise<Order | undefined>;
  
  // Loyalty Members
  createLoyaltyMember(member: InsertLoyaltyMember): Promise<LoyaltyMember>;
  getLoyaltyMemberByPhone(phone: string): Promise<LoyaltyMember | undefined>;
  getLoyaltyMembers(): Promise<LoyaltyMember[]>;
  updateLoyaltyMemberPoints(memberId: number, points: number, spent?: number): Promise<LoyaltyMember | undefined>;
  updateLoyaltyMemberTier(memberId: number, tier: string): Promise<LoyaltyMember | undefined>;
  
  // Points Transactions
  createPointsTransaction(transaction: InsertPointsTransaction): Promise<PointsTransaction>;
  getPointsTransactionsByMember(memberId: number): Promise<PointsTransaction[]>;
  
  // Rewards
  createReward(reward: InsertReward): Promise<Reward>;
  getRewards(): Promise<Reward[]>;
  getActiveRewards(): Promise<Reward[]>;
  updateReward(id: number, updates: Partial<Reward>): Promise<Reward | undefined>;
  
  // Reward Redemptions
  createRewardRedemption(redemption: InsertRewardRedemption): Promise<RewardRedemption>;
  getRewardRedemptionsByMember(memberId: number): Promise<RewardRedemption[]>;
  updateRedemptionStatus(id: number, status: string): Promise<RewardRedemption | undefined>;
  
  // Kitchen Management
  getKitchenStatus(): Promise<any>;
  updateKitchenStatus(status: any): Promise<any>;
  getKitchenCapacity(): Promise<any>;
  updateKitchenCapacity(capacity: any): Promise<any>;
  getAvailableTimeSlots(date: string): Promise<any[]>;
  reserveTimeSlot(date: string, timeSlot: string): Promise<any>;
  calculateEstimatedTime(items: any[], currentLoad: number): Promise<string>;
  updateOrderComplexity(orderId: number, complexityScore: number): Promise<Order | undefined>;
}

import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt));
  }

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const [reservation] = await db
      .insert(reservations)
      .values(insertReservation)
      .returning();
    return reservation;
  }

  async getReservations(): Promise<Reservation[]> {
    return await db
      .select()
      .from(reservations)
      .orderBy(desc(reservations.createdAt));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async getOrders(): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return order || undefined;
  }

  async updateOrderPayment(id: number, paymentData: { 
    paymentStatus: string, 
    stripePaymentIntentId?: string, 
    paidAmount?: number, 
    paidAt?: Date 
  }): Promise<Order | undefined> {
    const updateData: any = { paymentStatus: paymentData.paymentStatus };
    
    if (paymentData.stripePaymentIntentId) {
      updateData.stripePaymentIntentId = paymentData.stripePaymentIntentId;
    }
    if (paymentData.paidAmount !== undefined) {
      updateData.paidAmount = paymentData.paidAmount;
    }
    if (paymentData.paidAt) {
      updateData.paidAt = paymentData.paidAt;
    }

    const [order] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();
    return order || undefined;
  }

  // Loyalty Members
  async createLoyaltyMember(insertMember: InsertLoyaltyMember): Promise<LoyaltyMember> {
    const [member] = await db
      .insert(loyaltyMembers)
      .values(insertMember)
      .returning();
    return member;
  }

  async getLoyaltyMemberByPhone(phone: string): Promise<LoyaltyMember | undefined> {
    const [member] = await db
      .select()
      .from(loyaltyMembers)
      .where(eq(loyaltyMembers.phone, phone));
    return member || undefined;
  }

  async getLoyaltyMembers(): Promise<LoyaltyMember[]> {
    return await db
      .select()
      .from(loyaltyMembers)
      .orderBy(desc(loyaltyMembers.joinDate));
  }

  async updateLoyaltyMemberPoints(memberId: number, points: number, spent?: number): Promise<LoyaltyMember | undefined> {
    const updates: any = { 
      totalPoints: points,
      lifetimePoints: points,
      lastVisit: new Date()
    };
    
    if (spent !== undefined) {
      updates.totalSpent = spent;
      updates.totalOrders = db.select().from(loyaltyMembers).where(eq(loyaltyMembers.id, memberId));
    }

    const [member] = await db
      .update(loyaltyMembers)
      .set(updates)
      .where(eq(loyaltyMembers.id, memberId))
      .returning();
    return member || undefined;
  }

  async updateLoyaltyMemberTier(memberId: number, tier: string): Promise<LoyaltyMember | undefined> {
    const [member] = await db
      .update(loyaltyMembers)
      .set({ tier })
      .where(eq(loyaltyMembers.id, memberId))
      .returning();
    return member || undefined;
  }

  // Points Transactions
  async createPointsTransaction(insertTransaction: InsertPointsTransaction): Promise<PointsTransaction> {
    const [transaction] = await db
      .insert(pointsTransactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async getPointsTransactionsByMember(memberId: number): Promise<PointsTransaction[]> {
    return await db
      .select()
      .from(pointsTransactions)
      .where(eq(pointsTransactions.memberId, memberId))
      .orderBy(desc(pointsTransactions.createdAt));
  }

  // Rewards
  async createReward(insertReward: InsertReward): Promise<Reward> {
    const [reward] = await db
      .insert(rewards)
      .values(insertReward)
      .returning();
    return reward;
  }

  async getRewards(): Promise<Reward[]> {
    return await db
      .select()
      .from(rewards)
      .orderBy(desc(rewards.createdAt));
  }

  async getActiveRewards(): Promise<Reward[]> {
    return await db
      .select()
      .from(rewards)
      .where(eq(rewards.isActive, true))
      .orderBy(rewards.pointsCost);
  }

  async updateReward(id: number, updates: Partial<Reward>): Promise<Reward | undefined> {
    const [reward] = await db
      .update(rewards)
      .set(updates)
      .where(eq(rewards.id, id))
      .returning();
    return reward || undefined;
  }

  // Reward Redemptions
  async createRewardRedemption(insertRedemption: InsertRewardRedemption): Promise<RewardRedemption> {
    const [redemption] = await db
      .insert(rewardRedemptions)
      .values(insertRedemption)
      .returning();
    return redemption;
  }

  async getRewardRedemptionsByMember(memberId: number): Promise<RewardRedemption[]> {
    return await db
      .select()
      .from(rewardRedemptions)
      .where(eq(rewardRedemptions.memberId, memberId))
      .orderBy(desc(rewardRedemptions.createdAt));
  }

  async updateRedemptionStatus(id: number, status: string): Promise<RewardRedemption | undefined> {
    const [redemption] = await db
      .update(rewardRedemptions)
      .set({ status, usedAt: status === 'used' ? new Date() : undefined })
      .where(eq(rewardRedemptions.id, id))
      .returning();
    return redemption || undefined;
  }

  // Kitchen Management Implementation
  async getKitchenStatus(): Promise<any> {
    const activeOrders = await db.select().from(orders).where(eq(orders.status, 'preparing'));
    const queuedOrders = await db.select().from(orders).where(eq(orders.status, 'confirmed'));
    
    const currentLoad = Math.min(100, Math.round((activeOrders.length / 15) * 100));
    const avgWaitTime = 30 + (activeOrders.length * 10) + (queuedOrders.length * 15);

    return {
      currentLoad,
      activeOrders: activeOrders.length,
      queuedOrders: queuedOrders.length,
      avgWaitTime,
      isOverloaded: currentLoad > 80,
      statusMessage: currentLoad > 90 ? "Kuchnia przeciążona - wydłużone czasy realizacji" :
                    currentLoad > 70 ? "Kuchnia mocno obciążona" : "Kuchnia działa normalnie",
      lastUpdated: new Date()
    };
  }

  async updateKitchenStatus(status: any): Promise<any> { return status; }
  async getKitchenCapacity(): Promise<any> {
    return { maxCapacity: 15, staffCount: 3, equipmentStatus: "operational" };
  }
  async updateKitchenCapacity(capacity: any): Promise<any> { return capacity; }

  async getAvailableTimeSlots(date: string): Promise<any[]> {
    const slots = [];
    for (let hour = 11; hour < 22; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        const maxOrders = (hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 20) ? 3 : 5;
        slots.push({ time: timeSlot, available: true, maxOrders });
      }
    }
    return slots;
  }

  async reserveTimeSlot(date: string, timeSlot: string): Promise<any> {
    return { date, timeSlot, reserved: true };
  }

  async calculateEstimatedTime(items: any[], currentLoad: number): Promise<string> {
    const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
    let baseTime = 25;
    
    parsedItems.forEach((item: any) => {
      if (item.name?.toLowerCase().includes('pizza')) baseTime += 15;
      else if (item.name?.toLowerCase().includes('burger')) baseTime += 10;
      else baseTime += 5;
    });

    const loadMultiplier = currentLoad > 80 ? 1.5 : currentLoad > 60 ? 1.3 : 1.0;
    const estimatedMinutes = Math.round(baseTime * loadMultiplier);
    const minTime = Math.max(20, estimatedMinutes - 5);
    const maxTime = estimatedMinutes + 10;

    return `${minTime}-${maxTime} min`;
  }

  async updateOrderComplexity(orderId: number, complexityScore: number): Promise<Order | undefined> {
    const [order] = await db.update(orders).set({ complexityScore }).where(eq(orders.id, orderId)).returning();
    return order || undefined;
  }
}

export const storage = new DatabaseStorage();
