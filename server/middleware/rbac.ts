import { Request, Response, NextFunction } from 'express';
import { ApiError } from './error-handler';

// Role definitions
export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff',
  CUSTOMER = 'customer',
  LOYALTY_MEMBER = 'loyalty_member'
}

// Permission definitions
export enum Permission {
  // Order permissions
  CREATE_ORDER = 'create_order',
  VIEW_ORDER = 'view_order',
  UPDATE_ORDER = 'update_order',
  DELETE_ORDER = 'delete_order',
  VIEW_ALL_ORDERS = 'view_all_orders',
  
  // Customer permissions
  VIEW_CUSTOMER = 'view_customer',
  UPDATE_CUSTOMER = 'update_customer',
  DELETE_CUSTOMER = 'delete_customer',
  VIEW_ALL_CUSTOMERS = 'view_all_customers',
  EXPORT_CUSTOMER_DATA = 'export_customer_data',
  
  // Menu permissions
  CREATE_MENU_ITEM = 'create_menu_item',
  UPDATE_MENU_ITEM = 'update_menu_item',
  DELETE_MENU_ITEM = 'delete_menu_item',
  
  // Loyalty permissions
  VIEW_LOYALTY_POINTS = 'view_loyalty_points',
  MANAGE_LOYALTY_POINTS = 'manage_loyalty_points',
  CREATE_REWARDS = 'create_rewards',
  
  // Admin permissions
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_USERS = 'manage_users',
  MANAGE_SETTINGS = 'manage_settings',
  VIEW_LOGS = 'view_logs',
  MANAGE_API_KEYS = 'manage_api_keys',
  
  // System permissions
  ACCESS_ADMIN_PANEL = 'access_admin_panel',
  PERFORM_MAINTENANCE = 'perform_maintenance',
  VIEW_SYSTEM_HEALTH = 'view_system_health'
}

// Role-Permission mapping
const rolePermissions: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: Object.values(Permission), // All permissions
  
  [Role.ADMIN]: [
    Permission.CREATE_ORDER,
    Permission.VIEW_ORDER,
    Permission.UPDATE_ORDER,
    Permission.DELETE_ORDER,
    Permission.VIEW_ALL_ORDERS,
    Permission.VIEW_CUSTOMER,
    Permission.UPDATE_CUSTOMER,
    Permission.VIEW_ALL_CUSTOMERS,
    Permission.CREATE_MENU_ITEM,
    Permission.UPDATE_MENU_ITEM,
    Permission.DELETE_MENU_ITEM,
    Permission.VIEW_LOYALTY_POINTS,
    Permission.MANAGE_LOYALTY_POINTS,
    Permission.CREATE_REWARDS,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_SETTINGS,
    Permission.ACCESS_ADMIN_PANEL,
    Permission.VIEW_SYSTEM_HEALTH
  ],
  
  [Role.MANAGER]: [
    Permission.CREATE_ORDER,
    Permission.VIEW_ORDER,
    Permission.UPDATE_ORDER,
    Permission.VIEW_ALL_ORDERS,
    Permission.VIEW_CUSTOMER,
    Permission.UPDATE_CUSTOMER,
    Permission.VIEW_ALL_CUSTOMERS,
    Permission.UPDATE_MENU_ITEM,
    Permission.VIEW_LOYALTY_POINTS,
    Permission.VIEW_ANALYTICS,
    Permission.ACCESS_ADMIN_PANEL
  ],
  
  [Role.STAFF]: [
    Permission.CREATE_ORDER,
    Permission.VIEW_ORDER,
    Permission.UPDATE_ORDER,
    Permission.VIEW_CUSTOMER,
    Permission.VIEW_LOYALTY_POINTS
  ],
  
  [Role.CUSTOMER]: [
    Permission.CREATE_ORDER,
    Permission.VIEW_ORDER
  ],
  
  [Role.LOYALTY_MEMBER]: [
    Permission.CREATE_ORDER,
    Permission.VIEW_ORDER,
    Permission.VIEW_LOYALTY_POINTS
  ]
};

// Extended Request interface
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: Role;
    permissions?: Permission[];
  };
}

// Check if user has required role
export function hasRole(userRole: Role, requiredRole: Role): boolean {
  const roleHierarchy = {
    [Role.SUPER_ADMIN]: 6,
    [Role.ADMIN]: 5,
    [Role.MANAGER]: 4,
    [Role.STAFF]: 3,
    [Role.LOYALTY_MEMBER]: 2,
    [Role.CUSTOMER]: 1
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

// Check if user has required permission
export function hasPermission(userRole: Role, requiredPermission: Permission): boolean {
  return rolePermissions[userRole]?.includes(requiredPermission) || false;
}

// Middleware to require specific role
export function requireRole(requiredRole: Role) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }
    
    if (!hasRole(req.user.role, requiredRole)) {
      throw new ApiError(403, `Forbidden: Requires ${requiredRole} role or higher`);
    }
    
    next();
  };
}

// Middleware to require specific permission
export function requirePermission(requiredPermission: Permission) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }
    
    if (!hasPermission(req.user.role, requiredPermission)) {
      throw new ApiError(403, `Forbidden: Missing required permission: ${requiredPermission}`);
    }
    
    next();
  };
}

// Middleware to require any of the specified permissions
export function requireAnyPermission(...permissions: Permission[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }
    
    const hasAnyPermission = permissions.some(permission => 
      hasPermission(req.user!.role, permission)
    );
    
    if (!hasAnyPermission) {
      throw new ApiError(403, `Forbidden: Requires one of: ${permissions.join(', ')}`);
    }
    
    next();
  };
}

// Middleware to require all of the specified permissions
export function requireAllPermissions(...permissions: Permission[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }
    
    const hasAllPermissions = permissions.every(permission => 
      hasPermission(req.user!.role, permission)
    );
    
    if (!hasAllPermissions) {
      throw new ApiError(403, `Forbidden: Requires all of: ${permissions.join(', ')}`);
    }
    
    next();
  };
}

// Get user permissions based on role
export function getUserPermissions(role: Role): Permission[] {
  return rolePermissions[role] || [];
}

// Dynamic permission checking for conditional logic
export function canAccess(userRole: Role, resource: string, action: string): boolean {
  const permissionKey = `${action}_${resource}`.toUpperCase() as Permission;
  return hasPermission(userRole, permissionKey);
}