# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Buniverse is a experimental web framework for Bun that provides filesystem-based routing, interceptors, and context management. **This is experimental software - DO NOT use in production**.

## Key Architecture

### Framework Structure
- **Server**: Bootstrap function in `src/server.ts` creates a Bun HTTP server with routing and middleware support
- **Router**: Filesystem-based routing via `src/packages/router/fs/` that maps directory structure to HTTP routes
- **Interceptors**: Request/response middleware system in `src/interceptors/` 
- **Context**: Async context management for request-scoped data in `src/context.ts`
- **Plugins**: Extension system in `src/plugins/` for framework customization

### Routing Convention
Routes are defined by the filesystem structure in `src/routes/`:
- `route.get.ts` - GET handler
- `route.post.ts` - POST handler  
- `route.middleware.ts` - Route-level middleware
- `[param]/` - Dynamic route parameters
- Files starting with `@` are ignored/filtered

### Example Application
The `example/` directory contains a complete music app demonstrating:
- Database integration with Drizzle ORM and SQLite
- Authentication with JWT
- File uploads with UploadThing
- Structured routing with admin/user areas

## Development Commands

### Main Framework
```bash
# Run example app with hot reload
npm run example
# or
bun run example
```

### Example App (from example/ directory)
```bash
# Development server with hot reload
bun run dev

# Database operations
bun run db:migrate    # Run database migrations
bun run db:generate   # Generate migration files  
bun run db:push       # Push schema to database
```

## Project Structure

### Core Framework (`src/`)
- `server.ts` - Main bootstrap function and request handler
- `router-adapter.ts` - Router interface and HTTP verb types
- `context.ts` - Async context for request-scoped data
- `hooks/` - Framework hooks (useContext, useRequest)
- `interceptors/` - Middleware system
- `packages/router/fs/` - Filesystem router implementation
- `plugins/` - Plugin system
- `utils/` - Shared utilities

### Example App (`example/src/`)
- `routes/` - HTTP route handlers following filesystem routing
- `database/` - Database models, migrations, and connection
- `repo/` - Repository pattern for data access
- `services/` - Business logic (auth, JWT, storage)
- `config/env/` - Environment configuration
- `errors/` - Custom error handling

## Important Notes

- Uses Bun runtime and TypeScript
- No build step required - runs directly with `bun --watch`
- Framework exports are defined in root `index.ts` and `package.json`
- Example uses Drizzle ORM with SQLite for data persistence
- Authentication handled via JWT tokens
- File uploads via UploadThing service