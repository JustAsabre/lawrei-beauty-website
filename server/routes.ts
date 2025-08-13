import { Router } from 'express';
import { db } from './database';
import { services, customers, bookings, testimonials, portfolio, contacts } from '../shared/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { z } from 'zod';
import { AuthService } from './auth';

export function registerRoutes(app: any) {
  const router = Router();
  
  // Health check endpoint
  router.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Database connection test
  router.get('/db-test', async (req, res) => {
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

  // Services API - Real database
  router.get('/api/services', async (req, res) => {
    try {
      if (!db) {
        // Fallback to mock data if database not connected
        const mockServices = [
          {
            id: '1',
            name: 'Classic Facial',
            description: 'Deep cleansing facial with natural products',
            category: 'facial',
            duration: 60,
            price: 7500,
            imageUrl: '/images/facial.jpg',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '2',
            name: 'Swedish Massage',
            description: 'Relaxing full body massage',
            category: 'massage',
            duration: 90,
            price: 12000,
            imageUrl: '/images/massage.jpg',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '3',
            name: 'Gel Manicure',
            description: 'Long-lasting gel polish manicure',
            category: 'manicure',
            duration: 45,
            price: 4500,
            imageUrl: '/images/manicure.jpg',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        return res.json(mockServices);
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
      // Mock bookings data
      const mockBookings = [
        {
          id: 1,
          fullName: "Sarah Johnson",
          email: "sarah@example.com",
          phone: "(555) 123-4567",
          service: "Classic Facial",
          preferredDate: "2024-06-15",
          preferredTime: "9:00 AM",
          specialRequests: "Natural look with pink lips",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          fullName: "Emily Rodriguez",
          email: "emily@example.com",
          phone: "(555) 987-6543",
          service: "Swedish Massage",
          preferredDate: "2024-06-20",
          preferredTime: "2:00 PM",
          specialRequests: "Glamorous evening look",
          createdAt: new Date().toISOString()
        }
      ];
      res.json(mockBookings);
    } catch (error) {
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
      // Mock contacts data
      const mockContacts = [
        {
          id: 1,
          firstName: "Jessica",
          lastName: "Chen",
          email: "jessica@example.com",
          phone: "(555) 456-7890",
          inquiryType: "Bridal Makeup Inquiry",
          message: "I'm getting married in July and would like to discuss bridal makeup options.",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          firstName: "Maria",
          lastName: "Garcia",
          email: "maria@example.com",
          phone: "(555) 789-0123",
          inquiryType: "Special Event",
          message: "I have a gala event coming up and need professional makeup services.",
          createdAt: new Date().toISOString()
        }
      ];
      res.json(mockContacts);
    } catch (error) {
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

  // Portfolio API - Mock data
  router.get('/api/portfolio', async (req, res) => {
    try {
      const mockPortfolio = [
        {
          id: '1',
          title: 'Natural Glow Facial',
          description: 'Before and after of our signature facial treatment',
          imageUrl: '/images/portfolio/facial-before-after.jpg',
          category: 'facial',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Relaxation Massage',
          description: 'Swedish massage therapy session',
          imageUrl: '/images/portfolio/massage-session.jpg',
          category: 'massage',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      res.json(mockPortfolio);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
  });

  // Mount the router
  app.use(router);
  
  return app;
}
