# ShiftSavvy - Tips & Earnings Tracker

## Overview

ShiftSavvy is a mobile-first Progressive Web App (PWA) designed for service industry workers to track tips, wages, and earnings across multiple jobs. It allows users to log shifts with detailed financial data, visualize earnings, and export data for tax purposes. The application aims to provide a clear overview of earnings and support financial planning for service industry professionals.

**Key Capabilities:**
- Multi-job shift tracking with detailed earnings breakdown.
- Interactive dashboard for dynamic filtering and data visualization.
- Monthly calendar view for earnings overviews.
- Visual analytics with charts and statistical summaries.
- Tax estimation capabilities (federal, state, local) with clear disclaimers about limitations.
- CSV/PDF export for tax filing.
- User profile management including tax settings and language selection.
- Multiple employer tracking.
- Offline-capable PWA with internationalization and theme switching.
- Consistent navigation across authenticated sections.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Frameworks & Libraries:**
- React 18+ with TypeScript, Vite for tooling.
- Wouter for client-side routing.
- shadcn/ui (Radix UI primitives + Tailwind CSS) for UI components.

**State Management:**
- TanStack Query (React Query) v5 for server state.
- React Hook Form with Zod for form state and validation.

**Styling:**
- Tailwind CSS with custom design tokens and CSS variables for theming.
- Mobile-first responsive design.
- Typography: Inter (numbers) + Poppins (headings).

**Design System:**
- Hybrid approach inspired by Apple HIG and Material Design 3, focusing on clarity and mobile usability.
- Custom elevation system for interactivity.

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript.
- RESTful API structure with resource-based routing.

**Data Layer:**
- `IStorage` interface with `DatabaseStorage` implementation for database operations.

### Database & ORM

**Database:**
- PostgreSQL via Neon serverless.

**ORM:**
- Drizzle ORM with a schema-first approach for type-safe queries.

**Schema Design:**
- Core tables: `users`, `jobs`, `shifts`, `employers`, `sessions`.
- Financial precision with Decimal types.
- UUID primary keys and timestamp tracking.

### Authentication & Session Management

**Authentication Provider:**
- Replit Auth (OpenID Connect) via passport.js.
- Session-based authentication with PostgreSQL-backed sessions and 7-day TTL.

### Progressive Web App (PWA)

**Capabilities:**
- Service Worker for offline caching (cache-first for assets, network-first for API).
- Web Manifest for standalone display and mobile optimization.

### Internationalization (i18n)

**Implementation:**
- i18next with react-i18next.
- Supports English (default) and has an extensible structure for other languages.

### Data Validation

**Approach:**
- Zod schemas for runtime validation, integrated with `drizzle-zod`.
- Shared validation between client and server for data integrity.

### Error Handling

**Strategy:**
- Client-side: Toast notifications, re-login on 401 errors, loading states.
- Server-side: Try-catch blocks, generic error responses with status codes, logging.

## External Dependencies

### Third-Party Services

- **Replit Authentication:** OAuth 2.0 / OpenID Connect provider.
- **Neon Database:** Serverless PostgreSQL hosting.
- **zippopotam.us API:** Used for zipcode auto-lookup (city/state).

### Core Libraries

- **Data Visualization:** recharts for charts and graphs.
- **Date Handling:** date-fns for formatting and manipulation, with custom utilities for timezone-safe parsing.
- **Form Management:** react-hook-form and @hookform/resolvers (Zod resolver).
- **CSV Export:** papaparse for CSV generation.
- **Utilities:** nanoid (ID generation), clsx + tailwind-merge (className composition), class-variance-authority (component variants), memoizee (function memoization).

## Recent Changes

### October 2025 - Cash Tips Tax Option
- **Cash Tips in Tax Estimates Feature**:
  - Added toggle in Profile > Tax Settings to include/exclude cash tips from tax calculations
  - Users can choose whether to report cash tips for tax estimation purposes
  - Tax calculations respect user preference (default: include cash tips)
  - Visual indicator on Reports page when cash tips are excluded
  - Helps users plan for different tax reporting scenarios
  - Setting stored in user profile as `includeCashTipsInTaxes` boolean field

### October 2025 - Mobile UI Improvements
- **Fixed Mobile Navigation**:
  - Reduced stat card icon sizes from 32px to 20px for better mobile fit
  - Fixed bottom navigation to stay visible while scrolling (sticky positioning)
  - Reduced nav icon sizes from 24px to 20px to prevent overflow
  - All pages have proper bottom padding to prevent content from being hidden

### October 2025 - Routing Fix
- **404 Page Fix**:
  - Restructured Wouter routing to prevent 404 page from appearing on valid routes
  - Changed from nested fragment-based routing to flat Switch structure
  - 404 page now only appears for truly invalid routes

### October 2025 - Password-Protected Site Access
- **Site Access Gate Implemented**:
  - Added password protection to control access to entire site during testing phase
  - PasswordGate component wraps entire application before any content loads
  - Uses environment variable SITE_ACCESS_PASSWORD for secure password storage
  - Session-based authentication (sessionStorage) - remembers access during browser session
  - Clean UI with ShiftSavvy branding, error handling, and loading states
  - Backend verification endpoint at /api/verify-site-password
  - Allows site owner to share password with testers for controlled access

### October 2025 - Final Logo Implementation
- **Final ShiftSavvy Logo Deployed**:
  - Replaced all logo instances with final version (ShiftSavvy - FINAL_1761769622129.png)
  - Updated logo imports in Landing page, Dashboard, Reports, Profile, Shift Form headers
  - Updated Footer component with final logo (appears on all pages)
  - Maintains consistent 32px (h-8) height across all implementations
  - Blue horizontal logo with icon and "ShiftSavvy" text
  - All logos verified and loading correctly via end-to-end testing
  - Logo appears for both authenticated and unauthenticated users