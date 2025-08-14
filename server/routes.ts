import { Router } from 'express';
import { db } from './database';
import { services, customers, bookings, testimonials, portfolio, contacts } from '../shared/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { z } from 'zod';
import { AuthService } from './auth';
import { sql } from 'drizzle-orm';
import * as schema from '../shared/schema';

export function registerRoutes(app: any) {
  const router = Router();
  
  console.log("🔧 Setting up routes...");
  
  // Health check endpoint
  router.get('/health', (req, res) => {
    console.log("✅ Health check endpoint hit");
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Database connection test
  router.get('/db-test', async (req, res) => {
    console.log("✅ Database test endpoint hit");
    try {
      if (!db) {
        return res.json({ 
          status: 'Database connected (in-memory storage)', 
          timestamp: new Date().toISOString() 
        });
      }
      
      // Test real database connection
      const result = await db.select().from(services).limit(1);
      res.json({ 
        status: 'Database connected (Neon PostgreSQL)', 
        timestamp: new Date().toISOString(),
        tableCount: result.length
      });
    } catch (error) {
      console.error('Database test error:', error);
      res.status(500).json({ error: 'Database connection failed' });
    }
  });

  // Admin login - this must come before other routes to avoid conflicts
  router.post('/admin/login', async (req, res) => {
    console.log("✅ Admin login endpoint hit", { body: req.body });
    try {
      const { username, password } = req.body;
      
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Authenticate admin credentials
      const isValidAdmin = await AuthService.authenticateAdmin(username, password);
      
      if (isValidAdmin) {
        // Generate JWT token
        const token = AuthService.generateToken({
          userId: 'admin-1',
          username,
          role: 'admin'
        });
        
        res.json({ 
          token, 
          user: { username, role: "admin" },
          message: "Login successful" 
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Admin endpoint info (for debugging)
  router.get('/admin', (req, res) => {
    console.log("✅ Admin info endpoint hit");
    res.json({ 
      message: "Admin endpoint is working", 
      availableEndpoints: ["POST /admin/login"],
      timestamp: new Date().toISOString() 
    });
  });

  // Admin statistics
  router.get('/admin/stats', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      // Get real counts from database
      const bookings = await db.select().from(schema.bookings);
      const contacts = await db.select().from(schema.contacts);
      const portfolio = await db.select().from(schema.portfolio);
      const customers = await db.select().from(schema.customers);

      res.json({
        totalBookings: bookings.length,
        newMessages: contacts.length,
        portfolioItems: portfolio.length,
        totalClients: customers.length
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
  });

  // Services API - Real database
  router.get('/api/services', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      // Query real database
      const dbServices = await db.select().from(services).where(eq(services.isActive, true));
      res.json(dbServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ error: 'Failed to fetch services' });
    }
  });

  // Bookings API - Mock data for now
  router.post('/api/bookings', async (req, res) => {
    try {
      const { customerId, serviceId, appointmentDate, startTime, endTime, notes, totalPrice } = req.body;
      
      // Mock booking creation
      const newBooking = {
        id: Date.now().toString(),
        customerId,
        serviceId,
        appointmentDate: new Date(appointmentDate),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        notes,
        totalPrice,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      res.status(201).json(newBooking);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create booking' });
    }
  });

  // Get all bookings (for admin)
  router.get('/api/bookings', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      // Query real database with customer and service information
      const dbBookings = await db
        .select({
          id: bookings.id,
          customerId: bookings.customerId,
          serviceId: bookings.serviceId,
          appointmentDate: bookings.appointmentDate,
          startTime: bookings.startTime,
          endTime: bookings.endTime,
          status: bookings.status,
          totalPrice: bookings.totalPrice,
          paymentStatus: bookings.paymentStatus,
          createdAt: bookings.createdAt,
          customerFirstName: customers.firstName,
          customerLastName: customers.lastName,
          customerEmail: customers.email,
          customerPhone: customers.phone,
          serviceName: services.name,
          serviceCategory: services.category
        })
        .from(bookings)
        .leftJoin(customers, eq(bookings.customerId, customers.id))
        .leftJoin(services, eq(bookings.serviceId, services.id))
        .orderBy(bookings.createdAt);

      res.json(dbBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  });

  // Contacts API - Mock data for now
  router.post('/api/contacts', async (req, res) => {
    try {
      const { firstName, lastName, email, phone, inquiryType, message } = req.body;
      
      // Mock contact creation
      const newContact = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        phone,
        inquiryType,
        message,
        createdAt: new Date()
      };

      res.status(201).json(newContact);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create contact' });
    }
  });

  // Get all contacts (for admin)
  router.get('/contacts', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      // Query real database
      const dbContacts = await db
        .select()
        .from(contacts)
        .orderBy(contacts.createdAt);

      res.json(dbContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  });

  // Testimonials API - Mock data
  router.get('/api/testimonials', async (req, res) => {
    try {
      const mockTestimonials = [
        {
          id: '1',
          customerId: 'customer-1',
          serviceId: '1',
          rating: 5,
          review: 'Amazing facial! My skin feels incredible.',
          isApproved: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          customerId: 'customer-2',
          serviceId: '2',
          rating: 5,
          review: 'Best massage I\'ve ever had. Very relaxing!',
          isApproved: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      res.json(mockTestimonials);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
  });

  // Portfolio API - Real database
  router.get('/api/portfolio', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      // Query real database
      const dbPortfolio = await db
        .select()
        .from(portfolio)
        .where(eq(portfolio.isActive, true))
        .orderBy(portfolio.createdAt);

      res.json(dbPortfolio);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
  });

  // Get all portfolio items (for admin)
  router.get('/admin/portfolio', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      // Query real database
      const dbPortfolio = await db
        .select()
        .from(portfolio)
        .orderBy(portfolio.createdAt);

      res.json(dbPortfolio);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
  });

  // Mount the router
  console.log("🔧 Mounting router to app...");
  app.use(router);
  console.log("✅ Router mounted successfully");
  
  return app;
}
