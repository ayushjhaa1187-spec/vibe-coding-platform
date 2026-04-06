# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-04-06

### Added
- **Authentication**: Full Supabase Auth integration with email/password and Google OAuth
  - Login, signup, and password reset pages
  - Session management via middleware
  - Protected routes with automatic redirects
  - User avatar and profile menu in navbar
- **Database**: Supabase PostgreSQL schema with RLS
  - `profiles` table with auto-creation on signup
  - `projects` table with public/private visibility
  - `snippets` table linked to projects
  - `chat_history` table with JSONB message storage
  - Row-Level Security on all tables
- **API Routes**: RESTful CRUD endpoints
  - `/api/auth` - User info and logout
  - `/api/projects` - Create, read projects
  - `/api/snippets` - Create, read snippets
  - `/api/chat-history` - Save, list, delete chat sessions
  - Zod validation on all POST endpoints
  - Consistent `{ success, data, error }` response format
- **UI/UX Overhaul**
  - Light/dark mode with CSS variables and `next-themes`
  - Inter font via `next/font`
  - Clean, professional design (no neon/glow effects)
  - Typing indicator for AI responses
  - Clear conversation button
  - Skeleton loading states
  - Custom 404 page
  - Footer with attribution
  - Mobile-responsive hamburger menu
- **AI Chat Improvements**
  - Updated system prompt for Vibe's AI coding assistant
  - Full message history sent with each request (fixes same-response bug)
  - Error handling with user-friendly messages
  - Request body validation
- **Documentation**
  - Comprehensive README with badges, features, tech stack, and setup
  - `.env.example` with all required environment variables
  - `.prettierrc` for consistent formatting
  - Database migration file (`supabase/migrations/001_initial_schema.sql`)

### Changed
- Header redesigned with user menu, dark mode toggle, and clean branding
- Welcome modal updated with professional design
- Chat panel restyled with semantic color tokens
- All components use theme-aware CSS variables instead of hardcoded colors
- Root layout uses `next-themes` ThemeProvider

### Removed
- Neon/glow/cyber aesthetic (replaced with clean professional design)
- Hardcoded dark-only color values
- `animate-pulse` on decorative elements

## [0.1.0] - Initial Release

### Added
- AI-powered code generation with Vercel Sandbox
- Multi-model support (GPT-5.2, Claude, Gemini, etc.)
- Resizable panel layout
- File explorer and syntax highlighting
- Error auto-detection and fix suggestions
- Real-time command logs streaming
