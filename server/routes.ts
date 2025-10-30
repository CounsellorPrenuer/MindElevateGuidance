import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import session from "express-session";
import memorystore from "memorystore";
import crypto from "crypto";
import {
  insertAdminSchema,
  insertServiceSchema,
  insertTestimonialSchema,
  insertBlogPostSchema,
  insertContactSchema,
  insertPaymentSchema,
} from "@shared/schema";

const MemoryStore = memorystore(session);

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

declare module 'express-session' {
  interface SessionData {
    adminId?: string;
    adminEmail?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'mindelevate-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({
        checkPeriod: 86400000, // 24 hours
      }),
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
    })
  );

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.adminId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };

  // Initialize default admin if doesn't exist
  (async () => {
    const existingAdmin = await storage.getAdminByEmail('admin@mindElevate.com');
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('mind123', 10);
      await storage.createAdmin({
        email: 'admin@mindElevate.com',
        password: hashedPassword,
      });
    }
  })();

  // Admin auth routes
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const admin = await storage.getAdminByEmail(email);
      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      req.session.adminId = admin.id;
      req.session.adminEmail = admin.email;

      res.json({ 
        success: true, 
        admin: { id: admin.id, email: admin.email } 
      });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });

  app.post('/api/admin/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.json({ success: true });
    });
  });

  app.get('/api/admin/session', (req, res) => {
    if (req.session.adminId) {
      res.json({ 
        authenticated: true, 
        admin: { 
          id: req.session.adminId, 
          email: req.session.adminEmail 
        } 
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Public routes - Services
  app.get('/api/services', async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch services' });
    }
  });

  // Admin routes - Services
  app.post('/api/admin/services', requireAuth, async (req, res) => {
    try {
      const validated = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validated);
      res.json(service);
    } catch (error) {
      res.status(400).json({ error: 'Invalid service data' });
    }
  });

  app.put('/api/admin/services/:id', requireAuth, async (req, res) => {
    try {
      const updated = await storage.updateService(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: 'Update failed' });
    }
  });

  app.delete('/api/admin/services/:id', requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteService(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Service not found' });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Delete failed' });
    }
  });

  // Public routes - Testimonials
  app.get('/api/testimonials', async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
  });

  // Admin routes - Testimonials
  app.post('/api/admin/testimonials', requireAuth, async (req, res) => {
    try {
      const validated = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validated);
      res.json(testimonial);
    } catch (error) {
      res.status(400).json({ error: 'Invalid testimonial data' });
    }
  });

  app.put('/api/admin/testimonials/:id', requireAuth, async (req, res) => {
    try {
      const updated = await storage.updateTestimonial(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: 'Update failed' });
    }
  });

  app.delete('/api/admin/testimonials/:id', requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteTestimonial(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Delete failed' });
    }
  });

  // Public routes - Blog posts
  app.get('/api/blog-posts', async (req, res) => {
    try {
      const blogPosts = await storage.getAllBlogPosts();
      res.json(blogPosts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  });

  // Admin routes - Blog posts
  app.post('/api/admin/blog-posts', requireAuth, async (req, res) => {
    try {
      const validated = insertBlogPostSchema.parse(req.body);
      const blogPost = await storage.createBlogPost(validated);
      res.json(blogPost);
    } catch (error) {
      res.status(400).json({ error: 'Invalid blog post data' });
    }
  });

  app.put('/api/admin/blog-posts/:id', requireAuth, async (req, res) => {
    try {
      const updated = await storage.updateBlogPost(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: 'Update failed' });
    }
  });

  app.delete('/api/admin/blog-posts/:id', requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteBlogPost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Delete failed' });
    }
  });

  // Contact form submission
  app.post('/api/contact', async (req, res) => {
    try {
      const validated = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validated);
      res.json({ success: true, id: contact.id });
    } catch (error) {
      res.status(400).json({ error: 'Invalid contact data' });
    }
  });

  // Admin routes - View contacts
  app.get('/api/admin/contacts', requireAuth, async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  });

  app.delete('/api/admin/contacts/:id', requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteContact(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Delete failed' });
    }
  });

  // Razorpay payment routes
  app.post('/api/payments/create-order', async (req, res) => {
    try {
      const { amount, customerName, customerEmail, customerPhone } = req.body;

      if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        return res.status(500).json({ 
          error: 'Payment gateway not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.' 
        });
      }

      const Razorpay = (await import('razorpay')).default;
      const razorpay = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
      });

      const order = await razorpay.orders.create({
        amount: amount * 100,
        currency: 'INR',
        receipt: `order_${Date.now()}`,
      });

      const payment = await storage.createPayment({
        razorpayOrderId: order.id,
        amount,
        currency: 'INR',
        status: 'created',
        customerName,
        customerEmail,
        customerPhone,
      });

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentId: payment.id,
      });
    } catch (error: any) {
      console.error('Create order error:', error);
      res.status(500).json({ error: error.message || 'Failed to create order' });
    }
  });

  app.post('/api/payments/verify', async (req, res) => {
    try {
      const { orderId, paymentId, signature } = req.body;

      if (!RAZORPAY_KEY_SECRET) {
        return res.status(500).json({ error: 'Payment verification not configured' });
      }

      const body = orderId + '|' + paymentId;
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      if (expectedSignature === signature) {
        const payment = await storage.getPaymentByOrderId(orderId);
        if (payment) {
          await storage.updatePayment(payment.id, {
            status: 'success',
            razorpayPaymentId: paymentId,
          });
        }
        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'Invalid signature' });
      }
    } catch (error: any) {
      console.error('Verify payment error:', error);
      res.status(500).json({ error: error.message || 'Verification failed' });
    }
  });

  // Admin routes - Payments
  app.get('/api/admin/payments', requireAuth, async (req, res) => {
    try {
      const payments = await storage.getAllPayments();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch payments' });
    }
  });

  app.post('/api/payments', async (req, res) => {
    try {
      const validated = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(validated);
      res.json(payment);
    } catch (error) {
      res.status(400).json({ error: 'Invalid payment data' });
    }
  });

  app.put('/api/payments/:id', async (req, res) => {
    try {
      const updated = await storage.updatePayment(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: 'Update failed' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
