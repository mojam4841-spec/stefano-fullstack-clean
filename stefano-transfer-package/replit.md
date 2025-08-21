# Stefano Restaurant & Pub - Full Stack Web Application

## Overview

This is a full-stack web application for Stefano Restaurant & Pub in Bełchatów, Poland. It's a restaurant website featuring online ordering, contact forms, reservation system, and business services. The application is built as a modern single-page application with a Node.js backend and React frontend.

## System Architecture

The application follows a monorepo structure with a clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **Component Structure**: Modular React components following a feature-based organization
- **Styling**: Tailwind CSS with custom CSS variables for brand colors (Stefano red and gold)
- **UI Components**: Comprehensive shadcn/ui component library for consistent design
- **Forms**: React Hook Form with Zod validation
- **Analytics**: Google Analytics integration for tracking

### Backend Architecture
- **API Design**: RESTful API endpoints for contacts, reservations, and orders
- **Database Layer**: Drizzle ORM with PostgreSQL for data persistence
- **Storage Pattern**: Interface-based storage layer with in-memory fallback
- **Middleware**: Express middleware for logging, error handling, and request parsing

### Database Schema
The application manages three main entities:
- **Contacts**: Customer inquiries and messages
- **Reservations**: Table bookings with event details
- **Orders**: Online food orders with avatar-based categorization

### Authentication & Authorization
Currently uses a simple approach without user authentication, suitable for a restaurant website where most interactions are anonymous customer submissions.

## Data Flow

1. **Client Requests**: React components make HTTP requests through TanStack Query
2. **API Layer**: Express routes handle validation and business logic
3. **Storage Layer**: Abstracted storage interface allows for flexible data persistence
4. **Response Handling**: Structured error handling and success responses
5. **UI Updates**: Optimistic updates and proper loading states

## External Dependencies

### Core Technologies
- **Neon Database**: Serverless PostgreSQL for production database
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation

### Development Tools
- **Vite**: Fast build tool and development server  
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Fast JavaScript bundler for production

### Analytics & Tracking
- **Google Analytics**: User behavior tracking
- **Custom Analytics**: Event tracking for business insights

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:
- **Build Process**: Vite builds the frontend, ESBuild bundles the server
- **Production**: Node.js server serves both API and static files
- **Database**: PostgreSQL connection via environment variables
- **Port Configuration**: Configured for Replit's port mapping (5000 → 80)

The deployment supports both development and production modes with appropriate optimizations for each environment.

## Changelog

- June 26, 2025: Initial setup
- June 26, 2025: Added mobile app download section with features (notifications, navigation, reservations, loyalty program)
- June 26, 2025: Updated all logo references to new Stefano logo file
- June 26, 2025: Updated business services section with professional conference room image
- June 26, 2025: Prepared production build for GoDaddy deployment with all necessary files (.htaccess, robots.txt, sitemap.xml)
- June 26, 2025: Integrated official Stefano menu with authentic prices and descriptions (burgery 24-29zł, pizza 46-72zł, tortilla 24-29zł, dodatki 4-12zł)
- June 26, 2025: Added interactive menu categories with "ZAMÓW DUŻĄ PIZZĘ - DRUGA ZA PÓŁ CENY" promotion
- June 26, 2025: Enhanced chatbot with detailed menu knowledge, prices, ingredients, and intelligent question matching
- June 26, 2025: Updated to latest Stefano logo (Asset 1@2x-1-80_1750909127916.png)
- June 26, 2025: Implemented Cyberpunk avatars (Cyber Mędrzec, Rycerz, Czarownik, Wojowniczka) with progressive levels
- June 26, 2025: Created Progressive Web App (PWA) with manifest.json and Service Worker for mobile installation
- June 26, 2025: Added Daily Promotions system with unique offers for each day of the week and real-time countdown
- June 26, 2025: Added detailed cyber faces to avatars with CSS art and animation effects
- June 26, 2025: Created complete sauce shop with 6 products, shopping cart, and WhatsApp ordering
- June 26, 2025: Designed new app icon with Stefano logo and Gastro avatar for PWA
- June 26, 2025: Implemented comprehensive security testing and production-ready deployment package
- June 26, 2025: Added complete .htaccess security headers and performance optimizations
- June 26, 2025: Integrated WhatsApp ordering system with restaurant phone number 51616618
- June 26, 2025: Simplified avatar system to emoji icons (🧙‍♂️ ⚔️ 🔮 🛡️) for performance optimization
- June 26, 2025: Implemented production security: Helmet headers, rate limiting (100 req/15min), compression middleware
- June 26, 2025: Added comprehensive button testing system with 20 automated functionality tests
- June 26, 2025: Server optimized with CSP policies, API protection, and performance enhancements
- June 26, 2025: **MAJOR FEATURE: Implemented comprehensive loyalty program with points and rewards system**
  * Created complete PostgreSQL database schema with 4 new tables (loyalty_members, points_transactions, rewards, reward_redemptions)
  * Built tier-based system (Bronze, Silver, Gold, Platinum) with automatic upgrades based on lifetime points
  * Added 22 new API endpoints for member management, points tracking, and reward redemption
  * Integrated member registration with 100-point welcome bonus and automatic points awarding (1 point per 1zł spent)
  * Created comprehensive admin panel section for loyalty program oversight with member tracking and reward management
  * Added prominent loyalty program button in main navigation with crown icon for easy customer access
  * Implemented reward redemption system with unique codes and 30-day expiry periods
  * Built complete points transaction history and real-time tier progression tracking
  * Added 5 default rewards: darmowa kawa (50 pkt), 10% zniżka (100 pkt), darmowy deser (150 pkt), 20% zniżka VIP (250 pkt), darmowa pizza (500 pkt)
- June 26, 2025: **ADVANCED FEATURE: Intelligent kitchen management system with load monitoring**
  * Implemented real-time kitchen capacity monitoring with PostgreSQL backend (3 new tables: orders extended, kitchen_capacity, kitchen_status, time_slots)
  * Added intelligent order complexity scoring system based on dish types (pizza=3pts, burger=2pts, tortilla=2pts, sides=1pt)
  * Built automatic estimated time calculation with dynamic adjustment based on current kitchen load (1.5x multiplier when >80% capacity)
  * Created time slot management for scheduled orders with peak hour restrictions (lunch 12-14h: max 3 orders/slot, dinner 18-21h: max 3 orders/slot)
  * Integrated prepayment system with multiple payment methods (cash, card, online BLIK, Stripe integration)
  * Added comprehensive admin kitchen dashboard with real-time metrics, active orders tracking, and capacity management
  * Implemented automatic newsletter subscription from all customer touchpoints (contact forms, orders, loyalty signups)
  * Built customer database automation with marketing consent tracking and segmentation capabilities

## User Preferences

Preferred communication style: Simple, everyday language.