# Replit.md - Lawrei's Makeup Artist Website

## Overview

This is a full-stack makeup artist portfolio and booking website built with modern web technologies. The application features a sleek, luxury-themed frontend showcasing a makeup artist's services, portfolio, and booking capabilities, backed by a REST API for handling bookings and contact inquiries.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom luxury theme (gold/black color palette)
- **UI Components**: Radix UI components via shadcn/ui
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Style**: RESTful endpoints
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Storage Interface**: Abstract storage layer with in-memory implementation for development
- **Validation**: Zod schemas for request/response validation

### Key Components

#### Frontend Components
- **Navigation**: Fixed glassmorphism navigation with smooth scrolling
- **Hero Section**: Full-screen landing with animated elements
- **Services Overview**: Card-based service display
- **Portfolio Showcase**: Filterable image gallery
- **Booking Section**: Multi-step booking form with service selection
- **About Section**: Artist bio with statistics and certifications
- **Testimonials**: Customer review carousel
- **Contact Section**: Contact form with inquiry categorization
- **Footer**: Simple branding and copyright

#### Backend Components
- **Routes**: RESTful API endpoints for bookings and contacts
- **Storage**: Abstract interface with pluggable implementations
- **Schema**: Shared Drizzle schemas with Zod validation
- **Server**: Express server with middleware for logging and error handling

#### Shared Components
- **Schema Definitions**: Database tables and validation schemas
- **TypeScript Types**: Shared type definitions across frontend/backend

## Data Flow

### Booking Flow
1. User fills out booking form with service selection, personal details, and preferences
2. Frontend validates data using Zod schema
3. API request sent to `/api/bookings` POST endpoint
4. Backend validates and stores booking data
5. Success response triggers user notification

### Contact Flow
1. User submits contact form with inquiry type and message
2. Frontend validation ensures required fields
3. API request sent to `/api/contacts` POST endpoint
4. Backend processes and stores contact inquiry
5. Confirmation message displayed to user

### Data Persistence
- Development: In-memory storage for rapid prototyping
- Production: PostgreSQL via Drizzle ORM with Neon Database

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React, React DOM
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **UI Components**: Comprehensive Radix UI component suite
- **Forms**: React Hook Form, Hookform Resolvers
- **Validation**: Zod for schema validation
- **HTTP Client**: Built-in fetch with TanStack React Query
- **Routing**: Wouter for lightweight routing
- **Icons**: Lucide React icon library
- **Date Handling**: date-fns utility library

### Backend Dependencies
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Database**: Drizzle ORM with Neon Database connector
- **Validation**: Zod for request validation
- **Development**: tsx for TypeScript execution

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Full TypeScript support across stack
- **Database**: Drizzle Kit for migrations and schema management
- **Styling**: Tailwind CSS with shadcn/ui configuration

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles Express server to `dist/index.js`
3. **Assets**: Static files served from build output

### Environment Configuration
- **Database**: Requires `DATABASE_URL` environment variable
- **Development**: Hot reload with Vite middleware
- **Production**: Optimized builds with static asset serving

### Hosting Considerations
- Frontend can be deployed to any static hosting service
- Backend requires Node.js runtime environment
- Database hosted on Neon (serverless PostgreSQL)
- Environment variables needed for database connection

### Database Management
- Schema defined in `shared/schema.ts`
- Migrations managed via Drizzle Kit
- Development uses `db:push` for rapid schema updates
- Production deployments should use proper migration strategy

The application is designed for easy deployment on platforms like Replit, Vercel, or similar services that support full-stack JavaScript applications.