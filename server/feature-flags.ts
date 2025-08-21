interface FeatureFlag {
  name: string;
  enabled: boolean;
  description: string;
  rolloutPercentage?: number;
  enabledForUsers?: string[];
  enabledForRoles?: string[];
  metadata?: Record<string, any>;
}

class FeatureFlagService {
  private flags: Map<string, FeatureFlag> = new Map();
  
  constructor() {
    this.initializeFlags();
  }
  
  private initializeFlags() {
    // Default feature flags
    this.flags.set('NEW_CHECKOUT_FLOW', {
      name: 'NEW_CHECKOUT_FLOW',
      enabled: true,
      description: 'New streamlined checkout process',
      rolloutPercentage: 100
    });
    
    this.flags.set('LOYALTY_REWARDS_V2', {
      name: 'LOYALTY_REWARDS_V2',
      enabled: true,
      description: 'Enhanced loyalty rewards system',
      rolloutPercentage: 50
    });
    
    this.flags.set('AI_RECOMMENDATIONS', {
      name: 'AI_RECOMMENDATIONS',
      enabled: false,
      description: 'AI-powered menu recommendations'
    });
    
    this.flags.set('ADVANCED_ANALYTICS', {
      name: 'ADVANCED_ANALYTICS',
      enabled: true,
      description: 'Advanced business analytics dashboard',
      enabledForRoles: ['admin', 'super_admin']
    });
    
    this.flags.set('MOBILE_PWA_ENHANCEMENTS', {
      name: 'MOBILE_PWA_ENHANCEMENTS',
      enabled: true,
      description: 'Enhanced PWA features for mobile',
      rolloutPercentage: 100
    });
  }
  
  isEnabled(flagName: string, context?: { userId?: string; role?: string }): boolean {
    const flag = this.flags.get(flagName);
    
    if (!flag || !flag.enabled) {
      return false;
    }
    
    // Check role-based enablement
    if (flag.enabledForRoles && context?.role) {
      if (!flag.enabledForRoles.includes(context.role)) {
        return false;
      }
    }
    
    // Check user-specific enablement
    if (flag.enabledForUsers && context?.userId) {
      return flag.enabledForUsers.includes(context.userId);
    }
    
    // Check rollout percentage
    if (flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100) {
      const hash = this.hashUserId(context?.userId || 'anonymous');
      const bucket = hash % 100;
      return bucket < flag.rolloutPercentage;
    }
    
    return true;
  }
  
  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
  
  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }
  
  getFlag(flagName: string): FeatureFlag | undefined {
    return this.flags.get(flagName);
  }
  
  updateFlag(flagName: string, updates: Partial<FeatureFlag>): boolean {
    const flag = this.flags.get(flagName);
    if (!flag) {
      return false;
    }
    
    this.flags.set(flagName, { ...flag, ...updates });
    return true;
  }
  
  createFlag(flag: FeatureFlag): void {
    this.flags.set(flag.name, flag);
  }
  
  deleteFlag(flagName: string): boolean {
    return this.flags.delete(flagName);
  }
}

export const featureFlags = new FeatureFlagService();

// Express middleware for feature flags
export function featureFlagMiddleware(req: any, res: any, next: any) {
  req.featureFlags = {
    isEnabled: (flagName: string) => {
      const context = {
        userId: req.user?.id?.toString(),
        role: req.user?.role
      };
      return featureFlags.isEnabled(flagName, context);
    }
  };
  
  // Add feature flags to response locals for templates
  res.locals.featureFlags = req.featureFlags;
  
  next();
}

// Helper for conditional feature execution
export function withFeature<T>(
  flagName: string,
  enabledFn: () => T,
  disabledFn?: () => T,
  context?: { userId?: string; role?: string }
): T {
  if (featureFlags.isEnabled(flagName, context)) {
    return enabledFn();
  } else if (disabledFn) {
    return disabledFn();
  } else {
    throw new Error(`Feature ${flagName} is not enabled`);
  }
}