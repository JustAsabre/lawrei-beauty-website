import { Router } from 'express';
import { db } from './database';
import { services, customers, bookings, testimonials, portfolio, contacts, siteContent } from '../shared/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { z } from 'zod';
import { AuthService } from './auth';
import { sql } from 'drizzle-orm';
import * as schema from '../shared/schema';

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

  // Admin endpoint info
  router.get('/admin', (req, res) => {
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

  // Customers API - Create new customer
  router.post('/api/customers', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const { firstName, lastName, email, phone, dateOfBirth, preferences } = req.body;
      
      if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: 'First name, last name, and email are required' });
      }

      // Check if customer already exists
      const existingCustomer = await db
        .select()
        .from(customers)
        .where(eq(customers.email, email))
        .limit(1);

      if (existingCustomer.length > 0) {
        // Return existing customer
        return res.json(existingCustomer[0]);
      }

      // Create new customer
      const newCustomer = await db.insert(customers).values({
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        preferences: preferences ? JSON.stringify(preferences) : undefined
      }).returning();

      res.status(201).json(newCustomer[0]);
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ error: 'Failed to create customer' });
    }
  });

  // Get all customers (for admin)
  router.get('/api/customers', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const dbCustomers = await db
        .select()
        .from(customers)
        .where(eq(customers.isActive, true))
        .orderBy(customers.createdAt);

      res.json(dbCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ error: 'Failed to fetch customers' });
    }
  });

  // Bookings API - Real database integration
  router.post('/api/bookings', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const { customerId, serviceId, appointmentDate, startTime, endTime, notes, totalPrice } = req.body;
      
      if (!customerId || !serviceId || !appointmentDate || !startTime || !totalPrice) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create real booking in database
      const newBooking = await db.insert(bookings).values({
        customerId,
        serviceId,
        appointmentDate: new Date(appointmentDate),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        notes,
        totalPrice,
        status: 'pending',
        paymentStatus: 'pending'
      }).returning();

      res.status(201).json(newBooking[0]);
    } catch (error) {
      console.error('Error creating booking:', error);
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

  // Update booking status
  router.put('/api/bookings/:id', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const updatedBooking = await db
        .update(schema.bookings)
        .set({ status })
        .where(eq(schema.bookings.id, id))
        .returning();

      if (updatedBooking.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.json(updatedBooking[0]);
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ error: 'Failed to update booking' });
    }
  });

  // Delete booking
  router.delete('/api/bookings/:id', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const { id } = req.params;

      const deletedBooking = await db
        .delete(schema.bookings)
        .where(eq(schema.bookings.id, id))
        .returning();

      if (deletedBooking.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ error: 'Failed to delete booking' });
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

  // Update contact status
  router.put('/contacts/:id', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const updatedContact = await db
        .update(schema.contacts)
        .set({ status })
        .where(eq(schema.contacts.id, id))
        .returning();

      if (updatedContact.length === 0) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      res.json(updatedContact[0]);
    } catch (error) {
      console.error('Error updating contact:', error);
      res.status(500).json({ error: 'Failed to update contact' });
    }
  });

  // Delete contact
  router.delete('/contacts/:id', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const { id } = req.params;

      const deletedContact = await db
        .delete(schema.contacts)
        .where(eq(schema.contacts.id, id))
        .returning();

      if (deletedContact.length === 0) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
      console.error('Error deleting contact:', error);
      res.status(500).json({ error: 'Failed to delete contact' });
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
        .from(schema.portfolio)
        .orderBy(schema.portfolio.createdAt);

      res.json(dbPortfolio);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
  });

  // Add new portfolio item
  router.post('/admin/portfolio', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const { title, description, imageUrl, category, isActive } = req.body;
      
      if (!title || !description || !imageUrl || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newPortfolioItem = await db.insert(schema.portfolio).values({
        title,
        description,
        imageUrl,
        category,
        isActive: isActive ?? true
      }).returning();

      res.status(201).json(newPortfolioItem[0]);
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      res.status(500).json({ error: 'Failed to add portfolio item' });
    }
  });

  // Update portfolio item
  router.put('/admin/portfolio/:id', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const { id } = req.params;
      const updates = req.body;

      const updatedItem = await db
        .update(schema.portfolio)
        .set(updates)
        .where(eq(schema.portfolio.id, id))
        .returning();

      if (updatedItem.length === 0) {
        return res.status(404).json({ error: 'Portfolio item not found' });
      }

      res.json(updatedItem[0]);
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      res.status(500).json({ error: 'Failed to update portfolio item' });
    }
  });

  // Delete portfolio item
  router.delete('/admin/portfolio/:id', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const { id } = req.params;

      const deletedItem = await db
        .delete(schema.portfolio)
        .where(eq(schema.portfolio.id, id))
        .returning();

      if (deletedItem.length === 0) {
        return res.status(404).json({ error: 'Portfolio item not found' });
      }

      res.json({ message: 'Portfolio item deleted successfully' });
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      res.status(500).json({ error: 'Failed to delete portfolio item' });
    }
  });

  // Services Management APIs
  router.get('/admin/services', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const dbServices = await db
        .select()
        .from(schema.services)
        .orderBy(schema.services.createdAt);

      res.json(dbServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ error: 'Failed to fetch services' });
    }
  });

  router.post('/admin/services', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const { name, description, category, duration, price, imageUrl, isActive } = req.body;
      
      if (!name || !description || !category || !duration || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newService = await db.insert(schema.services).values({
        name,
        description,
        category,
        duration: parseInt(duration),
        price: Math.round(parseFloat(price) * 100), // Convert to cents
        imageUrl,
        isActive: isActive ?? true
      }).returning();

      res.status(201).json(newService[0]);
    } catch (error) {
      console.error('Error adding service:', error);
      res.status(500).json({ error: 'Failed to add service' });
    }
  });

  router.put('/admin/services/:id', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const { id } = req.params;
      const updates = { ...req.body };
      
      // Convert price to cents if provided
      if (updates.price) {
        updates.price = Math.round(parseFloat(updates.price) * 100);
      }
      
      // Convert duration to integer if provided
      if (updates.duration) {
        updates.duration = parseInt(updates.duration);
      }

      const updatedService = await db
        .update(schema.services)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(schema.services.id, id))
        .returning();

      if (updatedService.length === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }

      res.json(updatedService[0]);
    } catch (error) {
      console.error('Error updating service:', error);
      res.status(500).json({ error: 'Failed to update service' });
    }
  });

  router.delete('/admin/services/:id', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const { id } = req.params;

      const deletedService = await db
        .delete(schema.services)
        .where(eq(schema.services.id, id))
        .returning();

      if (deletedService.length === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }

      res.json({ message: 'Service deleted successfully' });
    } catch (error) {
      console.error('Error deleting service:', error);
      res.status(500).json({ error: 'Failed to delete service' });
    }
  });

  // Testimonials Management APIs
  router.get('/admin/testimonials', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const dbTestimonials = await db
        .select({
          id: testimonials.id,
          rating: testimonials.rating,
          review: testimonials.review,
          isApproved: testimonials.isApproved,
          createdAt: testimonials.createdAt,
          customerFirstName: customers.firstName,
          customerLastName: customers.lastName,
          customerEmail: customers.email,
          serviceName: services.name,
        })
        .from(testimonials)
        .leftJoin(customers, eq(testimonials.customerId, customers.id))
        .leftJoin(services, eq(testimonials.serviceId, services.id))
        .orderBy(testimonials.createdAt);

      res.json(dbTestimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
  });

  router.post('/admin/testimonials', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const { customerId, serviceId, rating, review, isApproved } = req.body;
      
      if (!customerId || !rating || !review) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newTestimonial = await db.insert(schema.testimonials).values({
        customerId,
        serviceId,
        rating: parseInt(rating),
        review,
        isApproved: isApproved ?? false
      }).returning();

      res.status(201).json(newTestimonial[0]);
    } catch (error) {
      console.error('Error adding testimonial:', error);
      res.status(500).json({ error: 'Failed to add testimonial' });
    }
  });

  router.put('/admin/testimonials/:id', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const { id } = req.params;
      const updates = { ...req.body };
      
      // Convert rating to integer if provided
      if (updates.rating) {
        updates.rating = parseInt(updates.rating);
      }

      const updatedTestimonial = await db
        .update(schema.testimonials)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(schema.testimonials.id, id))
        .returning();

      if (updatedTestimonial.length === 0) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }

      res.json(updatedTestimonial[0]);
    } catch (error) {
      console.error('Error updating testimonial:', error);
      res.status(500).json({ error: 'Failed to update testimonial' });
    }
  });

  router.delete('/admin/testimonials/:id', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const { id } = req.params;

      const deletedTestimonial = await db
        .delete(schema.testimonials)
        .where(eq(schema.testimonials.id, id))
        .returning();

      if (deletedTestimonial.length === 0) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }

      res.json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      res.status(500).json({ error: 'Failed to delete testimonial' });
    }
  });

  // Site Content Management APIs
  router.get('/admin/site-content', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const content = await db
        .select()
        .from(schema.siteContent)
        .orderBy(schema.siteContent.section);

      res.json(content);
    } catch (error) {
      console.error('Error fetching site content:', error);
      res.status(500).json({ error: 'Failed to fetch site content' });
    }
  });

  router.get('/admin/site-content/:section', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const { section } = req.params;
      const content = await db
        .select()
        .from(schema.siteContent)
        .where(eq(schema.siteContent.section, section))
        .limit(1);

      if (content.length === 0) {
        return res.status(404).json({ error: 'Content section not found' });
      }

      res.json(content[0]);
    } catch (error) {
      console.error('Error fetching site content:', error);
      res.status(500).json({ error: 'Failed to fetch site content' });
    }
  });

  router.post('/admin/site-content', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const { section, title, subtitle, content, imageUrl, settings, isActive } = req.body;
      
      if (!section) {
        return res.status(400).json({ error: 'Section is required' });
      }

      const newContent = await db.insert(schema.siteContent).values({
        section,
        title,
        subtitle,
        content,
        imageUrl,
        settings,
        isActive: isActive ?? true
      }).returning();

      res.status(201).json(newContent[0]);
    } catch (error) {
      console.error('Error adding site content:', error);
      res.status(500).json({ error: 'Failed to add site content' });
    }
  });

  router.put('/admin/site-content/:section', async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({ error: 'Database not connected' });
      }

      const { section } = req.params;
      const updates = { ...req.body };
      delete updates.section; // Don't allow changing the section key

      const updatedContent = await db
        .update(schema.siteContent)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(schema.siteContent.section, section))
        .returning();

      if (updatedContent.length === 0) {
        return res.status(404).json({ error: 'Content section not found' });
      }

      res.json(updatedContent[0]);
    } catch (error) {
      console.error('Error updating site content:', error);
      res.status(500).json({ error: 'Failed to update site content' });
    }
  });

  // Image Upload API (using base64 for simplicity)
  router.post('/admin/upload-image', async (req, res) => {
    try {
      const { imageData, fileName, folder } = req.body;
      
      if (!imageData) {
        return res.status(400).json({ error: 'Image data is required' });
      }

      // For now, we'll return a placeholder URL
      // In production, you'd upload to a service like Cloudinary, AWS S3, etc.
      const imageUrl = `https://images.unsplash.com/photo-${Date.now()}?w=800&h=600&fit=crop`;
      
      res.json({ 
        imageUrl,
        message: 'Image uploaded successfully'
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });

  // Mount the router
  app.use(router);
  
  return app;
}
