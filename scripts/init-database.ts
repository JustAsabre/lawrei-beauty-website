import { db } from '../server/database';
import * as schema from '../shared/schema';
import dotenv from 'dotenv';

dotenv.config();

async function initDatabase() {
  try {
    console.log('Initializing database...');

    // Clear all existing data
    console.log('Clearing existing data...');
    await db.delete(schema.payments);
    await db.delete(schema.bookings);
    await db.delete(schema.testimonials);
    await db.delete(schema.contacts);
    await db.delete(schema.portfolio);
    await db.delete(schema.services);
    await db.delete(schema.customers);
    await db.delete(schema.siteContent);

    // Initialize services
    console.log('Creating initial services...');
    const services = [
      {
        name: 'Bridal Makeup',
        description: 'Professional bridal makeup service for your special day',
        category: 'makeup',
        duration: 120,
        price: 15000, // $150.00
        isActive: true
      },
      {
        name: 'Special Event Makeup',
        description: 'Glamorous makeup for special occasions',
        category: 'makeup',
        duration: 60,
        price: 10000, // $100.00
        isActive: true
      }
    ];

    for (const service of services) {
      await db.insert(schema.services).values(service);
    }

    // Initialize site content
    console.log('Initializing site content...');
    const initialContent = [
      {
        section: 'hero',
        title: 'Welcome to LawreiBeauty',
        subtitle: 'Professional Makeup Artistry',
        content: 'Transform your look with our expert beauty services',
        imageUrl: '',
        isActive: true
      },
      {
        section: 'about',
        title: 'About Us',
        subtitle: 'Your Beauty Journey Starts Here',
        content: 'Professional makeup services for all occasions',
        imageUrl: '',
        isActive: true
      },
      {
        section: 'contact_info',
        title: 'Contact Us',
        subtitle: 'Get in Touch',
        content: 'Book your appointment today',
        imageUrl: '',
        isActive: true
      },
      {
        section: 'footer',
        title: '© 2024 LawreiBeauty',
        subtitle: 'All rights reserved',
        content: '',
        imageUrl: '',
        isActive: true
      }
    ];

    for (const content of initialContent) {
      await db.insert(schema.siteContent).values(content);
    }

    // Initialize portfolio
    console.log('Creating initial portfolio items...');
    const portfolioItems = [
      {
        title: 'Bridal Makeup',
        description: 'Natural and elegant bridal makeup',
        imageUrl: 'https://example.com/bridal1.jpg',
        category: 'makeup',
        isActive: true
      },
      {
        title: 'Special Event',
        description: 'Glamorous makeup for special occasions',
        imageUrl: 'https://example.com/event1.jpg',
        category: 'makeup',
        isActive: true
      }
    ];

    for (const item of portfolioItems) {
      await db.insert(schema.portfolio).values(item);
    }

    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();