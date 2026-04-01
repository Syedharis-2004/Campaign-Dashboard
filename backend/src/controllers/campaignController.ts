import { Request, Response } from 'express';
import db from '../utils/db';
import { getIO } from '../services/socketService';

// @desc    Get all campaigns
// @route   GET /campaigns
// @access  Private
export const getCampaigns = async (req: Request, res: Response) => {
  try {
    const { sortField, sortOrder, status, search, page = '1', limit = '10' } = req.query;
    
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Filtering
    let whereClause: any = { deletedAt: null };
    if (status) {
      whereClause.status = status;
    }
    if (search) {
      whereClause.title = { contains: search, mode: 'insensitive' };
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sortField) {
      orderBy = { [String(sortField)]: sortOrder === 'asc' ? 'asc' : 'desc' };
    }

    const campaigns = await db.campaign.findMany({
      where: whereClause,
      orderBy,
      skip,
      take: Number(limit),
      include: { client: true }
    });

    const total = await db.campaign.count({ where: whereClause });

    res.json({
      data: campaigns,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a campaign
// @route   POST /campaigns
// @access  Private
export const createCampaign = async (req: Request, res: Response) => {
  try {
    const { title, clientId, budget, objective } = req.body;
    
    // Input Validation
    if (!title || !clientId || !budget) {
       return res.status(400).json({ message: 'Please provide title, clientId, and budget' });
    }

    const campaign = await db.campaign.create({
      data: {
        title,
        clientId: Number(clientId),
        budget: Number(budget),
        objective
      }
    });

    res.status(201).json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update campaign
// @route   PUT /campaigns/:id
// @access  Private
export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { spend, clicks, impressions, status, title } = req.body;

    const campaign = await db.campaign.update({
      where: { id: Number(id) },
      data: { spend, clicks, impressions, status, title }
    });

    // BUSINESS LOGIC: WebSocket Rules Engine
    if (campaign.budget && campaign.spend > campaign.budget * 0.9) {
      // Alert when 90% of budget is spent
      getIO().emit('alert', {
        type: 'BUDGET_WARNING',
        message: `Campaign "${campaign.title}" is nearing or exceeding budget.`,
        campaignId: campaign.id
      });
    }

    if (campaign.impressions > 1000) {
      const ctr = campaign.clicks / campaign.impressions;
      if (ctr < 0.005) { // Sub 0.5% CTR Alert
        getIO().emit('alert', {
          type: 'LOW_CTR',
          message: `Campaign "${campaign.title}" has a poor CTR (${(ctr*100).toFixed(2)}%). Consider revising creatives.`,
          campaignId: campaign.id
        });
      }
    }

    res.json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Soft Delete campaign
// @route   DELETE /campaigns/:id
// @access  Private
export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await db.campaign.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date(), status: 'COMPLETED' }
    });

    res.json({ message: 'Campaign archived' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
