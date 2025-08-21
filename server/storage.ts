// Storage interfaces for Stefano Restaurant
export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  // avatar field removed
  items: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: Date;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: Date;
}

export interface Reservation {
  id: number;
  name: string;
  phone: string;
  email?: string;
  eventDate: string;
  guestCount: number;
  specialRequests?: string;
  createdAt: Date;
}

// In-memory storage with test data
let orders: Order[] = [
  {
    id: 1,
    customerName: "Test Kompletny",
    customerPhone: "669448585",
    customerEmail: "test@example.com",
    // avatar removed
    items: JSON.stringify([{name: "Pizza Margherita", price: 45, quantity: 1}]),
    totalAmount: 4500,
    status: "completed",
    paymentMethod: "cash",
    createdAt: new Date()
  }
];

let contacts: Contact[] = [
  {
    id: 1,
    name: "Test User",
    email: "test@stefano.pl",
    phone: "669448585",
    message: "Test message",
    createdAt: new Date()
  }
];

let reservations: Reservation[] = [];
let customers: Customer[] = [];
let gdprConsents: GdprConsent[] = [];
let gdprRequests: GdprRequest[] = [];
let nextOrderId = 16;
let nextContactId = 5;
let nextReservationId = 1;
let nextCustomerId = 1;
let nextGdprConsentId = 1;
let nextGdprRequestId = 1;

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  gdprConsent: boolean;
  marketingConsent: boolean;
  newsletterConsent: boolean;
  smsConsent: boolean;
  source: string;
  tags: string[];
  notes?: string;
  consentDate: Date;
  consentIpAddress?: string;
  consentUserAgent?: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  createdAt: Date;
}

export interface GdprConsent {
  id: number;
  customerId: number;
  consentType: string;
  consentGiven: boolean;
  consentDate: Date;
  ipAddress?: string;
  userAgent?: string;
  legalBasis: string;
  description?: string;
}

export interface GdprRequest {
  id: number;
  customerId: number;
  requestType: string;
  status: string;
  description?: string;
  requestDate: Date;
  completedDate?: Date;
  processedBy?: string;
  adminNotes?: string;
}

export interface IStorage {
  // Orders
  createOrder(order: any): Promise<Order>;
  getOrders(): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Contacts
  createContact(contact: any): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  
  // Reservations
  createReservation(reservation: any): Promise<Reservation>;
  getReservations(): Promise<Reservation[]>;
  
  // Customers with GDPR
  createCustomer(customer: any): Promise<Customer>;
  getCustomers(): Promise<Customer[]>;
  getCustomerById(id: number): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  updateCustomer(id: number, updates: any): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;
  
  // GDPR Consents
  createGdprConsent(consent: any): Promise<GdprConsent>;
  getGdprConsents(customerId: number): Promise<GdprConsent[]>;
  updateGdprConsent(customerId: number, consentType: string, consentGiven: boolean): Promise<GdprConsent>;
  
  // GDPR Requests
  createGdprRequest(request: any): Promise<GdprRequest>;
  getGdprRequests(): Promise<GdprRequest[]>;
  updateGdprRequestStatus(id: number, status: string, adminNotes?: string): Promise<GdprRequest | undefined>;
}

export class MemStorage implements IStorage {
  async createOrder(orderData: any): Promise<Order> {
    const order: Order = {
      id: nextOrderId++,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      // avatar field removed
      items: typeof orderData.items === 'string' ? orderData.items : JSON.stringify(orderData.items),
      totalAmount: orderData.totalAmount,
      status: orderData.status || "pending",
      paymentMethod: orderData.paymentMethod || "cash",
      createdAt: new Date()
    };
    orders.push(order);
    return order;
  }

  async getOrders(): Promise<Order[]> {
    return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
    }
    return order;
  }

  async createContact(contactData: any): Promise<Contact> {
    const contact: Contact = {
      id: nextContactId++,
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      message: contactData.message,
      createdAt: new Date()
    };
    contacts.push(contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return contacts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createReservation(reservationData: any): Promise<Reservation> {
    const reservation: Reservation = {
      id: nextReservationId++,
      name: reservationData.name,
      phone: reservationData.phone,
      email: reservationData.email,
      eventDate: reservationData.eventDate,
      guestCount: reservationData.guestCount,
      specialRequests: reservationData.specialRequests,
      createdAt: new Date()
    };
    reservations.push(reservation);
    return reservation;
  }

  async getReservations(): Promise<Reservation[]> {
    return reservations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Customer management functions
  async createCustomer(customerData: any): Promise<Customer> {
    const customer: Customer = {
      id: nextCustomerId++,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      email: customerData.email,
      phone: customerData.phone,
      address: customerData.address,
      city: customerData.city,
      postalCode: customerData.postalCode,
      gdprConsent: customerData.gdprConsent || false,
      marketingConsent: customerData.marketingConsent || false,
      newsletterConsent: customerData.newsletterConsent || false,
      smsConsent: customerData.smsConsent || false,
      source: customerData.source || "manual",
      tags: customerData.tags || [],
      notes: customerData.notes,
      consentDate: new Date(),
      consentIpAddress: customerData.consentIpAddress,
      consentUserAgent: customerData.consentUserAgent,
      totalOrders: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
      createdAt: new Date()
    };
    customers.push(customer);
    return customer;
  }

  async getCustomers(): Promise<Customer[]> {
    return customers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getCustomerById(id: number): Promise<Customer | undefined> {
    return customers.find(c => c.id === id);
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    return customers.find(c => c.email.toLowerCase() === email.toLowerCase());
  }

  async updateCustomer(id: number, updates: any): Promise<Customer | undefined> {
    const customer = customers.find(c => c.id === id);
    if (customer) {
      Object.assign(customer, updates);
    }
    return customer;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    const index = customers.findIndex(c => c.id === id);
    if (index !== -1) {
      customers.splice(index, 1);
      return true;
    }
    return false;
  }

  // GDPR Consent management
  async createGdprConsent(consentData: any): Promise<GdprConsent> {
    const consent: GdprConsent = {
      id: nextGdprConsentId++,
      customerId: consentData.customerId,
      consentType: consentData.consentType,
      consentGiven: consentData.consentGiven,
      consentDate: new Date(),
      ipAddress: consentData.ipAddress,
      userAgent: consentData.userAgent,
      legalBasis: consentData.legalBasis || "consent",
      description: consentData.description
    };
    gdprConsents.push(consent);
    return consent;
  }

  async getGdprConsents(customerId: number): Promise<GdprConsent[]> {
    return gdprConsents.filter(c => c.customerId === customerId);
  }

  async updateGdprConsent(customerId: number, consentType: string, consentGiven: boolean): Promise<GdprConsent> {
    const existingConsent = gdprConsents.find(c => c.customerId === customerId && c.consentType === consentType);
    
    if (existingConsent) {
      existingConsent.consentGiven = consentGiven;
      existingConsent.consentDate = new Date();
      return existingConsent;
    } else {
      return this.createGdprConsent({
        customerId,
        consentType,
        consentGiven,
        legalBasis: "consent"
      });
    }
  }

  // GDPR Request management
  async createGdprRequest(requestData: any): Promise<GdprRequest> {
    const request: GdprRequest = {
      id: nextGdprRequestId++,
      customerId: requestData.customerId,
      requestType: requestData.requestType,
      status: "pending",
      description: requestData.description,
      requestDate: new Date(),
      processedBy: requestData.processedBy,
      adminNotes: requestData.adminNotes
    };
    gdprRequests.push(request);
    return request;
  }

  async getGdprRequests(): Promise<GdprRequest[]> {
    return gdprRequests.sort((a, b) => b.requestDate.getTime() - a.requestDate.getTime());
  }

  async updateGdprRequestStatus(id: number, status: string, adminNotes?: string): Promise<GdprRequest | undefined> {
    const request = gdprRequests.find(r => r.id === id);
    if (request) {
      request.status = status;
      request.adminNotes = adminNotes;
      if (status === "completed") {
        request.completedDate = new Date();
      }
    }
    return request;
  }
}

// Use DatabaseStorage for production (recommended for enterprise)
import { DatabaseStorage } from "./database-storage";
// export const storage = new DatabaseStorage();

// Currently using in-memory storage (NOT recommended for production!)
export const storage = new MemStorage();