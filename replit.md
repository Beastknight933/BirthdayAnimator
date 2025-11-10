# Birthday Wishing App

## Overview

A web application for creating personalized, animated birthday greetings with photo collections. Users upload multiple photos along with recipient details (name and age), receive a shareable link, and recipients view an immersive, celebratory experience with animations, photo carousels, and confetti effects. The application emphasizes emotional impact and mobile-first design.

## Recent Changes (November 10, 2025)

- Implemented full backend with PostgreSQL database for greeting persistence
- Added file upload handling with Multer for photo storage
- Created API endpoints for greeting creation and retrieval
- Connected frontend to backend with real data fetching
- Removed unused authentication scaffolding (users table) to simplify schema
- Successfully tested complete end-to-end flow with Playwright

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling:**
- React 18 with TypeScript for type safety and modern component patterns
- Vite as the build tool for fast development and optimized production builds
- Wouter for lightweight client-side routing (create page, view page, 404)
- TanStack Query (React Query) for server state management and API interactions

**UI Component System:**
- shadcn/ui components built on Radix UI primitives for accessible, customizable components
- Tailwind CSS with custom configuration for styling and responsive design
- Custom color system using CSS variables (HSL format) for theming
- Typography: Playfair Display (display font) and Poppins (body font) via Google Fonts
- Custom animations: confetti, float, bounce-slow, fade-in, slide-up, scale-in

**Key Components:**
- `CreateGreeting`: Form-based interface for uploading photos and entering recipient details with real-time mutation feedback
- `ViewGreeting`: Full-screen celebration experience with intro animation, photo carousel, and confetti
- `PhotoCarousel`: Auto-playing image slideshow with manual navigation controls and smooth transitions
- `ConfettiEffect`: Canvas-based particle animation system with 150 colorful particles

**Design Principles:**
- Mobile-optimized, celebration-first experience
- Dual experience model: creation flow vs. viewing flow
- Photo-centric design with generous animations
- Reference-based approach inspired by JibJab and Instagram Stories

### Backend Architecture

**Server Framework:**
- Express.js for HTTP server and API routing
- TypeScript with ES modules for consistency with frontend
- Database-backed persistence (no in-memory storage)

**File Upload Handling:**
- Multer middleware for multipart form data processing
- Local file storage in `uploads/` directory served as static files
- Image validation (JPEG, PNG, GIF, WebP) with 10MB file size limit
- Unique filename generation using nanoid and timestamps
- Files persisted at `/uploads/${nanoid}-${timestamp}.ext`

**API Design:**
- RESTful endpoints for greeting creation and retrieval
- POST `/api/greetings`: Create greeting with photo upload (minimum 2, maximum 12 photos required)
  - Accepts multipart/form-data with photos array, recipientName, and recipientAge
  - Returns greeting object with unique ID and photo paths
- GET `/api/greetings/:id`: Retrieve greeting by ID
  - Returns greeting with all metadata or 404 if not found
- Static file serving for uploaded images via `/uploads` route

**Session Management:**
- Express session middleware with PostgreSQL session store (connect-pg-simple)
- Configured for production-ready session handling

**Development Features:**
- Vite middleware integration for HMR in development
- Request logging with duration tracking for API endpoints
- Error handling with structured JSON responses
- Validation using Zod schemas for type-safe data handling

### Database Layer

**ORM & Schema:**
- Drizzle ORM for type-safe database operations
- PostgreSQL as the primary database (via Neon serverless)
- WebSocket-based connection pooling for serverless environments

**Schema Design:**

*Greetings Table:*
- id: varchar (UUID, primary key, auto-generated)
- recipientName: text (required)
- recipientAge: integer (required)
- photos: text[] array (stores file paths, required)

**Data Access Pattern:**
- Repository pattern via `DatabaseStorage` class implementing `IStorage` interface
- Separation of concerns: storage layer abstracted from route handlers
- Type-safe operations using Drizzle's query builder and Zod validation schemas
- All CRUD operations use async/await with proper error handling

**Migration Strategy:**
- Drizzle Kit for schema migrations
- Configuration pointing to `./migrations` output directory
- Push-based workflow via `db:push` script for schema synchronization

### External Dependencies

**Database Service:**
- Neon Serverless PostgreSQL (via `@neondatabase/serverless`)
- Connection via `DATABASE_URL` environment variable
- WebSocket constructor override for Node.js compatibility

**File Upload:**
- Multer for handling multipart/form-data
- nanoid for unique ID generation
- Path utilities for file extension handling

**UI Component Libraries:**
- Radix UI primitives (20+ component packages) for accessible foundation
- shadcn/ui component patterns
- Lucide React for icons (Gift, Upload, Sparkles, Heart, Star, Cake, etc.)

**Form Management:**
- React Hook Form for form state and validation
- Zod for schema validation
- @hookform/resolvers for Zod integration

**Build & Development Tools:**
- esbuild for server bundling in production
- tsx for TypeScript execution in development
- Replit-specific plugins (cartographer, dev-banner, runtime-error-modal) for platform integration

**Styling:**
- Tailwind CSS with PostCSS
- class-variance-authority for component variant management
- clsx and tailwind-merge for conditional class composition

**State Management:**
- TanStack Query v5 for server state (data fetching, caching, mutations)
- React hooks for local component state

## Application Flow

### Creation Flow
1. User navigates to homepage (/)
2. Uploads 2-12 photos via drag-drop or file picker
3. Enters recipient name and age
4. Clicks "Generate Birthday Wish"
5. Form data + photos sent to POST `/api/greetings`
6. Server saves photos to disk, stores greeting in database
7. Unique shareable link displayed with copy functionality
8. User shares link with birthday recipient

### Viewing Flow
1. Recipient opens shared link (/wish/:id)
2. Frontend fetches greeting via GET `/api/greetings/:id`
3. 4-second intro animation displays with confetti
4. Transitions to photo carousel with recipient name and age overlay
5. Auto-playing slideshow with manual navigation controls
6. Music toggle and "Create Your Own" CTA available

## Testing

- End-to-end tests implemented with Playwright
- Test coverage includes: photo upload, form submission, link generation, greeting display, carousel navigation
- All interactive elements tagged with data-testid attributes for reliable testing
- Test confirms complete flow from creation to viewing experience
