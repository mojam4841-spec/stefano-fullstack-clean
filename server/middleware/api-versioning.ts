import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';

export interface ApiVersion {
  version: string;
  deprecated?: boolean;
  deprecationDate?: Date;
  sunsetDate?: Date;
}

export const API_VERSIONS: ApiVersion[] = [
  {
    version: 'v1',
    deprecated: false
  },
  {
    version: 'v2',
    deprecated: false
  }
];

// Middleware to handle API versioning
export function apiVersioning(req: Request, res: Response, next: NextFunction) {
  // Extract version from URL path (e.g., /api/v1/orders)
  const versionMatch = req.path.match(/\/api\/(v\d+)\//);
  const requestedVersion = versionMatch ? versionMatch[1] : 'v1'; // Default to v1
  
  // Store version in request for later use
  (req as any).apiVersion = requestedVersion;
  
  // Check if version exists
  const versionInfo = API_VERSIONS.find(v => v.version === requestedVersion);
  
  if (!versionInfo) {
    return res.status(400).json({
      error: 'Invalid API version',
      supportedVersions: API_VERSIONS.map(v => v.version),
      message: `Version ${requestedVersion} is not supported`
    });
  }
  
  // Add deprecation headers if applicable
  if (versionInfo.deprecated) {
    res.set('X-API-Deprecation-Warning', 'true');
    res.set('X-API-Deprecation-Date', versionInfo.deprecationDate?.toISOString() || '');
    
    if (versionInfo.sunsetDate) {
      res.set('X-API-Sunset-Date', versionInfo.sunsetDate.toISOString());
      res.set('Warning', `299 - "API version ${requestedVersion} is deprecated and will be removed on ${versionInfo.sunsetDate.toISOString()}"`);
    }
  }
  
  // Add version info to response headers
  res.set('X-API-Version', requestedVersion);
  res.set('X-API-Supported-Versions', API_VERSIONS.map(v => v.version).join(', '));
  
  next();
}

// Router factory for versioned APIs
export function createVersionedRouter(version: string): Router {
  const router = Router();
  
  // Version-specific middleware
  router.use((req, res, next) => {
    res.set('X-API-Version', version);
    next();
  });
  
  return router;
}

// Helper to create versioned endpoint handlers
export function versionedHandler(handlers: { [version: string]: Function }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const version = (req as any).apiVersion || 'v1';
    const handler = handlers[version] || handlers['default'];
    
    if (!handler) {
      return res.status(501).json({
        error: 'Not implemented',
        message: `This endpoint is not available in API version ${version}`
      });
    }
    
    handler(req, res, next);
  };
}

// Example usage for different API versions
export const ordersHandlerV1 = (req: Request, res: Response) => {
  // V1 implementation - simple response
  res.json({
    version: 'v1',
    orders: [],
    total: 0
  });
};

export const ordersHandlerV2 = (req: Request, res: Response) => {
  // V2 implementation - enhanced response with pagination
  res.json({
    version: 'v2',
    data: {
      orders: [],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0
      }
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id']
    }
  });
};