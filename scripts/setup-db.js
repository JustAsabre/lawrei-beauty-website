const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function setupDatabase() {
  try {
    console.log('Connecting to Neon database...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    const sql = neon(process.env.DATABASE_URL);
    
    // Test connection
    const result = await sql`SELECT version()`;
    console.log('Database connected successfully!');
    console.log('Database version:', result[0].version);
    
    console.log('Creating database tables...');
    
    // Create enums first
    await sql`
      DO $$ BEGIN
        CREATE TYPE service_category AS ENUM ('facial', 'massage', 'manicure', 'pedicure', 'hair', 'makeup', 'waxing', 'other');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    
    await sql`
      DO $$ BEGIN
        CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    
    await sql`
      DO $$ BEGIN
        CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    
    // Create services table
    await sql`
      CREATE TABLE IF NOT EXISTS services (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category service_category NOT NULL,
        duration INTEGER NOT NULL,
        price INTEGER NOT NULL,
        image_url TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Create customers table
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        date_of_birth TIMESTAMP,
        preferences TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Create bookings table
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID REFERENCES customers(id) NOT NULL,
        service_id UUID REFERENCES services(id) NOT NULL,
        appointment_date TIMESTAMP NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        status booking_status DEFAULT 'pending',
        notes TEXT,
        total_price INTEGER NOT NULL,
        payment_status payment_status DEFAULT 'pending',
        calendar_event_id TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Create testimonials table
    await sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID REFERENCES customers(id) NOT NULL,
        service_id UUID REFERENCES services(id),
        rating INTEGER NOT NULL,
        review TEXT NOT NULL,
        is_approved BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Create portfolio table
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT NOT NULL,
        category service_category,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Create contacts table
    await sql`
      CREATE TABLE IF NOT EXISTS contacts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        inquiry_type TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'new',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Create payments table
    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID REFERENCES customers(id) NOT NULL,
        booking_id UUID REFERENCES bookings(id) NOT NULL,
        amount INTEGER NOT NULL,
        currency TEXT DEFAULT 'usd',
        status TEXT DEFAULT 'pending',
        payment_method TEXT,
        transaction_id TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Create site_content table (this was missing!)
    await sql`
      CREATE TABLE IF NOT EXISTS site_content (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        section TEXT NOT NULL UNIQUE,
        title TEXT,
        subtitle TEXT,
        content TEXT,
        image_url TEXT,
        settings TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    console.log('All tables created successfully!');
    
    // Seed initial site content
    console.log('Seeding initial site content...');
    
    const initialContent = [
      {
        section: 'hero',
        title: 'Transform Your Beauty',
        subtitle: 'Professional makeup artistry for your most special moments',
        content: 'From bridal glamour to everyday elegance, let\'s create your perfect look.',
        image_url: '',
        is_active: true
      },
      {
        section: 'about',
        title: 'About Lawrei',
        subtitle: 'Professional Makeup Artist & Beauty Expert',
        content: 'With years of experience in the beauty industry, I specialize in creating stunning looks for every occasion. From bridal makeup to special events, I\'m here to help you look and feel your absolute best.',
        image_url: '',
        is_active: true
      },
      {
        section: 'contact_info',
        title: 'LawreiBeauty Studio',
        subtitle: '+1 (555) 123-4567',
        content: 'hello@lawreibeauty.com',
        image_url: '123 Beauty Street, Suite 100, City, State 12345',
        is_active: true
      },
      {
        section: 'footer',
        title: '© 2024 LawreiBeauty. All rights reserved.',
        subtitle: 'Professional makeup artistry for every occasion',
        content: 'https://lawreibeauty.com',
        image_url: '',
        is_active: true
      }
    ];
    
    for (const content of initialContent) {
      try {
        await sql`
          INSERT INTO site_content (section, title, subtitle, content, image_url, is_active)
          VALUES (${content.section}, ${content.title}, ${content.subtitle}, ${content.content}, ${content.image_url}, ${content.is_active})
          ON CONFLICT (section) DO UPDATE SET
            title = EXCLUDED.title,
            subtitle = EXCLUDED.subtitle,
            content = EXCLUDED.content,
            image_url = EXCLUDED.image_url,
            is_active = EXCLUDED.is_active,
            updated_at = NOW()
        `;
      } catch (error) {
        console.log(`Content for section '${content.section}' already exists or error:`, error.message);
      }
    }
    
    console.log('Initial site content seeded successfully!');
    
    console.log('Database setup completed successfully!');
    console.log('All tables and initial data have been created.');
    
  } catch (error) {
    console.error('Database setup failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

setupDatabase();
