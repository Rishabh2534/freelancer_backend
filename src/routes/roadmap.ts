import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Generate AI roadmap
router.post('/generate', authenticate, async (req: AuthRequest, res) => {
  try {
    const { skill } = req.body;

    if (!skill || !skill.trim()) {
      return res.status(400).json({ message: 'Skill is required' });
    }

    // Generate roadmap (simplified - in production, integrate with OpenAI)
    const roadmapModules = [
      {
        id: '1',
        title: 'Fundamentals',
        description: 'Master the core concepts and basics',
        topics: [
          `Introduction to ${skill}`,
          'Basic Syntax',
          'Core Principles',
          'Best Practices'
        ],
        completed: false,
        progress: 0
      },
      {
        id: '2',
        title: 'Intermediate Concepts',
        description: 'Build on fundamentals with advanced topics',
        topics: [
          'Advanced Patterns',
          'State Management',
          'Performance Optimization',
          'Testing'
        ],
        completed: false,
        progress: 0
      },
      {
        id: '3',
        title: 'Advanced Techniques',
        description: 'Master expert-level concepts',
        topics: [
          'Architecture Design',
          'Scalability',
          'Security',
          'Production Deployment'
        ],
        completed: false,
        progress: 0
      },
      {
        id: '4',
        title: 'Career Paths',
        description: 'Explore career opportunities',
        topics: [
          'Senior Developer',
          'Technical Lead',
          'Solution Architect',
          'Consultant'
        ],
        completed: false,
        progress: 0
      }
    ];

    // Save roadmap to database
    // Check if roadmap exists
    const existingRoadmap = await prisma.roadmap.findFirst({
      where: {
        userId: req.userId!,
        skill: skill.trim()
      }
    });

    let roadmap;
    if (existingRoadmap) {
      roadmap = await prisma.roadmap.update({
        where: { id: existingRoadmap.id },
        data: {
          modules: roadmapModules as any,
          updatedAt: new Date()
        }
      });
    } else {
      roadmap = await prisma.roadmap.create({
        data: {
          userId: req.userId!,
          skill: skill.trim(),
          modules: roadmapModules as any
        }
      });
    }

    res.json({ roadmap: roadmapModules });
  } catch (error: any) {
    console.error('Generate roadmap error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate roadmap' });
  }
});

// Get user's roadmaps
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const roadmaps = await prisma.roadmap.findMany({
      where: { userId: req.userId! },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({ roadmaps });
  } catch (error: any) {
    console.error('Get roadmaps error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch roadmaps' });
  }
});

// Update roadmap progress
router.patch('/:roadmapId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { modules } = req.body;

    const roadmap = await prisma.roadmap.findUnique({
      where: { id: req.params.roadmapId }
    });

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    if (roadmap.userId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedRoadmap = await prisma.roadmap.update({
      where: { id: req.params.roadmapId },
      data: {
        modules: modules as any,
        updatedAt: new Date()
      }
    });

    res.json({ roadmap: updatedRoadmap });
  } catch (error: any) {
    console.error('Update roadmap error:', error);
    res.status(500).json({ message: error.message || 'Failed to update roadmap' });
  }
});

export default router;

