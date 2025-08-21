import { db } from "./db";
import { 
  orders, 
  contacts, 
  reservations, 
  customers, 
  gdprConsents, 
  gdprRequests,
  loyaltyMembers,
  pointsTransactions,
  rewards,
  rewardRedemptions
} from "../shared/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import type { 
  Order, 
  Contact, 
  Reservation, 
  Customer, 
  GdprConsent, 
  GdprRequest,
  LoyaltyMember,
  PointsTransaction,
  Reward,
  RewardRedemption
} from "./storage";

export class DatabaseStorage {
  // Orders
  async getOrders(): Promise<Order[]> {
    const result = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return result.map(order => ({
      ...order,
      customerEmail: order.customerEmail || undefined,
      createdAt: order.createdAt || new Date()
    }));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;
    return {
      ...order,
      customerEmail: order.customerEmail || undefined,
      createdAt: order.createdAt || new Date()
    };
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const [newOrder] = await db.insert(orders).values({
      ...order,
      customerEmail: order.customerEmail || null
    }).returning();
    return {
      ...newOrder,
      customerEmail: newOrder.customerEmail || undefined,
      createdAt: newOrder.createdAt || new Date()
    };
  }

  async updateOrderStatus(id: number, status: string): Promise<void> {
    await db.update(orders).set({ status }).where(eq(orders.id, id));
  }

  // Contacts
  async getContacts(): Promise<Contact[]> {
    const result = await db.select().from(contacts).orderBy(desc(contacts.createdAt));
    return result.map(contact => ({
      ...contact,
      phone: contact.phone || undefined,
      createdAt: contact.createdAt || new Date()
    }));
  }

  async createContact(contact: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values({
      ...contact,
      phone: contact.phone || null
    }).returning();
    return {
      ...newContact,
      phone: newContact.phone || undefined,
      createdAt: newContact.createdAt || new Date()
    };
  }

  // Reservations
  async getReservations(): Promise<Reservation[]> {
    const result = await db.select().from(reservations).orderBy(desc(reservations.createdAt));
    return result.map(res => ({
      id: res.id,
      name: res.name,
      phone: res.phone,
      email: res.email || undefined,
      eventDate: res.date + ' ' + res.time,
      guestCount: res.guests,
      specialRequests: res.message || undefined,
      createdAt: res.createdAt || new Date()
    }));
  }

  async createReservation(reservation: Omit<Reservation, 'id' | 'createdAt'>): Promise<Reservation> {
    const [date, time] = reservation.eventDate.split(' ');
    const [newRes] = await db.insert(reservations).values({
      name: reservation.name,
      phone: reservation.phone,
      email: reservation.email || '',
      date: date,
      time: time || '19:00',
      guests: reservation.guestCount,
      message: reservation.specialRequests || null
    }).returning();
    
    return {
      id: newRes.id,
      name: newRes.name,
      phone: newRes.phone,
      email: newRes.email || undefined,
      eventDate: newRes.date + ' ' + newRes.time,
      guestCount: newRes.guests,
      specialRequests: newRes.message || undefined,
      createdAt: newRes.createdAt || new Date()
    };
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    const result = await db.select().from(customers).orderBy(desc(customers.createdAt));
    return result.map(customer => ({
      ...customer,
      phone: customer.phone || undefined,
      address: customer.address || undefined,
      city: customer.city || undefined,
      postalCode: customer.postalCode || undefined,
      notes: customer.notes || undefined,
      lastContactDate: customer.lastContactDate || undefined,
      consentIpAddress: customer.consentIpAddress || undefined,
      consentUserAgent: customer.consentUserAgent || undefined,
      lastOrderDate: customer.lastOrderDate || undefined,
      createdAt: customer.createdAt || new Date(),
      updatedAt: customer.updatedAt || new Date()
    }));
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    if (!customer) return undefined;
    return {
      ...customer,
      phone: customer.phone || undefined,
      address: customer.address || undefined,
      city: customer.city || undefined,
      postalCode: customer.postalCode || undefined,
      notes: customer.notes || undefined,
      lastContactDate: customer.lastContactDate || undefined,
      consentIpAddress: customer.consentIpAddress || undefined,
      consentUserAgent: customer.consentUserAgent || undefined,
      lastOrderDate: customer.lastOrderDate || undefined,
      createdAt: customer.createdAt || new Date(),
      updatedAt: customer.updatedAt || new Date()
    };
  }

  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values({
      ...customer,
      phone: customer.phone || null,
      address: customer.address || null,
      city: customer.city || null,
      postalCode: customer.postalCode || null,
      notes: customer.notes || null,
      lastContactDate: customer.lastContactDate || null,
      consentIpAddress: customer.consentIpAddress || null,
      consentUserAgent: customer.consentUserAgent || null,
      lastOrderDate: customer.lastOrderDate || null
    }).returning();
    
    return {
      ...newCustomer,
      phone: newCustomer.phone || undefined,
      address: newCustomer.address || undefined,
      city: newCustomer.city || undefined,
      postalCode: newCustomer.postalCode || undefined,
      notes: newCustomer.notes || undefined,
      lastContactDate: newCustomer.lastContactDate || undefined,
      consentIpAddress: newCustomer.consentIpAddress || undefined,
      consentUserAgent: newCustomer.consentUserAgent || undefined,
      lastOrderDate: newCustomer.lastOrderDate || undefined,
      createdAt: newCustomer.createdAt || new Date(),
      updatedAt: newCustomer.updatedAt || new Date()
    };
  }

  async updateCustomer(id: number, updates: Partial<Customer>): Promise<Customer | undefined> {
    const [updated] = await db.update(customers)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(customers.id, id))
      .returning();
    
    if (!updated) return undefined;
    return {
      ...updated,
      phone: updated.phone || undefined,
      address: updated.address || undefined,
      city: updated.city || undefined,
      postalCode: updated.postalCode || undefined,
      notes: updated.notes || undefined,
      lastContactDate: updated.lastContactDate || undefined,
      consentIpAddress: updated.consentIpAddress || undefined,
      consentUserAgent: updated.consentUserAgent || undefined,
      lastOrderDate: updated.lastOrderDate || undefined,
      createdAt: updated.createdAt || new Date(),
      updatedAt: updated.updatedAt || new Date()
    };
  }

  // GDPR
  async getGdprConsents(customerId: number): Promise<GdprConsent[]> {
    const result = await db.select().from(gdprConsents)
      .where(eq(gdprConsents.customerId, customerId))
      .orderBy(desc(gdprConsents.createdAt));
    
    return result.map(consent => ({
      ...consent,
      consentWithdrawnDate: consent.consentWithdrawnDate || undefined,
      ipAddress: consent.ipAddress || undefined,
      userAgent: consent.userAgent || undefined,
      description: consent.description || undefined,
      createdAt: consent.createdAt || new Date()
    }));
  }

  async createGdprConsent(consent: Omit<GdprConsent, 'id' | 'createdAt'>): Promise<GdprConsent> {
    const [newConsent] = await db.insert(gdprConsents).values({
      ...consent,
      consentWithdrawnDate: consent.consentWithdrawnDate || null,
      ipAddress: consent.ipAddress || null,
      userAgent: consent.userAgent || null,
      description: consent.description || null
    }).returning();
    
    return {
      ...newConsent,
      consentWithdrawnDate: newConsent.consentWithdrawnDate || undefined,
      ipAddress: newConsent.ipAddress || undefined,
      userAgent: newConsent.userAgent || undefined,
      description: newConsent.description || undefined,
      createdAt: newConsent.createdAt || new Date()
    };
  }

  async getGdprRequests(): Promise<GdprRequest[]> {
    const result = await db.select().from(gdprRequests).orderBy(desc(gdprRequests.createdAt));
    return result.map(request => ({
      ...request,
      description: request.description || undefined,
      completedDate: request.completedDate || undefined,
      processedBy: request.processedBy || undefined,
      adminNotes: request.adminNotes || undefined,
      createdAt: request.createdAt || new Date()
    }));
  }

  async createGdprRequest(request: Omit<GdprRequest, 'id' | 'createdAt'>): Promise<GdprRequest> {
    const [newRequest] = await db.insert(gdprRequests).values({
      ...request,
      description: request.description || null,
      completedDate: request.completedDate || null,
      processedBy: request.processedBy || null,
      adminNotes: request.adminNotes || null
    }).returning();
    
    return {
      ...newRequest,
      description: newRequest.description || undefined,
      completedDate: newRequest.completedDate || undefined,
      processedBy: newRequest.processedBy || undefined,
      adminNotes: newRequest.adminNotes || undefined,
      createdAt: newRequest.createdAt || new Date()
    };
  }

  async updateGdprRequest(id: number, updates: Partial<GdprRequest>): Promise<GdprRequest | undefined> {
    const [updated] = await db.update(gdprRequests)
      .set(updates)
      .where(eq(gdprRequests.id, id))
      .returning();
    
    if (!updated) return undefined;
    return {
      ...updated,
      description: updated.description || undefined,
      completedDate: updated.completedDate || undefined,
      processedBy: updated.processedBy || undefined,
      adminNotes: updated.adminNotes || undefined,
      createdAt: updated.createdAt || new Date()
    };
  }

  // Loyalty Program
  async getLoyaltyMembers(): Promise<LoyaltyMember[]> {
    const result = await db.select().from(loyaltyMembers).orderBy(desc(loyaltyMembers.joinDate));
    return result.map(member => ({
      ...member,
      email: member.email || undefined,
      joinDate: member.joinDate || new Date(),
      lastVisit: member.lastVisit || new Date()
    }));
  }

  async getLoyaltyMemberByPhone(phone: string): Promise<LoyaltyMember | undefined> {
    const [member] = await db.select().from(loyaltyMembers).where(eq(loyaltyMembers.phone, phone));
    if (!member) return undefined;
    return {
      ...member,
      email: member.email || undefined,
      joinDate: member.joinDate || new Date(),
      lastVisit: member.lastVisit || new Date()
    };
  }

  async createLoyaltyMember(member: Omit<LoyaltyMember, 'id' | 'totalPoints' | 'lifetimePoints' | 'tier' | 'joinDate' | 'lastVisit' | 'totalOrders' | 'totalSpent'>): Promise<LoyaltyMember> {
    const [newMember] = await db.insert(loyaltyMembers).values({
      ...member,
      email: member.email || null,
      totalPoints: 100, // Welcome bonus
      lifetimePoints: 100,
      tier: "bronze"
    }).returning();
    
    return {
      ...newMember,
      email: newMember.email || undefined,
      joinDate: newMember.joinDate || new Date(),
      lastVisit: newMember.lastVisit || new Date()
    };
  }

  async updateLoyaltyMember(id: number, updates: Partial<LoyaltyMember>): Promise<LoyaltyMember | undefined> {
    const [updated] = await db.update(loyaltyMembers)
      .set(updates)
      .where(eq(loyaltyMembers.id, id))
      .returning();
    
    if (!updated) return undefined;
    return {
      ...updated,
      email: updated.email || undefined,
      joinDate: updated.joinDate || new Date(),
      lastVisit: updated.lastVisit || new Date()
    };
  }

  async createPointsTransaction(transaction: Omit<PointsTransaction, 'id' | 'createdAt'>): Promise<PointsTransaction> {
    const [newTransaction] = await db.insert(pointsTransactions).values({
      ...transaction,
      orderId: transaction.orderId || null,
      rewardId: transaction.rewardId || null
    }).returning();
    
    return {
      ...newTransaction,
      orderId: newTransaction.orderId || undefined,
      rewardId: newTransaction.rewardId || undefined,
      createdAt: newTransaction.createdAt || new Date()
    };
  }

  async getRewards(): Promise<Reward[]> {
    const result = await db.select().from(rewards).where(eq(rewards.isActive, true));
    return result.map(reward => ({
      ...reward,
      expiryDate: reward.expiryDate || undefined,
      usageLimit: reward.usageLimit || undefined,
      createdAt: reward.createdAt || new Date()
    }));
  }

  async createRewardRedemption(redemption: Omit<RewardRedemption, 'id' | 'createdAt' | 'status'>): Promise<RewardRedemption> {
    const [newRedemption] = await db.insert(rewardRedemptions).values({
      ...redemption,
      status: "pending",
      usedAt: null
    }).returning();
    
    return {
      ...newRedemption,
      usedAt: newRedemption.usedAt || undefined,
      createdAt: newRedemption.createdAt || new Date()
    };
  }

  async getRewardRedemptions(memberId: number): Promise<RewardRedemption[]> {
    const result = await db.select().from(rewardRedemptions)
      .where(eq(rewardRedemptions.memberId, memberId))
      .orderBy(desc(rewardRedemptions.createdAt));
    
    return result.map(redemption => ({
      ...redemption,
      usedAt: redemption.usedAt || undefined,
      createdAt: redemption.createdAt || new Date()
    }));
  }

  async getCustomerStats(): Promise<any> {
    const totalCustomers = await db.select({ count: sql<number>`count(*)` }).from(customers);
    const activeNewsletters = await db.select({ count: sql<number>`count(*)` })
      .from(customers)
      .where(eq(customers.newsletterConsent, true));
    
    const recentCustomers = await db.select()
      .from(customers)
      .orderBy(desc(customers.createdAt))
      .limit(5);
    
    return {
      totalCustomers: totalCustomers[0]?.count || 0,
      activeNewsletters: activeNewsletters[0]?.count || 0,
      growthThisMonth: 12, // This would need proper calculation
      recentCustomers: recentCustomers.map(c => ({
        ...c,
        phone: c.phone || undefined,
        createdAt: c.createdAt || new Date()
      }))
    };
  }
}