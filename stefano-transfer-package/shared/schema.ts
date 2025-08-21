import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  newsletterConsent: boolean("newsletter_consent").default(false).notNull(),
  marketingConsent: boolean("marketing_consent").default(false).notNull(),
  source: text("source").default("contact_form").notNull(), // contact_form, loyalty, order, etc.
  tags: text("tags").array().default([]).notNull(), // ["vip", "pizza_lover", "frequent_customer"]
  lastContactDate: timestamp("last_contact_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Newsletter subscribers table for marketing automation
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  phone: text("phone"),
  status: text("status", { enum: ["active", "unsubscribed", "bounced"] }).default("active").notNull(),
  source: text("source").default("manual").notNull(), // manual, contact_form, loyalty, order
  interests: text("interests").array().default([]).notNull(), // ["pizza", "burgery", "promocje", "events"]
  tags: text("tags").array().default([]).notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
  lastEmailSent: timestamp("last_email_sent"),
  emailsSent: integer("emails_sent").default(0).notNull(),
  emailsOpened: integer("emails_opened").default(0).notNull(),
  emailsClicked: integer("emails_clicked").default(0).notNull(),
});

// Email campaigns for newsletter management
export const emailCampaigns = pgTable("email_campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  type: text("type", { enum: ["newsletter", "promotion", "event", "welcome", "loyalty"] }).notNull(),
  status: text("status", { enum: ["draft", "scheduled", "sending", "sent", "paused"] }).default("draft").notNull(),
  targetTags: text("target_tags").array().default([]).notNull(),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  recipientCount: integer("recipient_count").default(0).notNull(),
  openedCount: integer("opened_count").default(0).notNull(),
  clickedCount: integer("clicked_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Email tracking for analytics
export const emailTracking = pgTable("email_tracking", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => emailCampaigns.id),
  subscriberId: integer("subscriber_id").references(() => newsletterSubscribers.id),
  email: text("email").notNull(),
  action: text("action", { enum: ["sent", "delivered", "opened", "clicked", "bounced", "unsubscribed"] }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
});

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  guests: integer("guests").notNull(),
  eventType: text("event_type"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  avatar: text("avatar").notNull(), // pizza_master, chicken_king, burger_boss, tortilla_expert
  items: text("items").notNull(), // JSON string
  totalAmount: integer("total_amount").notNull(), // in cents
  status: text("status").notNull().default("pending"), // pending, confirmed, preparing, ready, completed, cancelled
  paymentMethod: text("payment_method").notNull().default("cash"), // cash, card, online, blik
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  prepaymentRequired: boolean("prepayment_required").default(false).notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paidAmount: integer("paid_amount").default(0), // in cents
  paidAt: timestamp("paid_at"),
  deliveryAddress: text("delivery_address"),
  orderType: text("order_type").notNull().default("delivery"), // delivery, pickup
  specialInstructions: text("special_instructions"),
  estimatedTime: text("estimated_time").notNull().default("30-45 min"), // displayed to customer
  actualPrepTime: integer("actual_prep_time").default(30), // minutes for kitchen planning
  scheduledFor: timestamp("scheduled_for"), // specific delivery/pickup time
  priority: integer("priority").default(1).notNull(), // 1=normal, 2=high, 3=urgent
  kitchenNotes: text("kitchen_notes"), // internal notes for kitchen staff
  complexityScore: integer("complexity_score").default(1).notNull(), // 1-5, calculated from items
  confirmedAt: timestamp("confirmed_at"),
  startedCookingAt: timestamp("started_cooking_at"),
  readyAt: timestamp("ready_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Kitchen capacity monitoring
export const kitchenCapacity = pgTable("kitchen_capacity", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  currentOrders: integer("current_orders").notNull().default(0),
  maxCapacity: integer("max_capacity").notNull().default(15), // max concurrent orders
  avgPrepTime: integer("avg_prep_time").notNull().default(30), // minutes
  peakHours: text("peak_hours").array().default([]).notNull(), // ["18:00-20:00", "12:00-14:00"]
  staffCount: integer("staff_count").notNull().default(3),
  equipmentStatus: text("equipment_status").notNull().default("operational"), // operational, limited, maintenance
  notes: text("notes"),
});

// Real-time kitchen status
export const kitchenStatus = pgTable("kitchen_status", {
  id: serial("id").primaryKey(),
  currentLoad: integer("current_load").notNull().default(0), // percentage 0-100
  activeOrders: integer("active_orders").notNull().default(0),
  queuedOrders: integer("queued_orders").notNull().default(0),
  avgWaitTime: integer("avg_wait_time").notNull().default(30), // minutes
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  statusMessage: text("status_message").default("Kuchnia działa normalnie"),
  isOverloaded: boolean("is_overloaded").default(false).notNull(),
  nextAvailableSlot: timestamp("next_available_slot"),
});

// Time slots for scheduled orders
export const timeSlots = pgTable("time_slots", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(), // YYYY-MM-DD
  timeSlot: text("time_slot").notNull(), // HH:MM
  maxOrders: integer("max_orders").notNull().default(5),
  currentOrders: integer("current_orders").notNull().default(0),
  isAvailable: boolean("is_available").notNull().default(true),
  slotType: text("slot_type").notNull().default("regular"), // regular, peak, off_peak
});

// Loyalty Program Tables
export const loyaltyMembers = pgTable("loyalty_members", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull().unique(),
  name: text("name").notNull(),
  email: text("email"),
  totalPoints: integer("total_points").notNull().default(0),
  lifetimePoints: integer("lifetime_points").notNull().default(0),
  tier: text("tier").notNull().default("bronze"), // bronze, silver, gold, platinum
  joinDate: timestamp("join_date").defaultNow().notNull(),
  lastVisit: timestamp("last_visit").defaultNow().notNull(),
  avatar: text("avatar"), // preferred avatar
  totalOrders: integer("total_orders").notNull().default(0),
  totalSpent: integer("total_spent").notNull().default(0), // in cents
});

export const pointsTransactions = pgTable("points_transactions", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull().references(() => loyaltyMembers.id),
  type: text("type").notNull(), // earned, redeemed, expired, bonus
  points: integer("points").notNull(),
  description: text("description").notNull(),
  orderId: integer("order_id").references(() => orders.id),
  rewardId: integer("reward_id").references(() => rewards.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  pointsCost: integer("points_cost").notNull(),
  category: text("category").notNull(), // food, discount, special
  value: integer("value").notNull(), // value in cents or percentage
  isActive: boolean("is_active").notNull().default(true),
  isLimitedTime: boolean("is_limited_time").notNull().default(false),
  expiryDate: timestamp("expiry_date"),
  minTier: text("min_tier").notNull().default("bronze"), // minimum tier required
  usageLimit: integer("usage_limit"), // max uses per member
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rewardRedemptions = pgTable("reward_redemptions", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull().references(() => loyaltyMembers.id),
  rewardId: integer("reward_id").notNull().references(() => rewards.id),
  status: text("status").notNull().default("pending"), // pending, used, expired
  code: text("code").notNull().unique(), // redemption code
  usedAt: timestamp("used_at"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertLoyaltyMemberSchema = createInsertSchema(loyaltyMembers).omit({
  id: true,
  joinDate: true,
  lastVisit: true,
  totalPoints: true,
  lifetimePoints: true,
  tier: true,
  totalOrders: true,
  totalSpent: true,
});

export const insertPointsTransactionSchema = createInsertSchema(pointsTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertRewardSchema = createInsertSchema(rewards).omit({
  id: true,
  createdAt: true,
  isActive: true,
  isLimitedTime: true,
});

export const insertRewardRedemptionSchema = createInsertSchema(rewardRedemptions).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type Reservation = typeof reservations.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertLoyaltyMember = z.infer<typeof insertLoyaltyMemberSchema>;
export type LoyaltyMember = typeof loyaltyMembers.$inferSelect;

export type InsertPointsTransaction = z.infer<typeof insertPointsTransactionSchema>;
export type PointsTransaction = typeof pointsTransactions.$inferSelect;

export type InsertReward = z.infer<typeof insertRewardSchema>;
export type Reward = typeof rewards.$inferSelect;

export type InsertRewardRedemption = z.infer<typeof insertRewardRedemptionSchema>;
export type RewardRedemption = typeof rewardRedemptions.$inferSelect;

// Newsletter schemas
export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  subscribedAt: true,
  unsubscribedAt: true,
  lastEmailSent: true,
  emailsSent: true,
  emailsOpened: true,
  emailsClicked: true,
});

export const insertEmailCampaignSchema = createInsertSchema(emailCampaigns).omit({
  id: true,
  createdAt: true,
  sentAt: true,
  recipientCount: true,
  openedCount: true,
  clickedCount: true,
});

export const insertEmailTrackingSchema = createInsertSchema(emailTracking).omit({
  id: true,
  timestamp: true,
});

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

export type InsertEmailCampaign = z.infer<typeof insertEmailCampaignSchema>;
export type EmailCampaign = typeof emailCampaigns.$inferSelect;

export type InsertEmailTracking = z.infer<typeof insertEmailTrackingSchema>;
export type EmailTracking = typeof emailTracking.$inferSelect;

// Kitchen monitoring schemas
export const insertKitchenCapacitySchema = createInsertSchema(kitchenCapacity).omit({
  id: true,
  timestamp: true,
});

export const insertKitchenStatusSchema = createInsertSchema(kitchenStatus).omit({
  id: true,
  lastUpdated: true,
});

export const insertTimeSlotSchema = createInsertSchema(timeSlots).omit({
  id: true,
});

export type InsertKitchenCapacity = z.infer<typeof insertKitchenCapacitySchema>;
export type KitchenCapacity = typeof kitchenCapacity.$inferSelect;

export type InsertKitchenStatus = z.infer<typeof insertKitchenStatusSchema>;
export type KitchenStatus = typeof kitchenStatus.$inferSelect;

export type InsertTimeSlot = z.infer<typeof insertTimeSlotSchema>;
export type TimeSlot = typeof timeSlots.$inferSelect;
