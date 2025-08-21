import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  authenticate, 
  requireAdmin, 
  requireLoyaltyMember,
  login,
  register,
  logout,
  getUserById,
  getAllUsers,
  updateUserProfile,
  type User
} from "./auth";
import { emailService } from "./email-service";
import { smsService } from "./sms-service";
import { deepseekService } from "./deepseek-service";

// Extend Express Request with user property
interface AuthRequest extends Request {
  user?: User;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication endpoints
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }
      
      const result = await login(email, password);
      
      if (!result) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      res.cookie('sessionToken', result.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      res.json({ 
        success: true, 
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          role: result.user.role,
          loyaltyNumber: result.user.loyaltyNumber
        },
        token: result.token
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = await register(req.body);
      
      if ('error' in result) {
        return res.status(400).json({ error: result.error });
      }
      
      res.cookie('sessionToken', result.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });
      
      res.json({ 
        success: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          role: result.user.role,
          loyaltyNumber: result.user.loyaltyNumber
        },
        token: result.token
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.sessionToken;
    if (token) {
      logout(token);
    }
    res.clearCookie('sessionToken');
    res.json({ success: true });
  });

  app.get("/api/auth/me", authenticate, (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.json({
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
      loyaltyNumber: req.user.loyaltyNumber
    });
  });

  app.put("/api/auth/profile", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const updates = req.body;
      const updatedUser = updateUserProfile(req.user.id, updates);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({ 
        success: true,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role,
          loyaltyNumber: updatedUser.loyaltyNumber
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin-only user management
  app.get("/api/admin/users", authenticate, requireAdmin, (req: AuthRequest, res: Response) => {
    const users = getAllUsers();
    res.json(users.map(u => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role,
      loyaltyNumber: u.loyaltyNumber,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin
    })));
  });

  // Create test admin user (development only)
  app.post("/api/auth/create-test-admin", async (req, res) => {
    try {
      // First register as regular user
      const result = await register({
        email: "admin@stefanogroup.pl",
        password: "admin123456",
        firstName: "Admin",
        lastName: "Stefano",
        phone: "500600700"
      });
      
      if ('error' in result) {
        return res.status(400).json({ error: result.error });
      }
      
      // Update user role to admin (in production this would be done differently)
      const user = getUserById(result.user.id);
      if (user) {
        user.role = 'admin';
      }
      
      res.json({ 
        success: true, 
        message: "Admin user created successfully",
        credentials: {
          email: "admin@stefanogroup.pl",
          password: "admin123456"
        }
      });
    } catch (error) {
      console.error("Admin creation error:", error);
      res.status(500).json({ error: "Failed to create admin user" });
    }
  });

  // Contact form submission with validation
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = req.body;
      
      // Validation
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ success: false, error: "Name is required" });
      }
      if (!email || !email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ success: false, error: "Valid email is required" });
      }
      if (!message || message.trim().length === 0) {
        return res.status(400).json({ success: false, error: "Message is required" });
      }
      
      const contact = await storage.createContact(req.body);
      res.json({ success: true, contact });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all contacts (for admin)
  app.get("/api/contacts", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Reservation submission with validation
  app.post("/api/reservations", async (req, res) => {
    try {
      const { name, phone, date, time, guests } = req.body;
      
      // Validation
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ success: false, error: "Name is required" });
      }
      if (!phone || phone.trim().length === 0) {
        return res.status(400).json({ success: false, error: "Phone is required" });
      }
      if (!date) {
        return res.status(400).json({ success: false, error: "Date is required" });
      }
      if (!time) {
        return res.status(400).json({ success: false, error: "Time is required" });
      }
      if (!guests || Number(guests) < 1) {
        return res.status(400).json({ success: false, error: "At least 1 guest is required" });
      }
      
      const reservation = await storage.createReservation(req.body);
      res.json({ success: true, reservation });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all reservations (for admin)
  app.get("/api/reservations", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const reservations = await storage.getReservations();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Order submission with validation
  app.post("/api/orders", async (req, res) => {
    try {
      // Validation
      if (!req.body.customerName || req.body.customerName.trim().length === 0) {
        return res.status(400).json({ success: false, error: "Customer name is required" });
      }
      if (!req.body.phone || req.body.phone.trim().length === 0) {
        return res.status(400).json({ success: false, error: "Phone number is required" });
      }
      if (!req.body.items || req.body.items === "" || req.body.items === "[]") {
        return res.status(400).json({ success: false, error: "At least one item is required" });
      }
      if (req.body.total && Number(req.body.total) <= 0) {
        return res.status(400).json({ success: false, error: "Total must be greater than 0" });
      }
      
      // Map avatar emoji to simplified system
      const orderData = {
        ...req.body,
        avatar: req.body.avatar || "👨", // Default to man
        deliveryAddress: req.body.deliveryAddress || "",
        orderType: req.body.orderType || "delivery",
        specialInstructions: req.body.specialInstructions || "",
        paymentMethod: req.body.paymentMethod || "cash"
      };
      
      const order = await storage.createOrder(orderData);
      
      // Send email if requested
      if (req.body.sendEmail && orderData.customerEmail) {
        await emailService.sendOrderConfirmationEmail(orderData.customerEmail, {
          orderId: order.id,
          customerName: orderData.customerName,
          items: JSON.parse(orderData.items || "[]"),
          totalAmount: orderData.totalAmount,
          deliveryAddress: orderData.deliveryAddress,
          orderType: orderData.orderType
        }).catch(err => console.error("Email send failed:", err));
      }
      
      res.json({ success: true, order });
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all orders (for admin)
  app.get("/api/orders", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update order status
  app.patch("/api/orders/:id/status", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(parseInt(req.params.id), status);
      res.json({ success: true, order });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Customer management endpoints
  app.post("/api/customers", async (req, res) => {
    try {
      const customerData = {
        ...req.body,
        consentIpAddress: req.ip,
        consentUserAgent: req.headers['user-agent'],
      };
      const customer = await storage.createCustomer(customerData);
      res.json({ success: true, customer });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/customers/:id", async (req, res) => {
    try {
      const customer = await storage.getCustomerById(parseInt(req.params.id));
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/customers/:id", async (req, res) => {
    try {
      const customer = await storage.updateCustomer(parseInt(req.params.id), req.body);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json({ success: true, customer });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/customers/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCustomer(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GDPR Consent management
  app.post("/api/gdpr/consent", async (req, res) => {
    try {
      const consentData = {
        ...req.body,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      };
      const consent = await storage.createGdprConsent(consentData);
      res.json({ success: true, consent });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/gdpr/consent/:customerId", async (req, res) => {
    try {
      const consents = await storage.getGdprConsents(parseInt(req.params.customerId));
      res.json(consents);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/gdpr/consent/:customerId", async (req, res) => {
    try {
      const { consentType, consentGiven } = req.body;
      const consent = await storage.updateGdprConsent(
        parseInt(req.params.customerId),
        consentType,
        consentGiven
      );
      res.json({ success: true, consent });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GDPR Request management
  app.post("/api/gdpr/requests", async (req, res) => {
    try {
      const request = await storage.createGdprRequest(req.body);
      res.json({ success: true, request });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/gdpr/requests", async (req, res) => {
    try {
      const requests = await storage.getGdprRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/gdpr/requests/:id", async (req, res) => {
    try {
      const { status, adminNotes } = req.body;
      const request = await storage.updateGdprRequestStatus(
        parseInt(req.params.id),
        status,
        adminNotes
      );
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      res.json({ success: true, request });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GDPR Data Export (prawo do przenoszenia danych)
  app.get("/api/gdpr/export/:customerId", async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const customer = await storage.getCustomerById(customerId);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      const consents = await storage.getGdprConsents(customerId);
      const exportData = {
        customer,
        consents,
        exportDate: new Date().toISOString(),
        exportBy: "GDPR Data Export API"
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="gdpr_data_${customerId}.json"`);
      res.json(exportData);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Download endpoints
  app.get("/api/download/complete-app", (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', 'attachment; filename="stefano-complete-app.html"');
    res.send(`<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stefano Restaurant & Pub</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #1a1a1a; color: #fff; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; padding: 20px; background: #dc2626; margin-bottom: 20px; }
        .section { background: #2a2a2a; padding: 20px; margin: 10px 0; border-radius: 8px; }
        .avatar { font-size: 48px; margin: 10px; cursor: pointer; }
        .menu-item { padding: 10px; border: 1px solid #555; margin: 5px 0; }
        .order-form input, .order-form textarea { width: 100%; padding: 10px; margin: 5px 0; }
        .btn { background: #dc2626; color: white; padding: 10px 20px; border: none; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍕 Stefano Restaurant & Pub</h1>
            <p>Delicious Pizza & Family Chicken King</p>
        </div>
        
        <div class="section">
            <h2>Wybierz Awatar</h2>
            <div class="avatar" onclick="selectAvatar('👨')">👨 Mężczyzna</div>
            <div class="avatar" onclick="selectAvatar('👩')">👩 Kobieta</div>
        </div>
        
        <div class="section">
            <h2>Menu</h2>
            <div class="menu-item">Pizza Margherita - 45zł</div>
            <div class="menu-item">Burger Classic - 28zł</div>
            <div class="menu-item">Kurczak BBQ - 32zł</div>
        </div>
        
        <div class="section">
            <h2>Zamówienie</h2>
            <div class="order-form">
                <input type="text" id="name" placeholder="Imię i nazwisko" required>
                <input type="tel" id="phone" placeholder="Telefon" required>
                <input type="email" id="email" placeholder="Email">
                <textarea id="items" placeholder="Zamówienie"></textarea>
                <button class="btn" onclick="submitOrder()">Zamów</button>
            </div>
        </div>
    </div>
    
    <script>
        let selectedAvatar = '👨';
        
        function selectAvatar(avatar) {
            selectedAvatar = avatar;
            alert('Wybrano profil: ' + avatar);
        }
        
        function submitOrder() {
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const items = document.getElementById('items').value;
            
            if (!name || !phone || !items) {
                alert('Wypełnij wymagane pola');
                return;
            }
            
            const whatsappMsg = encodeURIComponent(
                'Zamówienie z aplikacji Stefano:\\n' +
                'Imię: ' + name + '\\n' +
                'Telefon: ' + phone + '\\n' +
                'Profil: ' + selectedAvatar + '\\n' +
                'Zamówienie: ' + items
            );
            
            window.open('https://wa.me/48517616618?text=' + whatsappMsg, '_blank');
        }
    </script>
</body>
</html>`);
  });

  // Test endpoints for system functionality
  app.post("/api/test/email", async (req, res) => {
    try {
      const { to, subject, content } = req.body;
      
      const result = await emailService.sendEmail({
        to: to || "test@stefanogroup.pl",
        subject: subject || "Test Email - Stefano System",
        html: `<h1>Test Email</h1><p>${content || 'This is a test email from Stefano system.'}</p>`,
        text: content || 'This is a test email from Stefano system.'
      });
      
      res.json({ 
        success: result.success, 
        message: result.success ? "Email sent successfully" : result.error,
        status: emailService.getStatus()
      });
    } catch (error) {
      console.error("Email test error:", error);
      res.status(500).json({ error: "Email sending failed" });
    }
  });

  app.post("/api/test/sms", async (req, res) => {
    try {
      const { phone, message } = req.body;
      
      const result = await smsService.sendSMS(
        phone || "500600700",
        message || "Test SMS from Stefano system"
      );
      
      res.json({ 
        success: result.success,
        message: result.success ? "SMS sent successfully" : result.error,
        status: smsService.getStatus()
      });
    } catch (error) {
      console.error("SMS test error:", error);
      res.status(500).json({ error: "SMS sending failed" });
    }
  });

  app.get("/api/customers/:id/score", authenticate, async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const customer = await storage.getCustomerById(customerId);
      
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      // Calculate customer score based on various factors
      let score = 0;
      
      // Order history (max 30 points)
      score += Math.min(customer.totalOrders * 3, 30);
      
      // Total spent (max 30 points) - 1 point per 100 PLN
      score += Math.min(Math.floor(customer.totalSpent / 10000), 30);
      
      // Loyalty points (max 20 points)
      score += Math.min(Math.floor(customer.loyaltyPoints / 50), 20);
      
      // Engagement (max 20 points)
      if (customer.newsletterConsent) score += 5;
      if (customer.marketingConsent) score += 5;
      if (customer.smsConsent) score += 5;
      if (customer.gdprConsent) score += 5;
      
      const segment = score >= 80 ? 'VIP' : score >= 60 ? 'Gold' : score >= 40 ? 'Silver' : score >= 20 ? 'Bronze' : 'New';
      
      res.json({
        customerId,
        score,
        segment,
        factors: {
          orderHistory: Math.min(customer.totalOrders * 3, 30),
          totalSpent: Math.min(Math.floor(customer.totalSpent / 10000), 30),
          loyaltyPoints: Math.min(Math.floor(customer.loyaltyPoints / 50), 20),
          engagement: (customer.newsletterConsent ? 5 : 0) + (customer.marketingConsent ? 5 : 0) + (customer.smsConsent ? 5 : 0) + (customer.gdprConsent ? 5 : 0)
        }
      });
    } catch (error) {
      console.error("Customer scoring error:", error);
      res.status(500).json({ error: "Failed to calculate customer score" });
    }
  });

  // Cost monitoring endpoint
  app.get("/api/admin/cost-monitoring", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const { aiCache, aiCostTracker } = await import("./ai-cache");
      
      const costData = {
        email: {
          ...emailService.getUsageStats(),
          provider: process.env.DEMO_MODE === 'true' ? 'Console (Demo)' : 'SendGrid',
          costSaved: "$19.95/miesiąc"
        },
        sms: {
          ...smsService.getUsageStats(),
          provider: process.env.DEMO_MODE === 'true' ? 'Console (Demo)' : 'Twilio',
          costSaved: "$50/miesiąc"
        },
        ai: {
          ...aiCache.getStats(),
          ...aiCostTracker.getStats(),
          costSaved: "$30/miesiąc"
        },
        database: {
          usage: "0.1 GB",
          limit: "0.5 GB",
          provider: "Neon Free Tier",
          costSaved: "$19/miesiąc"
        },
        demoMode: process.env.DEMO_MODE === 'true',
        totalMonthlySavings: 180,
        totalYearlySavings: 2160
      };
      
      res.json(costData);
    } catch (error) {
      console.error("Cost monitoring error:", error);
      res.status(500).json({ error: "Failed to fetch cost data" });
    }
  });

  // DeepSeek Chatbot endpoint
  app.post("/api/chatbot", async (req: Request, res: Response) => {
    try {
      const { message, history } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      const response = await deepseekService.getChatResponse(message, history || []);
      
      res.json({ 
        response,
        status: deepseekService.getStatus() 
      });
    } catch (error) {
      console.error("Chatbot error:", error);
      res.status(500).json({ 
        error: "Failed to get chatbot response",
        fallback: "Przepraszamy, wystąpił problem. Zapraszamy do kontaktu telefonicznego: 517-616-618" 
      });
    }
  });

  // Chatbot status endpoint
  app.get("/api/chatbot/status", (req: Request, res: Response) => {
    res.json(deepseekService.getStatus());
  });

  const httpServer = createServer(app);
  return httpServer;
}