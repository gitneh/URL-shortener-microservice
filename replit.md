# Project Overview

This is a full-stack web application built with Express.js backend and React frontend, featuring a modern UI component system and database integration capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Tailwind CSS with Radix UI components via shadcn/ui
- **Build Tool**: Vite for development and bundling
- **Styling**: Tailwind CSS with CSS variables for theming

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Build Process**: esbuild for production bundling

### Database Integration
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Migrations**: Drizzle Kit for schema management
- **Storage Abstraction**: Custom storage interface with in-memory fallback

## Key Components

### Project Structure
```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/ui/  # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── pages/          # Application pages
├── server/          # Express backend
├── shared/          # Shared types and schemas
└── migrations/      # Database migration files
```

### UI Component System
- **Design System**: shadcn/ui with "new-york" style variant
- **Component Library**: Comprehensive set of accessible components using Radix UI primitives
- **Theming**: CSS variables with light/dark mode support
- **Icons**: Lucide React for consistent iconography

### Database Schema
- **Users Table**: Basic user authentication with username/password
- **Schema Validation**: Zod schemas generated from Drizzle tables
- **Type Safety**: Full TypeScript integration between database and application

### Storage Layer
- **Interface-based Design**: IStorage interface for database operations
- **Development Fallback**: In-memory storage for development without database
- **Production Ready**: PostgreSQL integration via Neon Database

## Data Flow

### Client-Server Communication
- **API Client**: Custom fetch wrapper with error handling
- **Query Management**: TanStack Query for caching and synchronization
- **Authentication**: Cookie-based session management
- **CORS**: Configured for cross-origin requests

### Request/Response Pipeline
1. Client makes API request through TanStack Query
2. Express middleware handles logging and error processing
3. Route handlers interact with storage layer
4. Responses are cached and managed by React Query

## External Dependencies

### Core Technologies
- **Neon Database**: Serverless PostgreSQL for production
- **Radix UI**: Accessible component primitives
- **TanStack Query**: Server state management
- **Drizzle ORM**: Type-safe database operations

### Development Tools
- **Vite**: Fast development server and build tool
- **Replit Integration**: Development environment optimizations
- **TypeScript**: Full type safety across the stack

### UI Dependencies
- **Tailwind CSS**: Utility-first styling
- **class-variance-authority**: Component variant management
- **date-fns**: Date manipulation utilities

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations ensure schema consistency

### Environment Configuration
- **Development**: Uses tsx for hot reloading and Vite dev server
- **Production**: Compiled JavaScript with static file serving
- **Database**: Environment variable configuration for connection strings

### Development Workflow
- `npm run dev`: Starts development server with hot reloading
- `npm run build`: Creates production build
- `npm run db:push`: Applies database schema changes
- `npm start`: Runs production server

The application is designed for easy deployment to platforms like Replit, with built-in development tools and a production-ready build process.