# Stefano Restaurant & Pub - Full Stack Web Application

## Overview
Stefano Restaurant & Pub is a full-stack web application for a restaurant in Bełchatów, Poland. It provides online ordering, contact forms, a reservation system, and business services. The project aims to deliver a modern single-page application experience with a focus on ease of use and comprehensive functionality for both customers and administrators. Key capabilities include loyalty programs, intelligent kitchen management, and robust security features, positioning it as a scalable solution for the restaurant industry.

## Recent Changes (August 2025)
- **Navigation Issues Fixed**: Resolved Link component usage in header.tsx and added "Return to main page" button in admin panel
- **Avatar Functionality Completely Removed**: All avatar-related features removed from the entire application
- **New Menu Category Added**: Added "KUBEŁKI" category featuring wings, strips, and combo buckets with authentic pricing from restaurant menu
- **Current Menu Categories**: BURGERY, TORTILLA, PIZZA, KUBEŁKI, DODATKI

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
The application uses a monorepo structure, separating client and server code. The frontend is built with React and TypeScript using Vite, while the backend uses Express.js with TypeScript. PostgreSQL is used for the database, managed by Drizzle ORM. UI components are styled with shadcn/ui and Tailwind CSS, and state management is handled by TanStack Query. Client-side routing is managed by Wouter.

**Key Architectural Decisions:**
*   **Monorepo Structure**: Facilitates cohesive development and deployment of client and server.
*   **React & Express.js**: Chosen for their performance, scalability, and robust ecosystems.
*   **PostgreSQL with Drizzle ORM**: Provides a reliable and scalable relational database solution with a type-safe ORM.
*   **shadcn/ui & Tailwind CSS**: Ensures a consistent, modern, and accessible UI/UX design.
*   **Modular Component Structure**: For maintainability and scalability of the frontend.
*   **RESTful API**: For clear and standardized communication between frontend and backend.
*   **Abstracted Storage Layer**: Allows flexibility in data persistence mechanisms.
*   **Containerization (Docker) and Orchestration (PM2)**: For streamlined deployment, scaling, and high availability.
*   **Security Focus**: Implementation of security headers, rate limiting, and secure API key management (AES-256 encryption).
*   **GDPR Compliance**: Built-in features for customer data management and consent tracking.
*   **PWA Functionality**: Enables a mobile-first experience with offline capabilities and home screen installation.

**Key Features and Implementations:**
*   **Online Ordering System**: Comprehensive ordering with menu, promotions, and WhatsApp integration.
*   **Reservation System**: Manages table bookings and event details.
*   **Loyalty Program**: Tier-based system with points, rewards, and member management.
*   **Intelligent Kitchen Management**: Real-time load monitoring, order complexity scoring, and estimated time calculation.
*   **Admin Panel**: Centralized management for orders, reservations, loyalty program, customer database, and API keys.
*   **Enterprise Bot**: Advanced business analytics and competitive analysis.
*   **Quality Control System**: Dashboard for real-time monitoring, test results, and analytics.
*   **API Key Management**: Secure storage and management of third-party API keys.
*   **Customer Database**: GDPR-compliant customer data management with consent tracking.
*   **Automated Deployment**: Scripts and configurations for simplified and robust production deployments.

## External Dependencies
*   **Neon Database**: Serverless PostgreSQL for production environments.
*   **Radix UI**: Accessible component primitives.
*   **Lucide React**: Icon library.
*   **React Hook Form**: Form state management.
*   **Zod**: Runtime type validation.
*   **Vite**: Frontend build tool.
*   **TypeScript**: Programming language.
*   **Tailwind CSS**: Styling framework.
*   **ESBuild**: JavaScript bundler.
*   **Google Analytics**: User behavior tracking.
*   **Sentry**: Error monitoring and reporting.
*   **Stripe**: Payment processing (integrated for prepayment system).
*   **OpenAI**: Potentially used for chatbot or AI features (API key management system supports it).
*   **SendGrid**: Potentially used for email services (API key management system supports it).
*   **X (Twitter)**: Integrated into SEO assistant and button tester.
*   **WhatsApp**: For direct ordering communication.
*   **Prometheus**: Monitoring stack.
*   **Let's Encrypt**: For SSL/TLS certificates.