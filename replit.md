# MindElevate - Career Counseling Platform

## Overview

MindElevate is a professional career counseling and mentorship platform for Dr. Gladis Diana Sivakumar, featuring 16 years of counseling expertise. The platform serves students, parents, professionals, and educational institutions by providing career guidance, admission counseling, workshops, and professional development services.

The application is a full-stack web platform with a public-facing website showcasing services and testimonials, a booking system with integrated payments, and a secure admin dashboard for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching

**UI Framework:**
- Tailwind CSS for utility-first styling
- Shadcn/ui component library (New York style variant) for consistent, accessible UI components
- Radix UI primitives for headless accessible components
- Custom design system following brand guidelines (Plus Jakarta Sans for headings, Inter for body text)

**State Management:**
- TanStack Query handles all server-side state with automatic caching and invalidation
- Local React state for UI interactions
- Session-based authentication state managed through custom `useAuth` hook

**Routing Strategy:**
- Public routes: Home, Booking Page
- Protected admin routes: Dashboard, Services Management, Testimonials Management, Blog Posts Management, Contacts Management, Payments Management
- 404 handling for undefined routes

### Backend Architecture

**Server Framework:**
- Express.js server handling API requests and serving the built frontend
- Session-based authentication using express-session with in-memory storage (MemoryStore)
- CORS and security middleware for production deployment

**API Design:**
- RESTful API endpoints under `/api` prefix
- Public endpoints: `/api/services`, `/api/testimonials`, `/api/blog-posts`, `/api/contact`
- Protected admin endpoints: `/api/admin/*` requiring session authentication
- Payment integration endpoint: `/api/payments/create-order`

**Authentication & Authorization:**
- Session-based authentication with HttpOnly cookies
- Password hashing using bcrypt (10 rounds)
- Admin-only routes protected by `requireAuth` middleware
- Session data includes admin ID and email

**Data Layer:**
- Storage interface abstraction (`IStorage`) for database operations
- Drizzle ORM for type-safe database queries
- Schema validation using Zod with `drizzle-zod` integration

### Data Storage

**Database Technology:**
- PostgreSQL as the primary database
- Neon serverless PostgreSQL adapter (`@neondatabase/serverless`) for cloud deployment
- Database connection via `DATABASE_URL` environment variable

**Schema Design:**

**Admins Table:**
- ID (UUID primary key)
- Email (unique, not null)
- Password (bcrypt hashed, not null)

**Services Table:**
- ID (UUID primary key)
- Title, Description, Image URL
- Features (array of text)
- Created timestamp

**Testimonials Table:**
- ID (UUID primary key)
- Name, Role, Quote, Avatar URL
- Created timestamp

**Blog Posts Table:**
- ID (UUID primary key)
- Title, Excerpt, Content, Category
- Date, Read Time
- Created timestamp

**Contacts Table:**
- ID (UUID primary key)
- Name, Email, Phone (optional), Message
- Created timestamp

**Payments Table:**
- ID (UUID primary key)
- Razorpay Order ID, Payment ID, Signature
- Amount, Currency, Status
- Customer details (name, email, phone, service, session type)
- Preferred date, additional message
- Created timestamp

**Migration Strategy:**
- Drizzle Kit for schema migrations
- Migration files stored in `/migrations` directory
- Push-based deployment via `npm run db:push`

### External Dependencies

**Payment Gateway:**
- Razorpay integration for payment processing
- Environment variables: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- Order creation, payment verification, and signature validation
- Webhook support for payment status updates

**Third-Party Services:**
- Neon Database (serverless PostgreSQL hosting)
- Environment configuration via `.env` file (not committed to repository)

**Development Tools:**
- Replit-specific plugins for development banner, error overlay, and cartographer
- TSX for TypeScript execution in development
- ESBuild for production server bundling

**Session Management:**
- `express-session` with configurable store
- `memorystore` for development (should be replaced with persistent store for production)
- Session secret via `SESSION_SECRET` environment variable

**Security Considerations:**
- HTTPS-only cookies in production (`secure: true`)
- HttpOnly cookies to prevent XSS attacks
- CSRF protection through session validation
- Input validation using Zod schemas
- Raw body parsing for webhook signature verification