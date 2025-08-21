import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// User interface for authentication
export interface User {
  id: number;
  email: string;
  password: string; // hashed
  role: 'admin' | 'customer' | 'loyalty_member';
  firstName?: string;
  lastName?: string;
  phone?: string;
  loyaltyNumber?: string;
  createdAt: Date;
  lastLogin?: Date;
}

// Session interface
export interface Session {
  id: string;
  userId: number;
  role: string;
  expiresAt: Date;
}

// In-memory storage for users and sessions
const users: User[] = [
  {
    id: 1,
    email: 'admin@stefano.pl',
    password: hashPassword('admin123'), // Default admin password
    role: 'admin',
    firstName: 'Admin',
    lastName: 'Stefano',
    createdAt: new Date()
  }
];

const sessions: Map<string, Session> = new Map();
let nextUserId = 2;

// Password hashing function
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'stefano-salt').digest('hex');
}

// Generate session token
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Authentication middleware
export function authenticate(req: Request & { user?: User }, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.sessionToken;
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  const session = sessions.get(token);
  if (!session || session.expiresAt < new Date()) {
    sessions.delete(token);
    return res.status(401).json({ error: 'Unauthorized - Invalid or expired token' });
  }

  const user = users.find(u => u.id === session.userId);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized - User not found' });
  }

  req.user = user;
  next();
}

// Admin-only middleware
export function requireAdmin(req: Request & { user?: User }, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden - Admin access required' });
  }
  next();
}

// Loyalty member middleware
export function requireLoyaltyMember(req: Request & { user?: User }, res: Response, next: NextFunction) {
  if (!req.user || (req.user.role !== 'loyalty_member' && req.user.role !== 'admin')) {
    return res.status(403).json({ error: 'Forbidden - Loyalty member access required' });
  }
  next();
}

// Login function
export async function login(email: string, password: string): Promise<{ user: User; token: string } | null> {
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user || user.password !== hashPassword(password)) {
    return null;
  }

  // Update last login
  user.lastLogin = new Date();

  // Create session
  const token = generateSessionToken();
  const session: Session = {
    id: token,
    userId: user.id,
    role: user.role,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  };
  
  sessions.set(token, session);

  return { user, token };
}

// Register function
export async function register(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  joinLoyaltyProgram?: boolean;
}): Promise<{ user: User; token: string } | { error: string }> {
  // Check if user already exists
  if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
    return { error: 'Email already registered' };
  }

  // Create new user
  const newUser: User = {
    id: nextUserId++,
    email: userData.email,
    password: hashPassword(userData.password),
    role: userData.joinLoyaltyProgram ? 'loyalty_member' : 'customer',
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone,
    loyaltyNumber: userData.joinLoyaltyProgram ? `STEF${String(nextUserId).padStart(6, '0')}` : undefined,
    createdAt: new Date(),
    lastLogin: new Date()
  };

  users.push(newUser);

  // Auto-login after registration
  const token = generateSessionToken();
  const session: Session = {
    id: token,
    userId: newUser.id,
    role: newUser.role,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  };
  
  sessions.set(token, session);

  return { user: newUser, token };
}

// Logout function
export function logout(token: string): void {
  sessions.delete(token);
}

// Get user by ID
export function getUserById(id: number): User | undefined {
  return users.find(u => u.id === id);
}

// Get all users (admin only)
export function getAllUsers(): User[] {
  return users;
}

// Update user profile
export function updateUserProfile(userId: number, updates: Partial<User>): User | null {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return null;

  // Don't allow updating certain fields
  delete updates.id;
  delete updates.email;
  delete updates.password;
  delete updates.role;
  delete updates.createdAt;

  users[userIndex] = { ...users[userIndex], ...updates };
  return users[userIndex];
}

// Clean up expired sessions
setInterval(() => {
  const now = new Date();
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(token);
    }
  }
}, 60 * 60 * 1000); // Every hour