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
    console.log('Starting comprehensive database seeding for Lawrei Beauty...');
    
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
    
    console.log('Inserting premium beauty services...');
    
    // Insert premium beauty services with realistic pricing
    const servicesData = [
      {
        name: "Signature Luxury Facial",
        description: "Our signature 90-minute facial treatment featuring premium skincare products, deep cleansing, exfoliation, and hydration. Includes a relaxing facial massage and custom mask application.",
        category: "facial" as const,
        duration: 90,
        price: 18000, // $180.00
        imageUrl: "/images/services/luxury-facial.jpg",
        isActive: true
      },
      {
        name: "Swedish Deep Tissue Massage",
        description: "Therapeutic 90-minute massage combining Swedish and deep tissue techniques for ultimate relaxation and muscle tension relief. Perfect for stress relief and muscle recovery.",
        category: "massage" as const,
        duration: 90,
        price: 15000, // $150.00
        imageUrl: "/images/services/deep-tissue-massage.jpg",
        isActive: true
      },
      {
        name: "Bridal Makeup & Hair",
        description: "Complete bridal transformation including professional makeup application, hair styling, and touch-up kit. Includes consultation and trial session.",
        category: "makeup" as const,
        duration: 180,
        price: 35000, // $350.00
        imageUrl: "/images/services/bridal-makeup.jpg",
        isActive: true
      },
      {
        name: "Gel Manicure & Pedicure",
        description: "Premium gel manicure and pedicure with luxury nail care products, cuticle treatment, and long-lasting color. Includes hand and foot massage.",
        category: "manicure" as const,
        duration: 75,
        price: 8500, // $85.00
        imageUrl: "/images/services/gel-manicure.jpg",
        isActive: true
      },
      {
        name: "Anti-Aging Treatment",
        description: "Advanced anti-aging facial treatment using premium serums, collagen masks, and specialized techniques to reduce fine lines and improve skin elasticity.",
        category: "facial" as const,
        duration: 120,
        price: 25000, // $250.00
        imageUrl: "/images/services/anti-aging.jpg",
        isActive: true
      },
      {
        name: "Hot Stone Massage",
        description: "Luxurious hot stone massage therapy using smooth, heated stones to relax muscles and provide deep therapeutic benefits. Perfect for stress relief.",
        category: "massage" as const,
        duration: 90,
        price: 18000, // $180.00
        imageUrl: "/images/services/hot-stone.jpg",
        isActive: true
      },
      {
        name: "Professional Hair Styling",
        description: "Expert hair styling for special occasions, including cutting, coloring, and styling. Consultation included to achieve your desired look.",
        category: "hair" as const,
        duration: 120,
        price: 12000, // $120.00
        imageUrl: "/images/services/hair-styling.jpg",
        isActive: true
      },
      {
        name: "Waxing Services",
        description: "Professional waxing services using high-quality wax for smooth, long-lasting results. Available for various body areas with soothing aftercare.",
        category: "waxing" as const,
        duration: 45,
        price: 6500, // $65.00
        imageUrl: "/images/services/waxing.jpg",
        isActive: true
      }
    ];
    
    const insertedServices = await db.insert(schema.services).values(servicesData).returning();
    console.log(`Inserted ${insertedServices.length} premium services`);
    
    console.log('Inserting professional portfolio items...');
    
    // Insert professional portfolio items with high-quality descriptions
    const portfolioData = [
      {
        title: "Bridal Makeup Transformation",
        description: "Complete bridal transformation featuring natural glam makeup with flawless foundation, defined eyes, and long-lasting lip color. Perfect for the most important day of your life.",
        imageUrl: "/images/portfolio/bridal-transformation.jpg",
        category: "makeup" as const,
        isActive: true
      },
      {
        title: "Luxury Facial Results",
        description: "Before and after results of our signature luxury facial treatment. Noticeable improvement in skin texture, tone, and overall radiance after just one session.",
        imageUrl: "/images/portfolio/facial-results.jpg",
        category: "facial" as const,
        isActive: true
      },
      {
        title: "Evening Glam Makeup",
        description: "Sophisticated evening makeup perfect for special events, galas, and red carpet appearances. Features dramatic eyes, contoured cheeks, and statement lips.",
        imageUrl: "/images/portfolio/evening-glam.jpg",
        category: "makeup" as const,
        isActive: true
      },
      {
        title: "Natural Day Look",
        description: "Effortless natural makeup for everyday wear that enhances your natural beauty. Light foundation, subtle eyeshadow, and natural lip color for a fresh, polished appearance.",
        imageUrl: "/images/portfolio/natural-day.jpg",
        category: "makeup" as const,
        isActive: true
      },
      {
        title: "Professional Photoshoot",
        description: "Professional makeup and styling for photography sessions, headshots, and modeling portfolios. Designed to look flawless both in person and on camera.",
        imageUrl: "/images/portfolio/photoshoot.jpg",
        category: "makeup" as const,
        isActive: true
      },
      {
        title: "Luxury Spa Treatment",
        description: "Complete spa experience including facial, massage, and body treatments. Premium products and techniques for ultimate relaxation and rejuvenation.",
        imageUrl: "/images/portfolio/spa-treatment.jpg",
        category: "facial" as const,
        isActive: true
      }
    ];
    
    const insertedPortfolio = await db.insert(schema.portfolio).values(portfolioData).returning();
    console.log(`Inserted ${insertedPortfolio.length} portfolio items`);
    
    console.log('Inserting sample customers...');
    
    // Insert realistic customer data
    const customersData = [
      {
        firstName: "Sarah",
        lastName: "Mitchell",
        email: "sarah.mitchell@example.com",
        phone: "+15551234567",
        dateOfBirth: new Date("1990-05-15"),
        preferences: JSON.stringify({ 
          skinType: "combination", 
          allergies: "none",
          preferredServices: ["facial", "makeup"],
          skinConcerns: ["aging", "uneven tone"]
        })
      },
      {
        firstName: "Emily",
        lastName: "Rodriguez",
        email: "emily.rodriguez@example.com",
        phone: "+15551234568",
        dateOfBirth: new Date("1988-12-03"),
        preferences: JSON.stringify({ 
          skinType: "dry", 
          allergies: "fragrance",
          preferredServices: ["massage", "facial"],
          skinConcerns: ["dryness", "sensitivity"]
        })
      },
      {
        firstName: "Jessica",
        lastName: "Thompson",
        email: "jessica.thompson@example.com",
        phone: "+15551234569",
        dateOfBirth: new Date("1992-08-22"),
        preferences: JSON.stringify({ 
          skinType: "oily", 
          allergies: "none",
          preferredServices: ["makeup", "waxing"],
          skinConcerns: ["acne", "oil control"]
        })
      },
      {
        firstName: "Amanda",
        lastName: "Chen",
        email: "amanda.chen@example.com",
        phone: "+15551234570",
        dateOfBirth: new Date("1985-03-10"),
        preferences: JSON.stringify({ 
          skinType: "normal", 
          allergies: "none",
          preferredServices: ["facial", "massage"],
          skinConcerns: ["anti-aging", "maintenance"]
        })
      },
      {
        firstName: "Rachel",
        lastName: "Williams",
        email: "rachel.williams@example.com",
        phone: "+15551234571",
        dateOfBirth: new Date("1995-11-18"),
        preferences: JSON.stringify({ 
          skinType: "combination", 
          allergies: "none",
          preferredServices: ["makeup", "hair"],
          skinConcerns: ["none", "maintenance"]
        })
      }
    ];
    
    const insertedCustomers = await db.insert(schema.customers).values(customersData).returning();
    console.log(`Inserted ${insertedCustomers.length} customers`);
    
    console.log('Inserting sample bookings...');
    
    // Insert realistic booking data
    const bookingsData = [
      {
        customerId: insertedCustomers[0].id,
        serviceId: insertedServices[0].id,
        appointmentDate: new Date("2024-03-15"),
        startTime: new Date("2024-03-15T10:00:00"),
        endTime: new Date("2024-03-15T11:30:00"),
        status: "confirmed" as const,
        notes: "First time client, prefers gentle products. Has combination skin with aging concerns.",
        totalPrice: 18000,
        paymentStatus: "paid" as const
      },
      {
        customerId: insertedCustomers[1].id,
        serviceId: insertedServices[1].id,
        appointmentDate: new Date("2024-03-16"),
        startTime: new Date("2024-03-16T14:00:00"),
        endTime: new Date("2024-03-16T15:30:00"),
        status: "pending" as const,
        notes: "Returning client, loves deep tissue massage. Prefers medium pressure.",
        totalPrice: 15000,
        paymentStatus: "pending" as const
      },
      {
        customerId: insertedCustomers[2].id,
        serviceId: insertedServices[2].id,
        appointmentDate: new Date("2024-03-20"),
        startTime: new Date("2024-03-20T09:00:00"),
        endTime: new Date("2024-03-20T12:00:00"),
        status: "confirmed" as const,
        notes: "Bridal makeup consultation and trial. Wedding is in June. Wants natural glam look.",
        totalPrice: 35000,
        paymentStatus: "paid" as const
      }
    ];
    
    const insertedBookings = await db.insert(schema.bookings).values(bookingsData).returning();
    console.log(`Inserted ${insertedBookings.length} bookings`);
    
    console.log('Inserting sample contacts...');
    
    // Insert realistic contact inquiries
    const contactsData = [
      {
        firstName: "Maria",
        lastName: "Garcia",
        email: "maria.garcia@example.com",
        phone: "+15551234572",
        inquiryType: "Bridal Makeup Inquiry",
        message: "I'm getting married in July and would like to discuss bridal makeup options. I'm looking for a natural, elegant look that will last throughout the ceremony and reception. Do you have availability for a consultation?",
        status: "new"
      },
      {
        firstName: "Sophie",
        lastName: "Anderson",
        email: "sophie.anderson@example.com",
        phone: "+15551234573",
        inquiryType: "Photoshoot Booking",
        message: "I have a professional photoshoot coming up for my business portfolio and need makeup services. The event is next month and I'd like something sophisticated and professional. What packages do you offer?",
        status: "new"
      },
      {
        firstName: "Lisa",
        lastName: "Johnson",
        email: "lisa.johnson@example.com",
        phone: "+15551234574",
        inquiryType: "Special Event",
        message: "I have a gala event coming up and need professional makeup services. The event is black tie and I'd like something sophisticated and glamorous. Do you have availability this weekend?",
        status: "read"
      }
    ];
    
    const insertedContacts = await db.insert(schema.contacts).values(contactsData).returning();
    console.log(`Inserted ${insertedContacts.length} contacts`);
    
    console.log('Inserting sample testimonials...');
    
    // Insert realistic testimonials
    const testimonialsData = [
      {
        customerId: insertedCustomers[0].id,
        serviceId: insertedServices[0].id,
        rating: 5,
        review: "Amazing luxury facial! My skin feels incredible and looks so much brighter. The esthetician was professional and used premium products. I can't wait to come back for my next treatment!",
        isApproved: true
      },
      {
        customerId: insertedCustomers[1].id,
        serviceId: insertedServices[1].id,
        rating: 5,
        review: "Best massage I've ever had! The deep tissue technique was perfect for my muscle tension. I left feeling completely relaxed and rejuvenated. Highly recommend!",
        isApproved: true
      },
      {
        customerId: insertedCustomers[2].id,
        serviceId: insertedServices[2].id,
        rating: 5,
        review: "My bridal makeup was absolutely perfect! The artist created exactly the look I wanted - natural but glamorous. It lasted all day and looked amazing in photos. Thank you for making me feel beautiful on my special day!",
        isApproved: true
      }
    ];
    
    const insertedTestimonials = await db.insert(schema.testimonials).values(testimonialsData).returning();
    console.log(`Inserted ${insertedTestimonials.length} testimonials`);
    
    console.log('Database seeding completed successfully!');
    console.log('\n📊 Professional Data Summary:');
    console.log(`   Premium Services: ${insertedServices.length} (priced $65-$350)`);
    console.log(`   Portfolio Items: ${insertedPortfolio.length} (professional quality)`);
    console.log(`   Customers: ${insertedCustomers.length} (with detailed preferences)`);
    console.log(`   Bookings: ${insertedBookings.length} (realistic appointments)`);
    console.log(`   Contact Inquiries: ${insertedContacts.length} (business inquiries)`);
    console.log(`   Testimonials: ${insertedTestimonials.length} (5-star reviews)`);
    console.log('\n🎯 Ready for multi-million dollar business operations!');
    
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
