import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import profileRoutes from './routes/profiles';
import chatRoutes from './routes/chat';
import roadmapRoutes from './routes/roadmap';

dotenv.config();

// Run DB migrations in production before starting (so Render can use default "npm start")
if (process.env.NODE_ENV === 'production') {
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  } catch (e) {
    console.error('Prisma migrate deploy failed:', e);
    process.exit(1);
  }
}

const app = express();
const prisma = new PrismaClient();

// CORS: allow comma-separated FRONTEND_URL and any *.vercel.app (preview deployments)
const frontendUrls = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((u) => u.trim())
  .filter(Boolean);
// Allow all *.vercel.app origins when main frontend is on Vercel (no extra env needed)
const allowVercelPreviews =
  process.env.ALLOW_VERCEL_PREVIEWS === 'true' ||
  frontendUrls.some((u) => u.includes('vercel.app'));

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true); // allow no-origin (e.g. Postman)
    const allowed =
      frontendUrls.includes(origin) ||
      (allowVercelPreviews && origin.endsWith('.vercel.app'));
    cb(null, allowed ? origin : false);
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/roadmap', roadmapRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;

