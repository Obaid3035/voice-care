# Voice Clone Monorepo

A monorepo containing both the client (React frontend) and server (Fastify backend) for the Voice Clone application.

## 🏗️ Project Structure

```
voice-clone/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and configurations
│   │   └── types/         # Client-specific types
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Fastify backend application
│   ├── src/
│   │   ├── features/      # Feature modules
│   │   ├── config/        # Configuration files
│   │   ├── utils/         # Utility functions
│   │   └── types/         # Server-specific types
│   └── package.json       # Backend dependencies
├── types/                 # Shared types between client and server
│   └── shared.ts         # Common type definitions
├── package.json          # Root package.json with shared dependencies
├── biome.json           # Shared code formatting and linting configuration
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd voice-clone
```

2. Install all dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both `client/` and `server/` directories
   - Configure your environment variables

### Development

Start both client and server in development mode:
```bash
npm run dev
```

This will start:
- Client: `http://localhost:5173`
- Server: `http://localhost:3000`

### Building

Build both applications for production:
```bash
npm run build
```

### Other Commands

- `npm run start` - Start the server in production mode
- `npm run lint` - Run linting on all workspaces
- `npm run format` - Format code in all workspaces
- `npm run test` - Run tests in all workspaces
- `npm run clean` - Clean all node_modules and reinstall

**Biome Commands:**
- `npm run biome:check` - Check for formatting and linting issues
- `npm run biome:check:fix` - Automatically fix formatting and linting issues
- `npm run biome:format` - Format all files
- `npm run biome:format:check` - Check formatting without making changes
- `npm run biome:lint` - Run linting only
- `npm run biome:lint:fix` - Fix linting issues automatically

## 📦 Shared Dependencies

The following dependencies are shared at the root level to avoid duplication:

- `@supabase/supabase-js` - Supabase client
- `zod` - Schema validation
- `@biomejs/biome` - Code formatting and linting
- `typescript` - TypeScript compiler

## 🔧 Configuration

### Code Formatting and Linting

The project uses Biome for code formatting and linting. Configuration is centralized in the root `biome.json` file and applies to both client and server:

**Available Commands:**
- `npm run biome:check` - Check for formatting and linting issues
- `npm run biome:check:fix` - Automatically fix formatting and linting issues
- `npm run biome:format` - Format all files
- `npm run biome:format:check` - Check formatting without making changes
- `npm run biome:lint` - Run linting only
- `npm run biome:lint:fix` - Fix linting issues automatically

**Configuration Features:**
- Consistent formatting across the entire monorepo
- Import organization and sorting
- TypeScript and JavaScript linting rules
- Accessibility (a11y) checks
- Performance and complexity warnings

### TypeScript

Both client and server have their own TypeScript configurations, but they share common types from the `types/` directory. The shared types can be imported using:

```typescript
import type { User, AudioContent } from '@/shared/shared';
```

## 🏗️ Architecture

### Client (React + Vite)

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React hooks and context
- **Routing**: React Router DOM

### Server (Fastify)

- **Framework**: Fastify with TypeScript
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Supabase Storage
- **External APIs**: ElevenLabs, OpenAI

### Shared

- **Types**: Common TypeScript interfaces and types
- **Validation**: Zod schemas
- **Code Quality**: Biome for formatting and linting

## 🔄 Development Workflow

1. **Feature Development**: Work on features that span both client and server
2. **Type Safety**: Use shared types to ensure consistency
3. **Code Quality**: Run `npm run format` and `npm run lint` before committing
4. **Testing**: Write tests for both client and server components

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the development server to test
5. Format and lint your code
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
