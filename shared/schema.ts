import { pgTable, text, timestamp, integer, boolean, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enums
export const serviceCategoryEnum = pgEnum('service_category', [
  'facial',
  'massage',
  'manicure',
  'pedicure',
  'hair',
  'makeup',
  'waxing',
  'other'
]);

export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'confirmed',
  'completed',
  'cancelled'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'paid',
  'refunded'
]);

// Services table
export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: serviceCategoryEnum('category').notNull(),
  duration: integer('duration').notNull(), // in minutes
  price: integer('price').notNull(), // in cents
  imageUrl: text('image_url'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Customers table
export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  dateOfBirth: timestamp('date_of_birth'),
  preferences: text('preferences'), // JSON string
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Bookings table
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').references(() => customers.id).notNull(),
  serviceId: uuid('service_id').references(() => services.id).notNull(),
  appointmentDate: timestamp('appointment_date').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  status: bookingStatusEnum('status').default('pending'),
  notes: text('notes'),
  totalPrice: integer('total_price').notNull(), // in cents
  paymentStatus: paymentStatusEnum('payment_status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Testimonials table
export const testimonials = pgTable('testimonials', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').references(() => customers.id).notNull(),
  serviceId: uuid('service_id').references(() => services.id),
  rating: integer('rating').notNull(), // 1-5 stars
  review: text('review').notNull(),
  isApproved: boolean('is_approved').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Gallery/Portfolio table
export const portfolio = pgTable('portfolio', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url').notNull(),
  category: serviceCategoryEnum('category'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Contacts table
export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  inquiryType: text('inquiry_type').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const servicesRelations = relations(services, ({ many }) => ({
  bookings: many(bookings),
  testimonials: many(testimonials),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  bookings: many(bookings),
  testimonials: many(testimonials),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  customer: one(customers, {
    fields: [bookings.customerId],
    references: [customers.id],
  }),
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  customer: one(customers, {
    fields: [testimonials.customerId],
    references: [customers.id],
  }),
  service: one(services, {
    fields: [testimonials.serviceId],
    references: [services.id],
  }),
}));

// Zod schemas for form validation
export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  paymentStatus: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

// TypeScript types
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Booking = typeof bookings.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Portfolio = typeof portfolio.$inferSelect;
