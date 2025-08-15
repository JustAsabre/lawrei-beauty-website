import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema';

// Check for required environment variable
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Create database connection
    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql, { schema });
    
    console.log('Clearing existing data...');
    
    // Clear existing data (in reverse order of dependencies)
    await db.delete(schema.testimonials);
    await db.delete(schema.bookings);
    await db.delete(schema.contacts);
    await db.delete(schema.portfolio);
    await db.delete(schema.customers);
    await db.delete(schema.services);
    
    console.log('Inserting services...');
    
    // Insert services
    const servicesData = [
      {
        name: "Classic Facial",
        description: "Deep cleansing facial treatment for all skin types",
        category: "facial" as const,
        duration: 60,
        price: 7500, // $75.00
        imageUrl: "/images/services/facial.jpg"
      },
      {
        name: "Swedish Massage",
        description: "Relaxing full-body massage for stress relief",
        category: "massage" as const,
        duration: 90,
        price: 12000, // $120.00
        imageUrl: "/images/services/massage.jpg"
      },
      {
        name: "Gel Manicure",
        description: "Long-lasting gel polish manicure",
        category: "manicure" as const,
        duration: 45,
        price: 4500, // $45.00
        imageUrl: "/images/services/manicure.jpg"
      },
      {
        name: "Bridal Makeup",
        description: "Professional makeup for your special day",
        category: "makeup" as const,
        duration: 120,
        price: 15000, // $150.00
        imageUrl: "/images/services/bridal.jpg"
      },
      {
        name: "Waxing Service",
        description: "Professional hair removal waxing",
        category: "waxing" as const,
        duration: 30,
        price: 3500, // $35.00
        imageUrl: "/images/services/waxing.jpg"
      }
    ];
    
    const insertedServices = await db.insert(schema.services).values(servicesData).returning();
    console.log(`Inserted ${insertedServices.length} services`);
    
    console.log('Inserting portfolio items...');
    
    // Insert portfolio items
    const portfolioData = [
      {
        title: "Bridal Makeup Look",
        description: "Elegant bridal makeup with natural finish",
        imageUrl: "/images/portfolio/bridal-1.jpg",
        category: "makeup" as const
      },
      {
        title: "Evening Glam",
        description: "Sophisticated evening makeup for special events",
        imageUrl: "/images/portfolio/evening-1.jpg",
        category: "makeup" as const
      },
      {
        title: "Natural Day Look",
        description: "Fresh and natural makeup for everyday wear",
        imageUrl: "/images/portfolio/natural-1.jpg",
        category: "makeup" as const
      },
      {
        title: "Photoshoot Makeup",
        description: "Professional makeup for photography sessions",
        imageUrl: "/images/portfolio/photo-1.jpg",
        category: "makeup" as const
      },
      {
        title: "Special Event Makeup",
        description: "Bold and creative makeup for parties and events",
        imageUrl: "/images/portfolio/event-1.jpg",
        category: "makeup" as const
      }
    ];
    
    const insertedPortfolio = await db.insert(schema.portfolio).values(portfolioData).returning();
    console.log(`Inserted ${insertedPortfolio.length} portfolio items`);
    
    console.log('Inserting sample customers...');
    
    // Insert sample customers
    const customersData = [
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@example.com",
        phone: "+15551234567",
        dateOfBirth: new Date("1990-05-15"),
        preferences: JSON.stringify({ skinType: "combination", allergies: "none" })
      },
      {
        firstName: "Emily",
        lastName: "Davis",
        email: "emily.davis@example.com",
        phone: "+15551234568",
        dateOfBirth: new Date("1988-12-03"),
        preferences: JSON.stringify({ skinType: "dry", allergies: "fragrance" })
      },
      {
        firstName: "Jessica",
        lastName: "Wilson",
        email: "jessica.wilson@example.com",
        phone: "+15551234569",
        dateOfBirth: new Date("1992-08-22"),
        preferences: JSON.stringify({ skinType: "oily", allergies: "none" })
      }
    ];
    
    const insertedCustomers = await db.insert(schema.customers).values(customersData).returning();
    console.log(`Inserted ${insertedCustomers.length} customers`);
    
    console.log('Inserting sample bookings...');
    
    // Insert sample bookings
    const bookingsData = [
      {
        customerId: insertedCustomers[0].id,
        serviceId: insertedServices[0].id,
        appointmentDate: new Date("2024-02-15"),
        startTime: new Date("2024-02-15T10:00:00"),
        endTime: new Date("2024-02-15T11:00:00"),
        status: "confirmed" as const,
        notes: "First time client, prefers gentle products",
        totalPrice: 7500,
        paymentStatus: "paid" as const
      },
      {
        customerId: insertedCustomers[1].id,
        serviceId: insertedServices[1].id,
        appointmentDate: new Date("2024-02-16"),
        startTime: new Date("2024-02-16T14:00:00"),
        endTime: new Date("2024-02-16T15:30:00"),
        status: "pending" as const,
        notes: "Stress relief massage requested",
        totalPrice: 12000,
        paymentStatus: "pending" as const
      }
    ];
    
    const insertedBookings = await db.insert(schema.bookings).values(bookingsData).returning();
    console.log(`Inserted ${insertedBookings.length} bookings`);
    
    console.log('Inserting sample contacts...');
    
    // Insert sample contacts
    const contactsData = [
      {
        firstName: "Amanda",
        lastName: "Brown",
        email: "amanda.brown@example.com",
        phone: "+15551234570",
        inquiryType: "Bridal Makeup Inquiry",
        message: "I'm getting married in June and would like to discuss bridal makeup options. Do you have availability for a consultation?"
      },
      {
        firstName: "Rachel",
        lastName: "Miller",
        email: "rachel.miller@example.com",
        phone: "+15551234571",
        inquiryType: "Photoshoot Booking",
        message: "I have a professional photoshoot coming up and need makeup services. What packages do you offer?"
      }
    ];
    
    const insertedContacts = await db.insert(schema.contacts).values(contactsData).returning();
    console.log(`Inserted ${insertedContacts.length} contacts`);
    
    console.log('Database seeding completed successfully!');
    console.log('\nSummary:');
    console.log(`   Services: ${insertedServices.length}`);
    console.log(`   Portfolio: ${insertedPortfolio.length}`);
    console.log(`   Customers: ${insertedCustomers.length}`);
    console.log(`   Bookings: ${insertedBookings.length}`);
    console.log(`   Contacts: ${insertedContacts.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
