# To-Do List Application

A clean and simple to-do list application built with Next.js, Convex, Better Auth, Tailwind CSS, and shadcn/ui. Features real-time updates, user authentication, and full CRUD operations for tasks.

## 🏗️ Architecture

This application follows the **four-layer Convex architecture** (Cleargent pattern):

1. **Database Layer** (`convex/db/`) - Pure CRUD operations with typed functions
2. **Endpoint Layer** (`convex/endpoints/`) - Business logic that composes database operations
3. **Workflow Layer** (`convex/workflows/`) - Durable external service integrations (not needed for this app)
4. **Helper Layer** (`convex/helpers/`) - Pure utility functions

## 🧩 Convex Components

This project uses the following Convex Components:

- **Better Auth** (`@convex-dev/better-auth`) - Authentication and session management
- **Rate Limiter** (`@convex-dev/rate-limiter`) - API rate limiting for production safety

## ✨ Features

- ✅ User authentication with Better Auth
- ✅ Create, read, update, delete tasks
- ✅ Task status tracking (pending, in progress, completed)
- ✅ Priority levels (low, medium, high)
- ✅ Due dates and completion tracking
- ✅ Task comments and activity log
- ✅ User preferences and customization
- ✅ Real-time updates across all clients
- ✅ Rate limiting for API protection

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Convex account (sign up at [convex.dev](https://convex.dev))

## 🚀 Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Convex

Initialize your Convex project:

```bash
npx convex dev
```

This will:
- Create a new Convex deployment
- Generate your `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`
- Set up the database schema
- Start the Convex development server

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and fill in:

1. **Convex variables** (from step 2):
   - `CONVEX_DEPLOYMENT`
   - `NEXT_PUBLIC_CONVEX_URL`

2. **Better Auth secret** (generate a secure random string):
   ```bash
   openssl rand -base64 32
   ```
   Add this to `BETTER_AUTH_SECRET`

3. **Site URL** (use defaults for local development):
   - `SITE_URL=http://localhost:3000`
   - `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

### 4. Start Development Servers

Run both Convex and Next.js:

```bash
pnpm dev
```

This starts:
- Convex backend on port 3210
- Next.js frontend on port 3000

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
todo-list-app/
├── convex/                    # Backend (Convex)
│   ├── schema.ts             # Database schema
│   ├── convex.config.ts      # Component configuration
│   ├── auth.ts               # Better Auth setup
│   ├── http.ts               # HTTP routes
│   ├── db/                   # Database layer (CRUD operations)
│   ├── endpoints/            # Endpoint layer (business logic)
│   └── helpers/              # Helper utilities
├── apps/
│   └── web/                  # Frontend (Next.js)
│       ├── app/              # Next.js App Router
│       ├── components/       # React components
│       ├── lib/              # Utilities and auth clients
│       └── providers/        # Context providers
├── .env.local.example        # Environment variables template
└── README.md                 # This file
```

## 🔐 Authentication

This app uses **Better Auth** with the Convex plugin for authentication:

- Email/password authentication (default)
- JWT-based sessions (30-day expiration)
- Automatic user scoping for all operations

To add OAuth providers (GitHub, Google, etc.):
1. Uncomment provider configuration in `.env.local`
2. Add provider credentials from their developer consoles
3. Configure providers in `convex/auth.ts`

## 🛡️ Rate Limiting

API endpoints are protected with rate limiting:

- **Create tasks**: 10 requests/minute (burst capacity: 3)
- **Update tasks**: 50 requests/minute
- **Delete tasks**: 30 requests/minute

Configure limits in `convex/rateLimiter.ts`.

## 🎨 Design System

This project uses a custom design system based on:
- **shadcn/ui** components
- **Tailwind CSS** for styling
- **Radix UI** primitives
- **Lucide React** icons

Theme configuration:
- Primary color: #6366f1 (Indigo)
- Secondary color: #0ea5e9 (Sky blue)
- Accent color: #f97316 (Orange)
- Font: Inter (system fallback)

## 📊 Database Schema

### Core Tables

- **tasks** - To-do items with status, priority, and due dates
- **taskComments** - Comments and notes on tasks
- **taskActivity** - Audit log of task changes
- **userPreferences** - User settings and preferences

All tables are user-scoped with proper indexes for efficient queries.

## 🧪 Development

### Available Scripts

```bash
pnpm dev          # Start both Convex and Next.js
pnpm web:dev      # Start Next.js only
pnpm convex:dev   # Start Convex only
pnpm build        # Build for production
pnpm setup        # Install and initialize
```

### Making Changes

1. **Database changes**: Edit `convex/schema.ts`
2. **Backend logic**: Add files to `convex/db/` or `convex/endpoints/`
3. **Frontend**: Edit files in `apps/web/`

Convex provides automatic type generation and hot reloading.

## 🚢 Deployment

### Convex Backend

```bash
npx convex deploy
```

### Next.js Frontend

Deploy to Vercel, Netlify, or your preferred platform:

1. Set environment variables in your deployment platform
2. Update `SITE_URL` and `NEXT_PUBLIC_SITE_URL` to your production domain
3. Deploy the `apps/web` directory

## 📚 Learn More

- [Convex Documentation](https://docs.convex.dev)
- [Better Auth Documentation](https://better-auth.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

## 🤝 Contributing

This is a personal project template. Feel free to fork and customize for your needs!

## 📝 License

MIT
