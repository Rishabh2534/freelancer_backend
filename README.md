# Talent Forge AI Backend

Backend API for the Talent Forge AI freelance platform.

## Features

- 🔐 JWT-based authentication
- 📦 Project management (CRUD, filtering, applications)
- 👤 User profiles with skills
- 💬 Channel-based chat system
- 🗺️ AI-powered learning roadmaps
- ⭐ Reviews and ratings

## Tech Stack

- **Node.js** with **Express**
- **TypeScript**
- **Prisma** ORM
- **PostgreSQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing

## Setup

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `FRONTEND_URL` - Frontend URL for CORS
- `PORT` - Server port (default: 5000)

3. Set up the database:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Projects
- `GET /api/projects` - Get all projects (with filters)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (auth required)
- `PUT /api/projects/:id` - Update project (auth required, owner only)
- `DELETE /api/projects/:id` - Delete project (auth required, owner only)
- `POST /api/projects/:id/apply` - Apply to project (auth required)
- `GET /api/projects/:id/applications` - Get project applications (auth required, owner only)

### Profiles
- `GET /api/profiles/:userId` - Get user profile
- `GET /api/profiles/me/profile` - Get current user's profile (auth required)
- `PUT /api/profiles/:userId` - Update profile (auth required, own profile only)

### Chat
- `GET /api/chat/channels` - Get all channels (auth required)
- `GET /api/chat/channels/:channelId/messages` - Get channel messages (auth required)
- `POST /api/chat/channels/:channelId/messages` - Send message (auth required)
- `POST /api/chat/channels` - Create channel (auth required)

### Roadmap
- `POST /api/roadmap/generate` - Generate AI roadmap (auth required)
- `GET /api/roadmap` - Get user's roadmaps (auth required)
- `PATCH /api/roadmap/:roadmapId` - Update roadmap progress (auth required)

## Database Schema

The database includes:
- Users and Profiles
- Projects with Tech Stack
- Applications
- Channels and Messages
- Reviews
- User Skills
- Roadmaps

See `prisma/schema.prisma` for full schema definition.

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:migrate` - Create and run migrations

## Environment Variables

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/talent_forge_ai
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=optional-for-ai-features
```

# freelancer_backend
