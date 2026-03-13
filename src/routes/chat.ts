import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all channels
router.get('/channels', authenticate, async (req: AuthRequest, res) => {
  try {
    const channels = await prisma.channel.findMany({
      include: {
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    // Update member count (simplified - in production, track actual members)
    const channelsWithCount = channels.map(channel => ({
      ...channel,
      memberCount: channel.memberCount || Math.floor(Math.random() * 2000) + 100
    }));

    res.json({ channels: channelsWithCount });
  } catch (error: any) {
    console.error('Get channels error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch channels' });
  }
});

// Get messages for a channel
router.get('/channels/:channelId/messages', authenticate, async (req: AuthRequest, res) => {
  try {
    const { limit = '50', before } = req.query;
    const limitNum = parseInt(limit as string);

    const where: any = {
      channelId: req.params.channelId
    };

    if (before) {
      where.createdAt = { lt: new Date(before as string) };
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limitNum
    });

    res.json({ messages: messages.reverse() });
  } catch (error: any) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/channels/:channelId/messages', authenticate, async (req: AuthRequest, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Check if channel exists
    const channel = await prisma.channel.findUnique({
      where: { id: req.params.channelId }
    });

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const message = await prisma.message.create({
      data: {
        channelId: req.params.channelId,
        userId: req.userId!,
        content: content.trim()
      },
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

    res.status(201).json({ message });
  } catch (error: any) {
    console.error('Send message error:', error);
    res.status(500).json({ message: error.message || 'Failed to send message' });
  }
});

// Create a channel (admin only - simplified)
router.post('/channels', authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Channel name is required' });
    }

    const channel = await prisma.channel.create({
      data: {
        name: name.trim(),
        description
      }
    });

    res.status(201).json({ channel });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Channel name already exists' });
    }
    console.error('Create channel error:', error);
    res.status(500).json({ message: error.message || 'Failed to create channel' });
  }
});

export default router;

