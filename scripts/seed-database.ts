import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema.ts';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check for required environment variable
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.delete(schema.services);
    await db.delete(schema.portfolio);
    await db.delete(schema.testimonials);
    await db.delete(schema.bookings);
    await db.delete(schema.contacts);
    await db.delete(schema.customers);

    // Insert services
    console.log('💆‍♀️ Inserting services...');
    const servicesData = [
      {
        name: 'Classic Facial',
        description: 'Deep cleansing facial with natural products for all skin types',
        category: 'facial',
        duration: 60,
        price: 7500,
        imageUrl: '/images/services/facial.jpg',
        isActive: true
      },
      {
        name: 'Swedish Massage',
        description: 'Relaxing full body massage therapy for stress relief',
        category: 'massage',
        duration: 90,
        price: 12000,
        imageUrl: '/images/services/massage.jpg',
        isActive: true
      },
      {
        name: 'Gel Manicure',
        description: 'Long-lasting gel polish manicure with nail care',
        category: 'manicure',
        duration: 45,
        price: 4500,
        imageUrl: '/images/services/manicure.jpg',
        isActive: true
      },
      {
        name: 'Bridal Makeup',
        description: 'Professional bridal makeup for your special day',
        category: 'makeup',
        duration: 120,
        price: 15000,
        imageUrl: '/images/services/bridal-makeup.jpg',
        isActive: true
      }
    ];

    const insertedServices = await db.insert(schema.services).values(servicesData).returning();
    console.log(`✅ Inserted ${insertedServices.length} services`);

    // Insert portfolio items
    console.log('🖼️ Inserting portfolio items...');
    const portfolioData = [
      {
        title: 'Natural Glow Facial',
        description: 'Before and after of our signature facial treatment',
        imageUrl: '/images/portfolio/facial-before-after.jpg',
        category: 'facial',
        isActive: true
      },
      {
        title: 'Relaxation Massage',
        description: 'Swedish massage therapy session',
        imageUrl: '/images/portfolio/massage-session.jpg',
        category: 'massage',
        isActive: true
      },
      {
        title: 'Bridal Makeup',
        description: 'Elegant bridal makeup transformation',
        imageUrl: '/images/portfolio/bridal-makeup.jpg',
        category: 'makeup',
        isActive: true
      }
    ];

    const insertedPortfolio = await db.insert(schema.portfolio).values(portfolioData).returning();
    console.log(`✅ Inserted ${insertedPortfolio.length} portfolio items`);

    // Insert sample customers
    console.log('👥 Inserting sample customers...');
    const customersData = [
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah@example.com',
        phone: '(555) 123-4567',
        isActive: true
      },
      {
        firstName: 'Emily',
        lastName: 'Rodriguez',
        email: 'emily@example.com',
        phone: '(555) 987-6543',
        isActive: true
      }
    ];

    const insertedCustomers = await db.insert(schema.customers).values(customersData).returning();
    console.log(`✅ Inserted ${insertedCustomers.length} customers`);

    // Insert sample bookings
    console.log('📅 Inserting sample bookings...');
    const bookingsData = [
      {
        customerId: insertedCustomers[0].id,
        serviceId: insertedServices[0].id,
        appointmentDate: new Date('2024-06-15'),
        startTime: new Date('2024-06-15T09:00:00'),
        endTime: new Date('2024-06-15T10:00:00'),
        status: 'pending',
        totalPrice: 7500,
        paymentStatus: 'pending'
      },
      {
        customerId: insertedCustomers[1].id,
        serviceId: insertedServices[1].id,
        appointmentDate: new Date('2024-06-20'),
        startTime: new Date('2024-06-20T14:00:00'),
        endTime: new Date('2024-06-20T15:30:00'),
        status: 'confirmed',
        totalPrice: 12000,
        paymentStatus: 'paid'
      }
    ];

    const insertedBookings = await db.insert(schema.bookings).values(bookingsData).returning();
    console.log(`✅ Inserted ${insertedBookings.length} bookings`);

    // Insert sample contacts
    console.log('💬 Inserting sample contacts...');
    const contactsData = [
      {
        firstName: 'Jessica',
        lastName: 'Chen',
        email: 'jessica@example.com',
        phone: '(555) 456-7890',
        inquiryType: 'Bridal Makeup Inquiry',
        message: 'I\'m getting married in July and would like to discuss bridal makeup options. I\'m looking for a natural, elegant look that will last throughout the ceremony and reception.'
      },
      {
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria@example.com',
        phone: '(555) 789-0123',
        inquiryType: 'Special Event',
        message: 'I have a gala event coming up and need professional makeup services. The event is black tie and I\'d like something sophisticated and glamorous.'
      }
    ];

    const insertedContacts = await db.insert(schema.contacts).values(contactsData).returning();
    console.log(`✅ Inserted ${insertedContacts.length} contacts`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Services: ${insertedServices.length}`);
    console.log(`   Portfolio: ${insertedPortfolio.length}`);
    console.log(`   Customers: ${insertedCustomers.length}`);
    console.log(`   Bookings: ${insertedBookings.length}`);
    console.log(`   Contacts: ${insertedContacts.length}`);

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
