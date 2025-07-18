# MindHaven - Mental Health Support Platform

## Overview

MindHaven is a comprehensive mental health support platform that connects users with therapy resources, AI-powered emotional support, and community features. The application provides a bridge between initial mental health support and professional therapy services, featuring mood tracking, journal entries, therapist discovery, community forums, and an AI therapy assistant called "Therabot."

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom therapy-themed color palette
- **Authentication**: Session-based authentication with Replit's OIDC integration

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: express-session with PostgreSQL session store
- **AI Integration**: OpenAI GPT-4o for the Therabot AI therapy assistant

### Key Design Decisions

**Monorepo Structure**: The application uses a shared directory structure with `/client`, `/server`, and `/shared` folders to enable code sharing between frontend and backend, particularly for TypeScript types and database schemas.

**Type Safety**: Heavy emphasis on type safety with TypeScript throughout the stack, Drizzle ORM for database type safety, and Zod schemas for runtime validation.

**Component-First UI**: Uses Radix UI primitives with shadcn/ui for accessible, customizable components with a consistent design system.

## Key Components

### Authentication System
- **Replit Auth Integration**: Uses OpenID Connect for seamless authentication
- **Session Management**: Secure session storage in PostgreSQL with configurable TTL
- **User Management**: Automatic user creation and profile management

### Database Schema
- **Users**: Core user profiles with optional demographic data
- **Therapists**: Professional therapist profiles with credentials and specializations
- **Therapy Sessions**: Session tracking and management
- **Mood Entries**: Daily mood tracking with energy levels and notes
- **Journal Entries**: Private journaling functionality
- **Community**: Posts and comments for peer support
- **Sessions**: Authentication session storage

### AI Therapy Assistant (Therabot)
- **GPT-4o Integration**: Advanced conversational AI for initial mental health support
- **Safety Features**: Crisis detection, professional referral recommendations
- **Structured Responses**: JSON-formatted responses with mood assessment and coping strategies
- **Ethical Guidelines**: Trauma-informed, culturally sensitive responses with clear limitations

### UI Component System
- **Design System**: Custom therapy-themed color palette with semantic color tokens
- **Accessibility**: Built on Radix UI primitives ensuring WCAG compliance
- **Mobile Responsive**: Tailwind CSS responsive design patterns
- **Component Library**: Comprehensive set of reusable UI components

## Data Flow

1. **Authentication Flow**: User authenticates via Replit OIDC → Session created in PostgreSQL → User profile retrieved/created
2. **Data Fetching**: React Query manages all server state with automatic caching and revalidation
3. **Database Operations**: Drizzle ORM provides type-safe database queries with automatic migrations
4. **AI Interactions**: User messages sent to OpenAI API → Structured response with safety analysis → Stored for session continuity

## External Dependencies

### Core Infrastructure
- **Neon**: Serverless PostgreSQL database hosting
- **OpenAI**: GPT-4o API for AI therapy assistant
- **Replit**: Authentication provider and development platform

### Key Libraries
- **Database**: Drizzle ORM, Neon serverless client
- **Frontend**: React, TanStack Query, Wouter, Radix UI, Tailwind CSS
- **Backend**: Express.js, Passport.js, OpenID Client
- **Development**: Vite, TypeScript, ESBuild

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement for rapid development
- **File System Routing**: Automatic route generation based on file structure
- **Development Middleware**: Error overlay and debugging tools

### Production Build
- **Frontend**: Vite builds optimized static assets to `/dist/public`
- **Backend**: ESBuild bundles server code to `/dist/index.js`
- **Static Serving**: Express serves built frontend assets in production

### Database Management
- **Schema Migrations**: Drizzle Kit handles database schema migrations
- **Environment Variables**: DATABASE_URL for database connection, OpenAI API keys
- **Session Storage**: PostgreSQL-backed session store for scalability

### Security Considerations
- **Environment Variables**: Sensitive data stored in environment variables
- **HTTPS**: Secure cookies and HTTPS-only session configuration
- **CORS**: Proper cross-origin resource sharing configuration
- **Input Validation**: Zod schemas for request validation and sanitization

## Recent Changes

**July 18, 2025 - Migration & Error Fixes:**
- ✅ Successfully migrated project from Replit Agent to Replit environment
- ✅ Created PostgreSQL database and applied schema migrations
- ✅ Fixed authentication system with both local and Replit OAuth support
- ✅ Implemented mock AI service as OpenAI alternative with intelligent responses
- ✅ Fixed API request issues in authentication modal
- ✅ Added comprehensive error handling and user feedback
- ✅ Created sample therapist data and community posts
- ✅ Verified all core functionality: auth, AI chat, therapist listings, community features