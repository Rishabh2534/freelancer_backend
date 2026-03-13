import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, optionalAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all projects with filters
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const {
      search,
      duration,
      workType,
      techStack,
      status = 'open',
      page = '1',
      limit = '20'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      status: status as string
    };

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (duration) {
      where.duration = duration;
    }

    if (workType) {
      where.workType = { has: workType };
    }

    if (techStack) {
      where.techStack = {
        some: {
          name: { contains: techStack as string, mode: 'insensitive' }
        }
      };
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              profile: true
            }
          },
          techStack: true,
          applications: req.userId ? {
            where: { userId: req.userId },
            select: { id: true, status: true }
          } : false,
          _count: {
            select: { applications: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.project.count({ where })
    ]);

    res.json({
      projects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch projects' });
  }
});

// Get single project
router.get('/:id', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            profile: true
          }
        },
        techStack: true,
        applications: req.userId ? {
          where: { userId: req.userId },
          select: { id: true, status: true }
        } : false,
        _count: {
          select: { applications: true }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ project });
  } catch (error: any) {
    console.error('Get project error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch project' });
  }
});

// Create project
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const {
      title,
      description,
      deadline,
      duration,
      workType,
      budget,
      techStack
    } = req.body;

    if (!title || !description || !deadline || !duration || !workType || !Array.isArray(workType)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        deadline: new Date(deadline),
        duration: duration as 'short' | 'medium' | 'long',
        workType: workType as ('remote' | 'onsite' | 'hybrid')[],
        budget,
        ownerId: req.userId!,
        techStack: {
          create: techStack?.map((tech: { name: string; proficiency: number }) => ({
            name: tech.name,
            proficiency: tech.proficiency || 50
          })) || []
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            profile: true
          }
        },
        techStack: true
      }
    });

    res.status(201).json({ project });
  } catch (error: any) {
    console.error('Create project error:', error);
    res.status(500).json({ message: error.message || 'Failed to create project' });
  }
});

// Update project
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.ownerId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    const {
      title,
      description,
      deadline,
      duration,
      workType,
      budget,
      techStack,
      status
    } = req.body;

    const updatedProject = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(deadline && { deadline: new Date(deadline) }),
        ...(duration && { duration }),
        ...(workType && { workType }),
        ...(budget !== undefined && { budget }),
        ...(status && { status }),
        ...(techStack && {
          techStack: {
            deleteMany: {},
            create: techStack.map((tech: { name: string; proficiency: number }) => ({
              name: tech.name,
              proficiency: tech.proficiency || 50
            }))
          }
        })
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            profile: true
          }
        },
        techStack: true
      }
    });

    res.json({ project: updatedProject });
  } catch (error: any) {
    console.error('Update project error:', error);
    res.status(500).json({ message: error.message || 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.ownerId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await prisma.project.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: error.message || 'Failed to delete project' });
  }
});

// Apply to project
router.post('/:id/apply', authenticate, async (req: AuthRequest, res) => {
  try {
    const { message } = req.body;
    const projectId = req.params.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.ownerId === req.userId) {
      return res.status(400).json({ message: 'Cannot apply to your own project' });
    }

    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: req.userId!
        }
      }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this project' });
    }

    const application = await prisma.application.create({
      data: {
        projectId,
        userId: req.userId!,
        message
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: true
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.status(201).json({ application });
  } catch (error: any) {
    console.error('Apply to project error:', error);
    res.status(500).json({ message: error.message || 'Failed to apply to project' });
  }
});

// Get applications for a project (owner only)
router.get('/:id/applications', authenticate, async (req: AuthRequest, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.ownerId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await prisma.application.findMany({
      where: { projectId: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: true,
            skills: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ applications });
  } catch (error: any) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch applications' });
  }
});

// Update application status (owner only)
router.patch('/:id/applications/:applicationId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: req.params.id }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.ownerId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const application = await prisma.application.update({
      where: { id: req.params.applicationId },
      data: { status: status as 'pending' | 'accepted' | 'rejected' | 'withdrawn' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: true
          }
        }
      }
    });

    res.json({ application });
  } catch (error: any) {
    console.error('Update application error:', error);
    res.status(500).json({ message: error.message || 'Failed to update application' });
  }
});

export default router;

