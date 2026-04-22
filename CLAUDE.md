# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**UIGen** is an AI-powered React component generator with live preview. It allows users to describe React components in natural language, and Claude generates working code displayed in real-time. Users can preview components, edit generated code, and iterate on designs.

**Tech Stack**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Prisma/SQLite, Anthropic Claude API

## Development Commands

### Setup & Installation
```bash
npm run setup  # Install dependencies, generate Prisma client, run migrations
```

### Development
```bash
npm run dev         # Start dev server with Turbopack on http://localhost:3000
npm run dev:daemon  # Start dev server in background (logs to logs.txt)
```

### Build & Deploy
```bash
npm run build  # Production build
npm run start  # Run production server
```

### Code Quality
```bash
npm run lint  # Run ESLint
npm run test  # Run Vitest (uses jsdom environment)
```

### Database
```bash
npx prisma generate           # Generate Prisma client
npx prisma migrate dev        # Run pending migrations
npm run db:reset              # Reset database (drops and recreates, runs all migrations)
npx prisma studio            # Open Prisma Studio GUI
```

### Running Single Tests
```bash
npm run test -- file.test.tsx                    # Run specific file
npm run test -- --reporter=verbose               # Verbose output
npm run test -- --ui                             # Open UI dashboard
```

## High-Level Architecture

### Directory Structure
```
src/
  app/                      # Next.js App Router pages & layouts
    api/chat/              # Main chat streaming endpoint
    [projectId]/           # Dynamic project pages
  components/               # React components by feature
    auth/                  # Login/signup components
    chat/                  # Chat interface, message list, input
    editor/                # Code editor & file manager
    preview/               # Live component preview
    ui/                    # Reusable UI primitives (Radix UI)
  lib/                      # Utilities & business logic
    file-system.ts        # Virtual filesystem (no disk writes)
    auth.ts               # JWT session management
    provider.ts           # Claude model initialization
    tools/                # Claude tool definitions (str-replace, file-manager)
    prompts/              # System prompts for Claude
    transform/            # Code transformation utilities
    contexts/             # React Context providers
  actions/                  # Next.js server actions
    create-project.ts     # Create new project
    get-project.ts        # Fetch project by ID
    get-projects.ts       # List user's projects
  hooks/                    # Custom React hooks (use-auth, etc.)
prisma/
  schema.prisma           # Database schema (User, Project models)
```

### Data Flow

1. **User Input** → Chat message sent to `/api/chat`
2. **API Route** (`src/app/api/chat/route.ts`):
   - Deserializes virtual filesystem from frontend
   - Constructs Claude message with system prompt
   - Uses `streamText()` from Vercel AI SDK with tools
3. **Claude Generation**:
   - Claude analyzes request and uses tools:
     - `str_replace_editor` - Modify file contents
     - `file_manager` - Create/delete/rename files
   - Response streams to client via `/data-stream` protocol
4. **Persistence**:
   - If authenticated + projectId provided, saves to Prisma:
     - `messages` - Conversation history (JSON stringified)
     - `data` - Virtual filesystem snapshot (serialized)
5. **Client** renders preview and code editor

### Key Components

- **VirtualFileSystem** (`src/lib/file-system.ts`): In-memory tree of files/dirs, no disk writes. Serializes to JSON for storage.
- **Chat Endpoint** (`src/app/api/chat/route.ts`): Streams Claude responses with tool use. Supports both authenticated users (saves to DB) and anonymous users.
- **Authentication**: JWT in httpOnly cookies. 7-day expiry. Mock provider fallback if no API key.
- **Database**:
  - `User`: id, email, password (bcrypt), timestamps
  - `Project`: id, name, userId (optional for anon users), messages (JSON), data (JSON), timestamps

### Environment Variables

```env
ANTHROPIC_API_KEY=sk-...    # Optional - required for LLM generation
JWT_SECRET=...              # Optional - dev default used if not set
DATABASE_URL=...            # Prisma SQLite URL (auto-generated in dev)
```

## Key Implementation Details

- **VirtualFileSystem**: Tree structure (no disk writes). Serializes to JSON for storage; `Map` for internal children.
- **Chat API** (`src/app/api/chat/route.ts`): Deserializes filesystem, calls Claude with `streamText()` and tools, saves to DB if authenticated.
- **Tools**: `str_replace_editor` and `file_manager` are Claude's only write operations. Defined in `src/lib/tools/`.
- **Persistence**: Messages and file data stored as JSON strings in Prisma (Project.messages, Project.data).
- **Node Compatibility**: `node-compat.cjs` required in dev/build scripts for polyfills.
