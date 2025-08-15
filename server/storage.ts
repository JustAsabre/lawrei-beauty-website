import { bookings, contacts, customers, type Booking, type InsertBooking, type Contact, type InsertContact, type Customer } from "@shared/schema";

export interface IStorage {
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer>;
  
  createBooking(booking: InsertBooking): Promise<Booking>;
  getAllBookings(): Promise<Booking[]>;
  
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
}

export class MemStorage implements IStorage {
  private customers: Map<string, Customer>;
  private bookings: Map<string, Booking>;
  private contacts: Map<string, Contact>;
  private currentCustomerId: number;
  private currentBookingId: number;
  private currentContactId: number;

  constructor() {
    this.customers = new Map();
    this.bookings = new Map();
    this.contacts = new Map();
    this.currentCustomerId = 1;
    this.currentBookingId = 1;
    this.currentContactId = 1;
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    return Array.from(this.customers.values()).find(
      (customer) => customer.email === email,
    );
  }

  async createCustomer(insertCustomer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const id = `customer-${this.currentCustomerId++}`;
    const customer: Customer = { 
      ...insertCustomer, 
      id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.customers.set(id, customer);
    return customer;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = `booking-${this.currentBookingId++}`;
    const booking: Booking = {
      ...insertBooking,
      id,
      notes: insertBooking.notes || null,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = `contact-${this.currentContactId++}`;
    const contact: Contact = {
      ...insertContact,
      id,
      phone: insertContact.phone || null,
      status: 'new', // Add default status
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }
}

export const storage = new MemStorage();
