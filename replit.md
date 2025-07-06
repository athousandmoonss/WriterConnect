# Inkwell - Creative Writing Social Platform

## Overview

Inkwell is a social platform designed specifically for creative writers and authors. It combines social networking features with portfolio management, allowing writers to share their work, connect with other writers, and build their professional writing presence. The platform is built as a full-stack web application with modern React frontend and Express.js backend.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds
- **UI Components**: Radix UI primitives with custom theming

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon (serverless PostgreSQL)
- **API Design**: RESTful API with structured error handling
- **Development**: Hot reloading with integrated Vite middleware

### Project Structure
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript types and database schema
- `migrations/` - Database migration files

## Key Components

### User Management
- User profiles with writing genres, credentials, and bio
- Avatar support and follower/following system
- User search functionality
- Profile statistics tracking (posts, followers, likes)

### Content Management
- Multi-type post system (writing, portfolio, image, text)
- Rich text editor with formatting capabilities
- Tag-based content organization
- Portfolio works with genre classification and status tracking

### Social Features
- Following/follower relationships
- Post likes and comments with nested replies
- Real-time engagement tracking
- Content discovery through search and feeds

### Portfolio System
- Dedicated portfolio works separate from regular posts
- Genre categorization and status tracking
- Professional presentation of writing works
- Integration with social feed for visibility

## Data Flow

### Database Schema
The application uses a relational database with the following main entities:
- **Users**: Core user information and statistics
- **Posts**: Social posts with content, tags, and engagement metrics
- **Portfolio Works**: Professional writing portfolio items
- **Follows**: User relationship tracking
- **Likes**: Post engagement tracking
- **Comments**: Nested comment system for posts

### API Structure
- RESTful endpoints organized by resource type
- Consistent error handling and validation
- Query optimization for feed generation
- Search functionality across users and content

### State Management
- Server state managed through TanStack Query
- Optimistic updates for better user experience
- Proper cache invalidation on mutations
- Error boundaries for graceful error handling

## External Dependencies

### Database
- **Neon**: Serverless PostgreSQL database
- **Drizzle ORM**: Type-safe database queries and migrations
- **connect-pg-simple**: PostgreSQL session storage

### UI/UX
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **date-fns**: Date formatting and manipulation

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast bundling for production
- **Replit Integration**: Development environment support

## Deployment Strategy

### Development
- Integrated Vite development server with Express
- Hot reloading for both frontend and backend
- Development-specific error overlays and debugging tools
- Replit-specific tooling for cloud development

### Production
- Vite build process for optimized frontend assets
- ESBuild bundling for Node.js backend
- Static file serving through Express
- Environment-based configuration management

### Database Management
- Drizzle migrations for schema changes
- Environment variable configuration for database connections
- Connection pooling through Neon serverless

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### Accessibility Features Implementation (July 06, 2025)
- **Accessibility Context**: Added comprehensive accessibility management with settings persistence
- **Color Schemes**: Implemented four reading-friendly themes:
  - High Contrast: Black and white for maximum readability
  - Dyslexia Friendly: Cream background with blue accents and OpenDyslexic font
  - Low Light: Dark theme with reduced eye strain
  - Default: Standard ink and gold theme
- **Text-to-Speech**: Full speech synthesis integration with:
  - Configurable reading speed (0.5x to 2.0x)
  - Voice type selection (default, male, female)
  - Read buttons on individual posts
  - Page-wide reading functionality
- **Typography Options**: Variable font sizes (normal, large, extra large) and large text mode
- **Accessibility Toolbar**: Fixed bottom-right quick access to all features
- **Settings Page**: Dedicated /accessibility route with comprehensive controls
- **CSS Framework**: Complete styling system for all accessibility modes
- **Browser Compatibility**: Proper fallbacks and error handling for speech synthesis

### Architecture Updates
- Added `/contexts` directory for React context providers
- Enhanced header navigation with accessibility settings link
- Integrated accessibility features into existing post components
- Added accessibility CSS classes and responsive design considerations

## Changelog

Changelog:
- July 06, 2025. Initial setup
- July 06, 2025. Accessibility mode implementation with color schemes and text-to-speech