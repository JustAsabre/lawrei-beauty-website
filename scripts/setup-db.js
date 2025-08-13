import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from '../shared/schema.js';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function setupDatabase() {
  try {
    console.log('🚀 Setting up LawreiBeauty database...');
    
    // Insert sample services
    const sampleServices = [
      {
        name: 'Classic Facial',
        description: 'Deep cleansing facial with natural products',
        category: 'facial',
        duration: 60,
        price: 7500, // $75.00
        imageUrl: '/images/facial.jpg'
      },
      {
        name: 'Swedish Massage',
        description: 'Relaxing full body massage',
        category: 'massage',
        duration: 90,
        price: 12000, // $120.00
        imageUrl: '/images/massage.jpg'
      },
      {
        name: 'Gel Manicure',
        description: 'Long-lasting gel polish manicure',
        category: 'manicure',
        duration: 45,
        price: 4500, // $45.00
        imageUrl: '/images/manicure.jpg'
      },
      {
        name: 'Brazilian Wax',
        description: 'Professional waxing service',
        category: 'waxing',
        duration: 30,
        price: 5500, // $55.00
        imageUrl: '/images/waxing.jpg'
      }
    ];

    console.log('📝 Inserting sample services...');
    for (const service of sampleServices) {
      await db.insert(schema.services).values(service);
    }

    // Insert sample testimonials
    const sampleTestimonials = [
      {
        customerId: '00000000-0000-0000-0000-000000000001',
        serviceId: '00000000-0000-0000-0000-000000000001',
        rating: 5,
        review: 'Amazing facial! My skin feels incredible.',
        isApproved: true
      },
      {
        customerId: '00000000-0000-0000-0000-000000000002',
        serviceId: '00000000-0000-0000-0000-000000000002',
        rating: 5,
        review: 'Best massage I\'ve ever had. Very relaxing!',
        isApproved: true
      }
    ];

    console.log('💬 Inserting sample testimonials...');
    for (const testimonial of sampleTestimonials) {
      await db.insert(schema.testimonials).values(testimonial);
    }

    // Insert sample portfolio items
    const samplePortfolio = [
      {
        title: 'Natural Glow Facial',
        description: 'Before and after of our signature facial treatment',
        imageUrl: '/images/portfolio/facial-before-after.jpg',
        category: 'facial'
      },
      {
        title: 'Relaxation Massage',
        description: 'Swedish massage therapy session',
        imageUrl: '/images/portfolio/massage-session.jpg',
        category: 'massage'
      }
    ];

    console.log('🖼️ Inserting sample portfolio items...');
    for (const item of samplePortfolio) {
      await db.insert(schema.portfolio).values(item);
    }

    console.log('✅ Database setup completed successfully!');
    console.log('📊 Sample data has been inserted.');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
