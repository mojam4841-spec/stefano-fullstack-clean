import swaggerJsdoc from 'swagger-jsdoc';
import { Express } from 'express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Stefano Restaurant API',
      version: '2.0.0',
      description: 'Enterprise-grade restaurant management API with complete order, loyalty, and analytics capabilities',
      contact: {
        name: 'Stefano IT Team',
        email: 'api@stefanogroup.pl',
        url: 'https://stefanogroup.pl'
      },
      license: {
        name: 'Proprietary',
        url: 'https://stefanogroup.pl/api-license'
      }
    },
    servers: [
      {
        url: 'https://api.stefanogroup.pl/v2',
        description: 'Production server'
      },
      {
        url: 'https://staging-api.stefanogroup.pl/v2',
        description: 'Staging server'
      },
      {
        url: 'http://localhost:5000/api/v2',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                correlationId: { type: 'string', format: 'uuid' },
                message: { type: 'string' },
                statusCode: { type: 'integer' },
                timestamp: { type: 'string', format: 'date-time' },
                path: { type: 'string' }
              }
            }
          }
        },
        Order: {
          type: 'object',
          required: ['customerName', 'customerPhone', 'items', 'totalAmount'],
          properties: {
            id: { type: 'integer', readOnly: true },
            customerName: { type: 'string', minLength: 2, maxLength: 100 },
            customerPhone: { type: 'string', pattern: '^[0-9]{9}$' },
            customerEmail: { type: 'string', format: 'email' },
            items: { 
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  price: { type: 'number', format: 'float' },
                  quantity: { type: 'integer', minimum: 1 }
                }
              }
            },
            totalAmount: { type: 'number', format: 'float', minimum: 0 },
            status: { 
              type: 'string',
              enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
              default: 'pending'
            },
            paymentMethod: {
              type: 'string',
              enum: ['cash', 'card', 'online', 'blik']
            },
            deliveryAddress: { type: 'string' },
            estimatedTime: { type: 'integer', description: 'Estimated time in minutes' },
            createdAt: { type: 'string', format: 'date-time', readOnly: true }
          }
        },
        Customer: {
          type: 'object',
          properties: {
            id: { type: 'integer', readOnly: true },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            loyaltyPoints: { type: 'integer' },
            totalOrders: { type: 'integer' },
            totalSpent: { type: 'number', format: 'float' },
            gdprConsent: { type: 'boolean' },
            marketingConsent: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        LoyaltyMember: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            customerId: { type: 'integer' },
            loyaltyNumber: { type: 'string' },
            tier: {
              type: 'string',
              enum: ['bronze', 'silver', 'gold', 'platinum']
            },
            totalPoints: { type: 'integer' },
            lifetimePoints: { type: 'integer' },
            joinDate: { type: 'string', format: 'date-time' }
          }
        },
        MenuItem: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number', format: 'float' },
            category: { type: 'string' },
            available: { type: 'boolean' },
            ingredients: {
              type: 'array',
              items: { type: 'string' }
            },
            allergens: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      }
    }
  },
  apis: ['./server/routes/*.ts', './server/api-docs/*.yml']
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);

export function setupSwagger(app: Express) {
  // Serve Swagger JSON
  app.get('/api/docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  // Serve Swagger UI
  app.get('/api/docs', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>Stefano API Documentation</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
        <style>
          body { margin: 0; padding: 0; }
          .swagger-ui .topbar { display: none; }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
        <script>
          window.onload = () => {
            window.ui = SwaggerUIBundle({
              url: '/api/docs/swagger.json',
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIBundle.SwaggerUIStandalonePreset
              ],
              plugins: [
                SwaggerUIBundle.plugins.DownloadUrl
              ],
              layout: "BaseLayout"
            });
          };
        </script>
      </body>
      </html>
    `);
  });
}