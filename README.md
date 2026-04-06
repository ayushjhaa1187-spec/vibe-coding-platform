# Vibe Coding Platform

[![Build](https://img.shields.io/badge/build-passing-brightgreen)](https://vibe-coding-platform-brown-two.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E)](https://supabase.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vibe-coding-platform-brown-two.vercel.app)

AI-powered coding platform that generates production-ready applications from natural language prompts. Describe what you want to build, and the AI writes, runs, and previews your code in an isolated sandbox — all in real time.

**[Launch Vibe Code](https://vibe-coding-platform-brown-two.vercel.app)**

---

## Features

| Feature | Description |
| :--- | :--- |
| **AI Code Generation** | Describe your app in plain English. The AI generates complete, runnable code using GPT-5.2, Claude Opus, Gemini, and more. |
| **Live Sandbox Preview** | Code runs in isolated Vercel Sandboxes with live preview — see your app as it's built. |
| **Multi-Model Support** | Switch between OpenAI, Anthropic, Google, Amazon, Moonshot, and xAI models on the fly. |
| **Authentication** | Email/password and Google OAuth via Supabase Auth. Protected routes, session management, and user profiles. |
| **Database** | Supabase PostgreSQL with Row-Level Security. Store projects, snippets, and chat history. |
| **Light/Dark Mode** | System-aware theme switching with carefully designed color tokens for both modes. |
| **Resizable Panels** | Split chat, preview, file explorer, and logs in a fully customizable layout. |
| **Error Auto-Fix** | Detects runtime errors and automatically suggests or applies fixes. |
| **Mobile Responsive** | Tab-based layout on mobile, split panels on desktop. |

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | [TypeScript 5](https://typescriptlang.org) |
| AI | [Vercel AI SDK](https://sdk.vercel.ai), multi-provider gateway |
| Auth | [Supabase Auth](https://supabase.com/auth) (email, Google OAuth) |
| Database | [Supabase PostgreSQL](https://supabase.com/database) with RLS |
| Styling | [Tailwind CSS v4](https://tailwindcss.com), CSS variables, [Radix UI](https://radix-ui.com) |
| State | [Zustand](https://zustand-demo.pmnd.rs) |
| Sandbox | [Vercel Sandbox](https://vercel.com/docs/sandbox) |
| Validation | [Zod](https://zod.dev) |

## Quick Start

### Prerequisites

- Node.js 22.x
- A [Supabase](https://supabase.com) project
- AI Gateway credentials (Vercel AI Gateway or compatible)

### Setup

```bash
# Clone the repository
git clone https://github.com/ayushjhaa1187-spec/vibe-coding-platform.git
cd vibe-coding-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run the database migration
# (via Supabase Dashboard → SQL Editor → paste supabase/migrations/001_initial_schema.sql)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Required | Description |
| :--- | :---: | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `AI_GATEWAY_BASE_URL` | Yes | AI provider gateway URL |
| `BOTID_SECRET_KEY` | No | BotID key for bot protection |

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoint
│   │   ├── chat/           # AI chat streaming endpoint
│   │   ├── chat-history/   # Chat history CRUD
│   │   ├── projects/       # Projects CRUD
│   │   ├── snippets/       # Snippets CRUD
│   │   └── ...
│   ├── auth/callback/      # OAuth callback handler
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── reset-password/     # Password reset page
│   └── ...
├── ai/                     # AI SDK configuration and tools
├── components/             # Reusable UI components
├── lib/                    # Utilities, hooks, Supabase clients
│   ├── supabase/           # Browser and server Supabase clients
│   └── hooks/              # Custom React hooks
├── supabase/
│   ├── migrations/         # SQL migration files
│   └── seed.sql            # Seed data template
└── public/                 # Static assets
```

## API Reference

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth` | GET | Get current user info |
| `/api/auth` | POST | Logout (`{ action: "logout" }`) |
| `/api/chat` | POST | Stream AI chat response |
| `/api/projects` | GET | List user's projects |
| `/api/projects` | POST | Create a project |
| `/api/snippets` | GET | List user's snippets |
| `/api/snippets` | POST | Create a snippet |
| `/api/chat-history` | GET | List chat sessions |
| `/api/chat-history` | POST | Save/update chat session |
| `/api/chat-history` | DELETE | Delete a chat session |

## Database Schema

Four tables with Row-Level Security:

- **profiles** — User profiles (auto-created on signup)
- **projects** — Code projects with public/private visibility
- **snippets** — Reusable code snippets, optionally linked to projects
- **chat_history** — AI conversation history (JSONB)

See [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql) for the complete schema.

## Development

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## Author

**Ayush Kumar Jha** — IIT Madras

- GitHub: [@ayushjhaa1187-spec](https://github.com/ayushjhaa1187-spec)

## License

MIT
