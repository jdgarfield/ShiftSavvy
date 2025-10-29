# ShiftSavvy - Tips & Earnings Tracker

## Overview

ShiftSavvy is a mobile-first Progressive Web App (PWA) designed for service industry workers to track tips, wages, and earnings across multiple jobs. The application enables users to log shifts with detailed financial data (hourly wages, cash/credit tips, tip-outs), visualize earnings through charts and reports, and export data for tax filing purposes.

**Core Features:**
- Multi-job shift tracking with detailed earnings breakdown
- Visual analytics with charts and statistical summaries
- Tax estimation capabilities (federal, state, local)
- CSV/PDF export for tax filing
- User profile management with image upload (base64, max 75KB)
  - Collapsible profile editor with summary view
  - Permanent username (cannot be changed once set)
  - Editable personal information (first name, last name, zip code)
  - Integrated language selection (English/Spanish)
  - Integrated tax settings (state and local tax rate)
- Multiple employer tracking (business name, address, contact info)
- Offline-capable PWA with service worker
- Internationalization support (i18n)
- Theme switching (light/dark mode via header toggle)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18+ with TypeScript
- Vite for build tooling and development server
- Wouter for client-side routing (lightweight alternative to React Router)

**UI Component System:**
- shadcn/ui component library (Radix UI primitives + Tailwind CSS)
- Custom "new-york" style theme with shadcn/ui
- Extensive use of Radix UI primitives for accessibility (@radix-ui/react-*)

**State Management:**
- TanStack Query (React Query) v5 for server state management
- React Hook Form with Zod validation for form state
- React Context for theme and sidebar state

**Styling Approach:**
- Tailwind CSS with custom design tokens
- CSS variables for theming (HSL color space)
- Custom spacing system (2, 4, 6, 8, 12, 16, 20, 24 units)
- Typography: Inter (data/numbers) + Poppins (headings)
- Mobile-first responsive design with breakpoint at 768px

**Design System:**
- Hybrid approach: Apple HIG (minimalism) + Material Design 3 (interactivity)
- Focus on clarity, efficiency, and one-handed mobile use
- Custom elevation system (hover-elevate, active-elevate-2 classes)
- Tabular numbers for financial data alignment

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- ESM module system (type: "module")
- Custom middleware for request logging and JSON body parsing

**API Structure:**
- RESTful endpoints under `/api/*` prefix
- Resource-based routing: `/api/jobs`, `/api/shifts`, `/api/employers`, `/api/auth/user`
- Profile management: `/api/auth/user/profile` (PATCH) - update user profile with validation
- Employer CRUD: `/api/employers` (GET, POST), `/api/employers/:id` (PATCH, DELETE)
- Authentication middleware (`isAuthenticated`) protecting all data endpoints

**Data Layer:**
- Storage abstraction via `IStorage` interface
- `DatabaseStorage` implementation for database operations
- Separation of concerns: routes → storage → database

### Database & ORM

**Database:**
- PostgreSQL (configured via Neon serverless)
- Connection pooling with `@neondatabase/serverless`

**ORM:**
- Drizzle ORM with schema-first approach
- Type-safe queries with full TypeScript integration
- Schema located in `shared/schema.ts` for client/server sharing

**Schema Design:**
- `users` - User profiles with tax settings (state, localTaxRate), profile data (username, zipCode, profileImageUrl)
- `jobs` - Multiple workplaces per user (name, description, color, hourly wage)
- `shifts` - Individual work shifts linked to jobs (date, hours, tips, tip-outs)
- `employers` - Employer information (businessName, address, phone, managerName, managerPhone)
- `sessions` - Session storage for Replit Auth (sid, sess, expire)

**Key Design Decisions:**
- Decimal type for financial precision (hourlyWage, tips, taxRate)
- Cascade deletion (jobs → shifts deleted on job deletion)
- UUID primary keys via `gen_random_uuid()`
- Timestamps for created/updated tracking

### Authentication & Session Management

**Authentication Provider:**
- Replit Auth (OpenID Connect)
- OAuth flow with passport.js strategy
- Session-based authentication (not JWT)

**Session Storage:**
- PostgreSQL-backed sessions via `connect-pg-simple`
- 7-day session TTL
- HTTP-only cookies with secure flag in production

**User Flow:**
- Unauthenticated users redirected to landing page
- `/api/login` initiates OAuth flow
- `/api/logout` destroys session
- All authenticated routes protected by `isAuthenticated` middleware

### Progressive Web App (PWA)

**Service Worker:**
- Cache-first strategy for static assets
- Network-first for API calls (excluded from caching)
- Fallback to root on offline navigation failures
- Cache version: `shiftsavvy-v1`

**Manifest:**
- Standalone display mode
- Portrait-primary orientation
- App designed for mobile service workers
- 192x192 and 512x512 icon sizes

### Internationalization (i18n)

**Implementation:**
- i18next with react-i18next
- Translation files embedded in `lib/i18n.ts`
- User language preference stored in database
- Runtime language switching capability

**Supported Languages:**
- English (en) - default
- Extensible structure for additional languages

### Data Validation

**Approach:**
- Zod schemas for runtime validation
- `drizzle-zod` integration for schema-to-validator conversion
- Shared validation between client and server via `@shared/schema`

**Key Schemas:**
- `insertJobSchema` - Job creation/update validation
- `insertShiftSchema` - Shift creation/update validation
- `updateProfileSchema` - Profile update validation (firstName, lastName, username, zipCode, profileImageUrl)
- `insertEmployerSchema` - Employer creation/update validation (businessName required, min 1 char)
- Type inference from schemas for TypeScript safety

### Error Handling

**Client-Side:**
- Toast notifications for user-facing errors
- Unauthorized errors (401) trigger re-login flow
- Loading states during async operations

**Server-Side:**
- Try-catch blocks in route handlers
- Generic error responses with appropriate status codes
- Request/response logging middleware

## External Dependencies

### Third-Party Services

**Replit Authentication:**
- OAuth 2.0 / OpenID Connect provider
- Issuer URL: `https://replit.com/oidc` (or custom via env)
- Client credentials via `process.env.REPL_ID` and `process.env.SESSION_SECRET`

**Neon Database:**
- Serverless PostgreSQL hosting
- WebSocket connections for edge compatibility
- Connection string via `process.env.DATABASE_URL`

### Core Libraries

**Data Visualization:**
- recharts - Chart components (BarChart, XAxis, YAxis, etc.)
- Used in reports page for earnings visualization

**Date Handling:**
- date-fns - Date formatting and manipulation
- Used throughout for shift date display and period calculations

**Form Management:**
- react-hook-form - Form state and validation
- @hookform/resolvers - Zod resolver integration

**CSV Export:**
- papaparse - CSV parsing and generation (types: @types/papaparse)

**Utilities:**
- nanoid - Unique ID generation
- clsx + tailwind-merge - Conditional className composition
- class-variance-authority (cva) - Component variant management
- memoizee - Function memoization for OIDC config caching

### Development Tools

**Build & Dev:**
- esbuild - Server-side bundling for production
- tsx - TypeScript execution for development
- @replit/vite-plugin-* - Replit-specific development enhancements

**Type Safety:**
- TypeScript with strict mode enabled
- Path aliases: `@/*` (client), `@shared/*` (shared), `@assets/*` (assets)
- Incremental compilation with build info caching