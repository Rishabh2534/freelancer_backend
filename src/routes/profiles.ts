import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get profile by user ID
router.get('/:userId', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      include: {
        profile: true,
        skills: true,
        receivedReviews: {
          include: {
            author: {
              select: {
                id: true,
                email: true,
                profile: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            projects: true,
            applications: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate stats
    const totalEarnings = 0; // This would come from completed projects/payments
    const averageRating = user.receivedReviews.length > 0
      ? user.receivedReviews.reduce((sum, r) => sum + r.rating, 0) / user.receivedReviews.length
      : 0;

    res.json({
      profile: {
        ...user,
        stats: {
          totalEarnings,
          projectsCompleted: user._count.projects,
          averageRating: averageRating.toFixed(1)
        }
      }
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch profile' });
  }
});

// Update profile
router.put('/:userId', authenticate, async (req: AuthRequest, res) => {
  try {
    if (req.params.userId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    const { fullName, location, bio, website, avatarUrl, skills } = req.body;

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: req.userId! },
      update: {
        ...(fullName !== undefined && { fullName }),
        ...(location !== undefined && { location }),
        ...(bio !== undefined && { bio }),
        ...(website !== undefined && { website }),
        ...(avatarUrl !== undefined && { avatarUrl })
      },
      create: {
        userId: req.userId!,
        fullName,
        location,
        bio,
        website,
        avatarUrl
      }
    });

    // Update skills if provided
    if (skills && Array.isArray(skills)) {
      await prisma.userSkill.deleteMany({
        where: { userId: req.userId! }
      });

      if (skills.length > 0) {
        await prisma.userSkill.createMany({
          data: skills.map((skill: { name: string; proficiency: number }) => ({
            userId: req.userId!,
            name: skill.name,
            proficiency: skill.proficiency || 50
          }))
        });
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      include: {
        profile: true,
        skills: true
      }
    });

    res.json({ profile: user });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message || 'Failed to update profile' });
  }
});

// Get current user's profile
router.get('/me/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        profile: true,
        skills: true,
        receivedReviews: {
          include: {
            author: {
              select: {
                id: true,
                email: true,
                profile: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            projects: true,
            applications: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const averageRating = user.receivedReviews.length > 0
      ? user.receivedReviews.reduce((sum, r) => sum + r.rating, 0) / user.receivedReviews.length
      : 0;

    res.json({
      profile: {
        ...user,
        stats: {
          totalEarnings: 0,
          projectsCompleted: user._count.projects,
          averageRating: averageRating.toFixed(1)
        }
      }
    });
  } catch (error: any) {
    console.error('Get my profile error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch profile' });
  }
});

export default router;

